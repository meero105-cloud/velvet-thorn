# Velvet Thorn: Content Guidelines (applies to every update)

> **Core principle: suggestive, never explicit.** The heart of the game is the **match-3 puzzle gameplay and the court-intrigue story**. Sensuality is atmosphere and tension, never the reward or the goal.
> Every update, DLC, event and AI-generated asset must pass this checklist before release.

## 1. Allowed (suggestive / 18+ mood)
- Flirtation, innuendo, romantic tension, jealousy, seduction as a political tactic
- Period costumes such as off-the-shoulder gowns and open-collar shirts, plus lace masks and bath robes
- Implied romance (scenes that cut away before a kiss, dimmed candlelight, a hand being taken)
- Violence, poison and betrayal in dark-fantasy tone (no gore)

## 2. Prohibited (never allowed under any circumstances)
- Nudity (exposed genitals, breasts or buttocks), sex acts, or depictions that imply them
- No minors in any romantic or sensual context. **Every character must clearly look adult**, including face and body proportions.
- Sexual content framed as non-consensual, sexualization of coercion
- Sexual fetish as the main focus, close-up shots built purely to sexualize
- Likenesses of real people (celebrities, streamers, etc.)

## 3. Structural rules (to stop drift)
| Rule | Detail |
|---|---|
| Rewards cannot be erotic | No "undress" or "more revealing" unlocks. Gallery unlocks are story scenes. |
| Gameplay comes first | Each update must touch at least as much gameplay (puzzles, enemies, blessings, bosses) as romance or sensual content. |
| No paid sensual content | Costumes or scenes that only add exposure must never be sold. Cosmetics are sold on style (for example a gothic or royal set). |
| Story context is required | Every suggestive scene must serve the plot: information, alliances, betrayal. |
| Prompt safety settings | Never delete the `STYLE` constant (adult, fully clothed) or `NEGATIVE_PROMPT` (for the negative-prompt field) in `js/data.js`. **They only lower risk; they don't guarantee safe output.** Human review is still required. |

## 4. AI asset generation checklist
- [ ] Do the characters clearly look adult (facial maturity, body proportions)?
- [ ] No nudity, see-through clothing that reveals intimate areas, or sexual poses?
- [ ] Did a human review the output and reject or regenerate anything that broke the rules?
- [ ] Do the generation tool's commercial-use license terms permit this use? (Check each tool's terms. **Unverified**: terms change with each plan.)
- [ ] For a Steam release: is the AI-generated content declared on the store page? (See Steam's AI content disclosure policy. Check the current wording before release.)

## 5. Age ratings
- Target ratings: **ESRB M / PEGI 16**, plus the App Store age rating (Apple has reportedly reorganized its age tiers, so check the current tiers; **unverified**) and IARC ratings on mobile. The exact rating comes out of each rating questionnaire. **Unverified, decided at submission time.**
- Explicit content can lead to store rejection or an Adults Only rating and restrictions on console, mobile and ad channels. (**Unverified**: check each platform's policy.) Keeping this line protects revenue, not just values.

## 6. Change control
- Any change to `js/data.js`'s `EVENTS` or `ASSETS` text or prompts must be reviewed against this document before merging.
- If something is borderline, the default is **leave it out**.
