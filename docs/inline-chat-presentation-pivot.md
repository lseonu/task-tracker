# Inline Chat Presentation Pivot

## Current Decision

The prototype now ships as one installable Codex plugin package:

- `plugins/devpost-hackathons`

It is text-first: it renders a rich multi-line text "dashboard" in any Codex host. Rich inline visuals come from the bundled Devpost MCP stepper widget (server `devpost` at `https://devpost.com/mcp`) on hosts that can render them. The team is still learning what OpenAI wants for the hackathon and what Devpost wants long-term, so the repo optimizes for easy inspection and testing.

## Product Contract

Chat is the primary participant surface.

The old localhost side-pane HTML flow is removed from the plugin. Skills should not ask participants to open a generated local page, watch a side pane, or choose whether they are in Desktop or CLI.

The plugin behaves the same everywhere:

- One command sequence across all hosts.
- The composer emits a text-first dashboard: a rich multi-line text progress view in the main chat body.
- It never emits Markdown image syntax.

## Rich Inline Visuals

The plugin does not generate or ship per-step images. The text dashboard is always rendered by the composer and stays readable in both light and dark Codex themes.

On hosts that can render them (Codex Desktop / ChatGPT), rich inline visuals come from the bundled Devpost MCP server (server `devpost` at `https://devpost.com/mcp`) and its stepper widget. The CLI and other non-widget hosts always show the text dashboard.

## State Boundary

The plugin uses one workflow state file:

```text
.openai-codex-hackathon-state.json
```

State tracks participant progress, registration flags, project metadata, learning progress, submission metadata, deadlines, and the next command. It does not track host type or whether widgets are supported.

If a participant switches between Codex Desktop and Codex CLI in the same project folder, the plugin should continue from the same state.

## Composer Contract

```bash
node plugins/devpost-hackathons/scripts/compose-response.mjs --page start
```

The composer reads package config and content. It also reads participant-local state from the active project folder.

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
- Composer output contains no Markdown image syntax on any host.
- Rich inline visuals appear via the bundled Devpost MCP stepper widget on capable hosts.
- The plugin manifest parses as valid JSON.
- The composer runs for every configured page.
- Root repo remains a marketplace/docs workspace, not a plugin package.
