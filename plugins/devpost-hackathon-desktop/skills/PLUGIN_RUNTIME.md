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

Chat is the primary participant interface. This is the Codex Desktop plugin, so responses may include a generated inline progress SVG. Do not tell the participant to open a localhost page during normal operation.

Every command should:

1. Read the required references and local state.
2. Perform its workflow-specific state or document updates.
3. Run the response composer.
4. Use the composer output as the participant-facing response.

The composer output includes the exact next skill invocation when another plugin command should run. In the Desktop plugin this should be visually scannable, preferably as a short Markdown blockquote callout. If you add any workflow-specific note after the composer output, repeat that exact invocation as the final callout in this form:

```text
> **Next command**
> Type `$command-name`
```

The composer prints Markdown to stdout:

```bash
node "$HOME/.codex/plugins/cache/local-plugins/devpost-hackathon-desktop/0.1.0/scripts/compose-response.mjs" --page resources
```

Do not attempt to detect or switch to CLI mode here; the CLI experience lives in the separate `devpost-hackathon-cli` plugin.

The composer generates progress SVGs from workflow state and writes them under `.openai-codex-hackathon/progress/` in the participant project. If `assets.progress_images_enabled` is `false`, or SVG generation fails, the composer uses text progress instead of an image.

If composer generation fails, provide a compact text fallback with:

- current stage
- important blocker or result
- next command
- any required yes/no prompt

Do not fall back to localhost page instructions.
