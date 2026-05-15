# Devpost Team Onboarding

## Purpose

This plugin is meant to be forked or configured for a specific Devpost-hosted hackathon. The current repo is set up for an OpenAI Codex Hackathon demo, but event owners should treat all event metadata, official URLs, dates, rules, resources, and submission requirements as launch configuration.

## Current URL Caveat

`config/hackathon.json` currently uses:

```json
"landing_page": "https://openai.devpost.com/",
"submission_page": "https://openai.devpost.com/"
```

That URL is real, but as of May 15, 2026 it resolves publicly to the ended **OpenAI Open Model Hackathon** page, not verified final Codex Hackathon copy. Before any customer or public launch, replace these URLs with the exact live Devpost event URL for the target hackathon.

## Configuration Files

Update these files for a new vendor or customer event:

- `config/hackathon.json`: event identity, official URLs, deadline display, asset paths, and Markdown content paths.
- `content/steps/start.md`: welcome, registration handoff, and high-level flow.
- `content/steps/rules.md`: eligibility, deadlines, requirements, judging, and official disclaimers.
- `content/steps/resources.md`: event resources, examples, guidance, and optional learning-path explanation.
- `content/steps/prepare.md`: Devpost submission-prep guidance.
- `content/steps/check.md`: final review and handoff guidance.
- `content/steps/map.md`: recovery-page copy.
- `content/learning/*.md`: optional guided planning copy.
- `assets/logos/`: official Devpost logo variants.
- `assets/banners/`: event-specific banner art.

The generated HTML pages do not show maintainer notes to participants. Copy owners should use this document and the maintainer-only comments inside the Markdown files to find the right source file quickly during QA.

## Minimum Event Data

Before launch, confirm:

- Event display name.
- Devpost landing page URL.
- Devpost submission page URL, if different.
- Official resources URL, if one exists.
- Registration or participation requirements.
- Eligibility rules.
- Submission deadline and timezone.
- Judging criteria.
- Required submission fields.
- Demo video, repo, screenshot, and public URL expectations.
- Hackathon manager or support contact.
- Sponsor/customer-specific language.

## Vendor Setup Pattern

For a future customer hackathon:

1. Copy or fork this plugin repo.
2. Update `config/hackathon.json`.
3. Replace Markdown copy under `content/steps/` and `content/learning/`.
4. Replace banner art in `assets/banners/`.
5. Keep the Devpost logo files in `assets/logos/` unless brand guidance changes.
6. Run `node "$HOME/.codex/plugins/cache/local-plugins/openai-codex-hackathon/0.1.0/scripts/render-artifacts.mjs" --all`.
7. Serve the repo locally with `python3 -m http.server 8787`.
8. Preview generated pages under `http://localhost:8787/artifacts/generated/`.
9. Run `node "$HOME/.codex/plugins/cache/local-plugins/openai-codex-hackathon/0.1.0/scripts/submission-security-scan.mjs"`.
10. QA the plugin commands in a fresh Codex Desktop chat.

## What Should Stay Generic

Do not hardcode one customer’s facts into skill instructions when the same value can live in config or Markdown.

Keep these generic:

- Skill command behavior.
- Artifact renderer logic.
- Shared CSS and layout.
- State-file shape.
- Security scanner.
- Future MCP integration notes.

Put event-specific content here instead:

- `config/hackathon.json` for short structured values.
- Markdown files for page copy.
- `assets/` for images and logos.

## Devpost MCP Future

The long-term version should not rely on manually copied event metadata forever. A future Devpost MCP can supply official event data, registration state, team identity, rules, submission requirements, and draft readiness.

Until that exists, this repo’s config and Markdown files are the source of truth for a configured plugin package.
