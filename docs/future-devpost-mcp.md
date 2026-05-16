# Future Devpost MCP

This is an integration memo, not an implementation plan for the current V1 prototype.

For V1, the plugin should keep using `config/hackathon.json`, Markdown content files, local state, chat-native response output, and browser/manual Devpost handoff. A Devpost MCP should become the source of truth only after the authenticated server, transport, scopes, and data model are settled.

## OpenAI Docs Notes

- [Codex plugin structure](https://developers.openai.com/codex/plugins/build#plugin-structure): a Codex plugin has `.codex-plugin/plugin.json`; optional plugin-root files and folders include `skills/`, `assets/`, `.app.json`, `.mcp.json`, and `hooks/`. The manifest can point to `mcpServers`.
- [Codex plugin path rules](https://developers.openai.com/codex/plugins/build#path-rules): plugin manifest paths should be relative to the plugin root and start with `./`. If this plugin later bundles MCP configuration, the manifest path should follow that convention.
- [Codex config reference](https://developers.openai.com/codex/config-reference#configtoml): Codex supports MCP server configuration, including HTTP server URLs, bearer-token environment variables, custom headers, OAuth scopes, OAuth resource hints, enabled/disabled tools, timeouts, and whether an MCP server is required.
- [Apps SDK review guidance](https://developers.openai.com/apps-sdk/deploy/submission#app-review--approval-faqs): authenticated MCP/app integrations should expose only necessary fields, avoid unnecessary PII or secrets in tool responses, and label tool behavior accurately. This is Apps SDK guidance, but the same safety posture is useful for a future Devpost MCP.

## Current Decision

Do not add `.mcp.json` yet.

Do not add `mcpServers` to `.codex-plugin/plugin.json` yet.

Keep this plugin forkable and useful without Devpost credentials. The current event config and Markdown content remain the local fallback even after an MCP exists.

## Likely V1 MCP Shape

The first Devpost MCP should be read-first. It should help Codex know what is true on Devpost without taking public actions on behalf of the participant.

Useful read-only tools:

- `devpost.get_event`: event name, dates, official rules URL, resources URL, submission field requirements, judging criteria, and sponsor/provider metadata.
- `devpost.get_current_user`: minimal authenticated Devpost identity, such as Devpost user id and display name.
- `devpost.get_registration`: whether the current user is registered for the event, plus registration id and eligibility status if available.
- `devpost.get_team`: team name, team id, members, and roles for the event.
- `devpost.get_submission`: draft/submitted status, Devpost project id or URL, and missing required fields if available.
- `devpost.validate_submission`: deadline state, required-field readiness, and remaining Devpost-side blockers.

Possible later write-capable tools:

- `devpost.create_or_update_submission_draft`
- `devpost.attach_submission_asset`
- `devpost.submit_project`

Write tools should not be part of the first integration unless Product, Legal, and Engineering are comfortable with Codex taking those actions. Final submit should require explicit confirmation and should be treated as a public, high-stakes action.

## Auth Model

The likely clean path is Devpost account OAuth with narrow scopes. Codex supports MCP OAuth-related configuration, so the participant should authenticate through the MCP/Codex flow rather than pasting tokens into chat.

If Devpost chooses a bearer-token or internal gateway model instead, Codex supports environment-variable based bearer tokens and headers. Tokens should stay out of plugin config, local state files, generated files, and model-visible logs.

Likely scopes:

- `events:read`
- `registrations:read`
- `teams:read`
- `submissions:read`
- later, possibly `submissions:write`

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
- `$review-rules`: pull official rules, eligibility, judging criteria, and submission requirements from Devpost when possible.
- `$resources`: pull official event resources and links when possible.
- `$prepare-submission`: compare local draft materials against the official Devpost submission fields.
- `$submission-check`: combine local security/readiness checks with Devpost-side validation.
- `$hackathon-map`: show live registration, team, and submission status when the MCP is connected.

## Migration Plan

1. Confirm Devpost MCP transport, auth model, scopes, tool names, and response shapes.
2. Add plugin-root `.mcp.json` only after the exact schema is known.
3. Add a relative `mcpServers` path to `.codex-plugin/plugin.json`.
4. Update skills to prefer MCP reads while preserving manual/browser fallback.
5. QA no-auth, auth-expired, unregistered, registered, no-team, team, no-draft, draft, submitted, and deadline-passed states.
6. Consider write-capable draft sync only after the read-only flow is stable.
7. Consider final submission only with explicit confirmation, clear UX, and product/legal approval.

## Open Questions

- Will Devpost expose the MCP over streamable HTTP, stdio, or an internal gateway?
- What OAuth scopes and review requirements will be required?
- What stable event identifier should this plugin store in config?
- Which registration/team/submission fields are safe and useful for Codex to read?
- Should draft submission sync exist in V1, or should Devpost remain browser-only for writes?
- Should final submit ever be available through Codex?
- What rate limits and caching rules should the plugin follow?
- What exact `.mcp.json` schema should bundled Codex plugins use when this moves from memo to implementation?
