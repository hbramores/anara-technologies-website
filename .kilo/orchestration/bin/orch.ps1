[CmdletBinding()]
param(
  [Parameter(Mandatory, Position = 0)][string]$Action,
  [string]$Id,
  [string]$Task,
  [string[]]$Owned,
  [string]$Sandbox,
  [string]$Decision,
  [string]$Note,
  [string]$Message,
  [int]$MaxRunSeconds = 0,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'lib.ps1')

function Write-Out($Obj) { $Obj | ConvertTo-Json -Depth 12 }

function Assert-WorkerId([string]$WorkerId) {
  if ([string]::IsNullOrWhiteSpace($WorkerId)) { throw "Worker id is required (-Id)." }
  if ($WorkerId -notmatch '^[A-Za-z0-9][A-Za-z0-9._-]*$') { throw "Invalid worker id '$WorkerId'. Use letters, digits, dot, underscore, dash." }
}

function Get-WorkerOrThrow($Registry, [string]$WorkerId) {
  if (-not $Registry.Contains($WorkerId)) { throw "Worker '$WorkerId' not found in registry." }
  return $Registry[$WorkerId]
}

function Get-RunRecord($W, [string]$RunId) {
  foreach ($r in @($W.runs)) { if ($r.runId -eq $RunId) { return $r } }
  return $null
}

# Tools a generated worker must never use. Deterministic explicit denies are used
# instead of a global '*' wildcard so the read/edit allowlists cannot be shadowed.
$script:WorkerDenyTools = @(
  'bash', 'task', 'webfetch', 'websearch', 'external_directory',
  'background_process', 'notebook_edit', 'notebook_execute',
  'skill', 'cron_create', 'cron_delete', 'cron_list', 'schedule_wakeup',
  'goal', 'goal_report', 'link_pr', 'todowrite', 'board_post', 'board_read',
  'cancel_wakeup', 'kilo_local_recall', 'agent_manager_models'
)

function Build-AssignmentText {
  param($Config, [string]$WorkerId, [string]$TaskText, [string[]]$OwnedRel, [string]$SandboxRel)
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine("# Worker Assignment: $WorkerId")
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('You are an ANARA orchestrated worker. Read this whole assignment before acting.')
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('## Bounded task')
  [void]$sb.AppendLine($TaskText)
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('## Project rules you must follow')
  [void]$sb.AppendLine('- Work ONLY on this assignment. Do not implement anything else.')
  [void]$sb.AppendLine('- Inspect the relevant files (read/glob/grep) before writing.')
  [void]$sb.AppendLine('- Stay strictly inside your owned paths. Writes elsewhere are denied by policy.')
  [void]$sb.AppendLine('- Do NOT dispatch other workers and do NOT run shell commands.')
  [void]$sb.AppendLine('- Leave all workflow decisions to the main agent.')
  [void]$sb.AppendLine('- ANARA: never invent clients, testimonials, statistics, capabilities, or personal data.')
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('## Owned paths (your only allowed write targets)')
  foreach ($p in $OwnedRel) { [void]$sb.AppendLine("- $p") }
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine("## Sandbox: $SandboxRel")
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('## Acceptance criteria')
  [void]$sb.AppendLine('- The bounded task is completed exactly as specified.')
  [void]$sb.AppendLine('- Every created or modified file is inside your owned paths.')
  [void]$sb.AppendLine('- No file outside your owned paths is created or changed.')
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('## Required structured report')
  [void]$sb.AppendLine('Your run message gives the exact JSON report path for this run.')
  [void]$sb.AppendLine('The report MUST include: workerId, runId, assignment, status, accomplished,')
  [void]$sb.AppendLine('filesCreatedOrModified, findings, checksPerformed, errorsWarningsBlockers,')
  [void]$sb.AppendLine('remainingWork, considersComplete.')
  [void]$sb.AppendLine("Set workerId to '$WorkerId'. Use the exact runId from the run message.")
  [void]$sb.AppendLine('After writing the report, print the same JSON as your final message.')
  return $sb.ToString()
}

function Build-RunMessage {
  param([string]$WorkerId, [string]$RunId, [string]$AssignmentRel, [string]$ReportRel, [string]$Extra)
  $sb = New-Object System.Text.StringBuilder
  if ($Extra) { [void]$sb.AppendLine("Follow-up instructions: $Extra") }
  [void]$sb.AppendLine("Read and execute your assignment at $AssignmentRel.")
  [void]$sb.AppendLine("Write your JSON report to exactly this path: $ReportRel")
  [void]$sb.AppendLine("Set workerId='$WorkerId' and runId='$RunId' in the report.")
  [void]$sb.AppendLine('Every key listed in the assignment is required; use non-empty strings and arrays.')
  [void]$sb.AppendLine('Then print the report JSON as your final message.')
  return $sb.ToString()
}

function New-AgentFile {
  param($Config, [string]$WorkerId, [string[]]$AllowedDirAbs)
  $patterns = New-Object System.Collections.Generic.List[string]
  foreach ($abs in $AllowedDirAbs) {
    $rel = Get-RelFromRepo $abs
    $bs = $rel -replace '/', '\'
    $patterns.Add($bs)
    $patterns.Add(($bs.TrimEnd('\') + '\*'))
    $patterns.Add($rel)
    $patterns.Add(($rel.TrimEnd('/') + '/*'))
  }
  $unique = $patterns | Select-Object -Unique
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine('---')
  [void]$sb.AppendLine("description: ANARA orchestrated worker $WorkerId (generated; do not edit by hand)")
  [void]$sb.AppendLine('mode: primary')
  [void]$sb.AppendLine("model: $($Config.model)")
  [void]$sb.AppendLine('permission:')
  [void]$sb.AppendLine('  edit:')
  [void]$sb.AppendLine("    '**': deny")
  foreach ($p in $unique) { [void]$sb.AppendLine("    '" + ($p -replace "'", "''") + "': allow") }
  [void]$sb.AppendLine('  write:')
  [void]$sb.AppendLine("    '**': deny")
  foreach ($p in $unique) { [void]$sb.AppendLine("    '" + ($p -replace "'", "''") + "': allow") }
  [void]$sb.AppendLine('  read:')
  [void]$sb.AppendLine("    '*': allow")
  [void]$sb.AppendLine("    '**/*.env': deny")
  [void]$sb.AppendLine("    '**/*.env.*': deny")
  [void]$sb.AppendLine("    '**/*.pem': deny")
  [void]$sb.AppendLine("    '**/*.key': deny")
  [void]$sb.AppendLine("    '**/id_rsa*': deny")
  [void]$sb.AppendLine("    '**/credentials*': deny")
  [void]$sb.AppendLine('  grep: allow')
  [void]$sb.AppendLine('  glob: allow')
  [void]$sb.AppendLine('  list: allow')
  foreach ($t in $script:WorkerDenyTools) { [void]$sb.AppendLine("  ${t}: deny") }
  [void]$sb.AppendLine('---')
  [void]$sb.AppendLine("You are ANARA orchestrated worker $WorkerId.")
  [void]$sb.AppendLine('Follow the assignment file exactly. Write only inside your assigned paths.')
  [void]$sb.AppendLine('Do not dispatch workers. Do not run shell commands. Report honestly.')
  $content = $sb.ToString()
  $agentPath = Get-AgentFilePath -Config $Config -WorkerId $WorkerId
  $dir = Split-Path -Parent $agentPath
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  Set-Content -LiteralPath $agentPath -Value $content -Encoding UTF8
  return $agentPath
}

function Start-WorkerProcess {
  param($Config, [string]$WorkerId, [string]$RunId, [string]$MessageFile, [string]$SessionId, [switch]$Auto, [int]$MaxRunSeconds = 0)
  $runDir = Get-RunDir -Config $Config -WorkerId $WorkerId -RunId $RunId
  $runtimeFile = Join-Path $runDir 'runtime.json'
  Remove-Item -LiteralPath (Join-Path $runDir 'runtime.json'), (Join-Path $runDir 'done.json'), (Join-Path $runDir 'stop.request') -Force -ErrorAction SilentlyContinue
  $wrapper = Join-Path $PSScriptRoot 'worker-run.ps1'
  $argList = @(
    '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $wrapper,
    '-Id', $WorkerId,
    '-RunId', $RunId,
    '-RepoRoot', (Get-RepoRoot),
    '-OrchRoot', (Get-OrchRoot),
    '-AgentName', (Get-AgentName -WorkerId $WorkerId),
    '-Model', $Config.model,
    '-Variant', $Config.variant,
    '-MessageFile', $MessageFile,
    '-GraceSeconds', ([string]$Config.gracefulTimeoutSeconds),
    '-MaxRunSeconds', ([string]$MaxRunSeconds)
  )
  if ($Auto) { $argList += '-Auto' }
  if ($SessionId) { $argList += @('-SessionId', $SessionId) }
  $argString = ($argList | ForEach-Object { ConvertTo-QuotedArgument $_ }) -join ' '
  $launcher = Start-Process -FilePath 'powershell.exe' -ArgumentList $argString -WorkingDirectory (Get-RepoRoot) -PassThru -WindowStyle Hidden
  $launcherStart = Get-ProcessStartTimeUtc -ProcessId $launcher.Id
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  while (-not (Test-Path -LiteralPath $runtimeFile) -and $sw.Elapsed.TotalSeconds -lt 20) { Start-Sleep -Milliseconds 300 }
  $kiloPid = $null; $kiloStart = $null; $launchWarnings = @()
  if (Test-Path -LiteralPath $runtimeFile) {
    try {
      $rt = Get-Content -LiteralPath $runtimeFile -Raw | ConvertFrom-Json
      if ($rt.kiloPid) { $kiloPid = [int]$rt.kiloPid; $kiloStart = $rt.kiloStartTimeUtc }
    } catch { $launchWarnings += 'runtime.json was unreadable' }
  } else {
    $launchWarnings += 'runtime.json not produced within 20s; process identity pending (recoverable from launcher/runtime.json)'
  }
  if (-not $kiloStart -and $kiloPid) { $launchWarnings += 'kilo start time missing; identity unverified' }
  return [ordered]@{
    launcherPid          = $launcher.Id
    launcherStartTimeUtc = $launcherStart
    kiloPid              = $kiloPid
    kiloStartTimeUtc     = $kiloStart
    launchWarnings       = $launchWarnings
  }
}

# ---------------- actions ----------------

function Invoke-Create {
  param($Config, [string]$WorkerId, [string]$TaskText, [string[]]$OwnedIn, [string]$SandboxIn, [int]$MaxRunSeconds = 0, [switch]$Force)
  Assert-WorkerId $WorkerId
  if ([string]::IsNullOrWhiteSpace($TaskText)) { throw "Task text is required (-Task)." }
  $sandboxRel = if ($SandboxIn) { $SandboxIn } else { ($Config.sandboxRoot + '/' + $WorkerId) }
  foreach ($s in @($sandboxRel) + @($OwnedIn)) { if ($s -and (Test-ContainsGlobMeta $s)) { throw "Path must not contain glob metacharacters: $s" } }
  $sandboxAbs = Normalize-AbsPath $sandboxRel
  $ownDirAbs = Get-WorkerDir -Config $Config -WorkerId $WorkerId
  $ownedAbs = @($sandboxAbs, $ownDirAbs)
  foreach ($o in $OwnedIn) { if (-not [string]::IsNullOrWhiteSpace($o)) { $ownedAbs += (Normalize-AbsPath $o) } }
  $ownedAbs = $ownedAbs | Select-Object -Unique
  foreach ($abs in $ownedAbs) { Assert-OwnedPathAllowed -AbsPath $abs -Config $Config -WorkerId $WorkerId }
  Enter-RegistryLock
  try {
    $reg = Read-Registry
    if ($reg.Contains($WorkerId)) {
      $existing = $reg[$WorkerId]
      if (-not $Force -and $existing.state -notin @('TERMINATED', 'FAILED')) {
        throw "Worker '$WorkerId' already exists in state '$($existing.state)'. Use -Force to recreate."
      }
      if ($existing.state -in @('RUNNING', 'TERMINATING')) {
        throw "Worker '$WorkerId' is $($existing.state); terminate it before recreating."
      }
    }
    foreach ($other in (Get-ActiveWorkers -Registry $reg)) {
      if ($other.workerId -eq $WorkerId) { continue }
      foreach ($a in $ownedAbs) {
        foreach ($b in $other.ownedPaths) {
          if (Test-PathsOverlap -A $a -B $b) {
            throw "Ownership overlap rejected: '$a' (worker $WorkerId) overlaps '$b' (worker $($other.workerId))."
          }
        }
      }
    }
    $workerDir = Get-WorkerDir -Config $Config -WorkerId $WorkerId
    New-Item -ItemType Directory -Path $workerDir -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $workerDir 'runs') -Force | Out-Null
    if (-not (Test-Path -LiteralPath $sandboxAbs)) { New-Item -ItemType Directory -Path $sandboxAbs -Force | Out-Null }
    $rec = New-WorkerRecord -WorkerId $WorkerId -Task $TaskText -OwnedAbs $ownedAbs -Config $Config
    if ($MaxRunSeconds -gt 0) { $rec.maxRunSeconds = $MaxRunSeconds }
    $ownedRel = $ownedAbs | ForEach-Object { Get-RelFromRepo $_ }
    $assignText = Build-AssignmentText -Config $Config -WorkerId $WorkerId -TaskText $TaskText -OwnedRel $ownedRel -SandboxRel (Get-RelFromRepo $sandboxAbs)
    Set-Content -LiteralPath (Join-Path $workerDir 'assignment.md') -Value $assignText -Encoding UTF8
    $agentPath = New-AgentFile -Config $Config -WorkerId $WorkerId -AllowedDirAbs @($sandboxAbs, $ownDirAbs)
    $rec.agentFile = $agentPath
    $reg[$WorkerId] = $rec
    Write-Registry -Map $reg
    return [ordered]@{ ok = $true; action = 'create'; workerId = $WorkerId; state = 'CREATED'; ownedPaths = $ownedRel; agentName = $rec.agentName; agentFile = (Get-RelFromRepo $agentPath); provider = $rec.provider; model = $rec.model; variant = $rec.variant }
  } finally { Exit-RegistryLock }
}

function Start-Run {
  param($Config, [string]$WorkerId, [string]$ExtraMessage, [switch]$Resume)
  Enter-RegistryLock
  $reg = Read-Registry
  $w = Get-WorkerOrThrow $reg $WorkerId
  if ($w.state -in @('RUNNING', 'TERMINATING')) { Exit-RegistryLock; throw "Worker '$WorkerId' is $($w.state)." }
  if ($Resume) {
    if (-not $w.sessionId) { Exit-RegistryLock; throw "Worker '$WorkerId' has no sessionId yet; run collect first." }
  } elseif ($w.state -notin @('CREATED', 'NEEDS_FOLLOWUP')) {
    Exit-RegistryLock; throw "Worker '$WorkerId' in state '$($w.state)' cannot be started."
  }
  $running = @(Get-RunningWorkers -Registry $reg)
  if ($running.Count -ge [int]$Config.maxConcurrentWorkers) {
    $names = ($running | ForEach-Object { $_.workerId }) -join ', '
    Exit-RegistryLock; throw "Concurrency limit reached ($($Config.maxConcurrentWorkers)). RUNNING workers: $names."
  }
  if (-not (Test-Path -LiteralPath $w.agentFile)) { Exit-RegistryLock; throw "Generated agent file missing for '$WorkerId': $($w.agentFile)" }
  $nextAttempt = ([int]$w.attempt) + 1
  $runId = New-RunId -Attempt $nextAttempt
  $runDir = Get-RunDir -Config $Config -WorkerId $WorkerId -RunId $runId
  New-Item -ItemType Directory -Path $runDir -Force | Out-Null
  $reportRel = Get-RelFromRepo (Join-Path $runDir 'report.json')
  $msg = Build-RunMessage -WorkerId $WorkerId -RunId $runId -AssignmentRel (Get-RelFromRepo (Join-Path (Get-WorkerDir -Config $Config -WorkerId $WorkerId) 'assignment.md')) -ReportRel $reportRel -Extra $ExtraMessage
  $messageFile = Join-Path $runDir 'message.txt'
  Set-Content -LiteralPath $messageFile -Value $msg -Encoding UTF8
  Set-Content -LiteralPath (Join-Path $runDir 'report.template.json') -Value (New-ReportTemplate -WorkerId $WorkerId -RunId $runId -Assignment $w.task) -Encoding UTF8
  $w.state = 'RUNNING'
  $w.attempt = $nextAttempt
  $w.currentRunId = $runId
  $w.pidsPending = $true
  $w.launchWarnings = @()
  $w.kiloPid = $null; $w.kiloStartTimeUtc = $null; $w.launcherPid = $null; $w.launcherStartTimeUtc = $null
  $w.runs = @($w.runs) + (New-RunRecord -RunId $runId -Attempt $nextAttempt -ReportPath (Join-Path $runDir 'report.json'))
  $w.updatedAt = (Get-Date).ToUniversalTime().ToString('o')
  $reg[$WorkerId] = $w
  Write-Registry -Map $reg
  Exit-RegistryLock

  $mrs = 0
  if ($w.maxRunSeconds) { $mrs = [int]$w.maxRunSeconds } elseif ($Config.maxRunSeconds) { $mrs = [int]$Config.maxRunSeconds }
  $ids = $null; $launchError = $null
  try {
    $ids = Start-WorkerProcess -Config $Config -WorkerId $WorkerId -RunId $runId -MessageFile $messageFile -SessionId $(if ($Resume) { $w.sessionId } else { $null }) -Auto:([bool]$Config.autoApprove) -MaxRunSeconds $mrs
  } catch { $launchError = $_.Exception.Message }

  Enter-RegistryLock
  try {
    $reg2 = Read-Registry; $w2 = $reg2[$WorkerId]
    if ($launchError) {
      $w2.state = 'FAILED'
      $w2.pidsPending = $false
      $w2.launchWarnings = @($w2.launchWarnings) + ("launch failed: " + $launchError)
      $runRec = Get-RunRecord $w2 $runId
      if ($runRec) { $runRec.reportErrors = @('launch failed: ' + $launchError) }
    } else {
      $w2.launcherPid = $ids.launcherPid
      $w2.launcherStartTimeUtc = $ids.launcherStartTimeUtc
      $w2.kiloPid = $ids.kiloPid
      $w2.kiloStartTimeUtc = $ids.kiloStartTimeUtc
      $w2.pidsPending = (-not $ids.kiloPid)
      $w2.launchWarnings = @($w2.launchWarnings) + @($ids.launchWarnings)
      if ($Resume) { $w2.state = 'RUNNING' }
    }
    $w2.updatedAt = (Get-Date).ToUniversalTime().ToString('o')
    $reg2[$WorkerId] = $w2
    Write-Registry -Map $reg2
  } finally { Exit-RegistryLock }
  return [ordered]@{ ok = (-not $launchError); action = 'start'; workerId = $WorkerId; state = $(if ($launchError) { 'FAILED' } else { 'RUNNING' }); runId = $runId; launcherPid = $(if ($ids) { $ids.launcherPid }); kiloPid = $(if ($ids) { $ids.kiloPid }); pidsPending = $(if ($ids) { -not $ids.kiloPid }); warnings = $(if ($launchError) { @($launchError) } else { $ids.launchWarnings }) }
}

function Invoke-Collect {
  param($Config, [string]$WorkerId)
  $reg = Read-Registry
  $w = Get-WorkerOrThrow $reg $WorkerId
  $runId = $w.currentRunId
  if (-not $runId) { throw "Worker '$WorkerId' has no current run. Start it first." }
  $runDir = Get-RunDir -Config $Config -WorkerId $WorkerId -RunId $runId
  $done = Join-Path $runDir 'done.json'
  $reportFile = Join-Path $runDir 'report.json'
  $status = Get-WorkerProcessStatus -Config $Config -W $w
  $proc = $status.proc
  $alive = $status.alive
  $sessionId = $w.sessionId
  if (-not $sessionId) { $sessionId = Get-SessionIdFromLog -Path (Join-Path $runDir 'stdout.log') }
  $exitCode = $null; $timedOut = $false; $stopped = $false; $finished = $false
  if (Test-Path -LiteralPath $done) {
    try { $d = Get-Content -LiteralPath $done -Raw | ConvertFrom-Json; $exitCode = $d.exitCode; $timedOut = [bool]$d.timedOut; $stopped = [bool]$d.stopped; $finished = $true } catch {}
  }
  $report = $null
  if (Test-Path -LiteralPath $reportFile) {
    try { $report = Get-Content -LiteralPath $reportFile -Raw | ConvertFrom-Json } catch { $report = $null }
  }
  $validation = Test-ReportValid -Report $report -Config $Config -WorkerId $WorkerId -RunId $runId
  $newState = $w.state
  if ($alive) { $newState = 'RUNNING' }
  elseif ($timedOut) { $newState = 'FAILED' }
  elseif ($validation.ok) { $newState = 'AWAITING_REVIEW' }
  else { $newState = 'FAILED' }
  Enter-RegistryLock
  try {
    $reg2 = Read-Registry; $w2 = $reg2[$WorkerId]
    $w2.sessionId = $sessionId
    $w2.state = $newState
    $w2.pidsPending = $alive -and (-not $proc.kiloPid)
    $w2.reportValid = $validation.ok
    $w2.reportErrors = $validation.errors
    $runRec = Get-RunRecord $w2 $runId
    if ($runRec) {
      $runRec.exitCode = $exitCode; $runRec.timedOut = $timedOut; $runRec.stopped = $stopped
      $runRec.reportValid = $validation.ok; $runRec.reportErrors = $validation.errors
      $runRec.sessionId = $sessionId
      $runRec.finishedAt = (Get-Date).ToUniversalTime().ToString('o')
    }
    $w2.updatedAt = (Get-Date).ToUniversalTime().ToString('o')
    $reg2[$WorkerId] = $w2
    Write-Registry -Map $reg2
  } finally { Exit-RegistryLock }
  return [ordered]@{ ok = $true; action = 'collect'; workerId = $WorkerId; runId = $runId; state = $newState; sessionId = $sessionId; exitCode = $exitCode; finished = $finished; timedOut = $timedOut; processAlive = $alive; reportValid = $validation.ok; reportErrors = $validation.errors; reportPath = (Get-RelFromRepo $reportFile) }
}

function Invoke-Review {
  param($Config, [string]$WorkerId, [string]$DecisionIn, [string]$NoteText)
  if ($DecisionIn -notin @('accept', 'followup', 'fail')) { throw "Decision must be one of: accept, followup, fail." }
  Enter-RegistryLock
  try {
    $reg = Read-Registry
    $w = Get-WorkerOrThrow $reg $WorkerId
    if ($w.state -notin @('AWAITING_REVIEW', 'NEEDS_FOLLOWUP', 'FAILED')) {
      throw "Worker '$WorkerId' in state '$($w.state)' cannot be reviewed."
    }
    if ($DecisionIn -eq 'accept') { $w.accepted = $true; $w.state = 'AWAITING_REVIEW' }
    elseif ($DecisionIn -eq 'followup') { $w.accepted = $false; $w.state = 'NEEDS_FOLLOWUP' }
    else { $w.accepted = $false; $w.state = 'FAILED' }
    if ($NoteText) { $w.notes = @($w.notes) + $NoteText }
    $w.updatedAt = (Get-Date).ToUniversalTime().ToString('o')
    $reg[$WorkerId] = $w
    Write-Registry -Map $reg
    return [ordered]@{ ok = $true; action = 'review'; workerId = $WorkerId; decision = $DecisionIn; state = $w.state; accepted = $w.accepted; ownershipRetained = $true }
  } finally { Exit-RegistryLock }
}

function Invoke-Followup {
  param($Config, [string]$WorkerId, [string]$MessageText)
  if ([string]::IsNullOrWhiteSpace($MessageText)) { throw "Follow-up requires -Message." }
  return (Start-Run -Config $Config -WorkerId $WorkerId -ExtraMessage $MessageText -Resume)
}

function Invoke-Terminate {
  param($Config, [string]$WorkerId)
  $reg = Read-Registry
  $w = Get-WorkerOrThrow $reg $WorkerId
  if ($w.state -eq 'TERMINATED') {
    return [ordered]@{ ok = $true; action = 'terminate'; workerId = $WorkerId; state = 'TERMINATED'; note = 'already terminated' }
  }
  $proc = Resolve-WorkerProcessInfo -Config $Config -W $w
  $runDir = $(if ($w.currentRunId) { Get-RunDir -Config $Config -WorkerId $WorkerId -RunId $w.currentRunId } else { $null })
  Enter-RegistryLock
  try {
    $reg2 = Read-Registry; $w2 = $reg2[$WorkerId]; $w2.state = 'TERMINATING'; $w2.updatedAt = (Get-Date).ToUniversalTime().ToString('o'); $reg2[$WorkerId] = $w2; Write-Registry -Map $reg2
  } finally { Exit-RegistryLock }

  $cleanupWarnings = @()
  # Phase 1: graceful request + cooperative wait.
  if ($runDir -and (Test-Path -LiteralPath $runDir)) { Set-Content -LiteralPath (Join-Path $runDir 'stop.request') -Value ((Get-Date).ToUniversalTime().ToString('o')) -Encoding UTF8 }
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt [int]$Config.gracefulTimeoutSeconds) {
    $ka = Test-ProcessIdentity -ProcessId ([int]$proc.kiloPid) -StartTimeUtc $proc.kiloStartTimeUtc
    $la = Test-ProcessIdentity -ProcessId ([int]$proc.launcherPid) -StartTimeUtc $proc.launcherStartTimeUtc
    if ((-not $ka) -and (-not $la)) { break }
    Start-Sleep -Seconds 1
  }
  # Phase 2: forced, identity-verified tree kill. Missing identity blocks a kill.
  $blockedIdentity = $false; $kiloResult = $null; $launcherResult = $null; $remaining = @()
  foreach ($node in @(
      [pscustomobject]@{ name = 'kilo'; pid = [int]$proc.kiloPid; start = [string]$proc.kiloStartTimeUtc },
      [pscustomobject]@{ name = 'launcher'; pid = [int]$proc.launcherPid; start = [string]$proc.launcherStartTimeUtc })) {
    if (-not $node.pid) { continue }
    if ([string]::IsNullOrWhiteSpace($node.start)) { $blockedIdentity = $true; $cleanupWarnings += "cannot verify $($node.name) pid=$($node.pid) identity (missing start time); refusing to kill"; continue }
    if (-not (Test-ProcessIdentity -ProcessId $node.pid -StartTimeUtc $node.start)) { continue }  # already gone / pid reused
    $r = Stop-ProcessTreeVerified -ProcessId $node.pid -StartTimeUtc $node.start -TimeoutSeconds ([int]$Config.forcedTimeoutSeconds)
    if ($node.name -eq 'kilo') { $kiloResult = $r } else { $launcherResult = $r }
    $remaining += @($r.remaining)
  }
  # Re-check every recorded identity after the kill.
  $still = @()
  foreach ($node in @(
      [pscustomobject]@{ pid = [int]$proc.kiloPid; start = [string]$proc.kiloStartTimeUtc },
      [pscustomobject]@{ pid = [int]$proc.launcherPid; start = [string]$proc.launcherStartTimeUtc })) {
    if ($node.pid -and (Test-ProcessIdentity -ProcessId $node.pid -StartTimeUtc $node.start)) { $still += $node.pid }
  }
  $clean = ((-not $blockedIdentity) -and ($still.Count -eq 0) -and (($remaining | Measure-Object).Count -eq 0))
  if ($clean) {
    if (Test-Path -LiteralPath $w.agentFile) { Remove-Item -LiteralPath $w.agentFile -Force -ErrorAction SilentlyContinue }
    if ($runDir) { Remove-Item -LiteralPath (Join-Path $runDir 'stop.request') -Force -ErrorAction SilentlyContinue }
  } else {
    $cleanupWarnings += ("termination incomplete; still-alive=[$($still -join ',')]; refusing to mark TERMINATED")
  }
  Enter-RegistryLock
  try {
    $reg3 = Read-Registry; $w3 = $reg3[$WorkerId]
    if ($clean) {
      $w3.state = 'TERMINATED'
      $w3.kiloPid = $null; $w3.launcherPid = $null; $w3.pidsPending = $false
    } else {
      $w3.state = 'TERMINATING'
    }
    $w3.cleanupWarnings = @($w3.cleanupWarnings) + $cleanupWarnings
    $w3.updatedAt = (Get-Date).ToUniversalTime().ToString('o')
    $reg3[$WorkerId] = $w3; Write-Registry -Map $reg3
  } finally { Exit-RegistryLock }
  return [ordered]@{ ok = $clean; action = 'terminate'; workerId = $WorkerId; state = $(if ($clean) { 'TERMINATED' } else { 'TERMINATING' }); blockedIdentity = $blockedIdentity; stillAlive = $still; kiloResult = $kiloResult; launcherResult = $launcherResult; warnings = $cleanupWarnings }
}

function Invoke-List {
  $reg = Read-Registry
  $out = @()
  foreach ($k in ($reg.Keys | Sort-Object)) {
    $w = $reg[$k]
    $out += [ordered]@{
      workerId = $w.workerId; state = $w.state; accepted = $w.accepted; attempt = $w.attempt
      model = $w.model; variant = $w.variant; sessionId = $w.sessionId; currentRunId = $w.currentRunId
      kiloPid = $w.kiloPid; pidsPending = $w.pidsPending; reportValid = $w.reportValid
      owned = (($w.ownedPaths | ForEach-Object { Get-RelFromRepo $_ }) -join '; ')
      updatedAt = $w.updatedAt
    }
  }
  return [ordered]@{ ok = $true; action = 'list'; count = $out.Count; workers = $out }
}

function Invoke-Status {
  param([string]$WorkerId)
  $reg = Read-Registry
  if ($WorkerId) { return (Get-WorkerOrThrow $reg $WorkerId) }
  return $reg
}

function Complete-TerminationIfClean {
  param($Config, $W)
  $status = Get-WorkerProcessStatus -Config $Config -W $W
  $proc = $status.proc
  if (@($status.unverifiable).Count -gt 0) {
    $W.cleanupWarnings = @($W.cleanupWarnings) + ("gc: cannot verify process identity for pid(s) [$(@($status.unverifiable) -join ',')]; refusing to complete termination")
    return $false
  }
  $still = @()
  foreach ($node in @(
      [pscustomobject]@{ pid = [int]$proc.kiloPid; start = [string]$proc.kiloStartTimeUtc },
      [pscustomobject]@{ pid = [int]$proc.launcherPid; start = [string]$proc.launcherStartTimeUtc })) {
    if ($node.pid -and (Test-ProcessIdentity -ProcessId $node.pid -StartTimeUtc $node.start)) { $still += $node.pid }
  }
  if ($still.Count -eq 0) {
    if (Test-Path -LiteralPath $W.agentFile) { Remove-Item -LiteralPath $W.agentFile -Force -ErrorAction SilentlyContinue }
    $W.state = 'TERMINATED'; $W.kiloPid = $null; $W.launcherPid = $null; $W.pidsPending = $false
    return $true
  }
  $W.cleanupWarnings = @($W.cleanupWarnings) + ("gc: termination incomplete; still-alive=[$($still -join ',')]")
  return $false
}

function Invoke-Gc {
  param($Config)
  $changed = @()
  Enter-RegistryLock
  try {
    $reg = Read-Registry
    foreach ($k in @($reg.Keys)) {
      $w = $reg[$k]
      if ($w.state -eq 'RUNNING') {
        $status = Get-WorkerProcessStatus -Config $Config -W $w
        if ($w.pidsPending -and $status.proc.kiloPid) { $w.kiloPid = $status.proc.kiloPid; $w.kiloStartTimeUtc = $status.proc.kiloStartTimeUtc; $w.pidsPending = $false }
        $alive = $status.alive
        if (-not $alive) {
          $runDir = $(if ($w.currentRunId) { Get-RunDir -Config $Config -WorkerId $k -RunId $w.currentRunId } else { $null })
          $valid = $false; $timedOut = $false
          if ($runDir) {
            $done = Join-Path $runDir 'done.json'; $reportFile = Join-Path $runDir 'report.json'
            if (Test-Path -LiteralPath $done) { try { $timedOut = [bool]((Get-Content -LiteralPath $done -Raw | ConvertFrom-Json).timedOut) } catch {} }
            if (Test-Path -LiteralPath $reportFile) { try { $r = Get-Content -LiteralPath $reportFile -Raw | ConvertFrom-Json; $valid = (Test-ReportValid -Report $r -Config $Config -WorkerId $k -RunId $w.currentRunId).ok } catch {} }
          }
          if ($timedOut) { $w.state = 'FAILED' } elseif ($valid) { $w.state = 'AWAITING_REVIEW' } else { $w.state = 'FAILED' }
          $w.reportValid = $valid
          $w.notes = @($w.notes) + 'gc: process not alive; state reconciled'
          $changed += $k
        }
      } elseif ($w.state -eq 'TERMINATING') {
        if (Complete-TerminationIfClean -Config $Config -W $w) { $changed += $k }
      }
      $w.updatedAt = (Get-Date).ToUniversalTime().ToString('o')
      $reg[$k] = $w
    }
    Write-Registry -Map $reg
  } finally { Exit-RegistryLock }
  return [ordered]@{ ok = $true; action = 'gc'; reconciled = $changed }
}

function Invoke-Verify {
  $reg = Read-Registry
  $issues = @()
  foreach ($k in @($reg.Keys)) {
    $w = $reg[$k]
    if ($w.state -eq 'RUNNING') {
      $proc = Resolve-WorkerProcessInfo -Config (Get-OrchConfig) -W $w
      $alive = Test-ProcessIdentity -ProcessId ([int]$proc.kiloPid) -StartTimeUtc $proc.kiloStartTimeUtc
      if (-not $alive -and -not $w.pidsPending) { $issues += "worker $k state=RUNNING but no live verified process (run collect/gc)" }
      if ($w.pidsPending) { $issues += "worker $k state=RUNNING with pidsPending (missing verified process identity)" }
    } elseif ($w.state -eq 'TERMINATING') {
      $issues += "worker $k state=TERMINATING (run gc/terminate to complete cleanup)"
    }
    if ($w.state -eq 'TERMINATED') {
      if (Test-Path -LiteralPath $w.agentFile) { $issues += "worker $k TERMINATED but generated agent still exists" }
      if ($w.kiloPid -or $w.launcherPid) { $issues += "worker $k TERMINATED but process ids retained" }
    }
  }
  return [ordered]@{ ok = ($issues.Count -eq 0); action = 'verify'; issues = $issues }
}

switch ($Action.ToLower()) {
  'create'    { $config = Get-OrchConfig; Write-Out (Invoke-Create -Config $config -WorkerId $Id -TaskText $Task -OwnedIn $Owned -SandboxIn $Sandbox -MaxRunSeconds $MaxRunSeconds -Force:$Force) }
  'start'     { $config = Get-OrchConfig; Write-Out (Start-Run -Config $config -WorkerId $Id) }
  'collect'   { $config = Get-OrchConfig; Write-Out (Invoke-Collect -Config $config -WorkerId $Id) }
  'review'    { $config = Get-OrchConfig; Write-Out (Invoke-Review -Config $config -WorkerId $Id -DecisionIn $Decision -NoteText $Note) }
  'followup'  { $config = Get-OrchConfig; Write-Out (Invoke-Followup -Config $config -WorkerId $Id -MessageText $Message) }
  'terminate' { $config = Get-OrchConfig; Write-Out (Invoke-Terminate -Config $config -WorkerId $Id) }
  'list'      { Write-Out (Invoke-List) }
  'status'    { Write-Out (Invoke-Status -WorkerId $Id) }
  'gc'        { $config = Get-OrchConfig; Write-Out (Invoke-Gc -Config $config) }
  'verify'    { Write-Out (Invoke-Verify) }
  default     { throw "Unknown action '$Action'. Use: create|start|collect|review|followup|terminate|list|status|gc|verify" }
}
