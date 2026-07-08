# Task Tracker

## One-line Summary

Task Tracker is a local developer triage cockpit that gathers scattered work into one queue, recommends what to do next, and explains why that task should come first.

## Devpost Form Answers

### Inspiration

I built Task Tracker because my work is spread across too many places: GitHub issues, GitHub PR review requests, GitLab issues, Linear tasks, and small housekeeping items that are not written down anywhere. The pain is not just remembering the tasks, but deciding what to do next when everything feels equally urgent.

### What it does

Task Tracker gives a developer one local queue for scattered work. It shows seeded GitHub, GitLab, Linear, PR review, and housekeeping tasks; lets the user add manual tasks; supports filtering, sorting, completion, archive, and undo; and highlights a ranked `Next Up` top 3 with short explanations for why each item is recommended. It also separates small, well-scoped tasks into a `Bot Candidates` lane for work that could later be handed to a coding agent.

### How we built it

The prototype is a static local web app built with HTML, CSS, and ES modules so it can run immediately from the repository without installing dependencies. The task data, filtering logic, and recommendation logic are split into small modules, while the UI layer handles queue rendering, detail editing, manual task creation, completion, and screenshot-ready demo states. Codex helped turn the initial idea into a scope, PRD, technical spec, checklist, implementation, verification pass, screenshots, and submission materials.

### Challenges we ran into

The biggest challenge was cutting the scope down from a real multi-service integration product into something useful and demoable during the hackathon. Live GitHub, GitLab, and Linear connections would have consumed most of the time, so the MVP focuses on the core workflow: collecting scattered work, ranking it, and explaining the recommendation. Another challenge was making the recommendation feel useful without overstating the prototype, since the current version uses deterministic local scoring rather than a live AI model.

### Accomplishments that we're proud of

I am proud that the prototype gets to the heart of the problem quickly: it opens directly into a working queue, shows a clear top recommendation, and explains the reasoning instead of acting like a generic todo list. The manual task flow, filters, detail drawer, completion/undo behavior, and Bot Candidates lane make the demo feel like a real workflow rather than a static mockup. I am also proud that the project is honest about its current limits while still showing a practical direction for a developer-focused tool.

### What we learned

We learned that the product value is less about syncing every source and more about reducing decision fatigue. The most useful surface is the opinionated `Next Up` assistant: it turns scattered work into a ranked short list and gives the user enough context to accept or override the recommendation. We also learned that a small local prototype can communicate the product direction clearly before investing in integrations.

### What's next for Task Tracker

Next, Task Tracker should add real GitHub, GitLab, and Linear integrations so assigned issues, PR review requests, and project tasks can populate the queue automatically. After that, it should persist user changes, learn from recently completed work, and use a model-backed recommendation layer that can explain tradeoffs more intelligently. The Bot Candidates lane could also evolve into a handoff flow that prepares small tasks for Codex or another coding agent.

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

No public demo URL is required for the current requirement set because runnable source code is accepted.

For now the demo is local-only at `http://127.0.0.1:4173/`.

## Public Repository Link

`https://github.com/lseonu/task-tracker`

This is the intended public submission repo for the hackathon project.

## Demo Video

No demo video is required for the current requirement set. Screenshots are included as optional supporting evidence.

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
- [x] Screenshot evidence is available; demo video is optional.
- [x] Confirm the repository URL is the intended public submission repo.
- [x] Runnable code satisfies the demo requirement.

## Submission Readiness Notes

- The prototype exists and is runnable locally.
- The story is coherent: one person, one queue, one clear recommendation surface.
- Screenshots and a demo script now exist.
- Required materials are present for the stated requirements: runnable code, source link, short problem description, and optional screenshots.

## Known Limitations

- The prototype is local-only and resets on refresh.
- There is no live GitHub, GitLab, or Linear sync.
- There is no live model call at runtime.
- The current build is a static HTML/CSS/ES module implementation rather than the React/Next.js stack described in the earlier spec.
- Public repository URL is set to the intended `lseonu/task-tracker` repo.
- Public demo URL and video URL are not included because the stated requirements allow runnable code and make screenshots/demo clips optional.

## Stated Submission Requirements

- A working tool: runnable code is available at `https://github.com/lseonu/task-tracker`.
- A short description of the problem: see `Problem`.
- A link to source code: `https://github.com/lseonu/task-tracker`.
- One screenshot or short demo clip: screenshots are available under `docs/hackathon-build/screenshots/`.

Devpost MCP login was completed through `codex mcp login devpost`, but the active Codex session may need a restart before MCP tools stop returning `Auth required`.
