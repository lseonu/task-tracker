# Plugin Runtime Rule

The participant's current working directory is their project folder, not this plugin
bundle. The local state file `.openai-codex-hackathon-state.json` lives in the
participant's project root.

This plugin runs entirely from skill instructions — there are no scripts to execute and
no Node dependency. You read the plugin's own content/config files (relative to the skill
you are running, exactly like the other entries under **Required References**), compose
the response yourself, and write state by editing the JSON file directly.

## Primary Interface

Chat is the primary participant interface. Compose responses text-first so they render in
any Codex host (terminal or desktop). The rich progress visual is the `devpost` MCP
server's stepper widget on hosts that can render it; your composed text must always stand
on its own without it. Do not tell the participant to open a localhost page, and do not
generate or embed images — the stepper widget is the only progress visual.

Every command should:

1. Read the required references and local state (`.openai-codex-hackathon-state.json`).
2. Make its workflow-specific state or document updates (see **Writing State**).
3. Render the journey stepper by calling the `show_hackathon_stepper` MCP tool (the
   bundled `devpost` server — `mcp__devpost__show_hackathon_stepper`) with the
   `active_step` for this stage — once per response, before the text. See **Journey
   Stepper**.
4. Compose the participant-facing text yourself (see **Composing the Response**).
5. End with the exact next skill invocation when another command should run, as the final
   line:

```text
Type this next: `$command-name`.
```

## Devpost MCP Server

The bundled `devpost` server (`https://devpost.com/mcp`) is the source of truth for official
event data. Current Codex registers it automatically. Follow these rules everywhere so a turn
never becomes a troubleshooting session:

- **Call only what you need, when you need it.** Each skill lists the `devpost` tools its page
  can draw on; call just the ones required to render the current response, at the point you
  need them. Do not pre-fetch the whole list, and do not call a tool whose result you will not
  use.
- **Do not verify, probe, or set up the server.** Assume the tools are available and call them
  directly. Never call a tool just to check it exists, and never tell the participant to
  register, add, re-authenticate, or restart the server during a normal turn. One-time
  install/setup lives in `../SETUP.md`, not in participant responses.
- **On failure, degrade in one line — do not self-correct.** If a `devpost` call errors or
  returns nothing, treat it as "official data unavailable," not "something is misconfigured."
  Fall back immediately to `../config/hackathon.json` (and the skill's named fallback file)
  and note once, in a short clause, that the event details are provisional. Do not retry in a
  loop, diagnose the error, or re-explain the fallback on later turns.

## Composing the Response

Build the text response in-context — do not run a script:

1. Read the page's content file from the plugin's `content/` directory, referenced
   relative to the current skill (e.g. `../../content/steps/start.md`). Each skill names
   its page content file under **Required References**.
2. Strip maintainer-only HTML comments (`<!-- ... -->`) — they are notes for editors, not
   for the participant.
3. Interpolate event values: replace `{{event.name}}` and `[Hackathon name]` with the
   event name (prefer live data from the `devpost` MCP server; otherwise the value in
   `../../config/hackathon.json`). If official dates/URLs are still placeholders, say they
   are provisional rather than inventing them.
4. Output, in order: a one-line headline for the stage, the interpolated page content,
   and the next-command callout. Keep it concise and text-only; the stepper widget already
   shows progress, so do not also hand-write a progress dashboard or ASCII stepper.

If you cannot read the content file, fall back to a compact text response with: the
current stage, the important blocker or result, the next command, and any required yes/no
prompt.

## Writing State

State lives in `.openai-codex-hackathon-state.json` in the participant's project root.
Edit it directly (a small JSON file edit is fine). Keep these rules:

- Keep the file small and V2-shaped (see `docs/state-model.md`): local progress,
  light personalization, and local document paths only. Do not persist Devpost-owned data
  (registration, official dates, submitted status) — read that live from the `devpost`
  MCP server each turn.
- Write only when state actually changes on this turn. Turns that just read, recap, or
  answer a question should not write state.
- Preserve existing fields you are not changing; never reset progress the participant has
  already made.

## Journey Stepper

Call `show_hackathon_stepper` once per response, before composing the text, on any turn
that moves the participant into a new step of the sequence. Pass the `active_step` for the
current stage:

| Stage / command       | `active_step` |
| --------------------- | ------------- |
| `$start-hackathon`    | `register`    |
| `$review`       | `review`      |
| `$resources`          | `resources`   |
| `$prepare-submission` | `prepare`     |
| `$submission`   | `submit`      |

For the optional guided build tool (the `$build-*` commands, which all sit inside the
Resources step), pass `active_step: resources` and also:

- `build_assistant: true`
- `build_step`: the current sub-step from `learning.current_step` — one of `scope`, `prd`,
  `spec`, `checklist`, `build`. For `$build-onboard` (the entry step), pass
  `build_assistant: true` and omit `build_step`.

If the guided build tool is not active, omit `build_assistant` and `build_step` — the
stepper then shows Resources without the sub-stepper.

Use the exact argument names and accepted values from the `show_hackathon_stepper` tool's
own input schema; if the live tool differs from the mapping above, follow the schema and
pass the value that identifies the current stage.
