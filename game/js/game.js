// Velvet Thorn — match-3 duels through a dark court
const N = 6;
const MAX_THORNS = 10;
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const app = () => document.getElementById('app');
const $ = s => document.querySelector(s);
const bind = (sel, fn) => document.querySelectorAll(sel).forEach(el => el.addEventListener('click', e => fn(el, e)));

// ---------- Meta progression (persists between runs) ----------
const META_DEFAULT = { runs: 0, wins: 0, best: 0, gallery: ['title'], tutorial: false };
function loadMeta() {
  try { return Object.assign({}, META_DEFAULT, JSON.parse(localStorage.getItem('vt_meta') || '{}')); }
  catch (e) { return { ...META_DEFAULT, gallery: ['title'] }; }
}
function saveMeta() { try { localStorage.setItem('vt_meta', JSON.stringify(meta)); } catch (e) {} }
let meta = loadMeta();
function unlock(img) {
  if (!ASSETS.images[img] || meta.gallery.includes(img)) return;
  meta.gallery.push(img); saveMeta();
  toast(t('galleryUnlock', ASSETS.images[img].title));
}

// ---------- Saved run: written at every stable screen so the game resumes after the app is closed ----------
function saveRun(screen, extra = {}) {
  if (!run) return;
  const d = screen === 'duel' && duel ? { boss: duel.boss, enemy: duel.enemy, board: duel.board, shield: duel.shield, gauge: duel.gauge } : null;
  try { localStorage.setItem('vt_run', JSON.stringify({ v: 1, screen, run, duel: d, extra })); } catch (e) {}
}
function loadRun() {
  try { const s = JSON.parse(localStorage.getItem('vt_run') || 'null'); return s && s.v === 1 && s.run ? s : null; }
  catch (e) { return null; }
}
function clearRun() { try { localStorage.removeItem('vt_run'); } catch (e) {} }
function resumeRun() {
  const s = loadRun();
  if (!s) return title();
  run = s.run; duel = null;
  const x = s.extra || {};
  switch (s.screen) {
    case 'duel':
      duel = { ...s.duel, first: null, busy: false, over: false, popping: null, fresh: null, bad: null };
      music(duel.boss ? 'mus_boss' : 'mus_duel');
      return renderDuel();
    case 'blessing': return blessingScreen(x.heading, x.notes, afterNode, x.choices);
    case 'event': return story(x.id);
    case 'eventDone': return afterNode();
    case 'cellar': return cellar();
    case 'throne': return throneScreen();
    default: return showPath();
  }
}

// ---------- Pause (button, and automatically when the app goes to the background) ----------
let pauseOv = null;
function pauseMenu() {
  if (pauseOv || !run) return;
  pauseOv = overlay(`<h2>${t('pauseHead')}</h2>
    <p class="sub">${t('pauseNote')}</p>
    <div class="menu col">
      <button class="btn primary" id="p-resume">${t('resumeGame')}</button>
      <button class="btn" id="p-help">${t('howTo')}</button>
      <button class="btn" id="p-mute">${Media.isMuted() ? '🔇' : '♪'} ${t('sound')}</button>
      ${Ads.isAdFree() ? '' : `<button class="btn" id="p-buy">${t('removeAds', Shop.price())}</button>`}
      <button class="btn" id="p-title">${t('quitToTitle')}</button>
    </div>`, true);
  const close = () => { if (pauseOv) pauseOv.remove(); pauseOv = null; };
  pauseOv.querySelector('#p-resume').onclick = close;
  pauseOv.querySelector('#p-help').onclick = () => howTo();
  pauseOv.querySelector('#p-mute').onclick = e => { e.currentTarget.textContent = `${Media.toggleMute() ? '🔇' : '♪'} ${t('sound')}`; };
  const buy = pauseOv.querySelector('#p-buy');
  if (buy) buy.onclick = async () => { if (await Shop.buy()) { toast(t('adFreeThanks')); buy.remove(); } };
  pauseOv.querySelector('#p-title').onclick = () => { close(); clearTimeout(hintTimer); document.querySelectorAll('.cine').forEach(c => c.remove()); title(); };
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { Media.suspend(); if (duel && !duel.over && !document.querySelector('.cine')) pauseMenu(); }
  else Media.resume();
});

// ---------- Music needs a user gesture before it can start ----------
let wantMusic = 'mus_title', gestured = false;
function music(id) { wantMusic = id; if (gestured) Media.play(id); }
document.addEventListener('pointerdown', () => {
  if (gestured) return;
  gestured = true; Media.unlock(); Media.play(wantMusic);
});

// ---------- UI helpers ----------
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('out'), 1800);
  setTimeout(() => t.remove(), 2300);
}
// Speech-bubble shout next to your HP bar, at most one at a time.
let lastShout = 0;
function shout(text, kind) {
  const now = Date.now();
  if (now - lastShout < 450) return;
  lastShout = now;
  floatText(text, 'me', 'shout ' + kind);
}
function floatText(text, targetId, cls = '') {
  const el = document.getElementById(targetId);
  if (!el) return;
  const r = el.getBoundingClientRect();
  const f = document.createElement('div');
  f.className = 'float ' + cls; f.textContent = text;
  f.style.left = (r.left + r.width / 2 + (Math.random() * 40 - 20)) + 'px';
  f.style.top = (r.top + r.height / 3) + 'px';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1100);
}
const bar = (v, max, cls) => `<div class="bar ${cls}"><div style="width:${Math.max(0, 100 * v / max)}%"></div><span>${v}/${max}</span></div>`;
const chip = (ic, v, tip) => `<span class="chip" title="${tip}">${ic}${v}</span>`;

function overlay(html, modal = false) {
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `<div class="panel">${html}</div>`;
  document.body.appendChild(ov);
  if (!modal) ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  return ov;
}

// ---------- Run state ----------
let run = null, duel = null;
const TOTAL_NODES = CHAPTERS.reduce((s, c) => s + c.nodes.length, 0);
const progress = () => CHAPTERS.slice(0, run.chapter).reduce((s, c) => s + c.nodes.length, 0) + run.node;
const lv = id => (run && run.bless[id]) || 0;
const perTile = s => SUITS[s].base + [lv('sharp'), lv('velvet'), lv('vintage'), 0][s];
const gaugeMax = () => Math.max(6, GAUGE_MAX - 2 * lv('whisper'));
const finisherDmg = () => FINISHER_DMG + 10 * lv('crown');

// One compact line: where you are on the left, HP / blessings / pause on the right.
function hudHTML(showHp = true) {
  const n = Object.values(run.bless).reduce((x, v) => x + v, 0);
  return `<div class="hud">
    <div class="where"><b class="loop">${tierLabel(run.loop)}</b> ${t('where', run.chapter + 1, CHAPTERS[run.chapter].name, progress() + 1, TOTAL_NODES)}</div>
    <div class="hud-btns">
      ${showHp ? `<span class="hud-hp">${icon('heart')}${run.hp}/${run.maxhp}</span>` : ''}
      ${n ? `<button class="hud-btn" id="h-bless" aria-label="${t('blessings')}">${icon('star')}<span>${n}</span></button>` : ''}
      <button class="hud-btn" id="h-pause" aria-label="${t('pauseHead')}">${icon('pause')}</button>
    </div>
  </div>`;
}
function bindHud() {
  bind('#h-pause', pauseMenu);
  bind('#h-bless', blessList);
}
function blessList() {
  const owned = Object.keys(run.bless).filter(k => run.bless[k] > 0);
  const ov = overlay(`<h2>${t('blessings')}</h2>
    <ul class="bless-list">${owned.map(k => `<li><b>${BLESSINGS[k].name}${run.bless[k] > 1 ? ' ×' + run.bless[k] : ''}</b><small>${BLESSINGS[k].text}</small></li>`).join('')}</ul>
    <button class="btn primary" id="ov-close">${t('gotIt')}</button>`);
  ov.querySelector('#ov-close').onclick = () => ov.remove();
}

// ---------- Title ----------
function title() {
  music('mus_title');
  const totalImgs = Object.keys(ASSETS.images).length;
  run = null; duel = null; pauseOv = null;
  const saved = loadRun();
  app().innerHTML = `<div class="screen title-screen">
    <div class="title-top"><button class="hud-btn" id="b-mute" aria-label="${t('sound')}">${icon(Media.isMuted() ? 'mute' : 'sound')}</button></div>
    <div class="title-art"></div>
    <div class="title-body">
      <h1>Velvet Thorn</h1>
      <p class="tag">${t('tagline')}</p>
      <div class="title-menu">
        ${saved ? `<button class="btn primary big" id="b-cont">${t('resume')}</button>` : ''}
        <button class="btn ${saved ? '' : 'primary big'}" id="b-new">${t('newRun')}</button>
        <div class="two">
          <button class="btn" id="b-how">${t('howTo')}</button>
          <button class="btn" id="b-gal">${t('galleryBtn', meta.gallery.length, totalImgs)}</button>
        </div>
        <button class="btn ghost" id="b-lang">${icon('globe')}${t('langBtn').replace(/^🌐\s*/, '')}</button>
        <div class="two shop-row">
          ${Ads.isAdFree() ? `<span class="adfree-on">${t('adFreeOn')}</span>` : `<button class="btn ghost sm" id="b-buy">${t('removeAds', Shop.price())}</button>`}
          <button class="btn ghost sm" id="b-restore">${t('restore')}</button>
        </div>
        ${IS_APP ? '' : `<button class="btn ghost sm" id="b-prompts">${t('prompts')}</button>`}
      </div>
      <p class="stats">${t('titleStats', meta.runs, meta.wins, meta.best)}</p>
      <p class="rating">${t('rating')}</p>
      <p class="legal"><a href="https://meero105-cloud.github.io/velvet-thorn/privacy/" target="_blank" rel="noopener">${t('privacy')}</a></p>
    </div>
  </div>`;
  $('.title-art').appendChild(Media.art('title', 'bg'));
  bind('#b-mute', el => { el.innerHTML = icon(Media.toggleMute() ? 'mute' : 'sound'); });
  bind('#b-cont', resumeRun);
  bind('#b-new', startRun);
  bind('#b-how', howTo);
  bind('#b-gal', gallery);
  bind('#b-prompts', promptSheet);
  bind('#b-buy', async () => { if (await Shop.buy()) { toast(t('adFreeThanks')); title(); } });
  bind('#b-restore', () => Shop.restore().then(() => { if (!run) title(); }));
  bind('#b-lang', () => { setLang(LANGS[(LANGS.indexOf(LANG) + 1) % LANGS.length]); Ads.banner(); title(); });
}

function legendHTML() {
  return `<div class="legend">${SUITS.map((s, i) =>
    `<div class="lg s${i}">${icon(SUIT_ICON[i])}<span>${t('legend', s.name, s.unit, run ? perTile(i) : s.base)}</span></div>`).join('')}</div>`;
}
// The duel's compact version: icon + amount per tile.
function legendBar() {
  return `<div class="legend-bar">${SUITS.map((s, i) =>
    `<div class="lg s${i}" title="${s.name}">${icon(SUIT_ICON[i])}<span>${t('legendShort', s.unit, perTile(i))}</span></div>`).join('')}</div>`;
}
function rulesHTML() {
  return `<ol class="rules">${t('rules', legendHTML()).map(r => `<li>${r}</li>`).join('')}</ol>`;
}
function howTo(onClose) {
  const ov = overlay(`<h2>${t('howTo')}</h2>
    <p>${t('howToIntro')}</p>
    ${rulesHTML()}
    <button class="btn primary" id="ov-close">${t('gotIt')}</button>`, typeof onClose === 'function');
  ov.querySelector('#ov-close').onclick = () => { ov.remove(); if (typeof onClose === 'function') onClose(); };
}

// ---------- Run flow ----------
function startRun() {
  clearRun();
  meta.runs++; saveMeta();
  run = { hp: PLAYER_HP, maxhp: PLAYER_HP, bless: {}, chapter: 0, node: 0, loop: 0 };
  unlock('exile');
  playCine('vid_prologue', () => startChapter(0));
}
// A cinematic with its own music (the next screen picks its music again afterwards).
function playCine(id, next) {
  const v = ASSETS.videos[id];
  if (v && v.mus) music(v.mus);
  Media.cinematic(id, next);
}
// Cinematics play on the first pass only; later loops skip straight to the action.
function cine(id, next) {
  if (run.loop === 0 && ASSETS.videos[id]) playCine(id, next);
  else next();
}
function startChapter(c) {
  run.chapter = c; run.node = 0;
  cine(CHAPTERS[c].video, showPath);
}

function nodeIcon(n) {
  if (n.type === 'duel') return icon(ENEMIES[n.enemy].boss ? 'crown' : ENEMIES[n.enemy].elite ? 'eye' : 'blade');
  return icon(n.type === 'event' ? 'rose' : 'wine');
}

function showPath() {
  music('mus_court');
  const ch = CHAPTERS[run.chapter], nd = ch.nodes[run.node];
  const track = ch.nodes.map((n, i) =>
    `<span class="dot ${i < run.node ? 'done' : i === run.node ? 'now' : ''}">${nodeIcon(n)}</span>`).join('<i></i>');
  let next;
  if (nd.type === 'duel') {
    const E = ENEMIES[nd.enemy];
    next = `<div class="next foe-preview"><div class="np-art"></div><div class="np-body">
      <small>${t(E.boss ? 'kindBoss' : E.elite ? 'kindElite' : 'kindDuel')}</small><h3>${E.name}</h3>
      <p class="ev-text">${E.line}</p>
      <button class="btn primary" id="go">${t('startDuel')}</button></div></div>`;
  } else if (nd.type === 'event') {
    next = `<div class="next"><small>${t('kindStory')}</small><h3>${EVENTS[nd.id].title}</h3><button class="btn primary" id="go">${t('enter')}</button></div>`;
  } else {
    next = `<div class="next"><small>${t('kindRest')}</small><h3>${t('cellar')}</h3><button class="btn primary" id="go">${t('goDown')}</button></div>`;
  }
  app().innerHTML = `${hudHTML()}
    <div class="screen map">
      <h2>${t('chapterHead', run.chapter + 1, ch.name)}</h2>
      <div class="track">${track}</div>
      ${next}
    </div>`;
  if (nd.type === 'duel') $('.np-art').appendChild(Media.art(ENEMIES[nd.enemy].img, 'portrait'));
  bindHud();
  let chosen = false;
  bind('#go', () => {
    if (chosen) return; chosen = true;
    if (nd.type === 'duel') {
      const E = ENEMIES[nd.enemy];
      if (E.boss) music('mus_boss');
      cine(E.boss ? 'vid_boss_' + nd.enemy : E.elite ? 'vid_elite_' + nd.enemy : '', () => startDuel(nd.enemy));
    }
    else if (nd.type === 'event') cine('vid_ev_' + nd.id, () => story(nd.id));
    else cine('vid_cellar', cellar);
  });
  saveRun('path');
}

function afterNode() {
  run.node++; recordBest();
  if (run.node >= CHAPTERS[run.chapter].nodes.length) {
    if (run.chapter === CHAPTERS.length - 1) return victory();
    return startChapter(run.chapter + 1);
  }
  showPath();
}
const cleared = () => run.loop * TOTAL_NODES + progress();
// run.loop 0..2 = easy/normal/hard tier, 3+ = Throne Challenge rounds.
const isThrone = loop => loop >= TIERS.length;
function tierMult(loop) {
  if (!isThrone(loop)) return TIERS[loop];
  const top = TIERS[TIERS.length - 1], k = loop - TIERS.length + 1;
  return { hp: top.hp * Math.pow(THRONE_HP, k), atk: top.atk * Math.pow(THRONE_ATK, k) };
}
const tierLabel = loop => isThrone(loop) ? t('throneRound', loop - TIERS.length + 1) : t('tier' + loop);
function recordBest() { meta.best = Math.max(meta.best, cleared()); saveMeta(); }

// ---------- Board ----------
function makesMatch(b, i, s) {
  const r = Math.floor(i / N), c = i % N;
  return (c >= 2 && b[i - 1] === s && b[i - 2] === s) || (r >= 2 && b[i - N] === s && b[i - 2 * N] === s);
}
// A fresh board with no ready-made matches but at least one possible move. Keeps the thorns of `old`.
function newBoard(old) {
  let b;
  for (let tries = 0; tries < 100; tries++) {
    b = [];
    for (let i = 0; i < N * N; i++) {
      if (old && old[i] === THORN) { b.push(THORN); continue; }
      let s;
      do { s = rnd(4); } while (makesMatch(b, i, s));
      b.push(s);
    }
    if (findMove(b)) return b;
  }
  return b;
}
const isAdj = (a, b) => (Math.abs(a - b) === 1 && Math.floor(a / N) === Math.floor(b / N)) || Math.abs(a - b) === N;
function neighbors(i) {
  const r = Math.floor(i / N), c = i % N, out = [];
  if (r > 0) out.push(i - N); if (r < N - 1) out.push(i + N);
  if (c > 0) out.push(i - 1); if (c < N - 1) out.push(i + 1);
  return out;
}

function findMatches(b) {
  const groups = [];
  const scan = (idx) => { // idx(line, k) -> cell index
    for (let line = 0; line < N; line++) {
      let k = 0;
      while (k < N) {
        const s = b[idx(line, k)];
        let e = k;
        while (e + 1 < N && b[idx(line, e + 1)] === s) e++;
        if (s !== null && s < 4 && e - k + 1 >= 3) {
          const cells = []; for (let j = k; j <= e; j++) cells.push(idx(line, j));
          groups.push({ suit: s, cells });
        }
        k = e + 1;
      }
    }
  };
  scan((r, c) => r * N + c);
  scan((c, r) => r * N + c);
  return groups;
}
// Returns one swap [a, b] that makes a match, or null.
function findMove(b) {
  for (let i = 0; i < N * N; i++) {
    for (const j of [i + 1, i + N]) {
      if (j >= N * N || (j === i + 1 && j % N === 0)) continue;
      if (b[i] === THORN || b[j] === THORN || b[i] === b[j]) continue;
      const c = b.slice(); [c[i], c[j]] = [c[j], c[i]];
      if (findMatches(c).length) return [i, j];
    }
  }
  return null;
}

function swapTiles(a, b) { [duel.board[a], duel.board[b]] = [duel.board[b], duel.board[a]]; }
function addThorns(n) {
  const have = duel.board.filter(v => v === THORN).length;
  const free = shuffle(duel.board.map((v, i) => v === THORN ? -1 : i).filter(i => i >= 0));
  free.slice(0, Math.max(0, Math.min(n, MAX_THORNS - have))).forEach(i => { duel.board[i] = THORN; });
}
function ensureMoves() {
  if (findMove(duel.board)) return;
  toast(t('reshuffle'));
  let b = newBoard(duel.board);
  if (!findMove(b)) b = newBoard(); // too many thorns: clear them too
  duel.board = b;
}

// ---------- Duel ----------
function startDuel(eid) {
  const E = ENEMIES[eid], ch = run.chapter;
  const normal = !E.boss && !E.elite;
  // Normal enemies grow per chapter; everyone grows per loop.
  const m = tierMult(run.loop);
  const maxhp = Math.round(E.hp * (normal ? 1 + 0.35 * ch : 1) * m.hp);
  duel = {
    boss: !!E.boss,
    enemy: { name: E.name, img: E.img, hp: maxhp, maxhp, shield: 0,
      atkBonus: normal ? 6 * ch : 0, atkMult: m.atk,
      actions: E.actions, ai: 0, every: E.every, count: E.every },
    board: newBoard(), shield: 8 * lv('guard'), gauge: 0,
    first: null, busy: false, over: false, popping: null, fresh: null, bad: null
  };
  unlock(E.img);
  music(E.boss ? 'mus_boss' : 'mus_duel');
  renderDuel();
  if (!meta.tutorial) {
    duel.busy = true;
    howTo(() => { meta.tutorial = true; saveMeta(); duel.busy = false; renderDuel(); });
  }
}

function hitEnemy(d) {
  const e = duel.enemy;
  const blocked = Math.min(e.shield, d);
  e.shield -= blocked; d -= blocked;
  e.hp = Math.max(0, e.hp - d);
  floatText(d > 0 ? '-' + d : t('blocked'), 'foe', 'dmg');
  Media.sfx('hit');
  if (d > 0) { Media.voice('attack'); shout(t('shoutAttack'), 'attack'); }
}
function hurtPlayer(d) {
  const b = Math.min(duel.shield, d);
  duel.shield -= b; d -= b;
  run.hp = Math.max(0, run.hp - d);
  if (d > 0) { floatText('-' + d, 'me', 'dmg'); Media.sfx('hurt'); Media.voice('hurt'); shout(t('shoutHurt'), 'hurt'); document.body.classList.add('shake'); setTimeout(() => document.body.classList.remove('shake'), 300); }
  else floatText(t('blocked'), 'me', 'poise');
}
function healPlayer(v) {
  const h = Math.min(v, run.maxhp - run.hp);
  run.hp += h;
  if (h > 0) floatText('+' + h, 'me', 'heal');
}

// Applies tile effects for one clear step.
function applyClear(cells, mult) {
  const cnt = [0, 0, 0, 0];
  cells.forEach(i => { const s = duel.board[i]; if (s !== null && s < 4) cnt[s]++; });
  const amt = s => Math.round(cnt[s] * perTile(s) * mult);
  if (cnt[0]) hitEnemy(amt(0));
  if (cnt[1]) { const v = amt(1); duel.shield += v; floatText(t('shieldGain', v), 'me', 'poise'); }
  if (cnt[2]) healPlayer(amt(2));
  if (cnt[3]) duel.gauge = Math.min(gaugeMax(), duel.gauge + amt(3));
}

async function clearAnim(set) {
  duel.popping = set; renderDuel(); await sleep(260);
  set.forEach(i => { duel.board[i] = null; });
  duel.popping = null;
  duel.fresh = gravity();
  renderDuel(); await sleep(230);
  duel.fresh = null;
}
function gravity() {
  const fresh = new Set();
  for (let c = 0; c < N; c++) {
    const col = [];
    for (let r = N - 1; r >= 0; r--) { const v = duel.board[r * N + c]; if (v !== null) col.push(v); }
    for (let r = N - 1, k = 0; r >= 0; r--, k++) {
      if (k < col.length) duel.board[r * N + c] = col[k];
      else { duel.board[r * N + c] = rnd(4); fresh.add(r * N + c); }
    }
  }
  return fresh;
}

// Clears matches until the board settles. Returns true if the player's own match had 5+ tiles (extra move).
async function resolve() {
  let depth = 0, big = false;
  while (duel.enemy.hp > 0) {
    const groups = findMatches(duel.board);
    if (!groups.length) break;
    depth++;
    if (depth === 1 && groups.some(g => g.cells.length >= 5)) big = true;
    const set = new Set();
    groups.forEach(g => g.cells.forEach(i => set.add(i)));
    [...set].forEach(i => neighbors(i).forEach(j => { if (duel.board[j] === THORN) set.add(j); }));
    const mult = 1 + 0.5 * (depth - 1);
    if (depth > 1) floatText(t('combo', mult), 'board', 'combo');
    applyClear([...set], mult);
    Media.sfx('match');
    await clearAnim(set);
  }
  return big;
}

async function trySwap(a, b) {
  duel.busy = true; duel.first = null;
  swapTiles(a, b);
  if (!findMatches(duel.board).length) {
    duel.bad = [a, b]; renderDuel(); await sleep(300);
    swapTiles(a, b); duel.bad = null; duel.busy = false; renderDuel();
    toast(t('noMatch'));
    return;
  }
  renderDuel(); await sleep(120);
  const extra = await resolve();
  if (duel.enemy.hp <= 0) return winDuel();
  if (extra) floatText(t('extraMove'), 'board', 'combo');
  else if (--duel.enemy.count <= 0) {
    renderDuel(); await sleep(250);
    await enemyAct();
    duel.enemy.count = duel.enemy.every;
    if (run.hp <= 0) return defeat();
  }
  ensureMoves();
  duel.busy = false; renderDuel();
}

async function finisher() {
  if (duel.busy || duel.gauge < gaugeMax()) return;
  duel.busy = true; duel.gauge = 0; duel.first = null;
  floatText(t('finisherShout'), 'board', 'combo');
  hitEnemy(finisherDmg());
  const thorns = new Set(duel.board.map((v, i) => v === THORN ? i : -1).filter(i => i >= 0));
  if (thorns.size) await clearAnim(thorns);
  await resolve();
  if (duel.enemy.hp <= 0) return winDuel();
  ensureMoves();
  duel.busy = false; renderDuel();
}

const scaled = (a, e) => Math.round(a.v * e.atkMult) + (a.t === 'atk' ? e.atkBonus : 0);
function actionHTML(a, e) {
  switch (a.t) {
    case 'atk': return `<b class="i-atk">${icon('blade')}${t('intentAtk', scaled(a, e))}</b>`;
    case 'thorn': return `<b>${icon('thorn')}${t('intentThorn', a.v)}</b>`;
    case 'guard': return `<b>${icon('shield')}${t('intentGuard', scaled(a, e))}</b>`;
    case 'heal': return `<b>${icon('wine')}${t('intentHeal', scaled(a, e))}</b>`;
  }
  return '';
}

async function enemyAct() {
  const e = duel.enemy, a = e.actions[e.ai], v = scaled(a, e);
  e.ai = (e.ai + 1) % e.actions.length;
  if (a.t === 'atk') hurtPlayer(v);
  else if (a.t === 'thorn') { addThorns(a.v); floatText(t('thornsPlanted', a.v), 'board', 'dmg'); }
  else if (a.t === 'guard') { e.shield += v; floatText(t('shieldGain', v), 'foe', 'poise'); }
  else if (a.t === 'heal') { const h = Math.min(v, e.maxhp - e.hp); e.hp += h; floatText('+' + h, 'foe', 'heal'); }
  duel.shield = 0; // your shield only lasts until the enemy's next action
  renderDuel(); await sleep(400);
}

// ---------- Hint after 5 seconds idle ----------
let hintTimer = null;
function armHint() {
  clearTimeout(hintTimer);
  if (!duel || duel.busy || duel.over) return;
  hintTimer = setTimeout(() => {
    if (!duel || duel.busy || duel.over) return;
    const m = findMove(duel.board);
    if (m) m.forEach(i => { const t = $(`.tile[data-i="${i}"]`); if (t) t.classList.add('hintglow'); });
  }, 5000);
}

function onTile(i) {
  if (duel.busy) return;
  if (duel.board[i] === THORN) { toast(t('thornToast')); return; }
  const a = duel.first;
  if (a === null || !isAdj(a, i)) { duel.first = a === i ? null : i; return renderDuel(); }
  trySwap(a, i);
}

function renderDuel() {
  const d = duel, e = d.enemy;
  const next = e.actions[e.ai];
  const gm = gaugeMax(), ready = d.gauge >= gm;
  const hint = d.busy ? '' : t(d.first !== null ? 'hintSelected' : 'hintIdle');
  // Danger: low HP, or the enemy's attack next turn would get through your shield and finish you.
  const incoming = next.t === 'atk' && e.count === 1 ? scaled(next, e) - d.shield : 0;
  const danger = run.hp > 0 && (run.hp <= run.maxhp * 0.3 || incoming >= run.hp);
  app().innerHTML = `${hudHTML(false)}
  <div class="duel">
    <div class="foe ${e.hp <= 0 ? 'dead' : ''}" id="foe">
      <div class="foe-art"></div>
      <div class="foe-info">
        <div class="foe-name">${e.name}</div>
        ${bar(e.hp, e.maxhp, 'hpbar')}
        <div class="chips">${e.shield ? chip(icon('shield'), e.shield, t('shieldTipFoe')) : ''}</div>
        <div class="intent">${t('nextAction')} ${actionHTML(next, e)}
          <span class="countdown ${e.count === 1 ? 'soon' : ''}">${e.count === 1 ? t('countNext') : t('countIn', e.count)}</span></div>
      </div>
    </div>
    <div class="board" id="board">${d.board.map((v, i) => {
      const cls = [v === THORN ? 'thorn' : v === null ? '' : 's' + v, d.first === i ? 'sel' : '',
        d.popping && d.popping.has(i) ? 'pop' : '', d.fresh && d.fresh.has(i) ? 'drop' : '',
        d.bad && d.bad.includes(i) ? 'bad' : ''].join(' ');
      return `<button class="tile ${cls}" data-i="${i}">${v === null ? '' : tileArt(v)}</button>`;
    }).join('')}</div>
    <div class="hint">${hint}</div>
    <div class="me" id="me">
      <div class="me-hp ${danger ? 'danger' : ''}"><span class="me-label">${icon('heart')}${t('me')}</span>${bar(run.hp, run.maxhp, 'hpbar mine')}${danger ? `<b class="danger-tag">${t('danger')}</b>` : ''}</div>
      <div class="me-row">
        ${chip(icon('shield'), d.shield, t('shieldTipMe'))}
        <div class="gauge ${ready ? 'full' : ''}"><div style="width:${100 * d.gauge / gm}%"></div><span>${icon('mask')}${d.gauge}/${gm}</span></div>
        <button class="btn ${ready ? 'primary glow' : ''}" id="fin" ${ready && !d.busy ? '' : 'disabled'}>${t('finisherBtn', finisherDmg())}</button>
      </div>
    </div>
    ${legendBar()}
  </div>`;
  $('.foe-art').appendChild(Media.art(e.img, 'portrait'));
  bindHud();
  bind('.tile', el => onTile(+el.dataset.i));
  bind('#fin', finisher);
  bindDrag($('#board'));
  armHint();
  if (!d.busy && !d.over) saveRun('duel');
}

// Drag a tile onto its neighbour to swap (mouse and touch).
function bindDrag(board) {
  let from = null;
  board.addEventListener('pointerdown', e => {
    const t = e.target.closest('.tile');
    from = t ? +t.dataset.i : null;
  });
  board.addEventListener('pointerup', e => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const t = el && el.closest('.tile');
    const to = t ? +t.dataset.i : null;
    if (from === null || to === null || to === from || duel.busy) { from = null; return; }
    const a = from; from = null;
    if (!isAdj(a, to) || duel.board[a] === THORN || duel.board[to] === THORN) return;
    trySwap(a, to);
  });
}

// ---------- Rewards ----------
function applyBlessing(id) {
  if (id === 'heart') { run.maxhp += 10; run.hp = Math.min(run.maxhp, run.hp + 10); }
  else if (id === 'rest') run.hp = Math.min(run.maxhp, run.hp + Math.round(run.maxhp * 0.4));
  else run.bless[id] = lv(id) + 1;
}

function blessingScreen(heading, notes, onDone, choices = shuffle(Object.keys(BLESSINGS)).slice(0, 3)) {
  saveRun('blessing', { heading, notes, choices });
  app().innerHTML = `${hudHTML()}
    <div class="screen reward">
      <h2>${heading}</h2>
      ${notes.map(n => `<p>${n}</p>`).join('')}
      <p class="sub">${t('pickBlessing')}</p>
      <div class="choices">${choices.map(id => `<button class="bless" data-b="${id}">
        <b>${BLESSINGS[id].name}</b><small>${BLESSINGS[id].text}</small>${lv(id) ? `<em>${t('owned', lv(id))}</em>` : ''}</button>`).join('')}</div>
    </div>`;
  bindHud();
  let chosen = false;
  bind('.bless', el => {
    if (chosen) return; chosen = true;
    applyBlessing(el.dataset.b);
    toast('✦ ' + BLESSINGS[el.dataset.b].name);
    onDone();
  });
}

function winDuel() {
  duel.over = true; duel.busy = true;
  clearTimeout(hintTimer);
  renderDuel();
  Media.sfx('win');
  const notes = [];
  if (duel.boss) {
    const h = Math.min(Math.round(run.maxhp * 0.3), run.maxhp - run.hp);
    run.hp += h;
    notes.push(t('healed', h));
  }
  setTimeout(() => blessingScreen(t(duel.boss ? 'bossWin' : 'win'), notes, afterNode), 700);
}

// ---------- Story events ----------
function story(id) {
  const ev = EVENTS[id];
  music(ev.music || 'mus_court');
  if (!ev.choices.some(c => c.fx.gallery)) unlock(ev.img);
  saveRun('event', { id });
  app().innerHTML = `${hudHTML()}
    <div class="screen event">
      <div class="ev-art"></div>
      <div class="ev-body">
        <h2>${ev.title}</h2>
        <p class="ev-text">${ev.text}</p>
        <div class="ev-choices">${ev.choices.map((c, i) => `<button class="btn choice" data-c="${i}"><b>${c.label}</b><small>${c.desc}</small></button>`).join('')}</div>
      </div>
    </div>`;
  $('.ev-art').appendChild(Media.art(ev.img, 'scene'));
  bindHud();
  let chosen = false;
  bind('.choice', el => {
    if (chosen) return;
    chosen = true;
    eventResult(applyFx(ev.choices[+el.dataset.c].fx));
  });
}

function gainBlessing(id, m) {
  applyBlessing(id);
  m.push(t('gainedBlessing', BLESSINGS[id].name, BLESSINGS[id].text));
}

function applyFx(fx) {
  const m = [];
  if (fx.heal) { const h = Math.min(fx.heal, run.maxhp - run.hp); run.hp += h; m.push(t('healed', h)); }
  if (fx.hurt) { run.hp = Math.max(1, run.hp - fx.hurt); m.push(t('hpLost', fx.hurt)); }
  if (fx.maxhp) {
    run.maxhp += fx.maxhp;
    run.hp = fx.maxhp > 0 ? run.hp + fx.maxhp : Math.min(run.hp, run.maxhp);
    m.push(t('maxHpChange', fx.maxhp));
  }
  if (fx.bless) gainBlessing(fx.bless === 'random' ? pick(Object.keys(BLESSINGS)) : fx.bless, m);
  if (fx.gallery) { unlock(fx.gallery); m.push(t('memory')); }
  if (fx.gamble) {
    if (Math.random() < 0.5) { const h = Math.min(15, run.maxhp - run.hp); run.hp += h; m.push(t('gambleWin', h)); }
    else { run.hp = Math.max(1, run.hp - 8); m.push(t('gambleLose')); gainBlessing('whisper', m); }
  }
  if (!m.length) m.push(t('nothing'));
  return m;
}

function eventResult(msgs) {
  $('.ev-choices').innerHTML = `${msgs.map(x => `<p class="result">${x}</p>`).join('')}<button class="btn primary" id="cont">${t('cont')}</button>`;
  $('.hud').outerHTML = hudHTML(); bindHud();
  saveRun('eventDone');
  bind('#cont', afterNode);
}

// ---------- Wine cellar (rest) ----------
function cellar() {
  music('mus_salon');
  saveRun('cellar');
  const h = Math.round(run.maxhp * 0.3);
  app().innerHTML = `${hudHTML()}
    <div class="screen event">
      <div class="ev-art"></div>
      <div class="ev-body">
        <h2>${t('cellar')}</h2>
        <p class="ev-text">${t('cellarText')}</p>
        <div class="ev-choices">
          <button class="btn choice" id="rest"><b>${t('rest')}</b><small>${t('healed', h)}</small></button>
          <button class="btn choice" id="reflect"><b>${t('reflect')}</b><small>${t('reflectDesc')}</small></button>
        </div>
      </div>
    </div>`;
  $('.ev-art').appendChild(Media.art('cellar', 'scene'));
  unlock('cellar');
  bindHud();
  let chosen = false;
  bind('#rest', () => { if (chosen) return; chosen = true; run.hp = Math.min(run.maxhp, run.hp + h); afterNode(); });
  bind('#reflect', () => { if (chosen) return; chosen = true; blessingScreen(t('reflectHead'), [], afterNode); });
}

// ---------- Endings ----------
function defeat() {
  if (!duel || duel.over) return;
  duel.over = true; duel.busy = true;
  clearTimeout(hintTimer);
  clearRun();
  if (!run.revived) return setTimeout(revivePrompt, 500);
  giveUp();
}
function giveUp() {
  unlock('defeat');
  const label = tierLabel(run.loop), where = progress() + 1;
  setTimeout(() => playCine('vid_defeat', () => endScreen(t('defeatHead'), t('defeatText', label, where))), 600);
}
// One revive per run: watch a rewarded ad and keep fighting this duel at half HP.
function revivePrompt() {
  const ov = overlay(`<h2>${t('reviveHead')}</h2>
    <p class="sub">${t('reviveNote')}</p>
    <div class="menu col">
      <button class="btn primary" id="rv-ad">${t(Ads.isAdFree() ? 'reviveFree' : 'reviveAd')}</button>
      <button class="btn" id="rv-no">${t('reviveNo')}</button>
      ${Ads.isAdFree() ? '' : `<button class="btn ghost sm" id="rv-buy">${t('reviveBuy', Shop.price())}</button>`}
    </div>`, true);
  const buy = ov.querySelector('#rv-buy');
  if (buy) buy.onclick = async () => { if (await Shop.buy()) { ov.remove(); toast(t('adFreeThanks')); revive(); } };
  ov.querySelector('#rv-ad').onclick = async () => {
    ov.remove();
    if (await Ads.rewarded()) revive(); else giveUp();
  };
  ov.querySelector('#rv-no').onclick = () => { ov.remove(); giveUp(); };
}
function revive() {
  run.revived = true;
  run.hp = Math.round(run.maxhp * 0.5);
  duel.shield = 0; duel.enemy.count = duel.enemy.every;
  duel.over = false; duel.busy = false;
  ensureMoves();
  toast(t('revived'));
  renderDuel();
}
function victory() {
  // The story ending (and a throne win) belongs to clearing the hard tier; easy and normal end on a tier-clear screen.
  if (run.loop === TIERS.length - 1) { meta.wins++; saveMeta(); unlock('victory'); return playCine('vid_ending', throneScreen); }
  throneScreen();
}
// After the final boss of a tier: go on to the next tier (or the next Throne Challenge round), or stop here.
function throneScreen() {
  music('mus_title');
  saveRun('throne');
  const L = run.loop, next = tierMult(L + 1);
  const head = L < TIERS.length - 1 ? t('tierClear', tierLabel(L)) : L === TIERS.length - 1 ? t('throneHead') : t('throneHeadLoop', tierLabel(L));
  const text = t(L < TIERS.length - 1 ? 'tierClearText' : L === TIERS.length - 1 ? 'throneText' : 'throneTextLoop');
  app().innerHTML = `${hudHTML()}<div class="screen end">
    <h1>${head}</h1>
    <p>${text}</p>
    <p class="stats">${t('throneStats', cleared(), meta.best)}</p>
    <div class="menu">
      <button class="btn primary" id="keep">${L === TIERS.length - 1 ? t('throneStart') : t('nextTier', tierLabel(L + 1))}</button>
      <button class="btn" id="again">${t('newJourney')}</button><button class="btn" id="menu">${t('toTitle')}</button>
    </div>
    <p class="sub">${t('tierNote', tierLabel(L + 1), next.hp.toFixed(1), next.atk.toFixed(1))}</p>
  </div>`;
  bindHud();
  bind('#keep', () => {
    run.loop++;
    run.revived = false; // one ad revive per tier
    run.hp = Math.min(run.maxhp, run.hp + Math.round(run.maxhp * 0.5));
    toast(t('tierToast', tierLabel(run.loop)));
    startChapter(0);
  });
  bind('#again', startRun);
  bind('#menu', title);
}
function endScreen(head, text) {
  music('mus_title');
  app().innerHTML = `<div class="screen end">
    <h1>${head}</h1><p>${text}</p>
    <p class="stats">${t('endStats', meta.runs, meta.wins, meta.best, meta.gallery.length, Object.keys(ASSETS.images).length)}</p>
    <div class="menu"><button class="btn primary" id="again">${t('retry')}</button><button class="btn" id="menu">${t('toTitle')}</button></div>
  </div>`;
  run = null; duel = null; clearRun();
  bind('#again', startRun);
  bind('#menu', title);
}

// ---------- Gallery ----------
function gallery() {
  const ids = Object.keys(ASSETS.images);
  app().innerHTML = `<div class="screen gallery">
    <h2>${t('gallery')} <small>${meta.gallery.length}/${ids.length}</small></h2>
    <div class="galgrid">${ids.map(id => `<div class="gal ${meta.gallery.includes(id) ? '' : 'locked'}" data-id="${id}"><span>${meta.gallery.includes(id) ? ASSETS.images[id].title : '???'}</span></div>`).join('')}</div>
    <button class="btn" id="back">${t('back')}</button>
  </div>`;
  document.querySelectorAll('.gal').forEach(el => {
    if (!meta.gallery.includes(el.dataset.id)) return;
    el.prepend(Media.art(el.dataset.id, 'thumb'));
    el.addEventListener('click', () => {
      const ov = overlay(`<div class="big"></div><h2>${ASSETS.images[el.dataset.id].title}</h2>`);
      ov.querySelector('.big').appendChild(Media.art(el.dataset.id, 'scene'));
    });
  });
  bind('#back', title);
}

// ---------- AI asset prompt sheet (for manual generation) ----------
function promptSheet() {
  const row = (kind, id, path, prompt) => `<tr><td><code>${id}</code><br><small>${kind}</small></td><td><code>${path}</code></td>
    <td class="pr">${prompt}</td><td><button class="btn sm copy">${t('copy')}</button></td></tr>`;
  const rows = [
    ...Object.entries(ASSETS.images).map(([id, a]) => row(t('kindImg'), id, `assets/img/${id}.webp`, a.prompt)),
    ...Object.entries(ASSETS.music).map(([id, a]) => row(t('kindMusic'), id, `assets/music/${id}.mp3`, a.prompt)),
    ...Object.entries(ASSETS.videos).map(([id, a]) => row(t('kindVideo'), id, `assets/video/${id}.mp4`, a.prompt))
  ];
  app().innerHTML = `<div class="screen sheet">
    <h2>${t('prompts')}</h2>
    <p class="sub">${t('sheetSub')}</p>
    <p class="sub"><b>${t('negLabel')}</b> <code>${NEGATIVE_PROMPT}</code><br>${t('sheetWarn')}</p>
    <div class="menu"><button class="btn" id="back">${t('back')}</button><button class="btn" id="json">${t('json')}</button></div>
    <div class="tablewrap"><table><thead><tr><th>ID</th><th>${t('thPath')}</th><th>${t('thPrompt')}</th><th></th></tr></thead><tbody>${rows.join('')}</tbody></table></div>
  </div>`;
  bind('#back', title);
  bind('.copy', el => {
    const text = el.closest('tr').querySelector('.pr').textContent;
    navigator.clipboard.writeText(text).then(() => toast(t('copied'))).catch(() => toast(t('copyFail')));
  });
  bind('#json', () => {
    const blob = new Blob([JSON.stringify(ASSETS, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'velvet-thorn-asset-prompts.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
}

// Android back button: close the top dialog, skip a cutscene, pause a run, or leave from the title.
if (IS_APP && Capacitor.Plugins.App) Capacitor.Plugins.App.addListener('backButton', () => {
  const cineEl = document.querySelector('.cine-skip');
  const ovs = [...document.querySelectorAll('.overlay')];
  if (cineEl) cineEl.click();
  else if (pauseOv) { pauseOv.remove(); pauseOv = null; }
  else if (ovs.length) { if (!document.getElementById('rv-ad') && !document.querySelector('.ad-test')) ovs[ovs.length - 1].remove(); }
  else if (run) pauseMenu();
  else if (document.querySelector('.title-screen')) Capacitor.Plugins.App.exitApp();
  else title();
});

setLang(detectLang());
Ads.init();
Shop.init(() => { if (!run && document.querySelector('.title-screen')) title(); });
Ads.banner();
title();
