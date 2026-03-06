# OroRound 20-Agent Comprehensive Audit & Remediation

## TL;DR

> **Quick Summary**: A massive parallel remediation of the OroRound codebase, executed by 20 distinct agents. Focuses heavily on stabilizing the Vitest React 18 configuration, fixing the ESLint Rushstack dependency resolution errors, securing state management, and polishing UI/UX components.
> 
> **Deliverables**: 
> - Corrected `package.json` and `vitest.config.ts` for clean test runs.
> - Fixed ESLint configuration `eslint-config-next` patch errors.
> - Refactored `usePurchaseGold` and `app/page.tsx` for robust state synchronization.
> - 100% accessible, responsive Shadcn UI components.
> 
> **Estimated Effort**: Large (20 parallel tasks)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Config Fixes → State Fixes → UI Polish → Testing Verification

---

## Context

### Original Request
Conduct a highly detailed, 20-agent audit and remediation of the OroRound project to address current shortcomings.

### Interview Summary
**Key Discussions**:
- **Strategy**: Leverage 20 distinct parallel agents.
- **Coverage**: Evenly distribute tasks across Configuration (ESLint/Vitest), Architecture (State sync), UI/UX (A11y/Responsiveness), and Code Quality.

**Research Findings**:
- **Vitest Mismatch**: `A React Element from an older version of React was rendered` caused by `@vitejs/plugin-react` clashing with Next.js 14 module resolution.
- **ESLint Crash**: `Failed to patch ESLint because the calling module was not recognized` caused by mismatched ESLint v8 vs v10 dependencies.
- **State Desync**: Local state `activeTransactionId` in `page.tsx` is prone to loss on unmount; needs robust Zustand integration.

### Metis Review
**Identified Gaps** (addressed):
- **Guardrails**: Ensure ESLint fixes do not break existing Tailwind plugins.
- **Edge Cases**: Ensure the Vitest fix supports all existing 29 assertions.
- **Scope Creep**: Strictly bound the state refactor to the purchase flow, not the entire app router.

---

## Work Objectives

### Core Objective
Stabilize the foundational tooling (tests, linting) and bulletproof the core transaction UI flows via a 20-agent parallel execution matrix.

### Concrete Deliverables
- Functional `npm run test` with zero React DOM errors.
- Functional `npm run lint` with zero Rushstack patch errors.
- Refactored `src/store/purchaseStore.ts` holding robust transaction state.
- Perfected A11y on all Shadcn modals and inputs.

### Definition of Done
- [ ] `npm run lint` exits with code 0.
- [ ] `npm run test` executes successfully without React version mismatch warnings.
- [ ] E2E Playwright tests remain green.

### Must Have
- All tasks must be fully independent to allow 20-agent parallelism.

### Must NOT Have (Guardrails)
- Do not migrate away from Next.js 14 App Router.
- Do not replace Zustand with Redux.
- Do not remove existing E2E Playwright tests.

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES
- **Automated tests**: TDD / Tests-after
- **Framework**: vitest / playwright

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Configuration & Tooling Fixes - Max Priority):
├── Task 1: Fix ESLint dependencies in package.json [quick]
├── Task 2: Fix Vitest React 18 plugin resolution [quick]
├── Task 3: Update vitest.config.ts environment [quick]
├── Task 4: Fix Prettier Tailwind configuration [quick]
└── Task 5: Configure Next.js compiler options [quick]

Wave 2 (State & Architecture - Core Logic):
├── Task 6: Extract activeTransactionId to Zustand store [deep]
├── Task 7: Refactor usePurchaseGold for global state [deep]
├── Task 8: Refactor useTransactionStatus for global state [deep]
├── Task 9: Implement query invalidation on success [deep]
└── Task 10: Map Edge Case API errors in errors.ts [quick]

Wave 3 (UI/UX Polish & Accessibility):
├── Task 11: Add ARIA labels to AmountInput [visual-engineering]
├── Task 12: Add ARIA labels to RoundUpSelector [visual-engineering]
├── Task 13: Implement Loading Skeletons in Portfolio [visual-engineering]
├── Task 14: Fix SuccessModal contrast ratios [visual-engineering]
├── Task 15: Fix FailureModal responsive padding [visual-engineering]
├── Task 16: Ensure DevnetBanner is dismissible via keyboard [visual-engineering]
└── Task 17: Update TransactionPreview animations [visual-engineering]

Wave 4 (Test Coverage & Final Polish):
├── Task 18: Update Vitest specs for new global state [unspecified-high]
├── Task 19: Update Playwright specs for ARIA changes [unspecified-high]
└── Task 20: Final TypeScript typecheck audit [quick]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
```
## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.

- [ ] 1. Fix ESLint dependencies in package.json

  **What to do**:
  - Remove conflicting global ESLint installations and downgrade/pin `eslint` to v8 to match `eslint-config-next@14`.
  - Fix the `rushstack/eslint-patch` resolution error by ensuring dependencies align.

  **Must NOT do**:
  - Do not upgrade Next.js to v15.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file manipulation (`package.json`).

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `package.json`

  **Acceptance Criteria**:
  - [ ] `npm install` completes successfully.
  - [ ] `npm run lint` completes without throwing rushstack module errors.

  **QA Scenarios**:
  ```
  Scenario: Lint completes without rushstack error
    Tool: interactive_bash
    Preconditions: package.json is updated, npm i executed.
    Steps:
      1. Run `npm run lint`
    Expected Result: Exits with code 0 or standard lint warnings, NOT a fatal config read error.
    Evidence: .sisyphus/evidence/task-1-lint-success.txt
  ```

- [ ] 2. Fix Vitest React 18 plugin resolution

  **What to do**:
  - Swap `@vitejs/plugin-react` to `@vitejs/plugin-react-swc` or configure alias resolutions in `vite.config.ts` / `vitest.config.ts` to prevent "A React Element from an older version of React was rendered" errors caused by multiple React instances.

  **Must NOT do**:
  - Do not alter the actual unit test logic.

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Config modification.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 18
  - **Blocked By**: None

  **References**:
  - `vitest.config.ts`, `package.json`

  **Acceptance Criteria**:
  - [ ] `npm run test` executes all suites without throwing the React DOM multiple instance error.

  **QA Scenarios**:
  ```
  Scenario: Vitest runs cleanly
    Tool: interactive_bash
    Preconditions: Vitest config updated.
    Steps:
      1. Run `npm run test`
    Expected Result: All 29 tests pass successfully without console error dumps regarding React.
    Evidence: .sisyphus/evidence/task-2-vitest-success.txt
  ```

- [ ] 3. Update vitest.config.ts environment
  **What to do**: Ensure `jsdom` is correctly specified and setup files are correctly resolving aliases.
  **Recommended Agent Profile**: `quick`
  **QA Scenarios**:
  ```
  Scenario: Environment initializes
    Tool: interactive_bash
    Steps: 1. Run `vitest run`
    Expected Result: Passes.
    Evidence: .sisyphus/evidence/task-3-env.txt
  ```

- [ ] 4. Fix Prettier Tailwind configuration
  **What to do**: Add `prettier-plugin-tailwindcss` to Prettier config.
  **Recommended Agent Profile**: `quick`
  **QA Scenarios**:
  ```
  Scenario: Prettier formats tailwind
    Tool: interactive_bash
    Steps: 1. Run `npm run format:check`
    Expected Result: Classes are ordered.
    Evidence: .sisyphus/evidence/task-4-prettier.txt
  ```

- [ ] 5. Configure Next.js compiler options
  **What to do**: Update `next.config.mjs` for strictMode.
  **Recommended Agent Profile**: `quick`
  **QA Scenarios**:
  ```
  Scenario: Next config validates
    Tool: interactive_bash
    Steps: 1. Run `npm run build`
    Expected Result: Build succeeds.
    Evidence: .sisyphus/evidence/task-5-next.txt
  ```

- [ ] 6. Extract activeTransactionId to Zustand store
  **What to do**: Create `src/store/purchaseStore.ts` holding `activeTransactionId` and `setActiveTransactionId` instead of local `useState` in `page.tsx`.
  **Recommended Agent Profile**: `deep`
  **QA Scenarios**:
  ```
  Scenario: Store initializes
    Tool: interactive_bash
    Steps: 1. Inspect store via Node REPL.
    Expected Result: Store has activeTransactionId null.
    Evidence: .sisyphus/evidence/task-6-store.txt
  ```

- [ ] 7. Refactor usePurchaseGold for global state
  **What to do**: Make the mutation hook write to the new `purchaseStore`.
  **Recommended Agent Profile**: `deep`
  **QA Scenarios**:
  ```
  Scenario: Hook writes to store
    Tool: interactive_bash
    Steps: 1. Run related unit test.
    Expected Result: Store updates correctly.
    Evidence: .sisyphus/evidence/task-7-hook.txt
  ```

- [ ] 8. Refactor useTransactionStatus for global state
  **What to do**: Hook reads from `purchaseStore`.
  **Recommended Agent Profile**: `deep`
  **QA Scenarios**:
  ```
  Scenario: Hook reads from store
    Tool: interactive_bash
    Steps: 1. Run related unit test.
    Expected Result: Hook reads correctly.
    Evidence: .sisyphus/evidence/task-8-hook.txt
  ```

- [ ] 9. Implement query invalidation on success
  **What to do**: In `page.tsx`, when `status === 'completed'`, call `queryClient.invalidateQueries({ queryKey: ['gold-balance'] })`.
  **Recommended Agent Profile**: `deep`
  **QA Scenarios**:
  ```
  Scenario: Balance invalidated
    Tool: interactive_bash
    Steps: 1. Check page.tsx logic.
    Expected Result: Invalidation is present.
    Evidence: .sisyphus/evidence/task-9-inval.txt
  ```

- [ ] 10. Map Edge Case API errors in errors.ts
  **What to do**: Add 5 new extreme edge cases to `errors.ts`.
  **Recommended Agent Profile**: `quick`
  **QA Scenarios**:
  ```
  Scenario: Map returns fallback
    Tool: interactive_bash
    Steps: 1. Run test.
    Expected Result: Edge cases map correctly.
    Evidence: .sisyphus/evidence/task-10-err.txt
  ```

- [ ] 11. Add ARIA labels to AmountInput
  **What to do**: Add `aria-label` and `aria-invalid` to the input field.
  **Recommended Agent Profile**: `visual-engineering`
  **QA Scenarios**:
  ```
  Scenario: Input has aria
    Tool: Playwright
    Steps: 1. Inspect input DOM.
    Expected Result: aria-label exists.
    Evidence: .sisyphus/evidence/task-11-aria.png
  ```

- [ ] 12. Add ARIA labels to RoundUpSelector
  **What to do**: Add `role="radiogroup"` to the selector.
  **Recommended Agent Profile**: `visual-engineering`
  **QA Scenarios**:
  ```
  Scenario: Selector has role
    Tool: Playwright
    Steps: 1. Inspect selector DOM.
    Expected Result: role radiogroup exists.
    Evidence: .sisyphus/evidence/task-12-aria.png
  ```

- [ ] 13. Implement Loading Skeletons in Portfolio
  **What to do**: Add Shadcn Skeleton components while `isRefreshing` is true.
  **Recommended Agent Profile**: `visual-engineering`
  **QA Scenarios**:
  ```
  Scenario: Skeletons render
    Tool: Playwright
    Steps: 1. Mock network delay, check DOM.
    Expected Result: Skeletons are visible.
    Evidence: .sisyphus/evidence/task-13-skel.png
  ```

- [ ] 14. Fix SuccessModal contrast ratios
  **What to do**: Adjust text colors for WCAG AAA compliance.
  **Recommended Agent Profile**: `visual-engineering`
  **QA Scenarios**:
  ```
  Scenario: High contrast
    Tool: Playwright
    Steps: 1. Open modal, screenshot.
    Expected Result: Colors are dark/light enough.
    Evidence: .sisyphus/evidence/task-14-contrast.png
  ```

- [ ] 15. Fix FailureModal responsive padding
  **What to do**: Add `sm:p-6` and `p-4` to ensure mobile view is clean.
  **Recommended Agent Profile**: `visual-engineering`
  **QA Scenarios**:
  ```
  Scenario: Mobile modal padding
    Tool: Playwright
    Steps: 1. Resize viewport to mobile, open modal.
    Expected Result: Padding does not bleed.
    Evidence: .sisyphus/evidence/task-15-padding.png
  ```

- [ ] 16. Ensure DevnetBanner is dismissible
  **What to do**: Add an `X` button to hide the Devnet banner via `uiStore`.
  **Recommended Agent Profile**: `visual-engineering`
  **QA Scenarios**:
  ```
  Scenario: Banner dismisses
    Tool: Playwright
    Steps: 1. Click X on banner.
    Expected Result: Banner is hidden.
    Evidence: .sisyphus/evidence/task-16-banner.png
  ```

- [ ] 17. Update TransactionPreview animations
  **What to do**: Add `framer-motion` or tailwind `animate-in` to the preview card.
  **Recommended Agent Profile**: `visual-engineering`
  **QA Scenarios**:
  ```
  Scenario: Card animates
    Tool: Playwright
    Steps: 1. Trigger preview render.
    Expected Result: CSS classes reflect animation.
    Evidence: .sisyphus/evidence/task-17-anim.png
  ```

- [ ] 18. Update Vitest specs for new global state
  **What to do**: Fix tests broken by Zustand store extraction.
  **Recommended Agent Profile**: `unspecified-high`
  **QA Scenarios**:
  ```
  Scenario: Specs pass
    Tool: interactive_bash
    Steps: 1. run `npm run test`
    Expected Result: Passes.
    Evidence: .sisyphus/evidence/task-18-test.txt
  ```

- [ ] 19. Update Playwright specs for ARIA changes
  **What to do**: Use `page.getByRole` instead of CSS locators in E2E tests.
  **Recommended Agent Profile**: `unspecified-high`
  **QA Scenarios**:
  ```
  Scenario: E2E passes
    Tool: interactive_bash
    Steps: 1. run `npx playwright test`
    Expected Result: Passes.
    Evidence: .sisyphus/evidence/task-19-e2e.txt
  ```

- [ ] 20. Final TypeScript typecheck audit
  **What to do**: Fix any remaining `any` types or implicit errors.
  **Recommended Agent Profile**: `quick`
  **QA Scenarios**:
  ```
  Scenario: TS validates
    Tool: interactive_bash
    Steps: 1. run `npm run typecheck`
    Expected Result: 0 errors.
    Evidence: .sisyphus/evidence/task-20-ts.txt
  ```

---

## Final Verification Wave (MANDATORY)

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Output: `VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Output: `Build [PASS] | Lint [PASS] | Tests [PASS] | VERDICT: APPROVE`

- [ ] F3. **Real Manual QA** — `playwright`
  Output: `Scenarios [PASS] | VERDICT: APPROVE`

- [ ] F4. **Scope Fidelity Check** — `deep`
  Output: `Tasks [COMPLIANT] | VERDICT: APPROVE`

---

## Commit Strategy
- **1-5**: `chore(config): fix eslint and vitest build configurations`
- **6-10**: `refactor(state): migrate purchase flow to zustand architecture`
- **11-17**: `ui(a11y): polish modals, ARIA labels, and responsive behaviors`
- **18-20**: `test: update specs for new UI and state`

---

## Success Criteria

### Verification Commands
```bash
npm run lint  # Expected: exits code 0
npm run test  # Expected: All 29 tests pass
npm run build # Expected: Next.js builds successfully
```
