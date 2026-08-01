# Agent Reach for Claude Code — Install &amp; Validation Guide

**A TheZaraAI build log.** How we installed and validated [Agent Reach](https://github.com/Panniantong/Agent-Reach) for Claude Code, what we use it for, and the guardrails we put around it before a single record reaches an outreach campaign.

> **Positioning:** Agent Reach is third-party, MIT-licensed open-source software by [Panniantong](https://github.com/Panniantong/Agent-Reach). It is **internal research infrastructure** that TheZaraAI uses — not a TheZaraAI product, sub-brand, DBA, or separate company. Our commercial offer remains under [TheZaraAI](https://thezaraai.com), with HVAC and selected construction firms as the initial vertical.

---

## Contents

- [What this repository contains](#what-this-repository-contains)
- [What Agent Reach is (and is not)](#what-agent-reach-is-and-is-not)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Step-by-step walkthrough](#step-by-step-walkthrough)
- [Architecture: where the research layer sits](#architecture-where-the-research-layer-sits)
- [Worked example: HVAC and construction](#worked-example-hvac-and-construction)
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
| `LINKEDIN_POST.md` | The ready-to-publish LinkedIn post, its first comment, and the funnel link map |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

No secrets, cookies, tokens, API keys, or credentials are stored anywhere in this repository — and none should be added to a fork.

---

## What Agent Reach is (and is not)

Agent Reach is a **scaffolding CLI**, not a framework. It installs and configures the upstream tools an AI agent needs to read the internet — web readers, transcript tooling, the GitHub CLI, an MCP-based search connector, feed parsing — and registers a `SKILL.md` so the agent knows which tool to reach for. It then reports channel health with a single `agent-reach doctor` command ([project README](https://github.com/Panniantong/Agent-Reach)).

**It is:** a research layer that makes an agent's reading repeatable and citable.

**It is not:** a lead generator. It does not produce qualified leads, book meetings, or create revenue. ICP definition, data validation, compliant enrichment, segmentation, messaging, and human review are all still work you have to do.

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
  ┌────────────────┐   ┌──────────────────┐   ┌───────────────────────┐
  │ Public sources │──▶│  Agent Reach     │──▶│ Validation &          │
  │ web · search   │   │  research layer  │   │ enrichment            │
  │ RSS · GitHub   │   │  (read only)     │   │ dedupe · verify ·     │
  │ YT transcripts │   │                  │   │ approved providers    │
  └────────────────┘   └──────────────────┘   └───────────┬───────────┘
                                                          │
  ┌────────────────┐   ┌──────────────────┐   ┌───────────▼───────────┐
  │  Measurement   │◀──│  Personalised    │◀──│  CRM / Instantly      │
  │ replies ·      │   │  outreach        │   │  validated records    │
  │ meetings ·     │   │  human-reviewed  │   │  with source URLs     │
  │ complaint rate │   │                  │   │                       │
  └────────────────┘   └──────────────────┘   └───────────────────────┘
```

| Stage | What happens |
| --- | --- |
| 1. Public sources | Open web pages, RSS/Atom feeds, public GitHub repositories, YouTube transcripts, platform-approved APIs |
| 2. Agent Reach research | The agent reads and summarises on request, keeping the source URL alongside every claim |
| 3. Validation &amp; enrichment | Deduplicate, verify against a second source, confirm currency, enrich only via compliant licensed providers |
| 4. CRM / Instantly | Only validated records enter the system of record, each with its source and capture date |
| 5. Personalised outreach | Human-reviewed messaging grounded in a verifiable public fact; suppression and opt-out honoured before send |
| 6. Measurement | Reply quality, meetings booked, complaint rate — not volume collected |

**The rule:** no record moves from stage 2 to stage 4 without a source URL, a validation check, and a named human who reviewed it.

---

## Worked example: HVAC and construction

HVAC and selected construction firms are TheZaraAI's initial vertical. Everything below runs on publicly available information and platform-approved APIs. Agent Reach does the reading in stages 1–2 only; it does not touch logged-in social accounts and it does not guarantee leads.

### Sample ICP filters

| Filter | HVAC (residential / light commercial) | Construction (remodel / general contracting) |
| --- | --- | --- |
| Trade &amp; classification | HVAC service, repair, replacement — NAICS 238220 | Residential remodel, GC, roofing, specialty trade — NAICS 236118 / 238xxx |
| Company size | 3–25 field technicians, 2–15 service vehicles | 5–50 employees, owner still involved in estimating |
| Service area | Defined metro or 45-minute drive radius; 3–6 ZIP clusters | Single metro or county footprint; no national coverage |
| Decision maker | Owner/operator, general manager, service manager | Owner, principal, head of preconstruction/estimating |
| Licence status | Active state or county mechanical licence, in good standing | Active contractor licence at the appropriate class and limit |
| Digital maturity | Live site and claimed Google Business Profile, but no online booking or same-day quote path | Site with project gallery, contact form as the only intake |
| Hard exclusions | National franchises and PE roll-ups, out-of-area firms, no verifiable licence or address, anyone on the suppression list, any record whose source URL cannot be re-checked | ← same |

### Compliant discovery sources

- **Google Business Profile** — publicly listed name, category, address, service area, hours, rating, website. Read public listing pages, or use the official Places API under its terms with your own key when you need volume.
- **Company websites** — services, service-area pages, brands installed, team/about pages, careers pages, financing options, stated response times.
- **Public directories and trade associations** — public business directory and BBB listings, member directories such as ACCA, PHCC, NAHB, NARI. Read the public page; do not create accounts to get behind a gate.
- **Permit and licensing records** — state contractor/mechanical licence boards and municipal or county permit portals, **where the data is published for public access and the terms allow automated reading**. Check terms and rate limits first; some sources require a formal records request instead.
- **Public social and business pages** — only what a signed-out visitor can see: a public company page, a public job post, a public YouTube channel and its transcripts. No logged-in sessions, no cookie reuse, no gated profile data.
- **Approved data providers** — licensed B2B data and email-verification vendors under contract, with a documented lawful basis. Used for enrichment after a firm has already passed the ICP filter.

### The workflow

**Stage 1 — Discover.** Ask the agent for firms in the target ZIP clusters, requiring a source URL for every field:

```text
Build a candidate list of independent HVAC and residential construction
firms serving ZIP codes 27601, 27604, 27609, 27612.

Use only publicly accessible sources: public business listings, company
websites, public trade-association directories, and public licence or
permit records where the site's terms allow automated reading.
Do not use logged-in sessions, cookies, or gated profile data.

For each firm return: legal/trading name, website, city, service area,
services offered, apparent headcount signal, licence number if public,
and the exact source URL for every field. Mark anything you inferred
as "inferred" rather than stating it as fact.
```

**Stage 2 — Validate the firm and the decision-maker role.** Two independent public sources must agree before a record advances.

- *Company is active:* licence board record + business registration/Secretary of State filing + live website.
- *Role is real and current:* licence holder or qualifying party on the public licence record, an about/team page, a permit applicant name, or a signed public post from the company page.
- *Still trading:* recent reviews, a recent permit, a current job post, or a dated site update in the last 6–12 months.
- *Reject:* a role that appears in only one unverifiable place, franchise-owned locations, and any record whose source URL no longer resolves.

**Stage 3 — Enrich through approved providers only.** Contact details come from licensed providers under contract, never from harvesting. Every enriched field carries provider, retrieval date, and lawful basis. Verify deliverability, apply suppression and opt-out lists at ingestion, drop anything the provider cannot substantiate.

**Stage 4 — Segment** by service area (ZIP cluster or drive-time band), size band (owner-operator 1–4, small crew 5–15, established 16–50), and trigger signal. No trigger means no personalised angle — the record waits in nurture.

**Stage 5 — Route into Instantly.** Only records that cleared stages 2–3, carry a source URL, and passed human review get uploaded. One campaign per segment, custom fields mapped so personalisation is grounded in the verified fact:

```text
company_name, trade, website, city, state, zip, service_area
size_band, licence_number, licence_status, licence_source_url
contact_first_name, contact_role, role_source_url
email, email_verification_status, enrichment_provider, enrichment_date
trigger_signal, trigger_date, trigger_source_url
segment_id, reviewed_by, reviewed_at, suppression_checked
```

Keep sending volume inside warmed capacity. Treat complaint and bounce rates as hard stops, and pull the campaign — not just the record — if either drifts.

### Trigger signals

| Signal | Public source | Why it matters |
| --- | --- | --- |
| Hiring installers, techs, or estimators | Careers page, public job post | Demand outrunning capacity; intake and scheduling under strain |
| New or upgraded contractor licence class | State licence board record | Moving into larger or different work |
| Rising permit volume, or a first permit in a new municipality | Public permit portal, where lawful to read | Expansion, usually before the back office catches up |
| New location, second yard, fleet expansion | Website, public listing, public company page | Growth spend already committed |
| Reviews mentioning slow quotes or missed callbacks | Public review content | A named, verifiable operational problem |
| No online booking or after-hours intake | Company website | Observable gap; no guessing at internals |
| Seasonal inflection (pre-cooling / pre-heating) | Calendar plus local weather reporting | Timing rather than personalisation |
| New financing, maintenance plan, or service agreement page | Company website | Investing in recurring revenue; open to process change |
| New trade-association membership or certification | Public association directory | Invests in standards — usually a better-fit buyer |

**None of this guarantees leads.** It produces a defensible, source-linked shortlist that matches a defined ICP. Whether that becomes pipeline depends on the offer, the message, the timing, and the humans reviewing it.

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
- [ ] ICP defined before any research runs
- [ ] Validation and enrichment steps defined, with a source URL on every record
- [ ] Human review sits between research output and anything that gets sent
- [ ] Suppression lists, opt-out handling, and privacy obligations confirmed current
- [ ] Success measured on reply quality and meetings, not volume collected

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
| Book a free 15-minute workflow call | `https://calendly.com/thezaraai/discovery-call` | HVAC and construction firms mapping their own lead-response process. A working session, not a pitch. |
| Get the free AI Field Manual | `https://thezaraai.com/#handbook` | Lower-intent readers who would rather receive a written resource by email than talk to anyone. |

Both in-guide links carry UTM parameters so guide traffic stays attributable:

```
?utm_source=github&utm_medium=agent_reach_guide&utm_campaign=home_services   # the call
?utm_source=github&utm_medium=agent_reach_guide&utm_campaign=agent_reach     # the Field Manual
```

Rules that keep the funnel honest, and that a fork should keep:

- **No email capture on GitHub Pages.** There is no form, no embedded iframe, and no third-party script in this bundle. Email collection happens only on TheZaraAI behind its existing protected form, which is why the Field Manual is a deep link rather than an inline signup.
- **No tracking scripts.** `assets/js/main.js` still makes zero network calls. Attribution comes from UTM parameters on outbound clicks, nothing else.
- **No guaranteed outcomes.** The call is described as free, fifteen minutes, and no obligation. It does not promise leads, meetings, or revenue, and neither should any edit to it.
- **The educational content comes first.** CTAs were added around the guide, not into it. No compliance rule, source credit, or safety warning was shortened to make room.

The ready-to-publish LinkedIn post and its first comment live in [`LINKEDIN_POST.md`](LINKEDIN_POST.md), fenced as plain text so line breaks survive copy-paste. That file also records which URL belongs in the post versus the in-guide buttons.

---

## Credit, sources, and licence

- **Agent Reach** — created by Panniantong, MIT licensed: <https://github.com/Panniantong/Agent-Reach>
- **TheZaraAI** — <https://thezaraai.com>

This guide documents one team's install and the guardrails around it. It is not affiliated with, or endorsed by, the Agent Reach project. Guide content © TheZaraAI; Agent Reach remains the property of its authors under the MIT licence. Nothing here is legal advice — confirm your own obligations before collecting or contacting.
