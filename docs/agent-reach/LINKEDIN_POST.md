# LinkedIn post — ready to publish

Copy everything between the rules. Roughly 1,900 characters, which reads as ~8 short blocks on mobile. The hook sits above the "see more" fold.

---

I gave Claude Code the ability to read the open web in about 10 minutes. It did not generate a single lead — and that is the point.

We build AI-assisted outbound at TheZaraAI, currently for HVAC and selected construction firms. Our weakest link was never sending infrastructure. It was research: manual, inconsistent, no traceable source.

So we installed Agent Reach, an open-source CLI by Panniantong that wires up the tools an agent needs to read public sources, then tells you what actually works.

The exact steps:

1. npx skills add Panniantong/Agent-Reach@agent-reach
2. Select Claude Code at the prompt (Codex only if you really use it)
3. python3 -m pip install "https://github.com/Panniantong/agent-reach/archive/main.zip"
4. agent-reach install --env=auto
5. agent-reach doctor
6. Restart Claude Code: claude

Step 5 is the one people skip. "doctor" tells you which channels are healthy and which are not, so you stop guessing.

How we use it, and how we do not:

We use public web and search, RSS, GitHub, YouTube transcripts, company websites, public business listings and directories, and public licence or permit records where the terms allow it.

We do not export cookies, reuse session tokens, get around login walls, or touch authenticated X, LinkedIn, Instagram, or Reddit sessions. Enrichment comes from licensed providers under contract, with a source URL and a review date on every record.

Be honest about what this is. It is research infrastructure, not a lead machine. You still need a defined ICP, validation, compliant enrichment, segmentation, and a human reading the message before it sends. No shortcuts appeared. The inputs just got better and more defensible.

Credit where it is due: Agent Reach is Panniantong's work, MIT licensed. We are users, not authors.

I wrote up the full install, the HVAC and construction workflow, sample ICP filters, trigger signals, and the safety rules as a free guide on GitHub. Link in the comments.

What is your research layer right now, and how do you keep it compliant?

---

## Publishing notes

- **Link placement:** put the GitHub Pages URL in the first comment rather than the post body, then edit it into the post after the first hour if you prefer.
- **First comment:** "Full guide, commands, and the compliance checklist: <YOUR GITHUB PAGES URL> — and the upstream project: https://github.com/Panniantong/Agent-Reach"
- **Alternate hooks** (swap line 1 if you want to A/B):
  - "Five commands gave our AI agent a research layer. It still cannot find you a customer."
  - "The install took 10 minutes. The guardrails took longer — and mattered more."
  - "Everyone is posting the AI scraping demo. Almost nobody posts the compliance rules that go with it."
- **Do not add:** performance claims, reply-rate numbers, or anything implying automated lead generation. There is no data behind those claims and the post loses its credibility the moment it overreaches.
- **Hashtags** (3–5 max, end of post or first comment): #AIAgents #ClaudeCode #Outbound #HVAC #GTM
- **Tag:** the Agent Reach author if you can find the correct profile; otherwise leave the plain-text credit as written rather than tagging the wrong account.
