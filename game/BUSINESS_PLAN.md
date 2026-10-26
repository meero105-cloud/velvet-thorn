# Velvet Thorn: Global Revenue and Launch Strategy (draft)

> Goal: revenue in global markets. Principle: **long-term revenue = good reviews × replayability × wide channel access.**
> Explicit content and predatory monetization risk losing channel access (ratings, store and ad restrictions) and drawing negative reviews, so they **can reduce revenue**. (Industry experience. **Unverified**: no quantitative data.)
> Items marked "**Unverified**" must be rechecked against the original sources before launch.

---

## 1. Positioning
- **Genre**: match-3 RPG (puzzle battles) × light roguelite progression × dark-fantasy court drama
- **Differentiator**: rules a new player understands in 30 seconds (swap, match, four tile effects), with depth from telegraphed enemy actions, shield timing and cascades. The court-intrigue story runs between duels.
- **Target audiences**: match-3 RPG players (Puzzle Quest-like) + casual puzzle players + story/romance players (otome and visual-novel fans)
- **Redesign note (2026-10-24)**: the earlier deckbuilder × match-3 hybrid was dropped because two systems on one screen made the game hard to understand. The card system has been removed.
- **Tone**: 18+ suggestive mood, but the gameplay itself is the core. See [CONTENT_GUIDELINES.md](CONTENT_GUIDELINES.md).

## 2. Platform sequence (recommended)
| Phase | Platform | Rationale |
|---|---|---|
| 1 | **Steam (PC) demo → Early Access** | Many genre hits launched on PC/Steam first (**unverified**: confirm audience share with market data). Collect wishlists and feedback with a free demo (Next Fest, etc.). |
| 2 | Steam full release, $14.99–19.99 | Premium pricing is the norm for the genre (comparable-title prices **unverified**, check during research). |
| 3 | iOS / Android | "Chapter 1 free + full unlock IAP ($6.99–9.99)", the premium-unlock model. |
| 4 | Console (Switch, etc.) | Decide after the PC version proves itself. Each platform holder has its own approval process. |

The web prototype (this repo) can be repackaged as a PC/mobile app via Electron/Tauri (PC) or Capacitor (mobile).

## 3. Monetization design (what to do and what not to do)
**What to do**
- Premium purchase / full unlock (one-time)
- **Story expansion DLC**: a new chapter, boss and card pool ($4.99)
- **Cosmetics**: card backs, board themes, gothic/royal costume sets (style-based; exposure-boosting costumes are banned)
- Soundtrack and digital artbook DLC (AI music/art license check required)
- Supporter Pack (bundle)

**Ads (mobile, decided 2026-10-24)**
- AdMob **banner** fixed at the bottom of the screen, kept clear of the puzzle board (no accidental taps).
- **Opt-in rewarded ad to revive**: when you fall, watch an ad to continue that duel at 50% HP, once per run. "Give up" is always available. Code: `js/ads.js` (test stand-in until the AdMob plugin is added).
- **One-time "Remove Ads" purchase** ($1.99; decided over a monthly subscription because a short-run game has no monthly content to justify one): hides the banner and makes the revive instant. Non-consumable, so the store page needs a "Restore purchases" button.

**What not to do (risk)**
- **Paid random loot boxes / gacha**: Belgium's gambling regulator classifies them as gambling and effectively bans them (since 2018). A 2022 study pointed out it isn't properly enforced. ([MCV/Develop](https://www.mcvuk.com/business-news/belgium-isnt-enforcing-loot-box-ban-claims-research-study/), [TechRaptor](https://techraptor.net/gaming/news/new-report-says-belgiums-loot-box-law-is-not-being-enforced)). Current status for 2026: **unverified**. Probability disclosure requirements, regulation and lawsuits are expanding by country, so leave them out at the design stage.
- Energy/stamina systems, pay-to-progress walls, forced ads: likely to clash with the genre's premium expectations and draw negative reviews (**unverified**: check against comparable titles' reviews).
- Sexual content as the paid reward: violates the content guidelines and creates store-rejection risk.

## 4. Retention design
Already in the prototype:
- Short runs (3 chapters, 16 stages), a blessing pick after each duel, story choices → "just one more run"
- Cascade multipliers (×1.5, ×2…) → the payoff of a big chain from one well-chosen swap
- Gallery collection (20 scenes) and best-record meta progression

Add before release (priority order):
1. **Ascension levels**: difficulty modifiers unlocked after each clear (long-term replay)
2. **Daily Seed challenge** + global leaderboard (daily return)
3. More blessings (target 30+), more enemies with distinct board tricks (frozen tiles, locked rows, etc.)
4. **Second playable character** (e.g. Valen with a different finisher and tile bonuses)
5. Story branches based on relationships and choices (affinity → multiple endings)

## 5. Global markets and localization
- Priority languages: English → Simplified Chinese → Japanese → Korean → German, French, Spanish, Brazilian Portuguese (estimated by the size of the Steam audience. **Unverified**: use the Steam hardware/language survey for current data.)
- Text lives as strings in `js/data.js`, so translations can be separated into a JSON table.
- Age ratings: IARC (mobile and some stores), ESRB, PEGI. Suggestive themes probably mean **M / PEGI 16**. **Unverified**: decided by questionnaire results.

## 6. Store policy and legal checklist
- [ ] **Steam AI content disclosure**: players see a disclosure for pre-generated AI assets on the store page, and the developer is responsible for making sure they contain nothing illegal or infringing. Valve has revised the rules (reported as early 2026; exact date **unverified**), but disclosure of player-facing generated content is still required. ([GameDeveloper](https://gamedeveloper.com/business/valve-tweaks-and-clarifies-ai-disclosure-rules-for-steam), [VGC](https://www.videogameschronicle.com/news/valve-has-significantly-rewritten-steams-rules-for-how-developers-much-disclose-ai-use))
- [ ] **Apple 1.1.4**: bans explicit depictions of sexual organs or acts meant to produce erotic responses. The suggestive line in this game is designed to stay within it. ([Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/))
- [ ] **Google Play sexual-content policy**: needs review (**unverified**)
- [ ] **AI tool licenses**: check commercial-use, ownership and credit requirements under each image, music and video tool's paid plan (**unverified**, terms differ by tool and plan)
- [ ] **Copyright of AI outputs**: purely AI-generated output may not be protected by copyright in some jurisdictions. Add human edits and composition to key art and logos to strengthen protection (**unverified**, needs legal advice)
- [ ] Privacy policy (when leaderboards or analytics are added), refund policy, payment taxes

## 7. Marketing hooks
- Short-form video (TikTok/Shorts/Reels): **cascade-combo clips**, boss-intro cinematics, "which of the court figures is your type?" character polls
- Steam: store page with a demo, wishlist campaign, Next Fest participation
- Community: Discord, a daily-seed leaderboard, fan-art events (based on the official character sheets)
- AI-generated cinematics can be reused directly as trailer material

## 8. Short-term roadmap
| Week | Work |
|---|---|
| 1–2 | Generate AI assets (prompt sheet in the game) → replace placeholders, lock in character consistency |
| 3–4 | 30 blessings, new enemy board tricks, Ascension 1–5, playtest-based balancing |
| 5–6 | Electron/Tauri build, Steam page, demo |
| 7–8 | Localization (EN/ZH/JA/KO), Next Fest prep, trailer |

> This plan does not guarantee revenue. Its aim is a structure that improves the odds of success through wide channel access and long-term reviews.
