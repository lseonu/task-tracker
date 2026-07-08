# Build Checklist

## Build Preferences

- **Build mode:** Autonomous
- **Comprehension checks:** N/A
- **Git:** Commit after each major milestone
- **Verification:** Yes
- **Check-in cadence:** Milestone verification checkpoints

## Checklist

- [x] **1. App Shell And Layout**
  Spec ref: `spec.md > Architecture > 1. App Shell`
  What to build: Create the queue-first page shell with a prominent Next Up panel, a main queue column, and an empty state.
  Acceptance: The app opens to a visible queue view with Next Up always present.
  Verify: Run the local app and confirm the main shell renders with both major regions visible.

- [x] **2. Seeded Task Model**
  Spec ref: `spec.md > Architecture > 2. Seeded Task Store`
  What to build: Define the task types and the seeded demo dataset that resets on refresh.
  Acceptance: The app starts with realistic demo tasks and no persistence layer.
  Verify: Refresh the app and confirm the same seeded tasks appear again.

- [x] **3. Queue Row Rendering**
  Spec ref: `spec.md > Architecture > 3. Task Queue`
  What to build: Render task rows with source, type, category/project, status, priority, effort, and agent-suitability indicators.
  Acceptance: The queue shows the task metadata needed for sorting and recommendation.
  Verify: Inspect the queue and confirm the core metadata is visible per row.

- [x] **4. Fast Task Composer**
  Spec ref: `spec.md > Architecture > 4. Task Composer`
  What to build: Add a compact form for quick task creation with an expanded edit state for advanced fields.
  Acceptance: A task can be created without filling in every advanced field.
  Verify: Add a manual housekeeping task and confirm it appears immediately in the queue.

- [x] **5. Filters And Sorting**
  Spec ref: `spec.md > Components And Responsibilities > Filters Bar`
  What to build: Add filters and sorting controls for source, type, category/project, status, priority, staleness, effort, and agent suitability.
  Acceptance: The queue can be narrowed and reordered without losing tasks.
  Verify: Apply a filter and sort change, then confirm the queue updates correctly.

- [x] **6. Recommendation Scoring**
  Spec ref: `spec.md > Architecture > 5. Recommendation Engine`
  What to build: Implement deterministic ranking using unblock others first, then momentum, then risk/deadline.
  Acceptance: The app returns a ranked top 3 recommendation set.
  Verify: Compare seeded tasks and confirm the top 3 ordering matches the stated priority rule.

- [x] **7. Next Up Panel**
  Spec ref: `spec.md > Components And Responsibilities > Next Up Panel`
  What to build: Render the ranked top 3 with the first item emphasized and reason chips plus an explanation sentence.
  Acceptance: The first recommendation is visually strongest and each recommendation explains itself.
  Verify: Open the panel and confirm the top item is highlighted and the reasons are visible.

- [x] **8. Task Detail And Completion**
  Spec ref: `spec.md > Architecture > 6. Task Detail / Inspector`
  What to build: Add the task detail drawer for editing advanced fields, completing tasks, and supporting undo.
  Acceptance: Completing a task crosses it out, archives it, and updates the recommendations.
  Verify: Complete a task, confirm the undo toast appears, then undo and confirm the task returns.

- [x] **9. Bot Candidates Lane**
  Spec ref: `spec.md > Architecture > 7. Bot Candidates Lane`
  What to build: Surface tasks tagged as agent-suitable in a separate lane from the human Next Up list.
  Acceptance: Bot Candidates are clearly separated from the main recommendation surface.
  Verify: Tag a task as agent-suitable and confirm it appears in the Bot Candidates lane.

- [x] **10. Demo Data And Empty States**
  Spec ref: `spec.md > Risks And Verification`
  What to build: Ensure first-run demo data, empty-state handling, and reset-on-refresh behavior all work together.
  Acceptance: The app is useful on first load and still behaves predictably after refresh.
  Verify: Reload the app from scratch and confirm the seeded queue and empty-state behavior are correct.

- [x] **11. Submission Handoff Materials**
  Spec ref: `prd.md > Submission Proof Points`
  What to build: Gather the story, screenshots, repo link, and demo script needed for submission prep.
  Acceptance: The project has enough material to move straight into `$prepare-submission`.
  Verify: Review the screenshots and demo notes and confirm the next command is `$prepare-submission`.
