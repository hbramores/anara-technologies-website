# AGENTS.md — ANARA Technologies Website

## 1. Purpose

This file defines how Kilo, coding agents, and other AI assistants must work on the ANARA Technologies website.

The website is a corporate portfolio and lead-generation website for ANARA Technologies. It showcases ANARA, its systems (initially PLANTWAIS), its services, and provides Contact and Start a Project inquiry flows.

## 2. Sources of Truth

Use these project documents in this order:

1. `files/ANARA_Website_PRD_v1.md` — product requirements, approved content, scope, brand direction, and V1 requirements.
2. `files/ANARA_Website_Modular_Build_Checklist.md` — implementation order and module IDs.
3. `AGENTS.md` — this file, located in the project root; defines how the AI must execute work and report to the user.
4. Existing verified code — implementation reality, provided it does not conflict with the documents above.

If requirements conflict, do not silently choose. Report the conflict and ask the user when the correct decision cannot be determined safely.

## 2.1 Project Structure

Treat the project root as:

```text
anara-technologies-website/   # frontend repository root
├── AGENTS.md
├── Files/
│   ├── ANARA_Website_PRD_v1.md
│   └── ANARA_Website_Modular_Build_Checklist.md
├── src/                # React application source
├── public/             # static assets
├── test/               # frontend unit tests
├── tests/              # headless browser checks
├── .kilo/              # worker orchestration tooling
├── index.html
├── package.json
└── vite.config.js
```

The `Files/` directory contains project reference documents. Do not treat it as application source code.

The form backend is a separate repository (`anara-technologies-backend`); this repository contains the frontend only.

`AGENTS.md` belongs in the project root so its instructions apply to the entire ANARA Website project.

Do not move, rename, or duplicate the PRD or build checklist unless the user explicitly requests it.

## 3. Core Execution Rule

Work on ONE approved module at a time.

Examples:
- A01 only
- B03 only
- E05 only

Do not implement future modules early just because they are related or convenient.

Do not start the next module until:
1. the current module is implemented,
2. the current module is verified,
3. the result is reported to the user, and
4. the user explicitly approves proceeding.

## 4. No Scope Creep

Do not:
- add features that are not in the PRD or current module;
- redesign approved content without permission;
- add packages or dependencies without a clear need;
- create a database unless a requirement actually needs one;
- add authentication, payments, dashboards, CMS, live chat, booking, or other out-of-scope V1 features;
- refactor unrelated working code during a focused module;
- implement speculative future features.

If you see a possible improvement outside the current scope, mention it under `Optional / Later` in the report. Do not implement it.

## 5. Preserve Approved ANARA Brand Decisions

Unless the user changes them, preserve:

- Company: ANARA Technologies
- Meaning: A New Approach to Real-world Advancement
- Positioning: Digital Systems for Growing Businesses
- Homepage headline: From business problems to working systems.
- Key client message: Tell us what’s slowing your business down. We’ll explore how technology can help.
- Primary gradient: `#670022 → #B0004B → #EB347C`
- Overall visual direction: primarily light, strategic dark sections, magenta accents
- Tone: professional, approachable, modern, simple, clear, grounded, forward-looking
- Audience language: plain language understandable to Filipino MSMEs and non-technical business owners
- Official logo asset: `src/assets/anara-logo.png` (import it; never stretch, distort, recolor, redraw, regenerate, or modify it; on dark surfaces adapt the surrounding presentation instead of the logo)

Do not replace approved copy with generic tech-company language unless explicitly asked.

## 6. Technical Direction

Default V1 direction from the PRD:

- React + Vite
- Tailwind CSS
- Node.js + Express only where server-side functionality is actually required
- No database unless a concrete requirement needs persistent storage
- Secure server-side or transactional email handling for forms
- CAPTCHA on Contact and Start a Project forms
- Responsive design
- SEO basics
- Analytics
- Accessibility basics

Before installing a dependency, first check whether the existing stack already solves the requirement.

## 7. Code Quality Rules

- Keep components focused and reusable where reuse is real.
- Prefer simple solutions over unnecessary abstractions.
- Use clear file and component names.
- Avoid duplicated UI and business logic.
- Keep secrets in environment variables.
- Never expose private keys or server credentials in frontend code.
- Do not hardcode production secrets.
- Keep `.env` ignored and maintain `.env.example` with safe placeholder values.
- Do not leave avoidable console errors or warnings.
- Remove dead code created during the current module.
- Maintain responsive behavior when editing shared components.

## 8. Content Rules

Do not invent:
- clients;
- testimonials;
- partnerships;
- awards;
- product capabilities;
- PLANTWAIS results;
- company history;
- team members;
- founder or personal profile information;
- statistics.

PLANTWAIS must be represented honestly as `In Development` until the user changes that status.

**Founder / personal privacy (approved decision).** The public website must not display Founder or personal profile information — name, biography, photograph, personal or developer background, job title, education, or personal social accounts — unless the user explicitly changes this decision. The About page represents ANARA Technologies OPC as a company, not an individual.

**Young Farmers Challenge support (approved).** PLANTWAIS received support through the Department of Agriculture's Young Farmers Challenge Program. This may be shown on the PLANTWAIS page using the wording "Supported through the Department of Agriculture's Young Farmers Challenge Program". Do not state or imply official DA endorsement, partnership, or ownership, that PLANTWAIS is a DA system, or any relationship beyond that program support. Do not mention grant amounts. Keep the recognition visually secondary to the ANARA and PLANTWAIS brands.

Do not present school/personal projects as official ANARA systems unless the user explicitly approves them.

## 9. Forms and Security

For form-related modules:

- validate required inputs;
- validate on the server when a backend is involved;
- never trust client-side validation alone;
- verify CAPTCHA server-side;
- use basic abuse/rate-limit protection where required;
- do not expose email service credentials;
- provide clear loading, success, and error states;
- do not automatically imply that submitting a project inquiry means ANARA accepted the project.

## 10. Verification Rule

A module is not complete just because code was written.

Run the relevant verification for the module. Examples include:

- development/build command;
- linting if configured;
- route/navigation checks;
- responsive checks;
- form validation checks;
- backend endpoint checks;
- CAPTCHA checks;
- production build;
- Lighthouse or accessibility checks where the module requires them.

Fix errors caused by the current work before reporting completion.

If verification cannot be run, state exactly what was not verified and why.

## 11. Handling Existing Code

Before editing:
1. inspect the relevant files;
2. understand the current implementation;
3. make the smallest coherent change needed for the module.

Do not overwrite working code blindly.

If the repository already contains an implementation that satisfies part of the current module, verify it first and preserve it where appropriate.

## 12. Handling Ambiguity

Do not ask unnecessary questions.

Make reasonable implementation decisions when:
- the PRD already gives enough direction;
- the choice is low-risk and reversible;
- it does not change product scope.

Ask the user before proceeding when a decision:
- changes approved scope;
- changes brand/content meaning;
- introduces significant cost or a paid service;
- changes the architecture materially;
- requires credentials or account-specific setup;
- affects privacy/security materially;
- conflicts with the PRD.

## 13. Response Style to the User

The user wants concise, straightforward progress reports.

Do NOT use a teaching workflow unless the user explicitly asks for an explanation.

Do NOT provide long tutorials about React, Tailwind, Node, or general programming concepts.

After completing a module, respond using this structure:

### [MODULE ID] Complete

**What changed**
- concise summary of completed work

**Files created/edited**
- `path/file.ext` — short reason
- `path/file.ext` — short reason

**Verification**
- command/test/check performed — result
- command/test/check performed — result

**Status**
- `PASS` if the module is complete and verified
- `BLOCKED` if something prevents completion

**Blockers / decisions**
- `None`, or list only the decisions the user actually needs to make

Then STOP.

Do not provide instructions for the next module until the user explicitly approves moving forward.

## 14. If the Module Is Blocked

Use:

### [MODULE ID] Blocked

**Completed**
- what was successfully completed

**Blocker**
- exact issue

**What I need from you**
- one clear decision, credential, asset, or answer

Do not work around a major product decision by inventing requirements.

## 15. Documentation Updates

When a module is verified:
- update any project progress/checklist file that the repository uses;
- mark only the verified module complete;
- do not mark future modules complete;
- keep documentation consistent with actual implementation.

If the implementation changes an approved product decision, update documentation only after the user approves that decision.

## 16. Git and Destructive Actions

Do not:
- force push;
- delete branches;
- rewrite Git history;
- remove large groups of files;
- reset unrelated user changes;
- discard uncommitted work

unless the user explicitly authorizes the destructive action.

Preserve user work outside the current module.

## 17. Definition of Done

A module is DONE only when:

1. its scoped requirements are implemented;
2. relevant verification passes;
3. no known error caused by the module remains;
4. documentation/progress status is accurate;
5. the completion report is given to the user.

The website V1 is DONE only after the final production verification module passes.

## Worker Orchestration

The main agent may delegate well-scoped, independent work to real Kilo Code worker processes. Worker orchestration is project infrastructure, separate from the website's one-module-at-a-time build rule, which still governs all website work. Detailed machine-specific commands live in `.kilo/orchestration/ORCHESTRATION.md`.

**When delegation is appropriate.** Delegate only when a task is independent, bounded, and worth the startup and coordination cost. Handle small, tightly coupled, or ambiguous work directly.

**Main-agent authority.** The main agent owns all workflow, integration, conflict-resolution, and acceptance decisions. Workers only execute one bounded assignment and report back. Workers must not dispatch other workers, run shell commands, or decide scope.

**Verified configuration.** Workers run through Kilo Code **7.8.8** with model **`nvidia/deepseek-ai/deepseek-v4.1-flash`** (Nvidia provider) and reasoning **`--variant max`**. Do not substitute another model silently.

**Independent worker sessions.** Every worker is its own `kilo run` OS process with its own session, logs, and generated agent. Workers are short-lived and resumable by session; no idle process is kept alive just to look persistent.

**File ownership and concurrency.** Each assignment declares owned paths; overlapping assignments are rejected before execution. Owned paths may not contain glob metacharacters, must be inside the assigned sandbox or the worker's own record directory, and must not pass through a junction/symlink. Write access is also enforced by a generated agent whose default is `deny` with narrow `allow` entries (verified: in-scope writes succeed, out-of-scope writes are hard-denied even with `--auto`). Reads are scoped to deny secret-like files, and every side-effecting tool a worker must not use is explicitly denied. Concurrency is capped at two workers by default. Shared or conflicting resources are serialized; app code, dependencies, database/migration, environment, and deployment files must not be assigned. Only the main agent may change them, and only with explicit user approval.

**Run identity and history.** Every execution receives a unique run ID and its own run directory. Reports are run-scoped and must carry the matching `workerId` and `runId`; reports from other runs are ignored. Previous runs are preserved as history.

**Required structured reports.** Each worker must write a JSON report (`workerId, runId, assignment, status, accomplished, filesCreatedOrModified, findings, checksPerformed, errorsWarningsBlockers, remainingWork, considersComplete`). The schema is validated for required fields, non-empty strings, array/boolean types, and matching worker/run IDs. A missing or malformed report is treated as a failure. A worker's completion claim is not acceptance.

**Review and follow-up.** The main agent inspects each worker's changes and verifies the acceptance criteria before accepting. Ownership stays active through review, follow-up, and `FAILED`, and is released only when a worker reaches `TERMINATED`. Follow-ups resume the same conversation where supported.

**Termination and cleanup.** Termination is two-phase: a graceful stop request and cooperative wait, then a bounded forced kill in which every process is killed only after its recorded PID **and** start time are verified. A process whose identity cannot be verified is never killed by PID alone; that blocks termination and produces a recovery warning. `TERMINATED` is set only when no recorded owned processes remain, the generated agent is removed, and ownership is released; otherwise the worker stays `TERMINATING` for `gc`/`verify`. Never terminate unrelated processes.

**Capability limitations and fallback.** Headless workers require `--auto` to edit at all, which is safe only with the deny-scoped generated agent. There is no per-worker terminal UI; isolation is logical (ownership plus scoped agent), not a separate worktree. Windows "graceful" shutdown is a bounded cooperative wait, not SIGTERM. Process-tree containment is snapshot-based: a process spawned after the snapshot or reparented away may survive and must be detected by review/`verify`. If stronger filesystem isolation is required, use `kilo worktree`; if structured permissions cannot be enforced, do not claim enforcement - fall back to explicit review of the diff.

## 18. Primary Principle

Build ANARA carefully, one verified module at a time.

Do not rush ahead. Do not inflate scope. Do not invent company claims. Keep the implementation aligned with the PRD, simple enough to maintain, and professional enough to represent ANARA Technologies.
