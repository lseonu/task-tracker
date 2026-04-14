---
name: deadline-reminders
description: Show upcoming hackathon deadlines, remind the participant what matters next, and record lightweight reminder state. Use when the user wants a countdown, asks what is due next, or needs a submission-readiness reminder inside Codex.
---

# Deadline Reminders

## Overview

Act as the lightweight reminder layer for this prototype. Keep it practical: show the next known deadline, what to do before it, and what official page the user should still verify.

## Required References

Read these files before responding:
- `../../config/hackathon.json`
- `.openai-codex-hackathon-state.json` when it exists

If the state file does not exist, direct the user to `$start-hackathon`.

## Response Pattern

Keep the response compact and use this order:
- Next known deadline or `TODO official date`
- Why it matters
- What the user should do next inside Codex
- Which official page they still need to verify

If no official dates are filled in yet:
- say that the reminder system is scaffolded but waiting on official dates
- still provide a practical pre-submission checklist
- recommend the next in-plugin step

## Reminder Checklist

When helpful, include a short checklist covering:
- rules reviewed
- resources checked
- project link ready or knowingly pending
- repo link ready or knowingly pending
- demo plan ready
- final submission review still needed

## State Update

When this skill runs:
- Add `deadline-reminders` to `completed_stages` if needed
- Set `current_stage` to `deadline-reminders`
- Set `next_command` to `prepare-submission` unless `submission.status` is `ready`, in which case set it to `submission-check` or `hackathon-map`
- Update or create a `reminders` object with:
  - `last_checked_at`
  - `next_deadline_label`
  - `next_deadline_display`
  - `official_dates_confirmed`

After updating state, render a refreshed compact progress card based on the current `.openai-codex-hackathon-state.json`.

## Scope Guard

Do not imply that Codex will send calendar invites, emails, or Devpost submissions automatically. This prototype only tracks and summarizes reminder state inside the plugin.
