# HTML Artifact Inventory

## Purpose

This inventory defines the V1 Codex Desktop HTML artifact surfaces for the OpenAI Codex Hackathon plugin.

The top-level participant flow remains a five-step Devpost-style sequence:

1. Start
2. Rules
3. Resources
4. Prepare
5. Check

The optional learning/planning module is nested inside Step 3. It gets its own HTML artifact sequence, but it does not become a sixth top-level step.

## Shared Artifact Requirements

Every major artifact should orient the participant immediately.

Each artifact needs:

- Devpost-style header using the official design kit once available
- Five-step progress UI
- Current step label such as `Step 3 of 5`
- Completed, active, blocked, and pending step states
- Next recommended action
- Official deadline display when available
- Link to the main Devpost event page
- Compact fallback chat summary
- Light and dark mode support using design tokens

Use `.openai-codex-hackathon-state.json` as the source of truth for progress and readiness. Do not store rendered HTML in state.

## Media Policy

V1 media support is based on completed manual Codex Desktop proof work. The standalone proof pages were removed after the result was recorded so production previews do not expose test artifacts.

- Direct MP4 embed worked in Codex Desktop preview.
- YouTube iframe did not work reliably.
- Do not make inline video or per-step art a V1 dependency.
- Templates may later support poster image, transcript summary, and external video link fallbacks if real media assets exist.
- Do not use YouTube iframe embeds in participant-facing V1 templates.

## Top-Level Artifact Sequence

### 1. Start Hackathon

File: `artifacts/generated/start-hackathon.html`

Command: `$start-hackathon`

Stepper state:
- Step 1 active or complete
- Step 2 next
- Later steps pending or blocked

Required content:
- Event name
- Devpost registration handoff
- Short explanation that Codex guides the rest of the flow
- State file continuity note
- Browser handoff CTA for registration
- Next command: `$review-rules`

Visual surface:
- Shared Devpost header and five-step progress UI

Fallback chat summary:
- State initialized or loaded
- Register on Devpost
- Run `$review-rules` next

### 2. Review Rules

File: `artifacts/generated/review-rules.html`

Command: `$review-rules`

Stepper state:
- Step 1 complete
- Step 2 active until the user replies `yes`
- Steps 3-5 blocked until rules are acknowledged

Required content:
- Fairness and equal-information notice
- Provisional eligibility summary until official copy lands
- Contest dates and deadline summary
- What to build
- What to submit
- Judging criteria summary
- Originality, third-party usage, testing, and content restrictions
- Common blockers
- Official-pages disclaimer
- Yes/no confirmation prompt

Visual surface:
- Shared Devpost header and five-step progress UI

Fallback chat summary:
- Rules are the required gate
- User must reply exactly `yes` or `no`
- On yes, unlock `$resources`

### 3. Resources

File: `artifacts/generated/resources.html`

Command: `$resources`

Stepper state:
- Steps 1-2 complete
- Step 3 active
- Steps 4-5 pending

Required content:
- Build toolbox links
- Official launch resources when available
- Strong project archetypes
- Anti-patterns
- Optional learning/planning branch entry point
- Two clear paths:
  - `I have my project idea` -> run `$prepare-submission`
  - `Help me shape the project` -> run `$learning-onboard`

Visual surface:
- Shared Devpost header and five-step progress UI
- Optional learning-module treatment if design provides one

Fallback chat summary:
- Resources shown
- Learning branch is optional
- Most likely next command is `$prepare-submission`, unless the user chooses guided planning

### 4. Prepare Submission

File: `artifacts/generated/prepare-submission.html`

Command: `$prepare-submission`

Stepper state:
- Steps 1-3 complete when resources were reviewed
- Step 4 active
- Step 5 pending or blocked until a draft exists

Required content:
- Draft room status
- `devpost-submission.md` status
- Missing required submission materials
- Revision checklist
- Project positioning feedback
- Repo/demo/video/screenshot fields
- Re-offer learning branch if the project is vague or underspecified
- Next command when ready: `$submission-check`

Visual surface:
- Shared Devpost header and five-step progress UI

Fallback chat summary:
- Draft updated or missing facts named
- Revision checklist
- Return to `$prepare-submission` or proceed to `$submission-check`

### 5. Submission Check

File: `artifacts/generated/submission-check.html`

Command: `$submission-check`

Stepper state:
- Steps 1-4 complete when submission packet is materially ready
- Step 5 active
- All steps complete only when the final check passes

Required content:
- Readiness result: `ready`, `close`, or `not ready`
- Submission completeness scorecard
- Security and exposed-secret scan result
- Required asset checklist
- Browser handoff checklist
- Official Devpost submission URL
- Final reminder that Codex does not submit automatically

Visual surface:
- Shared Devpost header and five-step progress UI

Fallback chat summary:
- Readiness result
- Fix-now list if needed
- Browser handoff URL when ready

## Persistent Map Artifact

File: `artifacts/generated/hackathon-map.html`

Command: `$hackathon-map`

Purpose:
- Recovery surface for the whole plugin
- Shows current state, deadline/readiness context, and next command
- Can be opened any time without changing workflow completion

Required content:
- Five-step progress UI
- Registration status
- Rules status
- Project summary when available
- Submission draft status
- Deadline display
- Optional learning status when the branch has started
- Next recommended action

Fallback chat summary:
- Current stage
- Next command
- One-line readiness status

## Learning Module Artifact Sequence

The learning module is first-class, but nested inside Step 3: Resources.

When active, the top-level stepper still highlights Step 3. The learning module may show its own smaller internal progress sequence.

### Ideate

File: `artifacts/generated/learning-onboard.html`

Command: `$learning-onboard`

Purpose:
- Orient the participant, gather their background, and start shaping the project idea

Required content:
- What the learning path does
- The sequence: Ideate, Scope, PRD, Spec, Checklist, Build, Return
- Assurance that the core hackathon flow remains available
- First short interview prompts about experience level and project confidence

Output:
- Participant background summary
- Learning path status set to active when the participant chooses it

### Scope

File: `artifacts/generated/learning-scope.html`

Command: `$learning-scope`

Purpose:
- Turn a spark of an idea into a focused build scope through flipped interaction

Required content:
- Target user
- Problem
- Core workflow
- In-scope features
- Out-of-scope features
- Demo path
- Strong/weak project-shape guidance

Output:
- Project scope document or section
- State updates for project name and summary when confirmed

### PRD

File: `artifacts/generated/learning-prd.html`

Command: `$learning-prd`

Purpose:
- Convert scope into user-facing requirements and acceptance criteria

Required content:
- User stories or jobs
- Functional requirements
- Acceptance criteria
- Submission-relevant proof points

Output:
- PRD-like requirements document

### Spec

File: `artifacts/generated/learning-spec.html`

Command: `$learning-spec`

Purpose:
- Translate requirements into a technical implementation plan

Required content:
- Architecture sketch
- Data model or file structure
- OpenAI integration plan
- Codex usage plan
- Risk and verification notes

Output:
- `spec.md` or equivalent technical plan

### Checklist

File: `artifacts/generated/learning-checklist.html`

Command: `$learning-checklist`

Purpose:
- Break the spec into sequenced, verifiable build tasks

Required content:
- Ordered task list
- Verification approach per task
- Demo and submission asset checkpoints

Output:
- Build checklist document

### Build

File: `artifacts/generated/learning-build.html`

Command: `$learning-build`

Purpose:
- Run the implementation sequence with Codex while preserving checkpoints and verification

Required content:
- Current build task
- Completed tasks
- Verification status
- Known blockers
- Return path to submission prep

Output:
- Working app changes
- Verification notes

## Draft UI Copy For Design Team

Top-level stepper labels:

| Step | Label | Description |
| --- | --- | --- |
| Step 1 | Start | Register and set up your Codex flow |
| Step 2 | Rules | Review requirements and confirm eligibility |
| Step 3 | Resources | Explore guides, examples, and project planning |
| Step 4 | Prepare | Draft your Devpost submission |
| Step 5 | Check | Run final review before submitting |

Top-level step headlines:

| Step | Headline | Subcopy |
| --- | --- | --- |
| Step 1 | Welcome to OpenAI Codex Hackathon | Register on Devpost, then continue here in Codex. |
| Step 2 | Review the rules | Confirm the requirements before you start building. |
| Step 3 | Choose your build path | Use the resources or start the optional guided learning path. |
| Step 4 | Prepare your submission | Turn your project into a clear Devpost-ready draft. |
| Step 5 | Run your final check | Review completeness, security, and handoff readiness. |

Learning branch copy:

| UI Element | Copy |
| --- | --- |
| Card title | Need help shaping your project? |
| Option 1 | I have my project idea |
| Option 1 description | Run `$prepare-submission` when you are ready. |
| Option 2 | Help me shape the project |
| Option 2 description | Run `$learning-onboard` to start the Ideate phase of the guided path. |

## Design Kit Inputs Needed

Request these from the design team:

- Light and dark mode tokens
- Devpost logo variants for light and dark backgrounds: `assets/logos/devpost-logo-original.svg` and `assets/logos/devpost-logo-white.svg`
- Stepper states: inactive, active, complete, blocked, hover/focus if needed
- Official fonts or approved webfont guidance
- Spacing and responsive behavior for desktop and narrow preview widths
- Optional learning-module treatment/assets if the design team wants to provide them
