# Plugin Runtime Rule

The participant's current working directory is their project folder, not this plugin bundle.

Do not assume these plugin files exist in the participant project:

- `scripts/compose-response.mjs`
- `scripts/submission-security-scan.mjs`
- `config/hackathon.json`
- `content/`
- `assets/`

When running plugin scripts, run them from the installed plugin bundle root. The plugin bundle root is the directory that contains `.codex-plugin/plugin.json`, `skills/`, `scripts/`, `config/`, `content/`, and `assets/`.

For this local installed plugin, the bundle root is usually:

```text
$HOME/.codex/plugins/cache/devpost-hackathon-prototypes/devpost-hackathons/0.1.0
```

Codex installs plugins at `$HOME/.codex/plugins/cache/<marketplace>/<plugin>/<version>/`,
so the path encodes the marketplace name (`devpost-hackathon-prototypes`) and the
plugin version (`0.1.0` from `.codex-plugin/plugin.json`). If either changes, update
the script paths in these skills to match.

## Primary Interface

Chat is the primary participant interface. Compose responses text-first so they render in any Codex host (terminal or desktop). Rich inline visuals are supplied by the bundled `devpost` MCP server (e.g. its stepper widget) on hosts that can render them; the composer's text dashboard is the universal fallback and must always stand on its own. Do not tell the participant to open a localhost page during normal operation.

Every command should:

1. Read the required references and local state.
2. Perform its workflow-specific state or document updates.
3. Render the journey stepper by calling the `show_hackathon_stepper` MCP tool
   (the bundled `devpost` server — `mcp__devpost__show_hackathon_stepper`) with the
   `active_step` for this stage. This inline widget is the single "you are here"
   progress visual: render it exactly once per response, before the composer output,
   on every step that advances the participant through the sequence. See **Journey
   Stepper** below for the per-stage arguments.
4. Run the response composer.
5. Use the composer output as the participant-facing response.

The composer output includes the exact next skill invocation when another plugin command should run. If you add any workflow-specific note after the composer output, repeat that exact invocation as the final line in this form:

```text
Type this next: `$command-name`.
```

The composer prints Markdown to stdout:

```bash
node "$HOME/.codex/plugins/cache/devpost-hackathon-prototypes/devpost-hackathons/0.1.0/scripts/compose-response.mjs" --page resources
```

Do not generate or embed images in the response. When connected, the `devpost` MCP server renders any rich visuals (such as its progress/stepper widget) inline on capable hosts; the composer output stays text-only.

## Journey Stepper

Call `show_hackathon_stepper` once per response, before composing the text, on any
turn that moves the participant into a new step of the sequence. Pass the
`active_step` for the current stage:

| Stage / command       | `active_step` |
| --------------------- | ------------- |
| `$start-hackathon`    | `register`    |
| `$review-rules`       | `review`      |
| `$resources`          | `resources`   |
| `$prepare-submission` | `prepare`     |
| `$submission-check`   | `submit`      |

For the optional guided build tool (the `$build-*` commands, which all sit inside
the Resources step), pass `active_step: resources` and also:

- `build_assistant: true`
- `build_step`: the current sub-step from `learning.current_step` — one of `scope`,
  `prd`, `spec`, `checklist`, `build`. For `$build-onboard` (the entry step), pass
  `build_assistant: true` and omit `build_step`.

If the guided build tool is not active, omit `build_assistant` and `build_step` — the
stepper then shows Resources without the sub-stepper.

Use the exact argument names and accepted values from the `show_hackathon_stepper`
tool's own input schema; if the live tool differs from the mapping above, follow the
schema and pass the value that identifies the current stage. The stepper widget is
the progress visual — do not also generate a progress image, and the composer output
stays text-only.

If composer generation fails, provide a compact text fallback with:

- current stage
- important blocker or result
- next command
- any required yes/no prompt

Do not fall back to localhost page instructions.
