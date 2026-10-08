# ANARA Worker Orchestration

Real, process-level Kilo Code worker orchestration for the ANARA website project.
`AGENTS.md` states the policy; this document holds the machine-specific commands
and usage details, and describes only behavior that has been verified by the
regression suite in `tests/run-regression.ps1`.

## 1. What this is

Each worker is a **separate, real `kilo run` OS process** with its own session,
its own run-scoped logs, and its own generated agent with permission-scoped
write access. The main agent owns all workflow decisions; workers only execute a
bounded assignment and return a structured report.

All scripts are PowerShell (Windows). All runtime state is local and git-ignored.

## 2. Verified configuration

- Kilo CLI: **7.8.8** (`kilo --version`).
- Provider/model: **`nvidia/deepseek-ai/deepseek-v4.1-flash`** (Nvidia provider; `kilo auth list` shows an Nvidia api credential).
- Reasoning: **`--variant max`** (supported variants for this model: none, low, high, max).
- Worker interface: `kilo run --format json --agent <name>` run with the repository as the working directory, with session resume via `-s <sessionID>`.
- Live-verified: model reachability, `--variant max`, JSON event stream, session id capture, and resume in the same conversation.

### `--auto` semantics (verified)

Headless `kilo run` auto-rejects any file mutation that is not pre-approved, so
workers cannot edit without `--auto`. `--auto` auto-approves only permissions
that are **not explicitly denied**; an explicit agent `deny` rule is still
enforced under `--auto`:

```
{"permission":"edit","pattern":"**","action":"deny","source":"agent"}
```

Workers therefore run with `--auto` **and** a generated agent whose default is
`'**': deny` with narrow `allow` entries. Verified: an in-sandbox write
succeeded and an out-of-sandbox write was hard-denied.

### Permission pattern rules (verified)

- Patterns use Windows backslashes for the working tree, e.g. `.kilo\orchestration\tests\sandbox\W1\*`.
- Put the broad `'**': deny` **first**, then specific `allow` entries (later entries win).
- A tool whose only rule is `deny` (no `allow`) is hidden from the worker; always keep at least one `allow`.
- Agent `edit` scoping also governs the `write` tool.
- Generated agents must live under `.kilo/agent/workers/` (see Limitations).
- Tools are locked down with **explicit per-tool denies** (bash, task, webfetch,
  websearch, external_directory, background_process, notebook, skill, cron,
  goal, link_pr, todowrite, board tools, recall, model listing) rather than a
  global `'*'` wildcard, so the read/edit allowlists cannot be shadowed.
- `read` is allow-by-default for the repository but explicitly denies
  `.env`, `.env.*`, `*.pem`, `*.key`, `id_rsa*`, and `credentials*`.

## 3. Layout

```
.kilo/
  agent/
    workers/
      .gitkeep
      base-readonly.md            # read-only reference agent (tracked)
      worker-<id>.md              # GENERATED per worker (git-ignored)
  orchestration/
    ORCHESTRATION.md              # this file (tracked)
    orchestration.settings.psd1   # config (tracked)
    registry.json                 # live registry (git-ignored)
    registry.json.bak             # last-good registry backup (git-ignored)
    .registry.lock / .registry.lock.owner   # lock + owner metadata (git-ignored)
    bin/
      orch.ps1                    # lifecycle CLI (tracked)
      lib.ps1                     # helpers (tracked)
      worker-run.ps1              # per-worker wrapper process (tracked)
    templates/
      worker-agent.template.md    # template for generated agents (tracked)
    tests/
      run-regression.ps1          # focused regression checks (tracked)
      sandbox/<id>/               # lifecycle test sandbox (git-ignored)
    workers/<id>/                 # per-worker record (git-ignored)
      assignment.md
      runs/<runId>/               # ONE DIRECTORY PER EXECUTION (history kept)
        message.txt
        report.template.json
        report.json               # worker's structured report for this run
        stdout.log / stderr.log
        runtime.json              # OS process identities for this run
        done.json                 # exit code, stopped/timedOut flags
        stop.request              # graceful-stop signal
```

## 4. Lifecycle

`CREATE -> EXECUTE -> REPORT -> EVALUATE -> CONTINUE or TERMINATE`

Run from the repository root (`$o` is the CLI path):

```powershell
$o = ".kilo\orchestration\bin\orch.ps1"

# CREATE - checks ownership overlap, path guards, generates agent + assignment
powershell -NoProfile -ExecutionPolicy Bypass -File $o create `
  -Id W1 -Task "Create hello.txt in your sandbox containing HELLO"

# EXECUTE - launches a detached wrapper process (concurrency-capped)
powershell -NoProfile -ExecutionPolicy Bypass -File $o start -Id W1

# REPORT - parse run logs, capture sessionId, validate run-scoped report
powershell -NoProfile -ExecutionPolicy Bypass -File $o collect -Id W1

# EVALUATE - the MAIN AGENT inspects the diff, then records the decision
powershell -NoProfile -ExecutionPolicy Bypass -File $o review -Id W1 -Decision accept -Note "verified"

# CONTINUE - resume the same conversation under a NEW run id
powershell -NoProfile -ExecutionPolicy Bypass -File $o followup -Id W1 -Message "Also create bye.txt"

# TERMINATE - graceful then bounded, identity-verified cleanup
powershell -NoProfile -ExecutionPolicy Bypass -File $o terminate -Id W1

# Observability
powershell -NoProfile -ExecutionPolicy Bypass -File $o list
powershell -NoProfile -ExecutionPolicy Bypass -File $o status -Id W1
powershell -NoProfile -ExecutionPolicy Bypass -File $o gc        # reconcile RUNNING/TERMINATING
powershell -NoProfile -ExecutionPolicy Bypass -File $o verify    # orphans / stale state
```

Optional flags: `create -Sandbox <rel>`, `create -Owned <rel1,rel2>`,
`create -MaxRunSeconds <n>`, `create -Force`.

## 5. Registry, states, and run identity

`registry.json` is a map of worker id -> record, written under an OS-managed
exclusive lock. Each record includes: state, task, ownedPaths, agent, provider/
model/variant, sessionId, currentRunId, a `runs` array (one entry per execution),
launcher/kilo PIDs with UTC start times, `pidsPending`, launch/cleanup warnings,
accepted, and report validation results.

States: `CREATED`, `RUNNING`, `AWAITING_REVIEW`, `NEEDS_FOLLOWUP`, `FAILED`,
`TERMINATING`, `TERMINATED`.

Every execution gets a fresh run id (`r<attempt>-<random>`), its own
`runs/<runId>/` directory, and a fresh `report.json`. `collect` reads only the
current run's report and requires the report's `runId` and `workerId` to match;
a stale report from a previous run is never accepted. Prior runs are retained.

Ownership is held from `CREATED` through `AWAITING_REVIEW`, `NEEDS_FOLLOWUP`,
`FAILED`, and `TERMINATING`, and is released only at `TERMINATED`.

## 6. Ownership, path guards, and concurrency

- `create` rejects any assignment whose owned paths overlap an active worker's paths.
- `create` rejects protected paths (app code, dependencies, env, db/migrations, deploy files, orchestration internals, other workers' records, agent files), including the bare directory node itself.
- Owned paths containing glob metacharacters (`* ? [`) are rejected.
- In `lifecycleSandboxOnly` mode, owned paths must be inside `.kilo/orchestration/tests/sandbox` or the worker's own record dir.
- Owned paths that pass through an existing junction/symlink (reparse point) are rejected.
- `start` enforces `maxConcurrentWorkers` (default **2**).
- Workers share one working tree; isolation is logical (ownership + deny-scoped agent), not a separate worktree.

## 7. Required structured report

Workers must write valid JSON to the run's `report.json` with keys:
`workerId, runId, assignment, status, accomplished, filesCreatedOrModified,
findings, checksPerformed, errorsWarningsBlockers, remainingWork,
considersComplete`.

Validation requires non-empty strings for `workerId, runId, assignment, status,
remainingWork`, arrays for the list fields, a boolean `considersComplete`, and
matching `workerId`/`runId`. A missing or malformed report is treated as
`FAILED`. The worker's `considersComplete` value is only a claim; acceptance is
recorded separately by the main agent via `review`.

## 8. Process management and safety

- `start` creates the run directory, records the run id, launches `worker-run.ps1`
  as a detached OS process, and records the launcher and Kilo PIDs with their UTC
  start times.
- If `runtime.json` is delayed or launch fails, the worker stays `RUNNING` with
  `pidsPending` and a launch warning; `collect`, `gc`, and `terminate` recover
  identity from `runtime.json`. A hard launch failure marks the worker `FAILED`.
- Every kill checks the recorded PID **and** start time against the live process.
  A PID whose recorded start time is missing is never killed by PID alone.
- Termination is two-phase: a `stop.request` graceful window
  (`gracefulTimeoutSeconds`), then a bounded forced kill of the recorded process
  tree (`forcedTimeoutSeconds`, `killTreeTimeoutSeconds`), in which each node is
  verified before it is killed and the whole snapshot is re-checked afterwards.
- If any recorded owned process (or an unverifiable PID) remains after the forced
  phase, the worker stays `TERMINATING`, keeps its process records, and records a
  cleanup warning; it is never marked `TERMINATED` while known owned processes
  remain. `gc` completes termination once the processes are gone.
- Per-run runtime is bounded by `maxRunSeconds`; on expiry the wrapper kills the
  tree and records `timedOut: true`, which `collect` reports as `FAILED`.

### Crash-recovery limitations

- The registry lock is an OS-managed exclusive handle; the OS releases it when
  the holder dies, so a crash does not wedge the lock. A stale lock is only ever
  reclaimed after verifying the recorded owner is no longer alive; age alone
  never justifies stealing a live lock.
- If the main agent dies mid-run, `runtime.json` identifies the worker process;
  run `gc` or `terminate` to reconcile. `gc` reconciles `RUNNING` workers whose
  process is gone and completes `TERMINATING` workers whose processes are gone.
- Registry writes use an atomic replace (`System.IO.File.Replace`) with a
  last-good backup; an unreadable registry falls back to the backup.
- Process-tree containment is **snapshot-based**: a process spawned after the
  snapshot, detached into a separate job object, or reparented away from the
  recorded tree may survive. Such survivors are caught only if their recorded
  identity is still tracked, so review and `verify` must be used to detect them.
- Windows has no SIGTERM for console processes: the "graceful" phase is a
  bounded cooperative wait, after which termination is forced.

## 9. Known limitations

- Headless workers require `--auto`; safe only with the deny-scoped agent (verified).
- Only nested agent files (`.kilo/agent/workers/*.md`) parse as agents in this
  build; a file placed directly in `.kilo/agent/` fails frontmatter validation.
- A cosmetic validation warning is emitted for `.kilo/**/*.json` runtime files
  (registry, reports) because Kilo scans that tree for config; content is valid.
- Scripts are Windows PowerShell only.
- Concurrent workers share one worktree; use `kilo worktree` if stronger
  filesystem isolation is required (not the default).
- No separate terminal UI per worker (headless CLI); workers are independent
  processes with run-scoped logs plus resumable sessions.

## 10. Verification performed

`tests/run-regression.ps1` exercises the confirmed defects with harmless isolated
tasks and currently passes 21/21, covering: run-id report gating, missing-identity
kill refusal, atomic registry write + backup recovery, ownership overlap,
protected bare-directory paths, glob-metacharacter rejection, other-worker record
rejection, junction-escape rejection, in-scope vs out-of-scope write enforcement,
secret-read scoping, follow-up resume under a new run with retained history, and
bounded timeout producing `FAILED`, plus termination cleanup with the generated
agent removed.

An external independent subagent re-review could not be completed in this
environment (the reviewer runner failed repeatedly with network errors), so the
fixes were verified by direct source re-inspection plus this regression suite.
Process-tree cleanup remains snapshot-based as described in section 8.
