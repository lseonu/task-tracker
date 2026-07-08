# Guided Build Process Notes

## Onboarding

- Started optional guided build path inside Step 3: Resources.
- Known participant name: Seon-Woo.
- Known project idea: Task Tracker for scattered work across GitHub, Linear, GitLab, and undocumented housekeeping.
- Captured onboarding details: professional builder; strongest stack is Python, TypeScript, React, and Next.js; has used Claude, Codex, opencode, and similar agents.
- MVP boundary from participant: categories plus sorting/filtering are in scope; real GitHub, GitLab, and Linear connections are likely too much for the first pass.
- Preferred working style: fast and decisive.
- Remaining optional onboarding detail: prior planning-doc experience, only if useful before scope.

## Scope Interview

- Target user: Seon-Woo personally.
- Pain: work is dispersed across undocumented housekeeping tasks, GitHub and GitLab issues, Linear updates, and GitHub PR review requests.
- Desired long-term flow: connect GitHub, GitLab, and Linear, then collect assigned issues, review requests, and other work automatically.
- MVP boundary: UI-only/manual for now. Users can manually add uncaptured tasks, categorize them, sort/filter/arrange them, mark tasks done, and cross out/archive completed work.
- Useful demo hook: suggest the next item to do based on recently worked items and task context, so it feels smarter than a plain task list.
- Product center of gravity: an opinionated "Next Up" assistant that recommends the next work item and explains why.
- Recommendation priority order: first unblock others, then preserve Seon-Woo's recent work momentum, then account for risk/deadlines.
- Task fields should include enough metadata to justify recommendations: title, source, type, category/project, status, priority, age/staleness, optional due date, estimated effort, whether it unblocks others, whether it matches recently touched work, notes, and agent suitability.
- Agent suitability: mark tasks/issues that look small and well-scoped enough for a coding agent to attempt in one shot, separating human-next work from bot-dispatch candidates.
- Explicit MVP exclusions: real GitHub/GitLab/Linear OAuth or API sync, background polling, multi-user/team features, notifications, calendar scheduling, and actual bot execution. Use seeded/manual data plus convincing recommendation logic.
- Scope document written to `docs/hackathon-build/scope.md`.

## PRD Interview

- First-load layout: full queue as the main surface, with a prominent Next Up side/top panel rather than a recommendation-only landing view.
- Next Up panel behavior: show a ranked top 3 recommendations, with the first item visually emphasized as the primary recommendation.
- Recommendation explanation behavior: each recommendation should show 2-3 short reason chips plus one concise sentence explaining why it ranked there.
- Manual task entry: use a fast add form with title, source, type, project/category, priority, effort, and "unblocks others." Put due date, notes, recent-work match, and bot suitability in a detail drawer or expanded edit state.
- Completion behavior: marking a task done crosses it out immediately, makes it available under Done/Archived filtering, recalculates the top 3 recommendations, and shows a lightweight undo toast.
- First-run/demo data: start with realistic seeded demo tasks so the product shows value immediately, while still allowing manual task creation during the demo.
- PRD written to `docs/hackathon-build/prd.md`.

## Spec Setup

- Proposed stack: React + Next.js, matching the participant's familiarity and the UI-heavy queue/recommendation shape of the app.
- Deployment target: local-only for the hackathon MVP.
- Persistence decision: reset to seeded demo data on refresh is acceptable for the MVP.
- Spec written to `docs/hackathon-build/spec.md`.

## Checklist Setup

- Build ordering preference: start with the app shell and seeded queue before the recommendation logic.
- Build mode: autonomous with verification checkpoints.
- Preference update: finish the checklist/build in one pass and report back when done.
- Checklist written to `docs/hackathon-build/checklist.md`.

## Build Notes

- Local prototype implemented as a static HTML/CSS/ES module app so it can run in this workspace without installing dependencies.
- Verification completed against the local server and a module boot check.
