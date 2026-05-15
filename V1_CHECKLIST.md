# V1 Checklist

## North Star

The Devpost landing page promises: install the Codex plugin, run `$start-hackathon`, and Codex guides the rest.

Honor that promise everywhere:

- Every skill must tell the user the next recommended action.
- `$hackathon-map` is the recovery surface when the user is unsure where they are.
- Every HTML artifact should orient the user immediately.
- Codex desktop app is the required participant surface for this plugin experience.

## 1. [x] Prove Media Embeds Before Designing Around Them

- Create a standalone HTML test page for YouTube iframe embeds.
- Create a standalone HTML test page for Devpost-owned CDN MP4 embeds, or a representative MP4 URL when available.
- Test both in Codex desktop browser/artifact preview.
- Decide whether supported video patterns include iframe, `<video>`, poster image, transcript fallback, or external link only.
- Do not add video structure to the plugin templates until this proof passes.

Status note:
- Created standalone proof pages in `artifacts/media-embed-proof/`.
- MP4 proof uses a representative public placeholder until a Devpost-owned CDN MP4 is available.
- Manual Codex Desktop preview result: direct MP4 embed worked; YouTube iframe did not.
- Media decision for V1: direct MP4 is technically feasible, but video and per-step art are not dependencies for this sprint. Do not use YouTube iframe embeds in participant-facing templates.

## 2. [x] Define HTML Artifact Inventory

- One artifact page for `$start-hackathon`.
- One artifact page for `$review-rules`.
- One artifact page for `$resources`.
- One artifact page for `$prepare-submission`.
- One artifact page for `$submission-check`.
- One persistent map/dashboard artifact.
- One optional learning/planning track artifact or artifact sequence.
- For each page, define the required content, shared progress/header surfaces, CTA, and fallback chat summary.

Status note:
- Defined the artifact inventory in `docs/artifact-inventory.md`.
- Top-level flow stays five steps: Start, Rules, Resources, Prepare, Check.
- The learning/planning module gets its own nested HTML artifact sequence inside Step 3 rather than becoming a sixth top-level step.

## 3. [x] Define Shared Artifact Template

- Create a shared HTML/CSS template for all skill artifacts.
- Add a standard top progress/status strip to every artifact.
- The strip should include:
  - event name
  - current step, such as `Step 3 of 5`
  - completed stages
  - blocked or waiting items
  - next recommended action
  - official submission deadline
  - time remaining when official dates are available
  - link back to the main Devpost event page
- Keep `.openai-codex-hackathon-state.json` as the source of truth for workflow progress.
- Avoid accumulating large artifact history in state.
- Regenerate artifacts from config plus state when needed.
- Keep chat output compact: summary, artifact link/open instruction, next command.

Status note:
- Created raw shared template files in `artifacts/templates/`.
- Created a plain Step 3 Resources sample in `artifacts/generated/resources-sample.html`.
- Documented template slots, state attributes, and the nested learning stepper in `docs/shared-artifact-template.md`.
- Kept styling intentionally minimal so the final Devpost design kit can be applied later.
- Preview rule: serve generated artifacts over localhost for the Codex in-app browser; direct `file://` navigation was rejected during testing.
- Workshopped and accepted the V1 structure: universal Devpost header, top-level five-step progression, headline/subcopy, plain HTML content, nested Step 3 learning progression, next action, and chat fallback.
- Sticky proof: `position: sticky` works for the progression component in the Codex in-app browser when served over localhost.
- Updated the shared artifact layout to follow the latest design-team direction: Devpost header, optional event banner slot, left-side five-step rail, main content column, and nested learning stepper only inside Step 3.
- Kept the official two-column layout active at Codex split-pane widths and reserved the stacked layout for narrow mobile-like panes.
- Removed visible chat fallback from artifact pages; fallback copy remains skill/renderer data for cases where HTML artifacts fail.

## 4. [x] Draft Victor Design And Art Request

- Request the Devpost design kit:
  - logos
  - official colors
  - official typography
  - layout guidance
  - icons or illustration rules if available
- Request font files or approved webfont guidance if custom/licensed fonts are used.
- Request evergreen Devpost graphics:
  - welcome screen
  - registration handoff
  - final submission handoff
  - generic progress/dashboard elements
- Request optional supplemental assets only if the design team wants to provide them:
  - optional guided planning treatment
  - responsive/narrow-pane behavior
- Include artifact page inventory and rough target dimensions in the request.

Status note:
- Design/art request was narrowed for the V1 timeline and communicated in Slack.
- Must-have request: finished progression component, responsive/narrow-pane guidance, Devpost design kit, logo variants, brand colors, fonts, and component states.
- Optional request: learning-module treatment/assets if the design team wants to provide them.
- Removed the expectation of custom art for every step and avoided making video assets a V1 dependency.
- Received and bundled Devpost light/dark SVG logo variants in `assets/logos/`; generated artifacts now use them through the shared template.

## 5. [x] Clarify State Model

- Keep JSON small and human-readable.
- Use state for:
  - current stage
  - completed stages
  - rules acknowledgment
  - registration status
  - project fields
  - submission fields
  - deadline display/cache if useful
  - optional learning status once added
- Do not use state to store full HTML or full artifact history.
- Add minimal UI/render metadata only if it proves useful.

Status note:
- Documented the clarified state model in `docs/state-model.md`.
- Added small `participant`, `learning`, `deadlines`, and `artifacts` sections to the initial state examples.
- Kept personalization minimal: participant display name and project identity only.
- Clarified that `dashboard` and `reminders` are legacy-ish prototype fields; new HTML artifact work should prefer `deadlines` and `artifacts`.

## 6. [x] Expand Event Config

- Add hackathon theme.
- Add sponsor/provider.
- Add what kind of project participants can expect to build.
- Add project requirements and expectations.
- Add judging emphasis.
- Add official deadline fields.
- Add main Devpost event URL.
- Add resources URL.
- Add submission URL.
- Add media URLs only after the media embed proof passes.
- Add art asset references once the design kit/art request is resolved.

Status note:
- Kept the event config intentionally lightweight rather than adding speculative event fields.
- Trimmed `config/hackathon.json` to event identity, official URLs, submission deadline, asset paths, Markdown content paths, minimal submission requirements, and future MCP notes.
- Added placeholder rich-text Markdown files in `content/steps/` for the five top-level steps.
- Added `README.md` guidance for future event owners: use config for metadata/assets, Markdown for longer copy, no inline images in V1, and expect Devpost MCP to become the future source of truth.

## 7. [x] Update Core Skills For HTML-First Output

- `$start-hackathon`
  - event-specific welcome
  - theme/provider/project expectations
  - registration handoff
  - progress strip
  - next command
- `$review-rules`
  - yes/no legal gate
  - compact rules artifact
  - progress strip
  - locked/unlocked state
- `$resources`
  - resources hub
  - strong project archetypes
  - anti-patterns
  - optional learning branch pitch
  - progress strip
- `$prepare-submission`
  - draft room
  - missing materials
  - revision checklist
  - offer learning branch again if project is vague
  - progress strip
- `$submission-check`
  - final scorecard
  - readiness result
  - security review
  - Devpost browser handoff
  - progress strip

Status note:
- Implemented a thin V1 HTML-first slice rather than a full behavioral rewrite.
- Added `scripts/render-artifacts.mjs` to generate top-level HTML artifacts from `config/hackathon.json`, `.openai-codex-hackathon-state.json` when present, and `content/steps/*.md`.
- Generated the five core pages in `artifacts/generated/`: start, review rules, resources, prepare submission, and submission check.
- Updated the five participant-facing skill docs with concise HTML Artifact Output instructions.
- Verified `artifacts/generated/resources.html` in the Codex in-app browser over localhost.
- Rewrote the core command skill files to make generated HTML artifacts the primary interface and explicitly prevent stale inline placeholder images, Mermaid dashboards, and chat-first landing pages.

## 8. [x] Design Optional Learning On-Ramp And Off-Ramp

- Present the learning/planning track after `$resources`.
- Make it first-class but clearly optional.
- Present two clear paths:
  - `I have my project idea` -> run `$prepare-submission`
  - `Help me shape the project` -> run `$learning-onboard`
- Re-offer from `$prepare-submission` if the project is vague or underspecified.
- Define the learning output:
  - scope notes
  - project plan
  - PRD-like requirements
  - technical spec
  - build checklist
- Define the off-ramp:
  - update project state fields
  - save the plan/checklist locally if useful
  - return to `$prepare-submission`

Status note:
- Documented the optional learning on-ramp/off-ramp in `docs/learning-on-ramp-off-ramp.md`.
- Kept the learning path nested inside Step 3: Resources, with two command-path choices rather than clickable routing controls.
- Updated the learning sequence to match the walkthrough, then trimmed V1 to the useful core path: Ideate, Scope, PRD, Spec, Checklist, Build, then Return to the core flow.
- Clarified that item 8 defines the path; item 9 will decide exact command names and implement the learning skills.
- Refreshed the generated Resources artifact and verified the two-path on-ramp over localhost in the Codex in-app browser.

## 9. [x] Build Optional Learning Track

- Build only after the on-ramp and off-ramp are clear.
- Use flipped interaction instead of lecture-first teaching.
- Ask short, concrete questions.
- Support speech-to-text interviews where available.
- Teach the underlying workflow without calling it spec-driven development.
- Keep the tone non-remedial: confident builders can skip it without penalty.
- Help users brainstorm, plan, write requirements, write a technical spec, produce a checklist, and direct Codex through implementation.

Status note:
- Scaffolded the optional learning shell, then ported the core Claude Code curriculum into the Codex path.
- Added six optional learning skills: `$learning-onboard`, `$learning-scope`, `$learning-prd`, `$learning-spec`, `$learning-checklist`, and `$learning-build`.
- Removed iterate/reflect from V1 per product direction.
- Added matching generated HTML artifacts and Markdown content files for each learning step.
- Updated the renderer so learning artifacts keep the top-level Step 3 Resources state active while showing the nested learning progression.
- Updated `$resources` to point participants to `$learning-onboard` when they choose the guided path.
- Documented that the learning path creates durable local files under `docs/hackathon-learning/` while keeping state lightweight.
- Verified `learning-onboard.html` over localhost in the Codex in-app browser.
- Added copy-maintainer comments to `content/steps/` and `content/learning/`; the renderer ignores these comments so they help handoff without appearing in participant artifacts.

## 10. [x] Implement Submission Security MVP

- Add a local secret scan to `$submission-check`.
- Scan likely text files in the repo.
- Include tracked and untracked files when safe.
- Flag common high-confidence token and API key patterns.
- Flag risky env or credential-looking files.
- Redact findings in chat and artifacts.
- Block `ready` only for high-confidence issues.
- Add a general security review:
  - exposed env files
  - hardcoded keys
  - risky data handling claims
  - unclear auth setup
  - unclear judge/test setup
  - suspicious public URLs or credentials in docs

Status note:
- Added `scripts/submission-security-scan.mjs`, a lightweight local scanner for likely text files, tracked and untracked files, high-confidence token patterns, private key blocks, credential-looking assignments, and risky credential file names.
- Scanner writes redacted JSON to `artifacts/generated/submission-security-scan.json`.
- Updated `$submission-check` to run the scanner before readiness review, block `ready` on high-confidence findings, treat warning-only scans as review-needed, and avoid exposing raw secret values.
- Updated the submission-check artifact renderer to show the security scan result when available.
- Verified normal repo scan passes and a temp smoke repo with a fake OpenAI-style key returns `block` with redacted evidence.
- Verified the refreshed submission-check artifact over localhost in the Codex in-app browser.

## 11. [x] Document Future Devpost MCP

- Defer implementation until Benoit's authenticated Devpost MCP is ready.
- Keep notes for:
  - auth flow
  - registration status
  - team identity
  - event registration
  - submission draft sync
  - submission field verification
  - write-capable registration or submission actions
- Preserve browser/manual fallback even when MCP exists.
- Add `.mcp.json` and `mcpServers` only when server command/auth shape is known.
- Added `docs/future-devpost-mcp.md` with OpenAI plugin/MCP documentation links, a read-first Devpost tool sketch, auth guidance, lightweight state/config boundaries, skill integration notes, migration plan, and open questions.
- Updated `README.md` to point future implementers to the Devpost MCP memo.

## 12. [ ] End-To-End Desktop QA

- Run the full flow in Codex desktop.
- Verify each skill creates or updates the expected artifact.
- Verify each artifact includes progress, deadline, Devpost URL, and next action.
- Verify generated pages do not show chat fallback UI during normal artifact rendering.
- Verify chat fallback remains compact and usable in chat when artifact rendering fails.
- Verify the user can recover with `$hackathon-map`.
- Verify the optional learning branch exits cleanly back to submission prep.
- Verify final submission handoff is clear and does not imply automatic Devpost submission unless MCP write support exists.
- Verify the latest design decisions: `Ideate` label, light/dark logo variants, split-pane responsive layout, and Markdown copy ownership comments not appearing in rendered pages.
