# Devpost Hackathons — Setup

This plugin bundles one MCP server, `devpost` (`https://devpost.com/mcp`), which supplies
official event data: overview, key dates, rules, submission requirements, and judging
criteria.

## Server registration

Current Codex registers bundled MCP servers automatically when the plugin is installed — no
action needed.

If you are on an older Codex that does not auto-register bundled servers, or the server was
disabled, add it once:

```
codex mcp add devpost --url https://devpost.com/mcp
```

Then restart Codex.

## Note for skill authors

Server setup is a one-time, human-facing concern and lives here on purpose. Skills must not
walk a participant through registration, re-authentication, or restarts during a normal turn —
see **Devpost MCP Server** in `skills/PLUGIN_RUNTIME.md` for the degrade-don't-troubleshoot
contract.
