# Inline Chat Presentation Pivot

## Current Decision

The prototype now ships as two separate installable Codex plugin packages from one repo:

- `plugins/devpost-hackathon-desktop`
- `plugins/devpost-hackathon-cli`

This is deliberate. The team is still learning what OpenAI wants for the hackathon and what Devpost wants long-term, so the repo optimizes for easy inspection and testing rather than a perfect shared abstraction.

## Product Contract

Chat is the primary participant surface.

The old localhost side-pane HTML flow is removed from the normal plugin packages. Skills should not ask participants to open a generated local page, watch a side pane, or choose whether they are in Desktop or CLI.

Desktop:

- Uses the same command sequence as CLI.
- Emits normal Markdown responses in the main chat body.
- References a configured main-step PNG at the start of each main command when that PNG exists.
- Does not generate branded stepper SVGs.
- References a configured secondary learning-path PNG at the start of each learning command when that PNG exists.
- Falls back to text progress when images are disabled or missing.

CLI:

- Uses the same command sequence as Desktop.
- Emits text-only Markdown.
- Uses ASCII progress for the main flow and the optional learning path.
- Never emits Markdown image syntax.

## Main Visual Slots

The current art-team assets include one light-mode PNG per top-level step:

- `start.png`
- `rules.png`
- `resources.png`
- `prepare.png`
- `check.png`

The Desktop package expects those files at:

```text
plugins/devpost-hackathon-desktop/assets/steppers/main-light/
```

The paths are configured in:

```text
plugins/devpost-hackathon-desktop/config/hackathon.json
```

The current art-team assets also include one light-mode secondary PNG per learning step:

- `onboard.png`
- `scope.png`
- `prd.png`
- `spec.png`
- `checklist.png`
- `build.png`
- `return.png`

Those files live at:

```text
plugins/devpost-hackathon-desktop/assets/steppers/learning-light/
```

If `assets.progress_images_enabled` is `false`, or if a configured PNG is missing, the Desktop composer uses text progress rather than failing or creating a placeholder. This keeps the prototype easy to switch back to a text-only presentation if the images do not survive QA.

## State Boundary

Both plugins share the same workflow state file:

```text
.openai-codex-hackathon-state.json
```

State tracks participant progress, registration flags, project metadata, learning progress, submission metadata, deadlines, and the next command. It does not track Desktop/CLI mode or whether images are supported.

If a participant switches between Codex Desktop and Codex CLI in the same project folder, both plugins should continue from the same state.

## Composer Contract

Desktop composer:

```bash
node plugins/devpost-hackathon-desktop/scripts/compose-response.mjs --page start
```

CLI composer:

```bash
node plugins/devpost-hackathon-cli/scripts/compose-response.mjs --page start
```

Both composers read package-local config and content. They also read participant-local state from the active project folder.

Final-check scan output lives at:

```text
.openai-codex-hackathon/submission-security-scan.json
```

## Branding Guidance

Do not put Devpost and OpenAI into a single co-branded headline treatment.

For visual assets, the event should remain primary. If Devpost attribution is needed, use a secondary placement such as "Powered by Devpost" after design approval.

## QA Acceptance

- No normal skill response mentions localhost.
- No normal skill response says an HTML artifact was regenerated.
- Desktop output includes image Markdown only when a configured PNG exists.
- CLI output contains no Markdown image syntax.
- Both plugin manifests parse as valid JSON.
- Both composers run for every configured page.
- Root repo remains a marketplace/docs workspace, not a third plugin package.
