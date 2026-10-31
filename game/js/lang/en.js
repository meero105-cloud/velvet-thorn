// English UI strings + translated story content (overlaid on the Korean originals in js/data.js).
(() => {
const s = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const ord = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');

I18N.en = { ui: {
  langBtn: '🌐 한국어',
  tagline: 'A dark-fantasy match-3 of puzzles and intrigue in the Thorn Court',
  rating: '18+ · Suggestive themes · No explicit content',
  privacy: 'Privacy Policy',
  newRun: 'New Journey',
  resume: 'Continue',
  pauseHead: 'Paused',
  pauseNote: 'Your progress is saved automatically. Close the app any time and continue from the title screen.',
  resumeGame: 'Resume',
  sound: 'Sound',
  quitToTitle: 'Title Screen (progress saved)',
  howTo: 'How to Play',
  galleryBtn: (n, m) => `Gallery ${n}/${m}`,
  prompts: 'AI Asset Prompts',
  titleStats: (runs, wins, best) => `Runs ${runs} · Thrones won ${wins} · Best ${s(best, 'stage')}`,
  galleryUnlock: name => '🖼 Gallery unlocked: ' + name,

  tier0: 'Easy', tier1: 'Normal', tier2: 'Hard',
  throneRound: n => `Throne Challenge ${n}`,
  where: (ch, name, i, total) => `Ch. ${ch} ${name} · ${i}/${total}`,
  chapterHead: (ch, name) => `Chapter ${ch} · ${name}`,

  legendShort: (unit, v) => `${v} ${unit}`,
  blessings: 'Your blessings',
  adLoading: 'Loading ad…',
  removeAds: p => `Remove ads · ${p}`,
  reviveBuy: p => `Remove ads & continue · ${p}`,
  restore: 'Restore purchases',
  removeAdsHead: 'Remove Ads',
  removeAdsNote: 'One purchase removes the bottom banner and lets you continue right away when you fall, with no ad. On a new phone, use "Restore purchases" to get it back.',
  buyTest: 'This is a test purchase. The app shows the store payment sheet.',
  buyBtn: p => `Buy for ${p}`,
  cancel: 'Cancel',
  buyPending: 'Your payment is pending. Ads will go away once it completes.',
  buyFail: 'The purchase did not go through. Please try again later.',
  restoreDone: 'Purchase restored. Ads are gone.',
  restoreNone: 'No purchases to restore.',
  adFreeThanks: 'Ads removed. Thank you!',
  adFreeOn: 'Ads removed ✓',
  adBanner: 'Ad banner space · 320×50',
  legend: (name, unit, v) => `<b>${name}</b>: ${v} ${unit} each`,
  rules: legend => [
    'Swap <b>two neighbouring tiles</b> to line up <b>3 or more</b> of the same kind. Tap a tile and then its neighbour, or drag one onto the other.',
    'Each kind of tile has its own effect.' + legend,
    'Enemies act when the <b>turn counter</b> above them runs out, and they show what they will do next.',
    '🛡 <b>Shield</b> blocks the enemy\'s next attack, then fades once the enemy acts. Build it right before a hit lands.',
    'Match <b>5 or more</b> to move <b>again</b> without the enemy\'s counter ticking down. Cascades multiply every effect.',
    'When the 🎭 gauge is full, unleash your <b>finisher</b>: heavy damage that also clears every thorn. It costs no turn.',
    '🥀 <b>Thorns</b> can\'t be moved. Make a match right next to one to clear it.',
    'A swap that makes no match is undone and costs no turn. Stay idle for 5 seconds and a hint will glow.'
  ],
  howToIntro: 'You are the Exile, returned to the Thorn Court to clear your name. Win duels across three chapters and gather blessings through the choices you make.',
  gotIt: 'Got it',

  kindBoss: 'BOSS', kindElite: 'ELITE', kindDuel: 'DUEL',
  startDuel: 'Begin Duel',
  kindStory: 'STORY', enter: 'Step Inside',
  kindRest: 'REST', cellar: 'The Wine Cellar', goDown: 'Descend',

  reshuffle: 'No moves left. Reshuffling the board.',
  blocked: 'Blocked',
  shieldGain: v => `+${v} shield`,
  combo: m => `Cascade ×${m}!`,
  noMatch: 'That doesn\'t make a line of 3. Try another swap.',
  extraMove: 'Extra move!',
  shoutAttack: 'Hyah!',
  shoutHurt: 'Ugh!',
  finisherShout: 'Unmasked!',
  intentAtk: v => `Attack ${v}`,
  intentThorn: v => `Plant ${s(v, 'thorn')}`,
  intentGuard: v => `Shield ${v}`,
  intentHeal: v => `Heal ${v}`,
  thornsPlanted: v => `🥀 ${s(v, 'thorn')}!`,
  thornToast: 'Thorns can\'t be moved. Match right next to one to clear it.',
  hintSelected: 'Tap a neighbouring tile to swap.',
  hintIdle: 'Tap a tile and then its neighbour, or drag to swap.',
  shieldTipFoe: 'Shield: absorbs damage first',
  shieldTipMe: 'Shield: blocks the enemy\'s next attack, fades after the enemy acts',
  nextAction: 'Next:',
  countNext: 'Next turn!',
  countIn: n => `in ${s(n, 'turn')}`,
  me: 'You',
  danger: 'Danger!',
  finisherBtn: d => `Finisher · ${d} damage`,

  pickBlessing: 'Choose a blessing',
  owned: n => `Owned ${n}`,
  healed: h => `Healed ${h} HP.`,
  bossWin: 'The court stirs.',
  win: 'Victory.',
  gainedBlessing: (name, text) => `Blessing gained: <b>"${name}"</b> ${text}`,
  hpLost: v => `Lost ${v} HP.`,
  maxHpChange: v => `Max HP ${v > 0 ? '+' : ''}${v}.`,
  memory: 'A memory you won\'t forget. (Gallery)',
  gambleWin: h => `Sweet and warm. Healed ${h} HP.`,
  gambleLose: 'Bitter. You lost 8 HP, but learned a trick.',
  nothing: 'Nothing happens. Not yet.',
  cont: 'Continue',

  cellarText: 'Beneath the banquet the air is cool and smells of oak. For a little while, no one is watching you.',
  rest: 'Rest',
  reflect: 'Reflect',
  reflectDesc: 'Choose one of 3 blessings.',
  reflectHead: 'Quiet Thoughts',

  reviveHead: 'You have fallen…',
  reviveNote: 'Watch an ad to keep fighting this duel with half your HP. Once per difficulty tier.',
  reviveAd: '▶ Watch an ad to continue',
  reviveFree: '▶ Continue now (ad-free)',
  reviveNo: 'Give up',
  revived: 'Back on your feet! Half HP restored',
  adTest: 'Test ad (the app shows a real ad here)',
  adClose: 'Close (no reward)',
  defeatHead: 'Exiled Again',
  defeatText: (tier, where) => `You fell at the ${ord(where)} stage of ${tier}. The court will remember your face.`,
  tierClear: tier => `${tier} Cleared!`,
  tierClearText: 'The court stirs, but it does not accept you yet. Stronger rivals are waiting.',
  throneHeadLoop: round => `The Throne Holds · ${round}`,
  throneHead: 'The Thorn Throne Is Yours',
  throneTextLoop: 'The court kneels once more. But new plots are already in bloom.',
  throneText: 'Your name is cleared, and the court has learned to fear it.',
  throneStats: (c, best) => `${s(c, 'stage')} so far · Best ${s(best, 'stage')}`,
  nextTier: tier => `Take on ${tier}`,
  throneStart: 'Begin the Throne Challenge',
  newJourney: 'New Journey',
  toTitle: 'Title Screen',
  tierNote: (tier, hp, atk) => `${tier}: enemy HP ×${hp}, attack ×${atk}. Blessings carry over and you recover half your HP.`,
  tierToast: tier => `${tier}: the court grows stronger`,
  endStats: (runs, wins, best, g, total) => `Runs ${runs} · Thrones won ${wins} · Best ${s(best, 'stage')} · Gallery ${g}/${total}`,
  retry: 'Try Again',

  gallery: 'Gallery',
  back: 'Back',

  copy: 'Copy',
  kindImg: 'Image · 3:4 portrait', kindMusic: 'Music · loop', kindVideo: 'Video · 16:9',
  sheetSub: 'Generate each file with any image, music or video tool, save it at the path shown and reload. The placeholder is replaced automatically.',
  negLabel: 'Negative prompt (images and video):',
  sheetWarn: 'A person must review every output against CONTENT_GUIDELINES.md. Prompts lower the risk but don\'t guarantee a safe result.',
  json: 'Download as JSON',
  thPath: 'Save path', thPrompt: 'Prompt',
  copied: 'Prompt copied',
  copyFail: 'Copy failed: select the text and copy it manually',

  placeholder: 'Placeholder',
  skip: 'Skip ▸▸'
},

content: {
  ASSETS: {
    images: {
      title: { title: 'Velvet Thorn' },
      exile: { title: 'The Exile' },
      seraphine: { title: 'Queen Seraphine' },
      cassian: { title: 'Spymaster Cassian Vey' },
      isolde: { title: 'Duchess Isolde Marrow' },
      rhoen: { title: 'Ser Rhoen, the Queen\'s Blade' },
      valen: { title: 'Valen of the Velvet House' },
      courtier: { title: 'The Gossiping Courtier' },
      rival: { title: 'The Jealous Rival' },
      duelist: { title: 'The Masked Duelist' },
      informant: { title: 'The Court Informant' },
      ev_velvet: { title: 'The Velvet House' },
      ev_letter: { title: 'The Black Wax Letter' },
      ev_garden: { title: 'The Moonlit Garden' },
      ev_chapel: { title: 'The Ash Chapel' },
      ev_mirror: { title: 'The Masquerade Mirror' },
      ev_bath: { title: 'The Rose Bathhouse' },
      cellar: { title: 'The Wine Cellar' },
      victory: { title: 'The Thorn Throne' },
      defeat: { title: 'Exiled Again' }
    },
    videos: {
      vid_prologue: { beats: [
        { text: 'Seven years ago, your house was burned for a treason it never committed.' },
        { text: 'You were thrown out the gates into the rain, with nothing but a mask.' },
        { text: 'Tonight the Thorn Court holds a masquerade. Behind every mask hides a debt.' },
        { text: 'Queen Seraphine has summoned you back. Not out of mercy.' },
        { text: '"So you have returned, Exile. It is time to dance."' } ] },
      vid_ch1: { title: 'Chapter 1 · The Masquerade', beats: [
        { text: 'Beneath the chandeliers, a hundred masks turn toward you at once.' },
        { text: 'Not everyone welcomes your return.' },
        { text: 'Ser Rhoen keeps the Queen\'s secrets. Perhaps one of yours, too.' } ] },
      vid_ch2: { title: 'Chapter 2 · The Poison Garden', beats: [
        { text: 'Beyond the palace walls lies a garden only the moonlight may enter.' },
        { text: 'Every flower here remembers someone\'s death.' },
        { text: 'Duchess Isolde never forgets a face. Or a dose.' } ] },
      vid_ch3: { title: 'Chapter 3 · The Thorn Throne', beats: [
        { text: 'The ledger is closed. Only one name remains.' },
        { text: 'Thorned vines crawl up the marble stairs.' },
        { text: 'The Queen is waiting. She knew it would be you all along.' } ] },
      vid_ending: { title: 'The Thorn Throne', beats: [
        { text: 'The court kneels. Some out of fear, some out of something warmer.' },
        { text: 'The crown of thorns falls to the floor. No one picks it up.' },
        { text: 'The fire of seven years ago is finally out.' },
        { text: '"Every crown is a mask. Wear it well."' } ] },
      vid_defeat: { beats: [
        { text: 'The gates slam shut again. A mask falls into the rain.' },
        { text: 'The court has no mercy for the unlucky. But the Exile always returns.' } ] },
      vid_ev_velvet: { beats: [
        { text: 'The music changes. The dancers part.' },
        { text: 'Behind a lace mask, someone is watching only you.' } ] },
      vid_ev_bath: { beats: [
        { text: 'Steam drifts between the marble pillars.' },
        { text: 'The Queen\'s Blade is waiting, without his sword.' } ] },
      vid_ev_garden: { beats: [
        { text: 'Under the moon, the poison flowers gleam silver.' },
        { text: 'The only sound is wine filling a goblet.' } ] },
      vid_ev_letter: { beats: [
        { text: 'Black wax. And a crest that burned seven years ago.' },
        { text: 'Someone knows your past. And they want to be paid for it.' } ] },
      vid_ev_mirror: { beats: [
        { text: 'The mask in the mirror smiles first.' },
        { text: 'You straighten your mask. The face in the mirror does not.' } ] },
      vid_ev_chapel: { beats: [
        { text: 'Through the broken roof, ash falls like snow.' },
        { text: 'The curtain of the confession booth stirs on its own.' } ] },
      vid_cellar: { beats: [ { text: 'The noise of the banquet fades. For a moment, no one is here.' } ] },
      vid_boss_rhoen: { title: 'The Loyal Knight', beats: [
        { text: 'Every candle on the balcony flickers at once.' },
        { text: '"By Her Majesty\'s command. There is no retreat."' } ] },
      vid_boss_isolde: { title: 'The Poison Duchess', beats: [
        { text: 'The goblet is filled to the brim.' },
        { text: '"I always pour the last glass myself."' } ] },
      vid_boss_seraphine: { title: 'Mistress of the Thorn Throne', beats: [
        { text: 'The throne room doors open.' },
        { text: '"I have waited seven years. Do not disappoint me."' } ] },
      vid_elite_cassian: { title: 'The One Who Knows All', beats: [
        { text: 'A single candle in the archive goes out.' },
        { text: '"Your name is at the top of this ledger."' } ] }
    }
  },

  SUITS: [
    { name: 'Blade', unit: 'damage' },
    { name: 'Rose', unit: 'shield' },
    { name: 'Wine', unit: 'healing' },
    { name: 'Mask', unit: 'gauge' }
  ],

  ENEMIES: {
    courtier: { name: 'The Gossiping Courtier', line: '"Oh my, the Exile is back? Everyone will be dying to know."' },
    rival: { name: 'The Jealous Rival', line: '"That place was supposed to be mine."' },
    informant: { name: 'The Court Informant', line: '"Your name is already in the Spymaster\'s ledger."' },
    duelist: { name: 'The Masked Duelist', line: '"No need for words. Draw your blade."' },
    cassian: { name: 'Spymaster Cassian Vey', line: '"I know everything about you. Even what you don\'t."' },
    rhoen: { name: 'Ser Rhoen, the Queen\'s Blade', line: '"Her Majesty\'s orders. Nothing personal."' },
    isolde: { name: 'Duchess Isolde Marrow', line: '"Another glass? This one really is fine."' },
    seraphine: { name: 'Queen Seraphine', line: '"I knew you would return. This time I will watch to the very end."' }
  },

  CHAPTERS: [ { name: 'The Masquerade' }, { name: 'The Poison Garden' }, { name: 'The Thorn Throne' } ],

  BLESSINGS: {
    sharp: { name: 'Honed Blade', text: '🗡 +1 damage per Blade tile' },
    velvet: { name: 'Thick Velvet', text: '🌹 +1 shield per Rose tile' },
    vintage: { name: 'Old Vintage', text: '🍷 +1 healing per Wine tile' },
    whisper: { name: 'Whisper of the Mask', text: 'Finisher needs 2 less gauge (min 6)' },
    crown: { name: 'The King\'s Edge', text: '+10 finisher damage' },
    guard: { name: 'Velvet Mask', text: 'Start each duel with 8 shield' },
    heart: { name: 'Iron Heart', text: '+10 max HP, heal 10' },
    rest: { name: 'Short Rest', text: 'Heal 40% of your HP' }
  },

  EVENTS: {
    velvet: { title: 'The Velvet House',
      text: 'At the edge of the ballroom, Valen finds you. "You look like you need an ally." The whisper comes close enough to catch the scent of jasmine. "Or at least a moment to breathe."',
      choices: [
        { label: 'Accept the dance', desc: '1 random blessing. Unlocks a gallery scene.' },
        { label: 'Ask what Valen knows', desc: 'Lose 5 HP. Gain "Honed Blade".' },
        { label: 'Politely decline', desc: 'Heal 8 HP.' } ] },
    bath: { title: 'The Rose Bathhouse',
      text: 'In the steam of the royal baths, Ser Rhoen sits in a robe, his armor set aside. The scars on his arm are plain to see. "No blades here. Ask."',
      choices: [
        { label: 'Ask about the fire', desc: 'Gain "The King\'s Edge". Unlocks a gallery scene.' },
        { label: 'Just rest', desc: 'Heal 12 HP.' } ] },
    garden: { title: 'The Moonlit Garden',
      text: 'Duchess Isolde hands you a glass. "To old friends." She laughs softly. "Or to old enemies. At this hour I can never tell the difference."',
      choices: [
        { label: 'Drink', desc: '50%: heal 15 HP. 50%: lose 8 HP and gain "Whisper of the Mask".' },
        { label: 'Pour it into the rosebush', desc: 'Gain "Thick Velvet".' } ] },
    letter: { title: 'The Black Wax Letter',
      text: 'A letter lies on your pillow, sealed with your dead father\'s crest. Whoever left it knows where you sleep.',
      choices: [
        { label: 'Break the seal', desc: 'Lose 4 max HP. 1 random blessing.' },
        { label: 'Burn it unread', desc: 'Heal 10 HP.' } ] },
    mirror: { title: 'The Masquerade Mirror',
      text: 'In the mirror you wear a different mask. And it smiles before you do.',
      choices: [
        { label: 'Touch the mirror', desc: 'Lose 6 HP. 1 random blessing.' },
        { label: 'Look away', desc: 'Nothing happens. Probably.' } ] },
    chapel: { title: 'The Ash Chapel',
      text: 'Ash drifts through the broken roof. The confession booth stands open. No one hears confessions here anymore. Perhaps that is why people come.',
      choices: [
        { label: 'Confess', desc: 'Heal 20 HP.' },
        { label: 'Pray', desc: '+5 max HP.' } ] }
  }
}
};
})();
