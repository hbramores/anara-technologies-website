Set-StrictMode -Version Latest

$script:RepoRoot        = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
$script:OrchRoot        = Join-Path $script:RepoRoot '.kilo\orchestration'
$script:ConfigPath      = Join-Path $script:OrchRoot 'orchestration.settings.psd1'
$script:RegistryPath    = Join-Path $script:OrchRoot 'registry.json'
$script:RegistryBackup  = Join-Path $script:OrchRoot 'registry.json.bak'
$script:LockPath        = Join-Path $script:OrchRoot '.registry.lock'
$script:LockOwnerPath   = Join-Path $script:OrchRoot '.registry.lock.owner'
$script:LockStream      = $null

function Get-RepoRoot { return $script:RepoRoot }
function Get-OrchRoot { return $script:OrchRoot }
function Get-RegistryPath { return $script:RegistryPath }

function Get-OrchConfig {
  if (-not (Test-Path -LiteralPath $script:ConfigPath)) { throw "Orchestration settings not found: $($script:ConfigPath)" }
  return (Import-PowerShellDataFile -LiteralPath $script:ConfigPath)
}

# ---------------------------------------------------------------------------
# Registry lock
#
# Primary mechanism is an OS-managed exclusive handle (FileShare.None) held open
# for the duration of the critical section. The OS releases it automatically if
# the holder dies, so a crash cannot create a permanent wedge. Owner metadata is
# written to a side file for diagnostics; a stale lock is only ever reclaimed
# after verifying the recorded owner PID + start time is no longer alive.
# Age alone never justifies stealing a live lock.
# ---------------------------------------------------------------------------
function Enter-RegistryLock {
  param([int]$TimeoutSeconds = 30)
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  $hardCap = $TimeoutSeconds + 15
  while ($true) {
    try {
      $fs = [System.IO.File]::Open($script:LockPath, [System.IO.FileMode]::OpenOrCreate, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
      $script:LockStream = $fs
      $owner = [ordered]@{
        pid          = $PID
        startTimeUtc = (Get-Process -Id $PID).StartTime.ToUniversalTime().ToString('o')
        acquiredAt   = (Get-Date).ToUniversalTime().ToString('o')
      }
      try { ($owner | ConvertTo-Json -Depth 4) | Set-Content -LiteralPath $script:LockOwnerPath -Encoding UTF8 } catch {}
      return
    } catch [System.IO.IOException] {
      $owner = $null
      if (Test-Path -LiteralPath $script:LockOwnerPath) {
        try { $owner = Get-Content -LiteralPath $script:LockOwnerPath -Raw | ConvertFrom-Json } catch { $owner = $null }
      }
      $ownerAlive = $false
      if ($owner -and $owner.pid) {
        $ownerAlive = Test-ProcessIdentity -ProcessId ([int]$owner.pid) -StartTimeUtc ([string]$owner.startTimeUtc)
      }
      if (-not $ownerAlive) {
        # Owner is verifiably gone; the OS should have released the handle.
        # Retry briefly, then give up with a warning rather than looping forever.
        if ($sw.Elapsed.TotalSeconds -gt $hardCap) {
          throw "Could not acquire registry lock; recorded owner is not alive but the OS handle is still held (pid $($owner.pid)). Manual check may be required: $($script:LockPath)"
        }
        Start-Sleep -Milliseconds 250
        continue
      }
      if ($sw.Elapsed.TotalSeconds -gt $TimeoutSeconds) {
        throw "Could not acquire registry lock within $TimeoutSeconds s; live owner pid=$($owner.pid) acquired at $($owner.acquiredAt)."
      }
      Start-Sleep -Milliseconds 200
    }
  }
}

function Exit-RegistryLock {
  if ($script:LockStream) { try { $script:LockStream.Dispose() } catch {} ; $script:LockStream = $null }
  Remove-Item -LiteralPath $script:LockOwnerPath -Force -ErrorAction SilentlyContinue
}

# ---------------------------------------------------------------------------
# Registry read/write (atomic replace + verified, with last-good backup)
# ---------------------------------------------------------------------------
function ConvertFrom-RegistryText {
  param([string]$Text)
  if ([string]::IsNullOrWhiteSpace($Text)) { return [ordered]@{} }
  $obj = $Text | ConvertFrom-Json
  $map = [ordered]@{}
  if ($obj) { foreach ($p in $obj.PSObject.Properties) { $map[$p.Name] = $p.Value } }
  return $map
}

function Read-Registry {
  $primaryOk = $false
  if (Test-Path -LiteralPath $script:RegistryPath) {
    try {
      $txt = Get-Content -LiteralPath $script:RegistryPath -Raw
      $map = ConvertFrom-RegistryText $txt
      $primaryOk = $true
      return $map
    } catch {
      Write-Warning "registry.json is unreadable; attempting last-good backup. ($($_.Exception.Message))"
    }
  }
  if (-not $primaryOk -and (Test-Path -LiteralPath $script:RegistryBackup)) {
    try {
      $txt = Get-Content -LiteralPath $script:RegistryBackup -Raw
      Write-Warning "Using registry backup: $($script:RegistryBackup)"
      return (ConvertFrom-RegistryText $txt)
    } catch {
      Write-Warning "registry backup is also unreadable."
    }
  }
  return [ordered]@{}
}

function Write-Registry {
  param($Map)
  $o = [ordered]@{}
  foreach ($k in ($Map.Keys | Sort-Object)) { $o[$k] = $Map[$k] }
  $json = $o | ConvertTo-Json -Depth 18
  $tmp = "$($script:RegistryPath).tmp"
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $fs = [System.IO.File]::Open($tmp, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)
  try { $fs.Write($bytes, 0, $bytes.Length); $fs.Flush($true) } finally { $fs.Dispose() }
  if (Test-Path -LiteralPath $script:RegistryPath) {
    [System.IO.File]::Replace($tmp, $script:RegistryPath, $script:RegistryBackup)  # atomic on NTFS
  } else {
    [System.IO.File]::Move($tmp, $script:RegistryPath)
  }
  # Verify the replacement is parseable; restore backup if not.
  $ok = $false
  try { [void](ConvertFrom-RegistryText (Get-Content -LiteralPath $script:RegistryPath -Raw)); $ok = $true } catch {}
  if (-not $ok) {
    if (Test-Path -LiteralPath $script:RegistryBackup) {
      Copy-Item -LiteralPath $script:RegistryBackup -Destination $script:RegistryPath -Force
      throw "Registry write verification failed; restored last-good backup."
    }
    throw "Registry write verification failed and no backup exists."
  }
}

# ---------------------------------------------------------------------------
# Path helpers
# ---------------------------------------------------------------------------
function Normalize-AbsPath {
  param([string]$Path)
  if ([string]::IsNullOrWhiteSpace($Path)) { throw "Empty path" }
  $p = $Path -replace '/', '\'
  if (-not [System.IO.Path]::IsPathRooted($p)) { $p = Join-Path $script:RepoRoot $p }
  return [System.IO.Path]::GetFullPath($p)
}

function Get-RelFromRepo {
  param([string]$AbsPath)
  $abs = Normalize-AbsPath $AbsPath
  $root = $script:RepoRoot.TrimEnd('\')
  if ($abs.StartsWith($root + '\', [System.StringComparison]::OrdinalIgnoreCase)) { return $abs.Substring($root.Length + 1) }
  return $abs
}

function Test-IsWithinPath {
  param([string]$Child, [string]$Parent)
  $c = (Normalize-AbsPath $Child).TrimEnd('\')
  $p = (Normalize-AbsPath $Parent).TrimEnd('\')
  if ($c.Equals($p, [System.StringComparison]::OrdinalIgnoreCase)) { return $true }
  return $c.StartsWith($p + '\', [System.StringComparison]::OrdinalIgnoreCase)
}

function Test-PathsOverlap {
  param([string]$A, [string]$B)
  return ((Test-IsWithinPath $A $B) -or (Test-IsWithinPath $B $A))
}

function Test-ContainsGlobMeta {
  param([string]$Path)
  return ($Path -match '[*?\[]')
}

# Reject owned paths that pass through an existing reparse point (junction/symlink).
function Test-ReparsePointInPath {
  param([string]$AbsPath)
  $abs = Normalize-AbsPath $AbsPath
  $root = ($script:RepoRoot).TrimEnd('\')
  $cur = $abs
  while ($cur -and $cur.Length -ge $root.Length) {
    if (Test-Path -LiteralPath $cur) {
      try {
        $it = Get-Item -LiteralPath $cur -Force -ErrorAction Stop
        if (($it.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) { return $true }
      } catch {}
    }
    $parent = Split-Path -Parent $cur
    if (-not $parent -or $parent -eq $cur) { break }
    $cur = $parent
  }
  return $false
}

function ConvertTo-GlobRegex {
  param([string]$Glob)
  $g = $Glob -replace '/', '\'
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.Append('(?i)^')
  $i = 0
  while ($i -lt $g.Length) {
    $ch = $g[$i]
    if ($ch -eq '*') {
      if (($i + 1) -lt $g.Length -and $g[$i + 1] -eq '*') {
        [void]$sb.Append('.*')
        $i += 2
        if ($i -lt $g.Length -and $g[$i] -eq '\') { $i++ }
        continue
      }
      [void]$sb.Append('[^\\]*'); $i++; continue
    }
    if ($ch -eq '?') { [void]$sb.Append('[^\\]'); $i++; continue }
    if ('\.+()^$|{}[]'.IndexOf($ch) -ge 0) { [void]$sb.Append('\'); [void]$sb.Append($ch); $i++; continue }
    [void]$sb.Append($ch); $i++
  }
  [void]$sb.Append('$')
  return $sb.ToString()
}

function Test-GlobMatch {
  param([string]$RelPath, [string]$Glob)
  $rp = $RelPath -replace '/', '\'
  return ($rp -match (ConvertTo-GlobRegex $Glob))
}

function Get-GlobLiteralPrefix {
  param([string]$Glob)
  $g = $Glob -replace '/', '\'
  $idx = $g.IndexOfAny([char[]]@('*', '?', '['))
  if ($idx -lt 0) { return $g }
  return $g.Substring(0, $idx).TrimEnd('\')
}

function Test-PathProtected {
  param([string]$AbsPath, $Config)
  $rel = Get-RelFromRepo $AbsPath
  foreach ($g in $Config.protectedGlobs) {
    if (Test-GlobMatch -RelPath $rel -Glob $g) { return $true }
    # Also protect the bare directory/node named by the glob's literal prefix,
    # so e.g. "src/**" also protects the "src" node itself.
    $prefix = Get-GlobLiteralPrefix $g
    if ($prefix) {
      if ($rel.Equals($prefix, [System.StringComparison]::OrdinalIgnoreCase)) { return $true }
    }
  }
  return $false
}

function Get-WorkerDir {
  param($Config, [string]$WorkerId)
  return (Normalize-AbsPath (Join-Path $Config.workersRoot $WorkerId))
}

function Get-RunDir {
  param($Config, [string]$WorkerId, [string]$RunId)
  return (Join-Path (Get-WorkerDir -Config $Config -WorkerId $WorkerId) (Join-Path 'runs' $RunId))
}

function Get-AgentFilePath {
  param($Config, [string]$WorkerId)
  $dir = Normalize-AbsPath $Config.agentWorkersDir
  return (Join-Path $dir ("worker-" + $WorkerId + ".md"))
}

function Get-AgentName {
  param([string]$WorkerId)
  return "workers/worker-$WorkerId"
}

function New-RunId {
  param([int]$Attempt = 0)
  return ("r{0}-{1}" -f $Attempt, [guid]::NewGuid().ToString('N').Substring(0, 8))
}

function Assert-OwnedPathAllowed {
  param([string]$AbsPath, $Config, [string]$WorkerId)
  if (Test-ContainsGlobMeta $AbsPath) { throw "Owned path must not contain glob metacharacters: $AbsPath" }
  if (Test-PathProtected -AbsPath $AbsPath -Config $Config) {
    throw "Owned path is protected and cannot be assigned: $(Get-RelFromRepo $AbsPath)"
  }
  $ownDirAbs = Get-WorkerDir -Config $Config -WorkerId $WorkerId
  $inOwn = Test-IsWithinPath -Child $AbsPath -Parent $ownDirAbs
  $workersRootAbs = Normalize-AbsPath $Config.workersRoot
  if ((Test-IsWithinPath -Child $AbsPath -Parent $workersRootAbs) -and (-not $inOwn)) {
    throw "Owned path is inside another worker's record dir: $(Get-RelFromRepo $AbsPath)"
  }
  if ($Config.lifecycleSandboxOnly) {
    $sandboxAbs = Normalize-AbsPath $Config.sandboxRoot
    $inSandbox = Test-IsWithinPath -Child $AbsPath -Parent $sandboxAbs
    if (-not ($inSandbox -or $inOwn)) {
      throw "In lifecycleSandboxOnly mode, owned paths must be inside '$($Config.sandboxRoot)' or the worker's own record dir. Got: $(Get-RelFromRepo $AbsPath)"
    }
  }
  if (Test-ReparsePointInPath -AbsPath $AbsPath) {
    throw "Owned path passes through an existing reparse point (junction/symlink): $(Get-RelFromRepo $AbsPath)"
  }
}

function Get-ActiveWorkers {
  param($Registry)
  $activeStates = @('CREATED', 'RUNNING', 'AWAITING_REVIEW', 'NEEDS_FOLLOWUP', 'FAILED', 'TERMINATING')
  $out = @()
  foreach ($k in $Registry.Keys) {
    if ($activeStates -contains $Registry[$k].state) { $out += $Registry[$k] }
  }
  return $out
}

function Get-RunningWorkers {
  param($Registry)
  $out = @()
  foreach ($k in $Registry.Keys) {
    if ($Registry[$k].state -eq 'RUNNING') { $out += $Registry[$k] }
  }
  return $out
}

# ---------------------------------------------------------------------------
# Process identity / tree helpers
# ---------------------------------------------------------------------------
function Get-ProcessStartTimeUtc {
  param([int]$ProcessId)
  if (-not $ProcessId) { return $null }
  try {
    $p = Get-Process -Id $ProcessId -ErrorAction Stop
    return $p.StartTime.ToUniversalTime().ToString('o')
  } catch { return $null }
}

function Test-ProcessIdentity {
  param([int]$ProcessId, [string]$StartTimeUtc)
  if (-not $ProcessId) { return $false }
  $st = Get-ProcessStartTimeUtc -ProcessId $ProcessId
  if (-not $st) { return $false }
  if ([string]::IsNullOrWhiteSpace($StartTimeUtc)) { return $false }  # missing identity => never trusted
  try {
    $a = [datetime]::Parse($st, [System.Globalization.CultureInfo]::InvariantCulture, [System.Globalization.DateTimeStyles]::RoundtripKind)
    $b = [datetime]::Parse($StartTimeUtc, [System.Globalization.CultureInfo]::InvariantCulture, [System.Globalization.DateTimeStyles]::RoundtripKind)
    return ([math]::Abs(($a - $b).TotalSeconds) -lt 3)
  } catch { return $false }
}

function Get-ProcessInfoSafe {
  param([int]$ProcessId)
  try {
    $p = Get-Process -Id $ProcessId -ErrorAction Stop
    return [ordered]@{ pid = $ProcessId; startTimeUtc = $p.StartTime.ToUniversalTime().ToString('o') }
  } catch { return $null }
}

function Get-DescendantProcessInfo {
  param([int]$ParentId)
  $out = @()
  $children = Get-CimInstance Win32_Process -Filter "ParentProcessId=$ParentId" -ErrorAction SilentlyContinue
  foreach ($c in $children) {
    $ci = Get-ProcessInfoSafe -ProcessId ([int]$c.ProcessId)
    if ($ci) { $out += $ci }
    $out += (Get-DescendantProcessInfo -ParentId ([int]$c.ProcessId))
  }
  return $out
}

function Get-ProcessTreeInfo {
  param([int]$RootId)
  $root = Get-ProcessInfoSafe -ProcessId $RootId
  if (-not $root) { return @() }
  return @($root) + @(Get-DescendantProcessInfo -ParentId $RootId)
}

# Kill a process tree. Every node is killed only after its recorded start time
# is verified, and the whole original snapshot is re-checked afterwards. Missing
# identity always refuses. Reparented processes spawned after the snapshot are a
# documented containment limitation (see ORCHESTRATION.md).
function Stop-ProcessTreeVerified {
  param([int]$ProcessId, [string]$StartTimeUtc, [int]$TimeoutSeconds = 15)
  $res = [ordered]@{ pid = $ProcessId; ok = $false; reason = ''; killed = @(); remaining = @() }
  if ([string]::IsNullOrWhiteSpace($StartTimeUtc)) { $res.reason = 'missing-identity-refused'; return $res }
  if (-not (Test-ProcessIdentity -ProcessId $ProcessId -StartTimeUtc $StartTimeUtc)) { $res.reason = 'identity-mismatch-or-already-exited'; return $res }
  $tree = @(Get-ProcessTreeInfo -RootId $ProcessId)
  $killed = @()
  foreach ($n in ($tree | Sort-Object { $_.pid } -Descending)) {
    try {
      $p = Get-Process -Id $n.pid -ErrorAction Stop
      if (Test-ProcessIdentity -ProcessId $n.pid -StartTimeUtc $n.startTimeUtc) { $p.Kill(); $killed += $n.pid }
    } catch {}
  }
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
    $alive = $false
    foreach ($n in $tree) { if (Test-ProcessIdentity -ProcessId $n.pid -StartTimeUtc $n.startTimeUtc) { $alive = $true; break } }
    if (-not $alive) { break }
    Start-Sleep -Milliseconds 250
  }
  $remaining = @()
  foreach ($n in $tree) { if (Test-ProcessIdentity -ProcessId $n.pid -StartTimeUtc $n.startTimeUtc) { $remaining += $n.pid } }
  $res.killed = $killed
  $res.remaining = $remaining
  $res.ok = ($remaining.Count -eq 0)
  $res.reason = if ($res.ok) { 'exited' } else { 'still-alive-after-forced-kill' }
  return $res
}

function Resolve-WorkerProcessInfo {
  param($Config, $W)
  $kiloPid = $W.kiloPid; $kiloStart = $W.kiloStartTimeUtc
  $launcherPid = $W.launcherPid; $launcherStart = $W.launcherStartTimeUtc
  if ((-not $kiloPid) -and $W.currentRunId) {
    $rt = Join-Path (Get-RunDir -Config $Config -WorkerId $W.workerId -RunId $W.currentRunId) 'runtime.json'
    if (Test-Path -LiteralPath $rt) {
      try {
        $o = Get-Content -LiteralPath $rt -Raw | ConvertFrom-Json
        if ($o.kiloPid) { $kiloPid = [int]$o.kiloPid; $kiloStart = $o.kiloStartTimeUtc }
        if ((-not $launcherPid) -and $o.wrapperPid) { $launcherPid = [int]$o.wrapperPid; $launcherStart = $o.wrapperStartTimeUtc }
      } catch {}
    }
  }
  return [ordered]@{ kiloPid = $kiloPid; kiloStartTimeUtc = $kiloStart; launcherPid = $launcherPid; launcherStartTimeUtc = $launcherStart }
}

# Combined liveness: a worker counts as alive if either its kilo process or its
# wrapper process is verified alive. PIDs whose recorded start time is missing
# are reported as unverifiable and must block a clean-termination decision.
function Get-WorkerProcessStatus {
  param($Config, $W)
  $proc = Resolve-WorkerProcessInfo -Config $Config -W $W
  $kiloAlive = Test-ProcessIdentity -ProcessId ([int]$proc.kiloPid) -StartTimeUtc $proc.kiloStartTimeUtc
  $launcherAlive = Test-ProcessIdentity -ProcessId ([int]$proc.launcherPid) -StartTimeUtc $proc.launcherStartTimeUtc
  $unverifiable = @()
  if ($proc.kiloPid -and [string]::IsNullOrWhiteSpace($proc.kiloStartTimeUtc)) { $unverifiable += [int]$proc.kiloPid }
  if ($proc.launcherPid -and [string]::IsNullOrWhiteSpace($proc.launcherStartTimeUtc)) { $unverifiable += [int]$proc.launcherPid }
  return [ordered]@{
    proc          = $proc
    kiloAlive     = $kiloAlive
    launcherAlive = $launcherAlive
    alive         = ($kiloAlive -or $launcherAlive)
    unverifiable  = $unverifiable
  }
}

# ---------------------------------------------------------------------------
# Session / report
# ---------------------------------------------------------------------------
function Get-SessionIdFromLog {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return $null }
  $m = Select-String -LiteralPath $Path -Pattern '"sessionID"\s*:\s*"([^"]+)"' | Select-Object -First 1
  if ($m) { return $m.Matches[0].Groups[1].Value }
  return $null
}

function Test-ReportValid {
  param($Report, $Config, [string]$WorkerId, [string]$RunId)
  $errors = @()
  if ($null -eq $Report) { return @{ ok = $false; errors = @('report file missing or unreadable') } }
  $names = @($Report.PSObject.Properties.Name)
  $stringFields = @('workerId', 'runId', 'assignment', 'status', 'remainingWork')
  $arrayFields = @('accomplished', 'filesCreatedOrModified', 'findings', 'checksPerformed', 'errorsWarningsBlockers')
  foreach ($f in $Config.reportSchema.required) {
    if ($names -notcontains $f) { $errors += "missing required field: $f" }
  }
  foreach ($f in $stringFields) {
    if ($names -contains $f) {
      $v = $Report.$f
      if (-not ($v -is [string]) -or [string]::IsNullOrWhiteSpace($v)) { $errors += "field '$f' must be a non-empty string" }
    }
  }
  foreach ($f in $arrayFields) {
    if ($names -contains $f) {
      if ($null -eq $Report.$f) { $errors += "field '$f' must be an array (may be empty)" }
    }
  }
  if ($names -contains 'considersComplete' -and ($Report.considersComplete -isnot [bool])) {
    $errors += "field 'considersComplete' must be a boolean"
  }
  if (($names -contains 'workerId') -and $Report.workerId -and $Report.workerId -ne $WorkerId) {
    $errors += "workerId mismatch (expected $WorkerId, got $($Report.workerId))"
  }
  if ($RunId) {
    if (($names -notcontains 'runId') -or (-not $Report.runId)) { $errors += "runId is required" }
    elseif ($Report.runId -ne $RunId) { $errors += "runId mismatch (expected $RunId, got $($Report.runId))" }
  }
  return @{ ok = ($errors.Count -eq 0); errors = $errors }
}

function New-ReportTemplate {
  param([string]$WorkerId, [string]$RunId, [string]$Assignment)
  $o = [ordered]@{
    workerId               = $WorkerId
    runId                  = $RunId
    assignment             = $Assignment
    status                 = ''
    accomplished           = @()
    filesCreatedOrModified = @()
    findings               = @()
    checksPerformed        = @()
    errorsWarningsBlockers = @()
    remainingWork          = ''
    considersComplete      = $false
  }
  return ($o | ConvertTo-Json -Depth 6)
}

# ---------------------------------------------------------------------------
# Misc
# ---------------------------------------------------------------------------
function Resolve-KiloInvocation {
  param($Config)
  if (-not [string]::IsNullOrWhiteSpace($Config.kiloNodeScript) -and (Test-Path -LiteralPath $Config.kiloNodeScript)) {
    $node = (Get-Command node -ErrorAction SilentlyContinue).Source
    return @{ exe = $node; prefix = @($Config.kiloNodeScript) }
  }
  $kiloCmd = Get-Command kilo -ErrorAction SilentlyContinue
  if (-not $kiloCmd) { throw "kilo CLI not found on PATH" }
  $shimDir = Split-Path -Parent $kiloCmd.Source
  $js = Join-Path $shimDir 'node_modules\@kilocode\cli\bin\kilo'
  if (Test-Path -LiteralPath $js) {
    $node = (Get-Command node -ErrorAction SilentlyContinue).Source
    if (-not $node) { throw "node not found on PATH" }
    return @{ exe = $node; prefix = @($js) }
  }
  throw "Could not resolve Kilo node entrypoint from shim: $($kiloCmd.Source)"
}

function ConvertTo-QuotedArgument {
  param([string]$Arg)
  if ($null -eq $Arg) { return '""' }
  if ($Arg -notmatch '[\s"]') { return $Arg }
  # Standard Windows CommandLineToArgvW quoting: escape backslash runs before a quote.
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.Append('"')
  $bs = 0
  foreach ($ch in $Arg.ToCharArray()) {
    if ($ch -eq '\') { $bs++; continue }
    if ($ch -eq '"') {
      [void]$sb.Append('\' * (($bs * 2) + 1))
      [void]$sb.Append('"')
      $bs = 0
      continue
    }
    if ($bs -gt 0) { [void]$sb.Append('\' * $bs); $bs = 0 }
    [void]$sb.Append($ch)
  }
  if ($bs -gt 0) { [void]$sb.Append('\' * ($bs * 2)) }
  [void]$sb.Append('"')
  return $sb.ToString()
}

function New-WorkerRecord {
  param([string]$WorkerId, [string]$Task, [string[]]$OwnedAbs, $Config)
  $now = (Get-Date).ToUniversalTime().ToString('o')
  return [ordered]@{
    workerId             = $WorkerId
    state                = 'CREATED'
    task                 = $Task
    ownedPaths           = $OwnedAbs
    agentName            = Get-AgentName -WorkerId $WorkerId
    agentFile            = Get-AgentFilePath -Config $Config -WorkerId $WorkerId
    provider             = $Config.provider
    model                = $Config.model
    variant              = $Config.variant
    sessionId            = $null
    currentRunId         = $null
    runs                 = @()
    attempt              = 0
    maxRunSeconds        = $null
    launcherPid          = $null
    launcherStartTimeUtc = $null
    kiloPid              = $null
    kiloStartTimeUtc     = $null
    pidsPending          = $false
    launchWarnings       = @()
    cleanupWarnings      = @()
    accepted             = $false
    reportValid          = $false
    reportErrors         = @()
    createdAt            = $now
    updatedAt            = $now
    notes                = @()
  }
}

function New-RunRecord {
  param([string]$RunId, [int]$Attempt, [string]$ReportPath)
  return [ordered]@{
    runId       = $RunId
    attempt     = $Attempt
    reportPath  = $ReportPath
    startedAt   = (Get-Date).ToUniversalTime().ToString('o')
    finishedAt  = $null
    exitCode    = $null
    timedOut    = $false
    stopped     = $false
    sessionId   = $null
    reportValid = $false
    reportErrors= @()
  }
}
