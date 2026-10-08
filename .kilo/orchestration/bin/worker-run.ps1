[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$Id,
  [Parameter(Mandatory)][string]$RunId,
  [Parameter(Mandatory)][string]$RepoRoot,
  [Parameter(Mandatory)][string]$OrchRoot,
  [Parameter(Mandatory)][string]$AgentName,
  [Parameter(Mandatory)][string]$Model,
  [Parameter(Mandatory)][string]$Variant,
  [Parameter(Mandatory)][string]$MessageFile,
  [string]$SessionId,
  [switch]$Auto,
  [int]$GraceSeconds = 25,
  [int]$MaxRunSeconds = 0
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'lib.ps1')

$runDir     = Join-Path (Join-Path (Join-Path $OrchRoot 'workers') $Id) (Join-Path 'runs' $RunId)
if (-not (Test-Path -LiteralPath $runDir)) { New-Item -ItemType Directory -Path $runDir -Force | Out-Null }
$stdoutLog  = Join-Path $runDir 'stdout.log'
$stderrLog  = Join-Path $runDir 'stderr.log'
$runtimeFile= Join-Path $runDir 'runtime.json'
$doneFile   = Join-Path $runDir 'done.json'
$stopFile   = Join-Path $runDir 'stop.request'

$wrapperStart = Get-ProcessStartTimeUtc -ProcessId $PID
$message = Get-Content -LiteralPath $MessageFile -Raw

$config = Get-OrchConfig
$kilo = Resolve-KiloInvocation -Config $config

$argList = @()
$argList += $kilo.prefix
$argList += 'run'
if ($Auto) { $argList += '--auto' }
$argList += @('-m', $Model, '--variant', $Variant, '--format', 'json', '--agent', $AgentName, '--title', ("orch:" + $Id + ":" + $RunId))
if ($SessionId) { $argList += @('-s', $SessionId) }
$argList += $message
$argString = ($argList | ForEach-Object { ConvertTo-QuotedArgument $_ }) -join ' '

$proc = Start-Process -FilePath $kilo.exe -ArgumentList $argString -WorkingDirectory $RepoRoot -RedirectStandardOutput $stdoutLog -RedirectStandardError $stderrLog -PassThru -NoNewWindow
$kiloStart = Get-ProcessStartTimeUtc -ProcessId $proc.Id

$runtime = [ordered]@{
  workerId            = $Id
  runId               = $RunId
  wrapperPid          = $PID
  wrapperStartTimeUtc = $wrapperStart
  kiloPid             = $proc.Id
  kiloStartTimeUtc    = $kiloStart
  exe                 = $kilo.exe
  args                = $argString
  startedAt           = (Get-Date).ToUniversalTime().ToString('o')
}
($runtime | ConvertTo-Json -Depth 5) | Set-Content -LiteralPath $runtimeFile -Encoding UTF8

$stopped = $false
$timedOut = $false
$runWatch = [System.Diagnostics.Stopwatch]::StartNew()
while ($true) {
  $proc.Refresh()
  if ($proc.HasExited) { break }
  if ($MaxRunSeconds -gt 0 -and $runWatch.Elapsed.TotalSeconds -ge $MaxRunSeconds) {
    $timedOut = $true
    [void](Stop-ProcessTreeVerified -ProcessId $proc.Id -StartTimeUtc $kiloStart -TimeoutSeconds 15)
    break
  }
  if (Test-Path -LiteralPath $stopFile) {
    $age = (Get-Date) - (Get-Item -LiteralPath $stopFile).LastWriteTime
    if ($age.TotalSeconds -ge $GraceSeconds) {
      $stopped = $true
      [void](Stop-ProcessTreeVerified -ProcessId $proc.Id -StartTimeUtc $kiloStart -TimeoutSeconds 15)
      break
    }
  }
  Start-Sleep -Seconds 1
}

$proc.Refresh()
$exitCode = $null
try { [void]$proc.WaitForExit(5000) } catch {}
try { if ($proc.HasExited) { $exitCode = [int]$proc.ExitCode } } catch { $exitCode = -1 }

$done = [ordered]@{
  workerId   = $Id
  runId      = $RunId
  exitCode   = $exitCode
  stopped    = $stopped
  timedOut   = $timedOut
  finishedAt = (Get-Date).ToUniversalTime().ToString('o')
}
($done | ConvertTo-Json -Depth 5) | Set-Content -LiteralPath $doneFile -Encoding UTF8
