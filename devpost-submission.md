# Task Tracker

## One-line Summary

Task Tracker is a local developer triage cockpit that gathers scattered work into one queue, recommends what to do next, and explains why that task should come first.

## Problem

Developer work is fragmented across GitHub issues, PR review requests, GitLab issues, Linear tasks, and a steady stream of undocumented housekeeping. The hard part is not just collecting tasks, but deciding what deserves attention next.

## Solution

Task Tracker gives one person a queue-first workspace with:

- a prominent `Next Up` panel
- a ranked top 3 recommendation list
- short reason chips plus one concise explanation
- manual task capture for work that is not recorded anywhere else
- task completion, archiving, and undo
- a separate `Bot Candidates` lane for small, well-scoped tasks that could be handed to a coding agent later

The current prototype is local-only and resets on refresh. It uses seeded demo data plus manual task entry so the workflow is visible immediately without live GitHub, GitLab, or Linear integrations.

## Why This Matters

People who build software often lose time re-learning what is in flight across multiple tools. This project focuses on triage, not just storage: it makes the next action visible and explains the ranking so the user can trust the recommendation.

## How We Used AI

The product includes AI-style triage behavior in the interface: the app ranks work, explains its ranking, and separates human-next work from bot-suitable tasks. The MVP does not call a live model at runtime.

## How We Used Codex

Codex was used to shape the hackathon scope, turn the idea into a PRD and technical spec, break the build into a checklist, and implement the prototype in this workspace. Codex also verified the local app with a browser-served preview and a module boot check.

## Key Features

- Queue-first layout with the queue as the main surface
- Prominent `Next Up` panel with a ranked top 3
- Short reason chips and explanation text for each recommendation
- Fast manual task creation
- Sorting and filtering across source, type, category, priority, effort, staleness, and agent suitability
- Task detail drawer for editing advanced metadata
- Completion, archive, and undo flow
- Separate `Bot Candidates` lane
- Seeded demo data that resets on refresh

## Architecture

The current prototype is a static local app built with HTML, CSS, and ES modules. It runs from the workspace without a dependency install.

Core pieces:

- `index.html`: page shell and layout
- `styles.css`: visual system and responsive layout
- `app/main.js`: UI state, task actions, filtering, detail drawer, and rendering
- `lib/seeded-tasks.js`: demo task set
- `lib/task-filters.js`: filter and sort logic
- `lib/recommendation.js`: ranking and explanation logic

The build docs under `docs/hackathon-build/` capture the original scope, PRD, spec, checklist, and build notes.

## Testing Instructions

1. Serve the workspace locally.
2. Open `http://127.0.0.1:4173/`.
3. Confirm the queue renders with seeded tasks.
4. Add a manual task and confirm it appears immediately.
5. Change filters and sorting and confirm the queue updates.
6. Open `Next Up` and confirm the top 3 ranking is visible.
7. Open a task detail drawer, edit a field, save, mark done, and use undo.
8. Confirm the `Bot Candidates` lane shows agent-suitable tasks.

Current local preview command:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

## Public Demo Link

`[TODO - add public demo URL if one is created]`

For now the demo is local-only at `http://127.0.0.1:4173/`.

## Public Repository Link

`https://github.com/lseonu/task-tracker`

This is the intended public submission repo for the hackathon project.

## Demo Video

`[TODO - add demo video URL]`

Prepared script: `docs/hackathon-build/demo-script.md`

Outline:

1. Show the problem: scattered work across multiple tools and undocumented tasks.
2. Show the queue-first app shell and seeded data.
3. Add a manual task.
4. Show the Next Up ranking and explain why the top item wins.
5. Show Bot Candidates.
6. Complete a task and undo it.

## Screenshot Shot List

- Queue view with seeded tasks: `docs/hackathon-build/screenshots/01-queue-next-up.png`
- Manual task added: `docs/hackathon-build/screenshots/02-manual-task-added.png`
- Filtered housekeeping queue: `docs/hackathon-build/screenshots/03-filtered-housekeeping.png`
- Task detail drawer: `docs/hackathon-build/screenshots/04-detail-drawer.png`
- Bot Candidates lane: `docs/hackathon-build/screenshots/05-bot-candidates.png`
- Completion state with undo toast: `docs/hackathon-build/screenshots/06-complete-undo-toast.png`

## Browser Handoff Checklist

- [x] Confirm the local server is running.
- [x] Open the app in a browser-compatible local URL.
- [x] Capture the queue, Next Up, detail drawer, and Bot Candidates views.
- [x] Check that the ranking explanation still reads clearly in the browser.
- [x] Verify the completion/undo flow through prepared screenshot states.
- [ ] Record or upload the demo video.
- [x] Confirm the repository URL is the intended public submission repo.
- [ ] Confirm whether a public demo URL is required by the official Devpost form.

## Submission Readiness Notes

- The prototype exists and is runnable locally.
- The story is coherent: one person, one queue, one clear recommendation surface.
- Screenshots and a demo script now exist.
- Remaining external gaps: demo video URL, public demo URL if required, repository confirmation, and official Devpost form fields.

## Known Limitations

- The prototype is local-only and resets on refresh.
- There is no live GitHub, GitLab, or Linear sync.
- There is no live model call at runtime.
- The current build is a static HTML/CSS/ES module implementation rather than the React/Next.js stack described in the earlier spec.
- Public repo, demo URL, and video URL are still placeholders.
- Public repository URL is set to the intended `lseonu/task-tracker` repo.
- Public demo URL and video URL are still placeholders.

## TODO Official Form Fields

The official Devpost submission form details could not be fetched in this session because the Devpost MCP returned `Auth required`.

Fill these in from the official event page when available:

- Official title field
- Official one-line summary field
- Category or track field, if any
- Public demo or website field, if required
- Repository field, if required
- Video URL field, if required
- Any custom submission questions
- Any prize or track opt-ins
