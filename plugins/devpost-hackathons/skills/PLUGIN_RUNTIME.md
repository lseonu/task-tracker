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
$HOME/.codex/plugins/cache/local-plugins/devpost-hackathons/0.1.0
```

## Primary Interface

Chat is the primary participant interface. Compose responses text-first so they render in any Codex host (terminal or desktop). Rich inline visuals are supplied by the bundled `devpost` MCP server (e.g. its stepper widget) on hosts that can render them; the composer's text dashboard is the universal fallback and must always stand on its own. Do not tell the participant to open a localhost page during normal operation.

Every command should:

1. Read the required references and local state.
2. Perform its workflow-specific state or document updates.
3. Run the response composer.
4. Use the composer output as the participant-facing response.

The composer output includes the exact next skill invocation when another plugin command should run. If you add any workflow-specific note after the composer output, repeat that exact invocation as the final line in this form:

```text
Type this next: `$command-name`.
```

The composer prints Markdown to stdout:

```bash
node "$HOME/.codex/plugins/cache/local-plugins/devpost-hackathons/0.1.0/scripts/compose-response.mjs" --page resources
```

Do not generate or embed images in the response. When connected, the `devpost` MCP server renders any rich visuals (such as its progress/stepper widget) inline on capable hosts; the composer output stays text-only.

If composer generation fails, provide a compact text fallback with:

- current stage
- important blocker or result
- next command
- any required yes/no prompt

Do not fall back to localhost page instructions.
