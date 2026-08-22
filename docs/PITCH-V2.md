# Pitch V2 — "Cable on the Floor"

**Date:** 2026-08-22 · **Source:** 9-agent framing workflow (5 framings × 3 adversarial judges × 1 synthesis)
**Verdict:** 2-of-3 judge consensus (8.6/8.7 weighted; dissenting judge picked "Cut, Then Finish" by 0.2
and explicitly instructed grafting Cable's fixes in). Supersedes the arc in [DECK-PLAN.md](DECK-PLAN.md);
design language and build architecture there still stand.

## The structural insight

**Pull the uplink at ~1:35 — before the drafting — and leave the cable on the floor for the rest of
the pitch.** Every downstream beat (draft, citations, override, no-file-action, human decides, ledger
write) then proves the 30%-weighted local-first criterion *as an ambient condition*, instead of the pull
being one late-arc stunt. The load-bearing sentence — *"That's the exit plan — executing"* — moves from
the moment of the pull to the completion of the first **offline** draft: it lands on resumed real work,
not on a dead cable.

Two falsifiable signals replace our self-authored "UPLINK — none" chip:
1. **A real external ping terminal** beside the UI — green from ~0:45, timing out live at the pull.
2. **The browser address bar showing the box's LAN IP** (10.0.0.166), never localhost.

And the LAN/WAN gotcha gets spoken *by us* at the pull, before any judge can ask it:
*"That's the box's uplink, not the room — this laptop still talks to the box over the LAN."*

## The 13 slides (~440 words, ends ~4:20 of 5:00)

| # | Beat | On screen | Spoken (gist) |
|---|---|---|---|
| 1 | IN-HOUSE — the duty | Act word + only `DORA Art 28(8)` and the phrase `reincorporate them in-house`, tan underline. **No full-bleed excerpt until EUR-Lex-verified.** | The duty exists. **HSBC pre-empt:** "This isn't 'cloud is banned' — HSBC runs primary AML on Google Cloud. That's exactly why the exit duty exists." |
| 2 | A SLIDE — the punchline | Sad PowerPoint mock. Beat of silence. | "Ask a bank what that plan looks like. You'll get a PowerPoint. [beat] We built the artifact instead." |
| 3 | EXITPLAN — the reveal | GB10 box drawing + spec chips (COMPUTE / MODELS / UPLINK). | Runs entirely on this box. This box object returns in slide 11. |
| 4 | QUEUE — **CUT 1 to live product** | 200-row queue. Honesty chip: `200 ALERTS · 99% NOISE · 30 MIN EACH BY HAND · SYNTHETIC DATA`. Ping terminal green; LAN IP visible. | "Two hundred alerts, thirty minutes each by hand — a hundred analyst-hours on one queue." **No dollars, no ROI %, anywhere.** |
| 5 | RULES — screener owns the queue | Row expands (build). Rule, fuzzy match, corridor. | "The model can't invent an alert, and it can't make one disappear." |
| 6 | **UNPLUGGED — the pull, at ~1:35** | Physical pull. Ping starts timing out live. UI keeps moving. Cable stays in frame. | Shared-fear setup → pull → LAN/WAN pre-empt → risk-committee line: "your risk committee's real question is what happens when your vendor goes dark mid-filing." |
| 7 | CITED — real work, offline | Draft assembles **post-pull**, citations to spans. Dead ping in corner. | "…starting now, offline. [draft completes] **That's the exit plan — executing.**" Slowest sentence. Real generation, pre-warmed backup alert, 30s abort cue. |
| 8 | OVERRULED | Red-flag bar stamps the draft. | "The rule wins. The model never overrules the rules." First merge candidate if clock slips. |
| 9 | **NO FILE ACTION** (new) | Agent's action list rendered: `DRAFT · CITE · ESCALATE`. File greyed + `HUMAN ONLY` lock. | "There is no file action behind it. That's not a prompt policy — there's no tool there to call." Architecture-visible; never stage a fake chat refusal. |
| 10 | DECIDE — the human, the unlock | Tan Decide/File buttons, only warm color. Ledger line appends. Ping still dead. | Art 18(3) + reframe: "That constraint isn't what limits this product — it's what lets a regulated bank run it at all." |
| 11 | STACK — **CUT 2 back to deck** | Spec chips reattach to the slide-3 box. Fast, near-zero dwell. | OpenClaw · NemoClaw · OpenShell · MongoDB+bge-m3 · nemotron — event eligibility; never cut to zero. |
| 12 | PAY IT BACK — 200 → 1 | Number-flow counts down 200 → 1. `ONE CITED DRAFT · ONE HUMAN DECISION`. Finanz Informatik as a clause. | "Two hundred alerts in. One cited draft, one human decision, and nothing left the room." |
| 13 | CLOSE | EXITPLAN wordmark, tan underline, "The artifact, not the slide." | "We're what the plan looks like when it's real." Stop talking. ~40s buffer — do not script into it. |

## Changes vs the current 12-slide deck

1. **Move the pull** from slide 9/12 (2:20) to beat 6 (~1:35); Act III disappears — offline becomes ambient.
2. **Cap slide 1's legal text** to phrase + article number (quote is mirror-sourced; EUR-Lex blocked). Restore only if verified in a browser before 17:00.
3. **Add the HSBC pre-empt** to slide 1 (the PROJECT-CONTEXT "always say" line the current deck never uses).
4. **Add the control condition**: real external ping + LAN IP in address bar; our own status chip is no longer the evidence.
5. **Speak the LAN/WAN distinction** at the pull.
6. **New NO FILE ACTION slide** — Art 18(3) shown as architecture, not asserted in narration.
7. **Human-decides reframed as the unlock**, not the caveat.
8. **Risk-committee language** at the pull (drop "no cloud, no fallback, no degraded mode").
9. **Load-bearing sentence moves** to the completed offline draft.
10. **Fix the business number's units**: "200 alerts on one queue × 30 min = ~100 analyst-hours." No dollars, no efficacy %, no ROI roll — judges flagged fabricated-ROI as the most puncturable failure across all framings.
11. **Spec table → chips on the known box object** (proportionate for a 10% criterion, still spoken).
12. **150,000 slide → 200→1 pay-back** with Finanz Informatik folded in as a clause.
13. **Narration trimmed to ~440 words** so pull + real generation + pauses fit 5:00 with buffer.

## Cut order (if long)

1. Slide 2's mock visual (keep the line + silence) · 2. Slide 12's number roll (fold into 13) ·
3. Merge 8 into 7 as a build · 4. Slide 9's live-chat upgrade (action-list form stays) ·
5. Slide 4's roll-up animation.
**Never cut:** 1, 5, 6, 7, 9, 10, 11.

## Go/no-go & risks (17:00 checkpoint)

- **Topology verified on the real box**: laptop→box over LAN (bring a private switch); only the box's
  WAN uplink gets pulled; cable + port physically marked. Never locate the cable on stage.
- **No reconnect after 1:35**: slide 7 needs a pre-warmed second alert and a hard 30-second abort cue.
  Rehearse narrating through generation latency as drama.
- **Fallback honesty rule**: if the live loop isn't green at 17:00, slides 4/5/8/9/10 fall back to deck
  recreations **wearing a `simulated` chip** — a real dying ping next to an unlabelled animation reads
  as staged.
- **Slide 9 buildability**: confirm the analyst UI can render the action list / locked File control by
  17:00; else it degrades into slide 10's narration.
- **Q&A prepared**: "Isn't 200 alerts small?" → one desk, one queue, deliberately conservative,
  synthetic. "So banks can't use cloud?" → the HSBC line; do not improvise a stronger claim.
