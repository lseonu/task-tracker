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
$HOME/.codex/plugins/cache/local-plugins/devpost-hackathon-desktop/0.1.0
```

## Primary Interface

Chat is the primary participant interface. This is the Codex Desktop plugin, so normal main-step responses should include the configured inline stepper PNG when that asset exists. Do not tell the participant to open a localhost page during normal operation.

Every command should:

1. Read the required references and local state.
2. Perform its workflow-specific state or document updates.
3. Run the response composer.
4. Use the composer output as the participant-facing response.

The composer prints Markdown to stdout:

```bash
node "$HOME/.codex/plugins/cache/local-plugins/devpost-hackathon-desktop/0.1.0/scripts/compose-response.mjs" --page resources
```

Do not attempt to detect or switch to CLI mode here; the CLI experience lives in the separate `devpost-hackathon-cli` plugin.

The composer reads main-step PNG paths from `config/hackathon.json` under `assets.main_stepper_images` and learning-step PNG paths under `assets.learning_stepper_images`. If the PNG for the current step is missing, the composer omits the image instead of generating a placeholder.

If composer generation fails, provide a compact text fallback with:

- current stage
- important blocker or result
- next command
- any required yes/no prompt

Do not fall back to localhost page instructions.
