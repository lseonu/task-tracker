---
name: plan-project
description: Help the user choose and sharpen a viable hackathon idea that fits the contest, avoids anti-patterns, and is strong enough to build and submit. Use when the user is ready to brainstorm or refine the project concept after reviewing the rules.
---

# Plan Project

## Overview

Turn a vague idea into a buildable project brief. Keep the artifact light by storing the essential plan in the local state file instead of generating a full planning document.

## Preconditions

Read `.openai-codex-hackathon-state.json`.

If the file does not exist, direct the user to `$start-hackathon`.

If `rules_acknowledged` is not `true`, stop and direct the user to `$review-rules`.

## Conversation Rules

Ask one question at a time.

Keep the planning loop focused on these questions:
- What user problem matters?
- Who is the target user?
- What is the smallest convincing product loop?
- Why does this actually need OpenAI capabilities?
- How does Codex help the user ship it during the hackathon?
- What is the `wow factor` judges will remember?

## Anti-Pattern Filter

Challenge weak ideas directly.

Do not approve ideas that are mainly:
- a single prompt in a thin UI
- a generic chatbot without a clear workflow
- a trivial wrapper around file or webpage Q&A
- a vague assistant with no target user and no testable loop

When an idea drifts into one of those patterns, explain the issue and push the user toward a stronger product definition.

Also note in the conversation that the final launch draft should incorporate sponsor-approved anti-patterns from the Codex team.

## Project Brief

Before finishing, make sure the user has approved a compact brief covering:
- project name
- problem
- users
- core workflow
- OpenAI usage
- Codex usage
- wow factor

Write those values into the `project` object in `.openai-codex-hackathon-state.json`.

## State Update

When the brief is approved:
- Add `plan-project` to `completed_stages` if needed
- Set `current_stage` to `build-project`
- Set `next_command` to `build-project`
- Set `project.anti_patterns_checked` to `true`

End with a short bullet summary of the approved brief and direct the user to `$build-project`.
