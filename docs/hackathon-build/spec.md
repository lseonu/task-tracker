# Technical Spec

## Overview

Build a local-only React + Next.js app for the Task Tracker MVP. The app resets to seeded demo data on refresh, accepts manual task entry, and computes an opinionated "Next Up" ranking that explains why each task is prioritized.

This spec follows the PRD in `docs/hackathon-build/prd.md`:

- Epics 1-2 map to queue, filtering, and task editing components.
- Epic 3 maps to ranking and explanation logic.
- Epic 4 maps to completion, archive, and undo behavior.
- Epic 5 maps to the Bot Candidates lane.

## Stack

- Next.js App Router: `https://nextjs.org/docs`
- React: `https://react.dev/learn`
- Tailwind CSS: `https://tailwindcss.com/docs/installation/using-vite`
- TypeScript for app and data model types

Why this stack:

- Next.js App Router fits a small but structured UI with page composition and component boundaries.
- React fits the interactive queue, filters, and recommendation state.
- Tailwind keeps the visual system fast to implement for a hackathon MVP.

## Architecture

### 1. App Shell

Implements: `prd.md > Epic 1: Unified Queue`

Responsibilities:

- Render the page chrome, title, and overall two-column layout.
- Keep the queue as the main surface with a prominent Next Up panel.
- Provide a clear empty state if no tasks exist.

### 2. Seeded Task Store

Implements: `prd.md > Epic 1: Unified Queue`, `prd.md > Epic 4: Task Completion And Review Loop`

Responsibilities:

- Hold the seeded demo tasks in a local source module.
- Initialize runtime state from those seeded tasks on load.
- Reset to the same seed set on refresh.

### 3. Task Queue

Implements: `prd.md > Epic 1: Unified Queue`, `prd.md > Epic 2: Task Metadata And Organization`

Responsibilities:

- Show all tasks in a work queue.
- Support sorting, filtering, arranging, and status display.
- Keep manual housekeeping tasks side by side with seeded items.

### 4. Task Composer

Implements: `prd.md > Epic 1: Unified Queue`, `prd.md > Epic 2: Task Metadata And Organization`

Responsibilities:

- Provide a fast add form with the minimal required fields.
- Open an expanded editor for advanced fields.
- Create new tasks immediately in the queue state.

### 5. Recommendation Engine

Implements: `prd.md > Epic 3: Next Up Recommendation`

Responsibilities:

- Score tasks using the PRD priority order: unblock others, preserve momentum, manage risk/deadlines.
- Return a ranked top 3 recommendation set.
- Generate reason chips and one short explanation sentence per recommendation.

### 6. Task Detail / Inspector

Implements: `prd.md > Epic 2: Task Metadata And Organization`, `prd.md > Epic 4: Task Completion And Review Loop`

Responsibilities:

- Edit advanced fields such as due date, notes, recent-work match, and agent suitability.
- Mark tasks complete.
- Show completed state and support undo.

### 7. Bot Candidates Lane

Implements: `prd.md > Epic 5: Bot Candidates`

Responsibilities:

- Surface tasks tagged as suitable for a coding agent.
- Keep bot-suitable work visually separate from the human Next Up list.

## File Structure

```text
app/
  layout.tsx
  page.tsx
  globals.css

components/
  app-shell.tsx
  task-queue.tsx
  task-composer.tsx
  task-detail-drawer.tsx
  next-up-panel.tsx
  bot-candidates-panel.tsx
  filters-bar.tsx
  queue-row.tsx

lib/
  task-types.ts
  seeded-tasks.ts
  recommendation.ts
  task-filters.ts
  task-actions.ts

docs/hackathon-build/
  learner-profile.md
  scope.md
  prd.md
  spec.md
  process-notes.md
```

## Data Flow

1. `seeded-tasks.ts` exports the initial task set.
2. `page.tsx` loads the seed data into local React state.
3. The user creates, edits, filters, sorts, completes, or reorders tasks through UI components.
4. `task-actions.ts` updates the in-memory task list.
5. `task-filters.ts` derives the visible queue from the current filters and sort order.
6. `recommendation.ts` scores the visible task set and returns the top 3 plus explanation metadata.
7. `next-up-panel.tsx` renders the ranked recommendations.
8. `bot-candidates-panel.tsx` renders the agent-suitable subset.
9. Completion updates the active queue immediately and exposes undo state for the toast.

Because the MVP resets on refresh, there is no browser storage layer or sync layer.

## Components And Responsibilities

### App Shell

Implements the queue-first layout from `prd.md > Epic 1: Unified Queue`.

Responsibilities:

- Set the primary layout.
- Keep the Next Up panel visible.
- Handle the empty state.

### Task Queue

Implements `prd.md > Epic 1: Unified Queue` and `prd.md > Epic 2: Task Metadata And Organization`.

Responsibilities:

- Render queue rows.
- Show status, source, category, priority, effort, and other key metadata.
- React to filter and sort state.

### Filters Bar

Implements `prd.md > Epic 2: Task Metadata And Organization`.

Responsibilities:

- Expose filter controls for source, type, category/project, status, priority, staleness, effort, and agent suitability.
- Keep filter state local to the page.

### Task Composer

Implements `prd.md > Epic 1: Unified Queue`.

Responsibilities:

- Collect fast-entry fields.
- Expand into advanced editing when needed.
- Create tasks without forcing advanced metadata.

### Task Detail Drawer

Implements `prd.md > Epic 2: Task Metadata And Organization`, `prd.md > Epic 4: Task Completion And Review Loop`.

Responsibilities:

- Edit advanced metadata.
- Mark complete.
- Undo accidental completion from the toast action.

### Next Up Panel

Implements `prd.md > Epic 3: Next Up Recommendation`.

Responsibilities:

- Show ranked top 3.
- Emphasize the first recommendation.
- Render reason chips and explanation text.

### Bot Candidates Panel

Implements `prd.md > Epic 5: Bot Candidates`.

Responsibilities:

- Show tasks marked as suitable for a coding agent.
- Keep this separate from the main recommendation surface.

### Recommendation Engine

Implements `prd.md > Epic 3: Next Up Recommendation`.

Responsibilities:

- Rank by unblock-others first.
- Then rank by momentum.
- Then rank by risk/deadline.
- Emit explanation tokens that the UI can render as chips.

### Task Actions

Implements `prd.md > Epic 4: Task Completion And Review Loop`.

Responsibilities:

- Add, edit, complete, archive, undo, and reorder tasks.
- Update derived recommendation state after each action.

## External APIs And Dependencies

No live product integrations are part of the MVP.

Official docs used for the implementation plan:

- Next.js App Router: `https://nextjs.org/docs`
- React components and state model: `https://react.dev/learn`
- Tailwind installation and utility workflow: `https://tailwindcss.com/docs/installation/using-vite`

Future integrations excluded from the MVP:

- GitHub API
- GitLab API
- Linear API

## AI Usage

The app itself does not need model calls for the hackathon MVP.

AI value is represented in the product behavior:

- The Next Up ranking explains why a task should come first.
- Bot Candidates mark tasks that are plausible one-shot jobs for a coding agent.

If we later add model assistance, it should only augment recommendation text or task triage, not replace the deterministic ranking logic in the MVP.

## Risks And Verification

### Risks

- Scope drift into real integrations.
- Recommendation logic becoming too vague to justify the ranking.
- UI complexity from too many task fields at once.
- Overbuilding persistence for a hackathon demo that resets on refresh.

### Verification

- Confirm the app opens on the queue view with a prominent Next Up panel.
- Confirm seeded demo tasks are visible immediately.
- Confirm the fast add form can create a task without advanced fields.
- Confirm ranking returns a top 3 and the first item is emphasized.
- Confirm completion crosses out the task and supports undo.
- Confirm Bot Candidates are visibly separated from the human recommendation list.

## Demo And Submission Flow

1. Open the app and show the seeded queue.
2. Add a manual housekeeping task.
3. Filter the queue to show the task is classed and manageable.
4. Open the Next Up panel and explain why the top item wins.
5. Show Bot Candidates for tasks that fit one-shot agent work.
6. Complete a task and show the queue and ranking update.

The submission story should emphasize that the product is a decision surface, not just a list: it helps the user answer what to do next when work is spread across tools and undocumented chores.
