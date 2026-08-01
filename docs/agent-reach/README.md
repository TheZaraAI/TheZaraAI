# Agent Reach for Claude Code — Starter Guide

**A free starter guide from TheZaraAI.** How to install and validate [Agent Reach](https://github.com/Panniantong/Agent-Reach) for Claude Code, what the research layer does and does not do, and the safe-use boundaries to put around it before you point it at anything.

> **Positioning:** Agent Reach is third-party, MIT-licensed open-source software by [Panniantong](https://github.com/Panniantong/Agent-Reach). It is **internal research infrastructure** that TheZaraAI uses — not a TheZaraAI product, sub-brand, DBA, or separate company. Our commercial offer remains under [TheZaraAI](https://thezaraai.com).

---

## Contents

- [What this repository contains](#what-this-repository-contains)
- [What Agent Reach is (and is not)](#what-agent-reach-is-and-is-not)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Step-by-step walkthrough](#step-by-step-walkthrough)
- [Architecture: where the research layer sits](#architecture-where-the-research-layer-sits)
- [The guide stops at the research layer](#the-guide-stops-at-the-research-layer)
- [Safe and compliant use](#safe-and-compliant-use)
- [Troubleshooting](#troubleshooting)
- [Final checklist](#final-checklist)
- [Publishing this guide with GitHub Pages](#publishing-this-guide-with-github-pages)
- [Where this guide points readers](#where-this-guide-points-readers)
- [Credit, sources, and licence](#credit-sources-and-licence)

---

## What this repository contains

| File | Purpose |
| --- | --- |
| `index.html` | The full guide as a responsive, static, GitHub Pages-ready page |
| `assets/css/styles.css` | Design system — near-black surfaces, warm white text, one electric accent |
| `assets/js/main.js` | Copy buttons, mobile nav, scroll spy, checklist state. No dependencies, no tracking |
| `assets/img/mark.svg` | Original inline SVG mark / favicon |
| `README.md` | This walkthrough |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

No secrets, cookies, tokens, API keys, or credentials are stored anywhere in this repository — and none should be added to a fork.

---

## What Agent Reach is (and is not)

Agent Reach is a **scaffolding CLI**, not a framework. It installs and configures the upstream tools an AI agent needs to read the internet — web readers, transcript tooling, the GitHub CLI, an MCP-based search connector, feed parsing — and registers a `SKILL.md` so the agent knows which tool to reach for. It then reports channel health with a single `agent-reach doctor` command ([project README](https://github.com/Panniantong/Agent-Reach)).

**It is:** a research layer that makes an agent's reading repeatable and citable.

**It is not:** a system. It does not decide which questions are worth asking, which answers to trust, or what should happen next. That design work is still yours — see [The guide stops at the research layer](#the-guide-stops-at-the-research-layer).

We also use a deliberately narrower slice of it than it supports — see [Safe and compliant use](#safe-and-compliant-use).

---

## Prerequisites

- Node.js (for `npx`)
- Python 3.9+ with `pip`
- Git
- Claude Code, installed and authenticated
- Roughly 10 minutes

---

## Quick start

Run these in a normal terminal, in order — not inside a running Claude Code session.

```bash
# 1. Add the Agent Reach skill (choose Claude Code at the prompt)
npx skills add Panniantong/Agent-Reach@agent-reach

# 2. Install the CLI from source
python3 -m pip install "https://github.com/Panniantong/agent-reach/archive/main.zip"

# 3. Detect the environment and install the upstream tools
agent-reach install --env=auto

# 4. Validate every channel
agent-reach doctor

# 5. Restart / open Claude Code so it picks up the new skill
claude
```

---

## Step-by-step walkthrough

### 1. Add the skill

```bash
npx skills add Panniantong/Agent-Reach@agent-reach
```

At the interactive prompt, **select Claude Code**. Select Codex only if you actually use it — every extra target is another config surface to maintain and audit. We selected Claude Code only.

### 2. Install the CLI

```bash
python3 -m pip install "https://github.com/Panniantong/agent-reach/archive/main.zip"
```

The skill files alone do not give you the `agent-reach` command. Keep the quotes around the URL — some shells will otherwise mangle it.

### 3. Run the installer

```bash
agent-reach install --env=auto
```

`--env=auto` detects whether you are on a local machine or a server and installs the upstream dependencies accordingly.

**Read the output before you accept it** — this installs software on your machine. On a shared box or production server, use the project's safer variants first:

```bash
agent-reach install --env=auto --dry-run   # preview, change nothing
agent-reach install --env=auto --safe      # restricted install
```

### 4. Validate with `doctor`

```bash
agent-reach doctor
```

This is the step people skip and then debug for an hour. `doctor` reports every channel's status and how to fix what is broken. Treat it as your acceptance test: the install is not "done" until the channels you intend to use report healthy.

### 5. Restart Claude Code

```bash
claude
```

A session that was already running will never see a skill registered after it started. Quit, reopen, then verify with one low-stakes public request — fetch a public page, read an RSS feed, or open a public GitHub repository — before pointing it at anything that matters.

---

## Architecture: where the research layer sits

```
  ┌────────────────┐   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
  │ Public sources │──▶│  Agent Reach     │──▶│  Verification    │──▶│  Action          │
  │ web · search   │   │  research layer  │   │  second source · │   │  whatever your   │
  │ RSS · GitHub   │   │  (read only)     │   │  human check     │   │  business does   │
  │ YT transcripts │   │  source URL kept │   │                  │   │  with a fact     │
  └────────────────┘   └──────────────────┘   └──────────────────┘   └──────────────────┘
```

| Stage | What happens |
| --- | --- |
| 1. Public sources | Open web pages, RSS/Atom feeds, public GitHub repositories, YouTube transcripts, platform-approved APIs |
| 2. Agent Reach research | The agent reads and summarises those sources on request, keeping the source URL alongside every claim |
| 3. Verification | A human or a second source confirms the claim is accurate and current before anyone relies on it |
| 4. Action | Whatever your business actually does with a verified fact — reviewed by a person who is accountable for the decision |

**The rule:** nothing moves from stage 2 to stage 4 without a source URL, a verification check, and a named human who reviewed it.

This diagram is deliberately generic. What sits inside "verification" and "action" is specific to the
business doing it, and designing that is the work this guide does not cover.

---

## The guide stops at the research layer

Everything above is infrastructure. Getting it installed and healthy is a real milestone — and it is
also the point at which the interesting problems start.

**What you have after five commands.** An agent that can read public sources on request and keep a
source URL next to every claim. Reproducible, citable research instead of ad hoc searching. That is
genuinely useful, and for a lot of people it is enough. If that is you, take the install, take the
safe-use rules, and go.

**What you do not have.** A system. A research layer answers questions you already knew to ask. It
does not decide which questions are worth asking, which answers to trust, or what should happen
next. That gap is not a tooling problem, and no install sequence closes it.

### The design work that sits on top

Turning a research layer into something a business can depend on means deciding, deliberately and in
this order: which market you are serving, how you qualify inside it, which sources you are willing to
trust, how claims get validated, how records are scored, how they are enriched, how they hand off to
the systems your team already uses, how outreach is orchestrated and reviewed, how any of it is
measured, and who is accountable when it is wrong.

Each of those is a design decision with real consequences, and each one is specific to the business
making it. There is no generic answer worth publishing — which is why this guide does not pretend to
have one. That layer is what TheZaraAI designs with clients; it is not published here.

> **Read this as a starter guide.** This is a starter guide to a third-party open-source tool. It is
> not a complete go-to-market workflow, and it is not TheZaraAI's client methodology. What is
> published here is the part that is genuinely reusable by anyone.

---

## Safe and compliant use

Agent Reach supports more channels than we use. Restricting ourselves is our choice, not a limitation of the tool.

### What we use it for

- Public web pages and general web search
- RSS and Atom feeds
- Public GitHub repositories, issues, and code search
- YouTube transcripts of publicly available videos
- Official, platform-approved APIs and tools, within their terms and rate limits
- Published company material: docs, changelogs, pricing pages, job posts, press releases

### What we do not do

- Export browser cookies or reuse session tokens to impersonate a logged-in user
- Work around login walls, paywalls, or rate limits
- Bypass or disable any platform control, CAPTCHA, or access restriction
- Collect from authenticated X, LinkedIn, Instagram, or Reddit sessions
- Collect personal data beyond what a legitimate business purpose requires
- Ignore `robots.txt`, terms of service, or a platform's stated automation policy

### Non-negotiables

- Never commit credentials, cookies, tokens, or API keys to a repository.
- Respect privacy law — GDPR, CCPA, CAN-SPAM, and local equivalents. Keep a lawful basis, honour deletion and opt-out requests, keep suppression lists current.
- Rate-limit yourself. Polite, low-volume reading is more defensible and less likely to break.
- Review the tool's own scope before extending it. Enabling a channel is a decision with legal and account consequences, not a config toggle.

---

## Troubleshooting

<details>
<summary><strong><code>agent-reach: command not found</code></strong></summary>

The package installed but the executable is not on your `PATH`.

```bash
# Does the module exist even though the shim is missing?
python3 -m agent_reach --help

# Where does pip put user scripts?
python3 -m site --user-base

# macOS / Linux — append to ~/.zshrc or ~/.bashrc
export PATH="$(python3 -m site --user-base)/bin:$PATH"

# Reload the shell config
source ~/.zshrc
```

On Windows the equivalent directory is `%APPDATA%\Python\Python3x\Scripts`. Open a new terminal after changing `PATH`.
</details>

<details>
<summary><strong>Python or pip refuses to install</strong></summary>

Modern Python distributions mark the system environment as externally managed and block direct installs. Do not force it with `--break-system-packages`.

```bash
# Confirm you are on Python 3.9+ and have pip
python3 --version
python3 -m pip --version

# Option A — isolated virtual environment (recommended)
python3 -m venv ~/.venvs/agent-reach
source ~/.venvs/agent-reach/bin/activate
python3 -m pip install "https://github.com/Panniantong/agent-reach/archive/main.zip"

# Option B — per-user install
python3 -m pip install --user "https://github.com/Panniantong/agent-reach/archive/main.zip"

# If pip itself is stale
python3 -m pip install --upgrade pip
```

With a virtual environment, `agent-reach` only exists while that environment is active. `pipx` is a good alternative for a globally available command with an isolated environment.
</details>

<details>
<summary><strong>Claude Code does not see the skill</strong></summary>

Skills load at session start. Fully exit the running session, then:

```bash
claude
```

Still missing? Re-run `npx skills add Panniantong/Agent-Reach@agent-reach` and confirm you selected **Claude Code** at the prompt — it is easy to skip past. Then check that an Agent Reach skill file exists in your Claude Code skills directory before debugging anything else.
</details>

<details>
<summary><strong>A channel reports unhealthy in <code>doctor</code></strong></summary>

```bash
agent-reach doctor
```

`doctor` is the source of truth: it names the channel, its status, and the fix. Most failures are a missing upstream binary — re-running `agent-reach install --env=auto` resolves them. If a channel requires an authenticated session, leave it unconfigured unless you have an approved, terms-compliant path to that data. A red line for a channel you deliberately do not use is a correct result, not a failure.
</details>

---

## Final checklist

- [ ] Skill added with `npx skills add Panniantong/Agent-Reach@agent-reach`, Claude Code selected at the prompt
- [ ] CLI installed via `python3 -m pip install "https://github.com/Panniantong/agent-reach/archive/main.zip"`
- [ ] `agent-reach install --env=auto` completed and its output reviewed
- [ ] `agent-reach doctor` run; every channel you intend to use reports healthy
- [ ] Claude Code restarted with `claude` and verified on one low-stakes public request
- [ ] Scope agreed in writing: public web, search, RSS, GitHub, YouTube transcripts, approved APIs only
- [ ] No cookies, tokens, credentials, or session data in the repository or shared anywhere
- [ ] Scope defined before any research runs — you know what you are asking and why
- [ ] Verification step defined, with a source URL on every claim
- [ ] Human review sits between research output and anything that gets sent
- [ ] Suppression lists, opt-out handling, and privacy obligations confirmed current
- [ ] Success measured on the quality of what you act on, not the volume collected

---

## Publishing this guide with GitHub Pages

This guide is a plain static bundle — no build step, no backend, no dependencies. All asset paths are relative, so it works from a repository subpath as well as the site root.

**Option A — publish from a subfolder of an existing repository**

1. Copy this folder into the repository, e.g. `docs/agent-reach/`.
2. Commit and push to your default branch.
3. In the repository: **Settings → Pages → Build and deployment → Deploy from a branch**, select your branch and the `/docs` folder.
4. The guide is served at `https://<user>.github.io/<repo>/agent-reach/`.

**Option B — publish the repository root**

1. Copy the files to the repository root.
2. **Settings → Pages → Deploy from a branch**, select your branch and `/ (root)`.
3. The guide is served at `https://<user>.github.io/<repo>/`.

Keep the `.nojekyll` file so GitHub Pages serves everything as-is. Verify after deploy that the stylesheet, script, and favicon all load, and that the in-page anchors still work at whatever subpath you chose.

---

## Where this guide points readers

The guide is free and gated behind nothing — no email, no signup, no form. Everything in it is reproducible without contacting TheZaraAI at all. Two optional calls to action sit alongside that content, one in the hero and one as a closing section before the credits.

| CTA | Destination | Who it is for |
| --- | --- | --- |
| Build your research-to-revenue system | `https://calendly.com/thezaraai/discovery-call` | Teams who have the research layer running and now need the system designed around it. A working session, not a pitch. |
| Get the free AI Field Manual | `https://thezaraai.com/#handbook` | Lower-intent readers who would rather receive a written resource by email than talk to anyone. |

Both in-guide links carry UTM parameters so guide traffic stays attributable:

```
?utm_source=github&utm_medium=agent_reach_guide&utm_campaign=agent_reach_guide   # the call
?utm_source=github&utm_medium=agent_reach_guide&utm_campaign=agent_reach_guide   # the Field Manual
```

Rules that keep the funnel honest, and that a fork should keep:

- **No email capture on GitHub Pages.** There is no form, no embedded iframe, and no third-party script in this bundle. Email collection happens only on TheZaraAI behind its existing protected form, which is why the Field Manual is a deep link rather than an inline signup.
- **No tracking scripts.** `assets/js/main.js` still makes zero network calls. Attribution comes from UTM parameters on outbound clicks, nothing else.
- **No guaranteed outcomes.** The call is described as free, fifteen minutes, and no obligation. It does not promise leads, meetings, or revenue, and neither should any edit to it.
- **The educational content comes first.** CTAs were added around the guide, not into it. No compliance rule, source credit, or safety warning was shortened to make room.

---

## Credit, sources, and licence

- **Agent Reach** — created by Panniantong, MIT licensed: <https://github.com/Panniantong/Agent-Reach>
- **TheZaraAI** — <https://thezaraai.com>

This guide documents a public install and the guardrails around it. It is not affiliated with, or endorsed by, the Agent Reach project. Guide content © TheZaraAI; Agent Reach remains the property of its authors under the MIT licence. Nothing here is legal advice — confirm your own obligations before collecting or contacting.
