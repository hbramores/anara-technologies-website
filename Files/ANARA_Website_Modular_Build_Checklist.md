# ANARA Website — Modular Build Checklist

**Version:** 1.0  
**Purpose:** Implementation roadmap for Kilo and other AI coding agents.

---

## Execution Rule

Build the ANARA Technologies website in small, testable modules.

For every module:

1. Work only on the currently approved module.
2. Do not implement later modules early.
3. Complete the scoped requirements.
4. Verify the implementation.
5. Report the result according to `AGENTS.md`.
6. Stop and wait for explicit user approval before moving to the next module.

A module is **not complete simply because code was written**. It must be verified.

---

# Phase A — Project Foundation

## A01 — Initialize Project

- [x] Create React + Vite project.
- [x] Install and configure Tailwind CSS.
- [x] Establish initial application folder structure.
- [x] Configure basic routing.
- [x] Create `.env.example`.
- [x] Create base `README.md`.
- [x] Verify the development server.
- [x] Verify the production build.

### A01 Acceptance Criteria

- React/Vite application starts successfully.
- Tailwind is configured and available.
- Basic routes can be resolved without errors.
- `.env.example` exists and contains no secrets.
- README contains basic project setup/run information.
- Production build completes without errors.
- No later website sections or features have been implemented.

**STOP — Report A01 and wait for approval.**

---

## A02 — Design System

- [x] Add ANARA brand colors:
  - [x] `#670022`
  - [x] `#B0004B`
  - [x] `#EB347C`
- [x] Define supporting neutral/background colors.
- [x] Define typography.
- [x] Define spacing conventions.
- [x] Define button variants.
- [x] Define card styling.
- [x] Define form styling.
- [x] Define reusable section/container components.
- [x] Verify accessible color contrast for primary combinations.

### A02 Acceptance Criteria

- Brand tokens/styles are centralized and reusable.
- Core reusable visual primitives are available.
- Brand gradient is implemented correctly.
- No page-specific sections from later modules are prematurely built.

**STOP — Report A02 and wait for approval.**

---

## A03 — Global Layout

- [x] Build desktop navbar.
- [x] Build mobile navigation.
- [x] Build footer.
- [x] Create shared page layout/container.
- [x] Add active navigation states.
- [x] Verify responsive navigation.
- [x] Verify all V1 navigation destinations.

### A03 Acceptance Criteria

- Shared layout works across configured routes.
- Desktop and mobile navigation function correctly.
- Footer is reusable.
- Navigation has no broken internal destinations.

**STOP — Report A03 and wait for approval.**

---

# Phase B — Homepage

## B01 — Hero

- [x] Add brand line: **A New Approach to Real-world Advancement**.
- [x] Add headline: **From business problems to working systems.**
- [x] Add approved supporting copy.
- [x] Add **Start a Project** CTA.
- [x] Add **Explore Our Systems** CTA.
- [x] Create hero visual treatment.
- [x] Verify responsive layout.

### B01 Acceptance Criteria

- Approved copy is preserved.
- Both CTAs route correctly.
- Hero works on mobile and desktop.
- Visual design follows the ANARA brand direction.

**STOP — Report B01 and wait for approval.**

---

## B02 — What ANARA Does

- [x] Add **Digital Systems for Growing Businesses** heading.
- [x] Add approved introductory copy.
- [x] Create visual flow:
  - [x] Understand the Problem
  - [x] Find the Right Approach
  - [x] Build the System
- [x] Verify responsive layout.

**STOP — Report B02 and wait for approval.**

---

## B03 — Featured PLANTWAIS

- [x] Add PLANTWAIS product information.
- [x] Add product screenshot/mockup area.
- [x] Show **In Development** status.
- [x] Add **Explore PLANTWAIS** CTA.
- [x] Make the section visually prominent rather than a small generic card.
- [x] Verify responsive layout.

**STOP — Report B03 and wait for approval.**

---

## B04 — Services Preview

- [x] Add Custom Software Development.
- [x] Add Web Application Development.
- [x] Add Business & Management Systems.
- [x] Add UI/UX Design & Prototyping.
- [x] Add supporting problem-first message.
- [x] Add **Start a Project** CTA.
- [x] Verify responsive layout.

**STOP — Report B04 and wait for approval.**

---

## B05 — How We Work

- [x] Add **01 — Understand**.
- [x] Add **02 — Plan**.
- [x] Add **03 — Build**.
- [x] Add **04 — Launch & Improve**.
- [x] Use approved descriptions.
- [x] Verify responsive layout.

**STOP — Report B05 and wait for approval.**

---

## B06 — About Preview

- [x] Show ANARA meaning.
- [x] Add approved short company introduction.
- [x] Add company philosophy statement.
- [x] Add **Learn About ANARA** CTA.
- [x] Verify responsive layout.

**STOP — Report B06 and wait for approval.**

---

## B07 — Final Homepage CTA

- [x] Add **Tell us what’s slowing your business down.**
- [x] Add **We’ll explore how technology can help.**
- [x] Add reassurance that the visitor does not need to know what system they need.
- [x] Add **Start a Project** CTA.
- [x] Verify responsive layout.

### Phase B Acceptance Criteria

- Homepage tells the intended story in the correct order.
- Approved ANARA copy and positioning are preserved.
- All CTAs work.
- Homepage is responsive.
- No unsupported company claims appear.

**STOP — Verify Phase B and wait for approval.**

---

# Phase C — Systems

## C01 — Systems Portfolio Page

- [x] Create Systems hero.
- [x] Create reusable systems portfolio structure.
- [x] Add PLANTWAIS showcase.
- [x] Show product status.
- [x] Add product link.
- [x] Ensure architecture supports future systems without displaying fake placeholder products.
- [x] Verify responsive layout.

**STOP — Report C01 and wait for approval.**

---

## C02 — PLANTWAIS Page Foundation

- [x] Create PLANTWAIS hero.
- [x] Add **From PLAN to GROW.**
- [x] Show **In Development** status.
- [x] Add product preview area.
- [x] Verify responsive layout.

**STOP — Report C02 and wait for approval.**

---

## C03 — PLANTWAIS Story

- [x] Add **The Problem**.
- [x] Add **The Solution**.
- [x] Add current key capabilities.
- [x] Ensure claims reflect the current approved PLANTWAIS direction.
- [x] Do not expose internal architecture or private development documentation.

**STOP — Report C03 and wait for approval.**

---

## C04 — PLANTWAIS Product Information

- [x] Add **Who It’s For**.
- [x] Add **How It Works**.
- [x] Add product screenshots/mockups.
- [x] Add development status/milestones.
- [x] Add **About the Project**.
- [x] Add **Contact ANARA** CTA.
- [x] Do not use a launch-oriented **Get Started** CTA while PLANTWAIS is still in development.
- [x] Add Young Farmers Challenge support recognition (accurate, visually secondary).

### Phase C Acceptance Criteria

- PLANTWAIS is presented honestly as an in-development ANARA system.
- Product content is understandable to non-technical visitors.
- No private technical information is unintentionally exposed.
- Systems architecture supports future additions.

**STOP — Verify Phase C and wait for approval.**

---

# Phase D — Services & Company

## D01 — Services Page

- [x] Create Services hero.
- [x] Add Custom Software Development.
- [x] Add Web Application Development.
- [x] Add Business & Management Systems.
- [x] Add UI/UX Design & Prototyping.
- [x] Use plain-language descriptions.
- [x] Add **Not sure what you need?** section.
- [x] Add **Start a Project** CTA.
- [x] Do not add fixed pricing/packages.
- [x] Verify responsive layout.

**STOP — Report D01 and wait for approval.**

---

## D02 — About Page

- [x] Create About hero.
- [x] Add ANARA story.
- [x] Add Vision.
- [x] Add Mission.
- [x] Add four core values:
  - [x] Practicality
  - [x] Purpose
  - [x] Accessibility
  - [x] Progress
- [x] Add **Start a Project** CTA.
- [x] Do not exaggerate company size, history, or experience.
- [x] Verify responsive layout.

### Phase D Acceptance Criteria

- Company identity matches the PRD.
- Approved vision and mission are unchanged unless explicitly revised.
- Services remain understandable to non-technical business owners.

**STOP — Verify Phase D and wait for approval.**

---

# Phase E — Lead Generation

## E01 — Contact Page UI

- [x] Create Contact hero.
- [x] Add Full Name field.
- [x] Add Email Address field.
- [x] Add Business / Organization field.
- [x] Add Subject field.
- [x] Add Message field.
- [x] Add public company contact information.
- [x] Add link to **Start a Project**.
- [x] Do not publish a private/home street address.
- [x] Verify responsive form layout.

**STOP — Report E01 and wait for approval.**

---

## E02 — Start a Project UI

- [x] Add Full Name.
- [x] Add Email Address.
- [x] Add Contact Number.
- [x] Add Business / Organization Name.
- [x] Add Business Type / Industry.
- [x] Add business description.
- [x] Add current process/workflow field.
- [x] Add problem field.
- [x] Add desired outcome field.
- [x] Add optional budget.
- [x] Add optional timeline.
- [x] Add optional additional information.
- [x] Do not add file upload in V1.
- [x] Verify responsive form layout.

**STOP — Report E02 and wait for approval.**

---

## E03 — Form Validation

- [x] Validate required fields.
- [x] Validate email format.
- [x] Add sensible input limits.
- [x] Add clear validation errors.
- [x] Add loading states.
- [x] Add success states.
- [x] Add failure states.
- [x] Verify keyboard usability.

**STOP — Report E03 and wait for approval.**

---

## E04 — Form Backend

- [x] Determine the smallest secure server-side solution needed.
- [x] Create secure submission endpoint(s) if required.
- [x] Process Contact form.
- [x] Process Start a Project inquiry.
- [x] Configure email notifications.
- [x] Store credentials only in environment variables.
- [x] Update `.env.example` with safe placeholders.
- [x] Add server-side validation.
- [x] Add error handling.
- [x] Add credential-free integration verification (`backend/test/`, run `npm test` in `backend/`): both forms reach the notification path via the `console` transport, validation rejects bad input, and no notification is sent for rejected input.
- [ ] Verify end-to-end delivery to ANARA's real inbox (requires production SMTP credentials — pending).

**STOP — Report E04 and wait for approval.**

---

## E05 — CAPTCHA & Abuse Protection

- [x] Integrate CAPTCHA on Contact form.
- [x] Integrate CAPTCHA on Start a Project form.
- [x] Verify CAPTCHA server-side (logic verified with mocked reCAPTCHA responses; live reCAPTCHA keys pending).
- [x] Add appropriate basic rate limiting.
- [x] Add spam/abuse protection.
- [x] Test invalid CAPTCHA (missing token and reCAPTCHA-failure rejection covered by `backend/test/captcha.test.mjs`; live reCAPTCHA keys pending).
- [x] Test rejected/abusive submissions.
- [x] Test legitimate submissions.

### Phase E Acceptance Criteria

- Both forms work end-to-end.
- ANARA receives expected notifications.
- Required fields are validated.
- CAPTCHA is enforced.
- Secrets are not exposed.
- Submission does not imply automatic project acceptance.

**STOP — Test both forms end-to-end and wait for approval.**

---

# Phase F — SEO, Analytics & Accessibility

## F01 — SEO

- [x] Add unique page titles.
- [x] Add meta descriptions.
- [x] Add Open Graph metadata.
- [x] Add favicon.
- [x] Add sitemap.
- [x] Configure robots behavior.
- [x] Verify semantic HTML.
- [x] Verify heading hierarchy.
- [x] Verify search-friendly URLs.

Pending: `public/sitemap.xml` and `public/robots.txt` still contain the placeholder `REPLACE-WITH-YOUR-DOMAIN` until the production domain is chosen.

**STOP — Report F01 and wait for approval.**

---

## F02 — Analytics

- [x] Configure approved analytics solution.
- [x] Track Start a Project CTA clicks.
- [x] Track project inquiry submissions.
- [x] Track contact submissions.
- [x] Track PLANTWAIS page visits.
- [x] Avoid collecting unnecessary sensitive form data in analytics.
- [x] Verify events locally: instrumentation emits the documented events with a stubbed gtag (`frontend/test/analytics.test.mjs`, run `npm test` in `frontend/`).
- [ ] Verify live analytics receipt in production (requires a GA measurement ID — pending).

**STOP — Report F02 and wait for approval.**

---

## F03 — Accessibility

- [x] Verify keyboard navigation.
- [x] Verify visible focus states.
- [x] Verify form labels.
- [x] Add meaningful image alt text.
- [x] Verify heading hierarchy.
- [x] Verify color contrast.
- [x] Verify semantic landmarks.
- [x] Perform basic screen-reader-oriented review.

Local evidence: `tests/browser/verify.mjs` asserts, on every V1 route, a single `<main>` landmark, one `h1`, a skip link, `lang` and viewport meta, alt text on every image, and a label for every form control. Automated checks do not replace a manual screen-reader pass.

### Phase F Acceptance Criteria

- Core pages are keyboard usable.
- Forms have proper labels and states.
- SEO metadata exists.
- Required analytics events work.
- Analytics does not expose unnecessary form content.

**STOP — Verify Phase F and wait for approval.**

---

# Phase G — Quality Assurance

## G01 — Responsive Testing

Test:

- [x] Mobile
- [x] Tablet
- [x] Laptop
- [x] Desktop
- [x] Navigation
- [x] Forms
- [x] PLANTWAIS page
- [x] Homepage
- [x] Long text/content wrapping
- [x] No unintended horizontal scrolling

Local evidence: `tests/browser/verify.mjs` loads every V1 route in headless Chrome and Edge at 375 / 768 / 1366 px and asserts no horizontal overflow plus page structure (84 checks per browser).

**STOP — Report G01 and wait for approval.**

---

## G02 — Browser Testing

Test current versions where available:

- [x] Chrome (verified locally via `tests/browser/verify.mjs`)
- [x] Edge (Chromium; verified locally via `tests/browser/verify.mjs`)
- [ ] Firefox
- [ ] Safari

Document anything that cannot be tested in the current environment.

Not tested here: Firefox and Safari are not installed in this environment (Safari is macOS-only). Sites are standard React + Tailwind with no browser-specific APIs, but this is unverified.

**STOP — Report G02 and wait for approval.**

---

## G03 — Performance

- [x] Optimize images.
- [x] Lazy-load appropriate assets.
- [x] Remove unused dependencies.
- [x] Remove dead code.
- [x] Check bundle size.
- [x] Run Lighthouse.
- [x] Address reasonable performance issues.
- [x] Aim for 90+ Lighthouse scores where realistically achievable.

**STOP — Report G03 and wait for approval.**

---

## G04 — Security Review

- [x] Confirm no secrets are exposed.
- [x] Confirm `.env` is ignored.
- [x] Verify server-side input validation.
- [ ] Verify CAPTCHA. (Server-side CAPTCHA *logic* is tested with mocked responses under E05; live reCAPTCHA verification with real keys is still pending.)
- [x] Verify rate limiting.
- [x] Verify production error handling.
- [x] Confirm forms cannot be easily abused.
- [x] Confirm sensitive data is not written unnecessarily to logs.

### Phase G Acceptance Criteria

- No known critical V1 issue remains.
- Responsive behavior is verified.
- Production build succeeds.
- Security basics are in place.
- Major accessibility/performance issues discovered during QA are resolved or documented.

**STOP — Verify Phase G and wait for approval.**

---

# Phase H — Production

## H01 — Production Preparation

- [x] Configure production environment variables.
- [x] Verify production build succeeds.

Local evidence: the built site is served with `BROWSER_TARGET=preview node tests/browser/verify.mjs` and passes the same 84 checks as the dev server.
- [x] Remove avoidable console errors/warnings.
- [x] Check all internal links.
- [x] Check external/social links.
- [x] Perform final content review.
- [x] Perform final spelling/grammar review.
- [x] Verify production configuration contains no development-only secrets/settings.

**STOP — Report H01 and wait for approval.**

---

## H02 — Deployment

- [ ] Deploy frontend.
- [ ] Deploy backend only if required by the implemented architecture.
- [ ] Connect approved domain.
- [ ] Verify HTTPS.
- [ ] Verify Contact form in production.
- [ ] Verify Start a Project form in production.
- [ ] Verify CAPTCHA in production.
- [ ] Verify analytics in production.
- [ ] Verify social sharing metadata.

**STOP — Report H02 and wait for approval.**

---

## H03 — Final Verification

- [x] Test entire website as a visitor.
- [ ] Submit a real Contact inquiry.
- [ ] Submit a real Start a Project inquiry.
- [ ] Confirm notifications are received.
- [x] Test mobile navigation.
- [x] Test PLANTWAIS page.
- [x] Test all primary CTAs.
- [x] Check all V1 routes.
- [x] Run final Lighthouse audit.
- [x] Confirm no critical console errors.
- [x] Confirm V1 scope matches the PRD.

### H03 Acceptance Criteria

- All V1 pages are available.
- Core CTAs work.
- Both inquiry flows work in production.
- CAPTCHA works in production.
- Analytics works.
- Site is responsive.
- No critical production errors remain.
- No out-of-scope feature is required for launch.

**ANARA WEBSITE V1 — CODE AND LOCAL VERIFICATION COMPLETE; PRODUCTION LAUNCH CHECKS PENDING (H02/H03).**

Not production-ready yet: real email delivery, live reCAPTCHA, live analytics receipt, Firefox/Safari, domain/HTTPS, deployment, and real inquiry submissions remain unchecked and require accounts, credentials, a domain, or hosting.

---

# Definition of Done

A module is **DONE** only when:

1. Its scoped requirements are implemented.
2. Relevant verification passes.
3. Errors caused by the module are resolved.
4. Project documentation/progress is accurate.
5. Kilo/AI reports the result.
6. The user approves proceeding.

The website itself is **DONE** only after **H03 — Final Verification** passes.

---

# Standard Kilo / AI Module Prompt Pattern

Use the following pattern when starting a module:

> We are working only on **[MODULE ID — MODULE NAME]**.
>
> Read and follow `AGENTS.md`, `files/ANARA_Website_PRD_v1.md`, and `files/ANARA_Website_Modular_Build_Checklist.md`.
>
> Do not implement later modules.
>
> Complete and verify only the current module. When finished, report:
>
> 1. What changed
> 2. Files created or edited
> 3. Verification/tests performed
> 4. PASS or BLOCKED status
> 5. Any blockers or decisions I need to make
>
> Then stop and wait for my explicit approval before proceeding.
