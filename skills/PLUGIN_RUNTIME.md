# Plugin Runtime Rule

The participant's current working directory is their project folder, not this plugin bundle.

Do not assume these plugin files exist in the participant project:

- `scripts/render-artifacts.mjs`
- `scripts/submission-security-scan.mjs`
- `config/hackathon.json`
- `content/`
- `assets/`
- `artifacts/templates/`

When running plugin scripts, run them from the installed plugin bundle root. The plugin bundle root is the directory that contains `.codex-plugin/plugin.json`, `skills/`, `scripts/`, `config/`, `content/`, `assets/`, and `artifacts/`.

For this local installed plugin, the bundle root is usually:

```text
$HOME/.codex/plugins/cache/local-plugins/openai-codex-hackathon/0.1.0
```

Use an absolute script path, for example:

```bash
node "$HOME/.codex/plugins/cache/local-plugins/openai-codex-hackathon/0.1.0/scripts/render-artifacts.mjs" --page resources
```

The renderer writes generated HTML into the participant project at `artifacts/generated/` and copies required CSS/assets into `.openai-codex-hackathon/`.

If artifact generation fails because `scripts/render-artifacts.mjs` is missing from the participant project, that is a skill bug. Retry with the absolute plugin-bundle script path instead of falling back immediately.
