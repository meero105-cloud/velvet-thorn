// Balance bot: plays full journeys headlessly and reports how far it gets per difficulty tier.
// Usage: node tools/balance-bot.js [runs=20] [smart|random]   (needs Playwright + Chromium)
const { chromium } = require('playwright');
const path = require('path');
const RUNS = +process.argv[2] || 20; const MODE = process.argv[3] || 'smart';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ locale: 'ko-KR' });
  await ctx.addInitScript(() => { const o = window.setTimeout; window.setTimeout = (f, ms, ...a) => o(f, 0, ...a); });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const res = await p.evaluate(async ([RUNS, MODE]) => { const LIMIT = MODE === 'random' ? 1 : 5;
    meta.tutorial = true;
    function score(m) {
      const c = duel.board.slice(); [c[m[0]], c[m[1]]] = [c[m[1]], c[m[0]]];
      const g = findMatches(c); if (!g.length) return -1;
      const cnt = [0, 0, 0, 0]; let big = 0;
      g.forEach(x => { cnt[x.suit] += x.cells.length; if (x.cells.length >= 5) big = 1; });
      const e = duel.enemy, nx = e.actions[e.ai];
      const wr = nx.t === 'atk' && e.count === 1 ? 1.5 : 0.2;
      const ww = run.hp / run.maxhp < 0.5 ? 1.2 : 0.3;
      return cnt[0] + cnt[1] * wr + cnt[2] * ww + cnt[3] * 0.7 + big * 3 + Math.random() * 0.1;
    }
    function best() {
      let bm = null, bs = -1;
      for (let i = 0; i < N * N; i++) for (const j of [i + 1, i + N]) {
        if (j >= N * N || (j === i + 1 && j % N === 0)) continue;
        if (duel.board[i] === THORN || duel.board[j] === THORN) continue;
        const s = MODE === 'random' ? (score([i, j]) < 0 ? -1 : Math.random()) : score([i, j]); if (s > bs) { bs = s; bm = [i, j]; }
      }
      return bm;
    }
    const out = [];
    for (let r = 0; r < RUNS; r++) {
      run = { hp: PLAYER_HP, maxhp: PLAYER_HP, bless: {}, chapter: 0, node: 0, loop: 0 };
      let dead = false, guard = 0;
      while (!dead && run.loop < LIMIT) {
        for (let c = 0; c < CHAPTERS.length && !dead; c++) {
          run.chapter = c;
          for (let n = 0; n < CHAPTERS[c].nodes.length && !dead; n++) {
            run.node = n; const nd = CHAPTERS[c].nodes[n];
            if (nd.type === 'duel') {
              startDuel(nd.enemy); duel.busy = false;
              while (run.hp > 0 && duel.enemy.hp > 0 && guard++ < 1e6) {
                if (duel.gauge >= gaugeMax()) { await finisher(); continue; }
                const m = best(); if (!m) { ensureMoves(); continue; }
                await trySwap(m[0], m[1]);
              }
              document.querySelectorAll('.overlay').forEach(o => o.remove());
              if (run.hp <= 0) { dead = true; out.push({ loop: run.loop, stage: progressOf(c, n), foe: nd.enemy }); break; }
              applyBlessing(shuffle(Object.keys(BLESSINGS))[0]);
            } else if (nd.type === 'event') { applyFx(pick(EVENTS[nd.id].choices).fx); }
            else run.hp = Math.min(run.maxhp, run.hp + Math.round(run.maxhp * 0.3));
          }
        }
        if (!dead) { run.loop++; run.hp = Math.min(run.maxhp, run.hp + Math.round(run.maxhp * 0.5)); }
      }
      if (!dead) out.push({ loop: LIMIT, stage: 0, foe: '-' });
    }
    function progressOf(c, n) { return CHAPTERS.slice(0, c).reduce((s, x) => s + x.nodes.length, 0) + n + 1; }
    return out;
  }, [RUNS, MODE]);
  const byTier = {}; const foes = {};
  res.forEach(x => { byTier[x.loop] = (byTier[x.loop] || 0) + 1; const k = x.loop + ':' + x.foe; foes[k] = (foes[k] || 0) + 1; });
  const reach = l => res.filter(x => x.loop > l).length;
  console.log('runs', res.length, 'TOTAL_NODES', await p.evaluate(() => TOTAL_NODES));
  ['easy', 'normal', 'hard', 'throne1', 'throne2', 'throne3'].forEach((n, l) => console.log(`cleared ${n}: ${reach(l)}/${res.length}`));
  console.log('deaths by tier:foe', foes);
  console.log('errors', errs.slice(0, 3));
  await b.close();
})();
