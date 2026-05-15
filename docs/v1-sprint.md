# V1 Sprint Notes

## Current Intent

Build the next version of the OpenAI Codex Hackathon plugin as a Codex desktop app experience. Participants are expected to use the Codex desktop app, so rich local HTML artifact previews can be treated as the primary visual surface for the guided flow.

The chat response should remain a compact fallback and navigation layer, but the main learner/user experience can move into generated HTML artifacts when that creates a clearer, more branded, less text-heavy journey.

## Confirmed Feedback Items

- Legal confirmation should be a simple `yes` / `no` response.
- Devpost-branded evergreen graphics are desirable, including welcome screens and branded headers for flow steps.
- Devpost light/dark SVG logo variants are bundled in `assets/logos/` and should be used through the shared artifact header.
- Individual hackathons can also provide event-specific graphics.
- The progress chart/map is valuable and should remain part of the experience.
- Registration friction should be reduced when Devpost MCP support is available.
- Project idea generation belongs in the optional learning/planning component rather than the required core flow.
- Submission check should be upgraded with practical value beyond a checklist, starting with a minimum viable exposed-secret scan.

## Devpost MCP Deferral

We are deferring Devpost MCP integration until Benoit's authenticated MCP server is ready.

Expected future integration shape:

- Add root `.mcp.json` to the plugin.
- Add `mcpServers` to `.codex-plugin/plugin.json`.
- Add state fields for Devpost connection status, event registration, team identity, and submission identity.
- Add an onboarding beat that detects whether the Devpost MCP is authenticated and available.
- Keep browser/manual fallback for users who cannot or do not connect the MCP.
- Upgrade registration from browser-only handoff to an authenticated in-Codex registration or registration verification flow if MCP write tools support it.
- Upgrade submission prep/check from local draft only to Devpost draft sync or Devpost field verification if MCP write/read tools support it.

Open questions for when the MCP exists:

- What tools are exposed for event registration, team membership, and submission fields?
- Does authentication happen during plugin install, first use, or first MCP call?
- Are write operations allowed for registration and submission drafts, or read-only verification first?
- What data can be cached locally in `.openai-codex-hackathon-state.json`?
- What should remain browser-only for legal, payment, media upload, or final submit reasons?

## Artifact Rendering Standard Draft

Working assumption: Codex desktop app is required for participants.

Potential standard:

- Each major skill can generate or update a local HTML artifact in `artifacts/`.
- HTML artifacts should use shared CSS/layout conventions and relative references to plugin assets.
- Chat output should summarize the action, point to the artifact, and give the next command.
- Mermaid/Markdown visuals remain fallback surfaces, not the primary visual experience.
- Shared template assets live in root-level `assets/`, then each skill can adapt content blocks for its own artifact.

Need to decide:

- Whether artifacts are generated in the participant project root, the plugin folder, or both.
- Whether each skill owns a bespoke HTML file or all skills update one dashboard file.
- How much state is embedded into HTML versus read from `.openai-codex-hackathon-state.json`.
- What visual components become reusable: header, command map, status strip, CTA block, legal gate, checklist, scorecard, learning module.
- How to handle preview/open behavior inside Codex desktop without making the flow brittle.

## Optional Learning / Planning Track

The optional learning component should not call itself spec-driven development.

Working framing:

- Guided planning
- Build plan
- Project shaping
- Hackathon build coach

Candidate entry points:

- Offer after `$resources`, when the user is choosing or shaping an idea.
- Offer from `$prepare-submission` if the project is vague, underspecified, or missing a clear user/problem/workflow.
- Offer from `$hackathon-map` as an optional side path, never as a blocker.

Candidate exit:

- Write a concise project plan or project brief into state and/or a local markdown file.
- Update `project.name`, `project.summary`, `project.openai_usage`, and `project.codex_usage` when the user confirms the plan.
- Return to `$prepare-submission`.

Likely learning flow:

- Flipped interaction: Codex asks the learner short, concrete questions instead of presenting a lecture.
- Brainstorm with the participant, gather background, and explain the optional path.
- Scope the project from a spark of an idea.
- Produce PRD, spec, checklist, and build artifacts.
- Optional speech-to-text interview support where available.
- Convert answers into a plan with problem, user, workflow, scope, milestones, and proof/demo path.
- Use that plan as the basis for implementation and submission prep.

## Submission Check Upgrade

Minimum viable exposed-secret scan:

- Run locally only.
- Scan likely text files in the repo, including tracked and untracked files when safe.
- Flag common high-confidence patterns for API keys and tokens.
- Flag risky files such as `.env`, `.env.local`, or credential-looking files if they are tracked or likely to be committed.
- Redact findings in chat and artifacts.
- Block `ready` status only for high-confidence findings.
- Treat lower-confidence findings as review warnings.

Open questions:

- Use a small custom scanner script, `git grep` patterns, or integrate an existing scanner later?
- Should the first version scan all files or only git-tracked plus staged/untracked text files?
- How should the scorecard represent secret scan results visually?

## Proposed V1 Work Sequence

1. Review the current skill sequence using the generated HTML structure overview.
2. Decide the artifact rendering standard and shared template shape.
3. Add sprint spec sections for artifact generation, optional learning branch, submission-check secret scan, and future MCP hooks.
4. Implement the shared HTML artifact template.
5. Update core skills to reference or generate HTML artifacts while preserving compact chat fallback.
6. Add optional learning/planning skill or branch.
7. Add minimum viable local secret scanning to `$submission-check`.
8. Draft formal art requests for Victor's design team.
9. Run the flow end-to-end in Codex desktop and tune the copy/visual rhythm.

## Art Request Candidates

- Devpost-branded welcome screen.
- Registration handoff screen.
- Rules/fairness briefing header.
- Resources hub header.
- Strong project archetypes graphic.
- Anti-patterns graphic.
- Optional guided planning / build coach visual.
- Submission readiness scorecard.
- Final browser handoff screen.
