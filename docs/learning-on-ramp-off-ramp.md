# Optional Learning On-Ramp And Off-Ramp

## Purpose

The optional guided build tool lives inside Step 3: Resources. It should help participants move from vibe coding into a more durable AI-assisted development workflow without making that guided build tool feel mandatory.

The core hackathon flow remains:

1. Start
2. Rules
3. Resources
4. Prepare
5. Check

When the guided build tool is active, Step 3 stays highlighted in the top-level progress UI.

## On-Ramp

The Resources step should offer two clear choices:

- `I have my project idea`: run `$prepare-submission`
- `Help me shape the project`: run `$build-onboard`

The on-ramp copy should make three things clear:

- confident builders can skip the path without penalty
- the path is for shaping and building a stronger project, not for learning trivia
- the output will be local planning and build artifacts that help with submission prep
- these are chat command choices, not clickable navigation buttons in V1

## Learning Sequence

The learning sequence follows the walkthrough structure:

1. `Ideate`: orient the participant, gather background, and start shaping the project idea
2. `Scope`: turn a spark of an idea into a focused project direction
3. `PRD`: write user-facing requirements and acceptance criteria
4. `Spec`: translate the PRD into technical implementation structure
5. `Checklist`: break the spec into sequenced, verifiable build tasks
6. `Build`: execute the checklist with appropriate verification pauses, then return to submission prep

The V1 command sequence is:

- `$build-onboard`
- `$build-scope`
- `$build-prd`
- `$build-spec`
- `$build-checklist`
- `$build-project`

Participants can answer by typing or by using any speech-to-text support available in their operating system or Codex environment. The skill behavior should tolerate longer dictated answers and then summarize them back before writing durable files.

## Outputs

The path should produce durable local documents, not long JSON strings:

- scope or brainstorm notes
- PRD
- technical spec
- build checklist
- build verification notes

State should only keep small pointers and confirmed project metadata:

- `learning.status`
- `learning.current_step`
- `learning.completed_steps`
- file paths for durable learning outputs
- confirmed `project.name`
- confirmed `project.summary`
- confirmed `project.ai_usage`
- confirmed `project.codex_usage`

## Off-Ramp

The guided build tool should return the participant to Step 4: Prepare.

The off-ramp artifact should summarize:

- what project they are building
- what planning files were created
- what still needs to be built or verified
- what submission materials are likely missing
- next command: `$prepare-submission`

When the participant exits the guided build tool, update state lightly:

- set `learning.status` to `completed` or `skipped`
- set `current_stage` to `prepare-submission` when they are ready to move on
- set `next_command` to `prepare-submission`
- preserve the five-step top-level flow

## Prepare Submission Re-Offer

`$prepare-submission` can re-offer the guided build tool if the project is vague or underspecified.

Use a soft prompt:

> Your project direction is still a little loose. You can keep drafting, or return to the optional guided path to tighten the scope before submission prep.

Do not block submission prep just because the participant skipped the guided build tool.
