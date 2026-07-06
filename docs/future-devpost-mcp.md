# Devpost MCP

The Devpost MCP is now implemented and bundled with this plugin. It is the source of truth for official event data and supplies the inline stepper widget on hosts that can render it. `config/hackathon.json` and the Markdown content files remain the local fallback when the server is unavailable.

## What's Bundled

The plugin ships a plugin-root `.mcp.json` declaring the remote Devpost MCP server. It is referenced by `"mcpServers": "./.mcp.json"` in `.codex-plugin/plugin.json`.

- MCP server id: `devpost`
- Endpoint: `https://devpost.com/mcp`
- Transport: remote streamable HTTP
- Scopes: `mcp:read`, `mcp:write`

As seen by Codex, the tools are namespaced `mcp__devpost__<tool>` (for example `mcp__devpost__get_hackathon_overview`).

## How It's Wired

`.mcp.json` at the plugin root declares the `devpost` server at `https://devpost.com/mcp` over remote streamable HTTP, with scopes `mcp:read` and `mcp:write`. The manifest at `.codex-plugin/plugin.json` points to it with the relative path `"mcpServers": "./.mcp.json"`. On hosts that auto-register bundled servers, no manual step is needed.

## Tools

Public read tools (no auth required):

- `get_hackathon_overview`
- `get_key_dates`
- `get_prizes`
- `get_judging_criteria`
- `get_submission_requirements`
- `get_hackathon_rules`
- `get_announcements`

Auth-required tools (OAuth / Bearer JWT; verified live against prod 2026-07-06):

- `whoami`
- `list_hackathons` — hackathons the user is registered for or submitted to
- `list_open_hackathons` — open/upcoming Devpost-managed hackathons (up to 15)
- `list_my_projects`
- `get_project`
- `get_registration_form`
- `register_for_hackathon`
- `create_project`
- `update_project`
- `upload_project_thumbnail` / `prepare_thumbnail_upload`
- `submit_project`

There is no `search_hackathons` tool — discovery is the two list tools above, with any keyword filtering done by the model in-context.

## Auth Model

Auth is OAuth via discovery. Public read tools work with no auth. A protected call returns a 401, which triggers a browser-based OAuth flow; the participant authenticates through the MCP/Codex flow rather than pasting tokens into chat. Scopes are `mcp:read` and `mcp:write`. Tokens should stay out of plugin config, local state files, generated files, and model-visible logs.

## Local Fallback

If a host does not auto-register the bundled server, add it manually:

```bash
codex mcp add devpost --url https://devpost.com/mcp
```

When the MCP server is unavailable entirely, the plugin keeps using `config/hackathon.json`, the Markdown content files, local state, and the text dashboard. The plugin stays forkable and useful without Devpost credentials.

## OpenAI Docs Notes

- [Codex plugin structure](https://developers.openai.com/codex/plugins/build#plugin-structure): a Codex plugin has `.codex-plugin/plugin.json`; optional plugin-root files and folders include `skills/`, `assets/`, `.app.json`, `.mcp.json`, and `hooks/`. The manifest can point to `mcpServers`.
- [Codex plugin path rules](https://developers.openai.com/codex/plugins/build#path-rules): plugin manifest paths should be relative to the plugin root and start with `./`. This plugin follows that convention with `"mcpServers": "./.mcp.json"`.
- [Codex config reference](https://developers.openai.com/codex/config-reference#configtoml): Codex supports MCP server configuration, including HTTP server URLs, bearer-token environment variables, custom headers, OAuth scopes, OAuth resource hints, enabled/disabled tools, timeouts, and whether an MCP server is required.
- [Apps SDK review guidance](https://developers.openai.com/apps-sdk/deploy/submission#app-review--approval-faqs): authenticated MCP/app integrations should expose only necessary fields, avoid unnecessary PII or secrets in tool responses, and label tool behavior accurately. This is Apps SDK guidance, but the same safety posture applies to the bundled Devpost MCP.

## State And Response Integration

The MCP should not replace the response composer. It should feed it.

`config/hackathon.json` should continue to define local defaults, copy paths, and asset paths. When MCP data exists, the composer and skills can prefer MCP-derived event data for official dates, rules, registration status, team status, and submission requirements.

`.openai-codex-hackathon-state.json` should cache only small derived values:

- event id
- MCP connected/authenticated status
- registration status
- team id or team status
- submission status
- last checked timestamp
- local document paths

Do not store access tokens, full participant profiles, full team records, or full submission payloads in local state.

## Skill Integration

- `$start-hackathon`: detect whether the Devpost MCP is available and authenticated; show registration status if available; otherwise keep browser/manual registration fallback.
- `$review`: pull official rules, eligibility, judging criteria, and submission requirements from Devpost when possible.
- `$resources`: pull official event resources and links when possible.
- `$prepare-submission`: compare local draft materials against the official Devpost submission fields.
- `$submission`: combine local security/readiness checks with Devpost-side validation, then submit via `submit_project` after explicit participant confirmation (browser handoff as fallback).
- `$hackathon-map`: show live registration, team, and submission status when the MCP is connected.

## Remaining Work

The bundling is done. The remaining work is on the skills and write side:

1. Update skills to prefer MCP reads while preserving manual/browser fallback.
2. QA no-auth, auth-expired, unregistered, registered, no-team, team, no-draft, draft, submitted, and deadline-passed states.
3. Final submission via `submit_project` is now wired into `$submission` behind an explicit "yes, submit" confirmation, with the browser handoff as fallback. It still needs human QA and product/legal sign-off before a production event.

## Open Questions

- Should `$prepare-submission` also sync drafts to Devpost via `create_project`/`update_project`, or should writes stay confined to `$submission`?
- What rate limits and caching rules should the plugin follow?
- Which registration/team/submission fields are safe and useful for Codex to read once authenticated tools land?
