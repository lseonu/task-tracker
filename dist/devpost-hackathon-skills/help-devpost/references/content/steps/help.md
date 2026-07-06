# 👋 Welcome to the {{event.name}} guide

This plugin turns Codex into your hackathon copilot — right here in chat, right in your project folder. It walks you from "just registered" to "ready to submit" without you having to keep track of anything.

## The big idea

**First, pick your hackathon.** Type `$find-hackathon` to see what's open on Devpost, browse events you can submit to, or confirm one you already have in mind. Everything else happens inside the event you choose.

From there, the hackathon is a journey of five steps, and each step is a command you type in chat:

| Step | Command | What it does |
| --- | --- | --- |
| 1. Start | `$start-hackathon` | Kick things off and set up local progress tracking. |
| 2. Rules | `$review` | Walk through the rules so nothing disqualifies you later. |
| 3. Resources | `$resources` | Get build resources, links, and anti-pattern advice. |
| 4. Prepare | `$prepare-submission` | Draft your Devpost submission as a local file. |
| 5. Submit | `$submission` | Run the final preflight, then submit to Devpost — with your confirmation. |

## Want more structure while you build?

Inside the Resources step there's an optional guided build track that takes you from rough idea to working project, one document at a time:

`$build-onboard` → `$build-scope` → `$build-prd` → `$build-spec` → `$build-checklist` → `$build-project`

Totally optional — skip it if you already know what you're building.

## Lost? There's a compass 🧭

`$hackathon-map` shows where you are, what you've finished, and what to do next. Use it any time you switch chats or lose the thread.

## Good to know

- Your progress lives in one small local file in this folder — nothing leaves your machine.
- Codex never submits without asking. At the end, `$submission` can submit for you — after showing exactly what will be sent and getting your explicit "yes, submit" — or you can finish in the browser instead.
- New here? Type `$find-hackathon` to pick your hackathon — the guide takes it from there.
<!-- Copy maintainers: edit this page copy in content/steps/help.md. The command list is
reconciled against the installed skills at runtime (see skills/help/SKILL.md, "Live Command
Inventory"): commands added to the plugin appear even if this page lags, and removed ones are
dropped. Keep this page's copy in sync anyway — it provides the tone and descriptions. -->
