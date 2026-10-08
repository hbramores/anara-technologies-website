@{
  provider                = 'nvidia'
  model                   = 'nvidia/deepseek-ai/deepseek-v4.1-flash'
  variant                 = 'max'
  autoApprove             = $true
  autoApproveNote         = 'Verified: --auto only auto-approves non-denied permissions; explicit agent deny rules are still enforced.'
  maxConcurrentWorkers    = 2
  gracefulTimeoutSeconds  = 25
  pollSeconds             = 1
  forcedTimeoutSeconds    = 15
  killTreeTimeoutSeconds  = 20
  maxRunSeconds           = 900
  lifecycleSandboxOnly    = $true
  sandboxRoot             = '.kilo/orchestration/tests/sandbox'
  workersRoot             = '.kilo/orchestration/workers'
  agentWorkersDir         = '.kilo/agent/workers'
  kiloNodeScript          = ''
  protectedGlobs          = @(
    '.git/**',
    'src/**',
    'public/**',
    'index.html',
    'vite.config.js',
    '.oxlintrc.json',
    'test/**',
    'tests/**',
    'Files/**',
    'files/**',
    'AGENTS.md',
    'README.md',
    'package.json',
    'package-lock.json',
    'kilo.json',
    'kilo.jsonc',
    'vercel.json',
    '.env',
    '.env.*',
    '**/*.env',
    '**/migrations/**',
    '**/*.sql',
    '.kilo/agent/**',
    '.kilo/orchestration/bin/**',
    '.kilo/orchestration/templates/**',
    '.kilo/orchestration/orchestration.settings.psd1',
    '.kilo/orchestration/registry.json',
    '.kilo/orchestration/ORCHESTRATION.md',
    '.kilo/orchestration/.registry.lock'
  )
  reportSchema            = @{
    required = @(
      'workerId',
      'assignment',
      'status',
      'accomplished',
      'filesCreatedOrModified',
      'findings',
      'checksPerformed',
      'errorsWarningsBlockers',
      'remainingWork',
      'considersComplete'
    )
  }
}
