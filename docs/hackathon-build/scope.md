# Project Scope

## Project Name Candidates

- Next Up
- Triage Desk
- Work Queue
- Dev Queue

## One-Line Summary

An opinionated personal work triage tool that gathers scattered developer tasks into one queue, recommends what Seon-Woo should do next, and explains the recommendation.

## Target User

The first target user is Seon-Woo: a professional software builder who has work spread across GitHub issues, GitHub PR review requests, GitLab issues, Linear issues, and undocumented housekeeping tasks.

The broader user is an individual developer or technical lead who has too many small work obligations scattered across tools and needs a fast way to decide what deserves attention now.

## Problem

Developer work is fragmented. Some tasks live in GitHub, GitLab, or Linear. Some are review requests. Some are cleanup chores or follow-ups that are not documented anywhere. The result is not just a task-tracking problem; it is a prioritization problem.

The user needs a single triage surface that can answer: "What should I do next, and why?"

## Core Workflow

1. The user lands on a unified work queue populated with seeded/demo tasks and manually added tasks.
2. Each task has enough metadata to support prioritization: source, type, category/project, status, priority, staleness, optional due date, estimated effort, whether it unblocks others, whether it matches recent work, notes, and agent suitability.
3. The user can sort, filter, arrange, add, edit, complete, and archive tasks.
4. The app highlights a "Next Up" recommendation and explains why it was chosen.
5. The user can also view "Bot Candidates": small, well-scoped tasks that look suitable for a coding agent to attempt in one shot.
6. When a task is done, the user marks it complete; the app crosses it out or archives it and updates the recommendation.

## What We Are Building

- A UI-only MVP with seeded data and manual task entry.
- A unified task queue with categories/sources for GitHub, GitLab, Linear, PR reviews, and housekeeping.
- Sorting and filtering by source, type, category/project, priority, staleness, status, effort, and agent suitability.
- Manual task creation and completion/archive behavior.
- An opinionated recommendation engine for "Next Up."
- Recommendation explanations that make the logic visible.
- A "Bot Candidates" lane for tasks likely suitable for coding-agent execution later.

Recommendation priority:

1. Unblock others first: PR reviews, requests, aging items, or tasks marked as blocking someone else.
2. Preserve momentum: prefer items related to recently touched projects, categories, or sources.
3. Manage risk/deadlines: consider overdue, high-priority, stale, or time-sensitive items.

## What We Are Not Building

- Real GitHub, GitLab, or Linear OAuth/API sync.
- Background polling or live updates.
- Multi-user/team features.
- Notifications.
- Calendar scheduling.
- Actual coding-agent execution.
- Full project management or general productivity suite features.

These are credible future extensions, but the hackathon MVP should prove the triage and recommendation workflow first.

## Inspiration And References

- Akiflow: useful reference for the all-sources-to-one-inbox pattern.
- Motion: useful reference for prioritization and "what should I work on next?" positioning.
- Workstream: useful developer-command-center framing, but much broader than this MVP.

## Demo Path

1. Show the user opening a queue with mixed work: PR reviews, GitHub/GitLab issues, Linear tasks, and housekeeping.
2. Add a manual housekeeping task that was not captured anywhere else.
3. Filter the queue to show how scattered work becomes navigable.
4. Open the "Next Up" recommendation and show the explanation: it prioritizes unblocking others, then momentum, then risk/deadline.
5. Show a separate "Bot Candidates" lane for small, well-scoped issues that could be handed to a coding agent later.
6. Mark the recommended task complete and show the queue/recommendation update.

## Submission Story

This project is not just a task list. It is a focused developer triage cockpit for deciding what to do next when work is scattered across issue trackers, PR reviews, and undocumented chores.

The AI/product angle is the opinionated prioritization layer: the app explains why one task should come next and separates human attention work from potential bot-dispatch work. The MVP uses seeded/manual data to keep scope realistic while demonstrating the workflow that future integrations would automate.
