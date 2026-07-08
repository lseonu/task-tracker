# Product Requirements Document

## Product Summary

Task Tracker is a personal developer triage cockpit. It helps Seon-Woo see scattered work in one queue, rank what should happen next, and explain why that recommendation comes first.

The MVP is UI-only. It uses seeded demo data plus manual task entry to show the workflow clearly without depending on live GitHub, GitLab, or Linear integrations.

## Target User

Primary user: Seon-Woo, a professional software builder juggling housekeeping, GitHub issues and PR reviews, GitLab issues, and Linear work.

Secondary user: an individual developer or technical lead who needs a fast, opinionated way to decide what to work on next when tasks are scattered across tools.

## Core User Journey

1. The user opens the app and sees the full queue first, with a prominent Next Up panel.
2. The queue already contains realistic seeded items so the app is useful immediately.
3. The user adds uncaptured work with a fast form when a task is not represented elsewhere.
4. The user filters, sorts, and arranges the queue to focus on a subset of work.
5. The Next Up panel shows a ranked top 3, with the first item emphasized.
6. Each recommendation shows short reason chips plus one short explanation sentence.
7. The user completes a task, which crosses it out, archives it, and updates the recommendations.
8. The app also surfaces Bot Candidates for small, well-scoped tasks that could later be handed to a coding agent.

## Epics And User Stories

### Epic 1: Unified Queue

- As Seon-Woo, I want one queue for all of my work so that I do not have to mentally merge GitHub, GitLab, Linear, and housekeeping items.
- As Seon-Woo, I want seeded demo tasks on first load so that I can understand the app without manual setup.
- As Seon-Woo, I want to manually add tasks so that undocumented work still has a place in the system.

Acceptance criteria:

- The app opens to a queue view, not a blank screen.
- The queue contains realistic seeded tasks on first load.
- A fast add form can create a task without requiring every advanced field.
- Newly added tasks appear in the queue immediately.

### Epic 2: Task Metadata And Organization

- As Seon-Woo, I want each task to carry source, type, category/project, status, priority, effort, and other prioritization signals so that the app can rank work intelligently.
- As Seon-Woo, I want to sort and filter the queue so that I can focus on the slice of work that matters right now.
- As Seon-Woo, I want to categorize tasks so that personal housekeeping can sit beside imported or seeded work.

Acceptance criteria:

- Tasks support the core metadata needed for ranking and filtering.
- Filters can narrow the queue by source, type, category/project, status, priority, staleness, effort, and agent suitability.
- Sort controls can reorder the queue without losing the underlying tasks.
- Task edits preserve the task’s identity and update the displayed queue state immediately.

### Epic 3: Next Up Recommendation

- As Seon-Woo, I want a ranked top 3 recommendation so that I can see both the best option and the runner-up choices.
- As Seon-Woo, I want the first recommendation emphasized so that the app makes a clear opinion instead of just listing possibilities.
- As Seon-Woo, I want short reason chips and a one-sentence explanation so that the recommendation feels understandable and trustworthy.

Acceptance criteria:

- The Next Up panel always shows a ranked top 3 when tasks exist.
- The first recommendation is visually stronger than the other two.
- Each recommendation includes 2-3 short reason chips.
- Each recommendation includes one concise explanation sentence.
- The ranking follows the priority order: unblock others first, then preserve momentum, then manage risk/deadlines.

### Epic 4: Task Completion And Review Loop

- As Seon-Woo, I want to mark a task complete so that the queue stays current.
- As Seon-Woo, I want completed tasks to be archived or filterable as done so that I can review history without cluttering the active queue.
- As Seon-Woo, I want the recommendation to update after completion so that the app reflects the new next best action.

Acceptance criteria:

- Completing a task crosses it out immediately in the active view.
- Completed tasks remain reachable through a done/archived view or filter.
- The Next Up panel recalculates after completion.
- A lightweight undo toast appears after completion.

### Epic 5: Bot Candidates

- As Seon-Woo, I want to mark a task as suitable for a coding agent so that I can separate human-next work from bot-dispatch work.
- As Seon-Woo, I want the app to surface Bot Candidates so that easy one-shot tasks are easy to identify later.

Acceptance criteria:

- Tasks can be tagged with agent suitability.
- The UI can surface a Bot Candidates lane or section.
- Bot Candidates are presented as a separate recommendation surface from the human Next Up list.

## Edge Cases

- If the queue is empty, the app should still show the main shell and a clear empty state with a call to add a task or load demo data.
- If there are fewer than three viable recommendations, the Next Up panel should show only the available results.
- If a task lacks some advanced metadata, the app should still allow it to be created and refined later.
- If multiple tasks are equally strong candidates, the ranking should still present a stable order.
- If a task is completed by mistake, the undo toast should let the user recover quickly.

## What We Are Building

- A queue-first UI with a prominent Next Up panel.
- Seeded demo data on first run.
- Fast manual task creation.
- Sorting and filtering controls.
- Task detail editing for advanced prioritization metadata.
- A ranked top 3 Next Up recommendation panel.
- Short reason chips plus a concise explanation sentence for each recommendation.
- Completion/archive behavior with undo.
- A Bot Candidates view or lane.

## What We Would Add With More Time

- Real GitHub, GitLab, and Linear integrations.
- OAuth and background sync.
- Smarter recommendation heuristics based on history over time.
- Multi-user collaboration.
- Notifications and reminders.
- Actual coding-agent dispatch for Bot Candidates.

## Submission Proof Points

- The app opens to a useful queue immediately.
- The recommendation panel makes a clear, opinionated choice.
- The explanation shows why the top item wins.
- Manual housekeeping tasks can be added and prioritized alongside seeded work.
- The app demonstrates completion, archiving, and re-ranking in one flow.
- Bot Candidates are clearly separated from human-next tasks.
