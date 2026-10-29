// Media layer: real AI assets if present in assets/, procedural placeholders otherwise.
const Media = (() => {
  const EMBLEMS = {
    crown: 'M-60,30 L-60,-20 L-30,10 L0,-40 L30,10 L60,-20 L60,30 Z',
    mask: 'M-70,-20 Q0,-50 70,-20 Q70,30 30,30 Q0,10 -30,30 Q-70,30 -70,-20 Z M-45,-5 a14,9 0 1,0 28,0 a14,9 0 1,0 -28,0 M17,-5 a14,9 0 1,0 28,0 a14,9 0 1,0 -28,0',
    rose: 'M0,-40 C30,-40 40,-10 20,5 C40,20 10,45 0,30 C-10,45 -40,20 -20,5 C-40,-10 -30,-40 0,-40 Z M-3,30 L-3,70 L3,70 L3,30 Z',
    dagger: 'M-6,-70 L6,-70 L8,20 L-8,20 Z M-35,20 L35,20 L35,30 L-35,30 Z M-6,30 L6,30 L6,65 L-6,65 Z',
    eye: 'M-75,0 Q0,-55 75,0 Q0,55 -75,0 Z M-22,0 a22,22 0 1,0 44,0 a22,22 0 1,0 -44,0',
    chalice: 'M-40,-50 L40,-50 Q40,10 0,15 Q-40,10 -40,-50 Z M-4,15 L4,15 L4,50 L-4,50 Z M-30,50 L30,50 L30,60 L-30,60 Z',
    letter: 'M-70,-40 L70,-40 L70,40 L-70,40 Z M-70,-40 L0,10 L70,-40 M0,10 a12,12 0 1,0 0.1,0',
    tower: 'M-30,60 L-30,-30 L0,-70 L30,-30 L30,60 Z M-10,60 L-10,20 Q0,5 10,20 L10,60 Z'
  };

  function placeholderSVG(id) {
    const drawn = Art.draw(id);
    if (drawn) return drawn;
    const m = ASSETS.images[id] || { title: id, emblem: 'rose', palette: ['#12060c', '#5c1430'] };
    const [a, b] = m.palette;
    const gid = 'g' + id + Math.random().toString(36).slice(2, 7);
    return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="${gid}" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></radialGradient></defs>
      <rect width="300" height="400" fill="url(#${gid})"/>
      <g opacity="0.12" stroke="#e8c27a" fill="none">${[...Array(6)].map((_, i) => `<circle cx="150" cy="170" r="${40 + i * 28}"/>`).join('')}</g>
      <g transform="translate(150,170)" fill="#e8c27a" fill-opacity="0.85" fill-rule="evenodd"><path d="${EMBLEMS[m.emblem] || EMBLEMS.rose}"/></g>
      <text x="150" y="330" text-anchor="middle" fill="#f3e2c0" font-family="Georgia,serif" font-size="22">${m.title}</text>
      <text x="150" y="356" text-anchor="middle" fill="#f3e2c0" fill-opacity="0.45" font-family="monospace" font-size="11">${t('placeholder')} · ${id}</text>
    </svg>`;
  }

  // Tries assets/img/<id>.webp|png|jpg, keeps the procedural placeholder if none exist.
  function art(id, cls = '') {
    const el = document.createElement('div');
    el.className = 'art ' + cls;
    el.innerHTML = placeholderSVG(id);
    const exts = ['webp', 'png', 'jpg'];
    const tryNext = i => {
      if (i >= exts.length) return;
      const im = new Image();
      im.onload = () => { el.innerHTML = ''; im.className = 'art-img'; el.appendChild(im); };
      im.onerror = () => tryNext(i + 1);
      im.src = `assets/img/${id}.${exts[i]}`;
    };
    tryNext(0);
    return el;
  }

  // ---------- Music ----------
  let ctx = null, master = null, muted = false, currentId = null, audioEl = null, synth = null;
  try { muted = localStorage.getItem('vt_muted') === '1'; } catch (e) {}

  function ensureCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.3;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
  }

  // ---------- Synth music (plays when assets/music/<id>.mp3 is missing) ----------
  // Each track is a minor-key chord loop played by a string pad, a bass, a plucked arpeggio and a melody,
  // all sent through a hall reverb. Patterns are in eighth notes; melody numbers are scale degrees (null = rest).
  const MINOR = [0, 2, 3, 5, 7, 8, 10];
  const HARM = [0, 2, 3, 5, 7, 8, 11]; // harmonic minor: the raised 7th gives the baroque cadence
  const _ = null;
  const TRACKS = {
    mus_title: { bpm: 64, beats: 4, root: 57, scale: HARM, prog: [0, 5, 3, 4], vol: .9,
      pad: 'strings', bass: 'half', arp: { inst: 'harpsi', pat: [0, 2, 4, 7, 4, 2, 0, 2], vol: .06 },
      mel: { inst: 'violin', vol: .07, notes: [4, _, _, 3, 2, _, 1, _, 0, _, _, _, -1, _, _, _, 2, _, _, 1, 0, _, -1, _, -2, _, _, _, -3, _, _, _] } },
    mus_court: { bpm: 152, beats: 3, root: 62, scale: MINOR, prog: [0, 3, 6, 4], vol: .9, waltz: true,
      pad: 'strings', bass: 'waltz', arp: { inst: 'pizz', pat: [_, _, 2, _, 4, _], vol: .08 },
      mel: { inst: 'flute', vol: .06, notes: [4, _, 5, _, 4, _, 2, _, _, _, 0, _, 3, _, 4, _, 3, _, 1, _, _, _, -1, _] } },
    mus_duel: { bpm: 112, beats: 4, root: 57, scale: HARM, prog: [0, 0, 5, 4], vol: 1,
      pad: 'strings', bass: 'drive', arp: { inst: 'harpsi', pat: [0, 4, 7, 4, 0, 4, 7, 9], vol: .05 }, perc: 'battle',
      mel: { inst: 'violin', vol: .06, notes: [7, _, 6, 7, 4, _, _, _, 5, _, 4, 5, 2, _, _, _, 4, _, 3, 4, 1, _, 2, _, 0, _, _, _, _, _, _, _] } },
    mus_boss: { bpm: 126, beats: 4, root: 50, scale: HARM, prog: [0, 5, 1, 4], vol: 1,
      pad: 'organ', bass: 'drive', arp: { inst: 'harpsi', pat: [0, 2, 4, 2, 7, 4, 2, 4], vol: .045 }, perc: 'boss',
      mel: { inst: 'brass', vol: .07, notes: [0, _, _, 0, 4, _, _, _, 5, _, 4, _, 6, _, _, _, 7, _, _, 6, 5, _, 4, _, 6, _, _, _, 4, _, _, _] } },
    mus_salon: { bpm: 84, beats: 4, root: 52, scale: MINOR, prog: [0, 3, 5, 4], vol: .9,
      pad: 'strings', bass: 'half', arp: { inst: 'harp', pat: [0, 2, 4, 7, 9, 7, 4, 2], vol: .06 },
      mel: { inst: 'violin', vol: .07, notes: [7, _, _, _, 6, _, 4, _, 5, _, _, _, 4, _, _, _, 2, _, 4, _, 3, _, 1, _, 2, _, _, _, _, _, _, _] } }
  };
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);
  const pitch = (tr, d) => midi(tr.root + 12 * Math.floor(d / 7) + tr.scale[((d % 7) + 7) % 7]);

  // Instruments: each schedules one note on context c into destination out.
  function osc(c, type, f, detune = 0) { const o = c.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = detune; return o; }
  function env(c, out, t, a, peak, dur, rel = .1) {
    const g = c.createGain(); g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setValueAtTime(peak, t + Math.max(a, dur - rel));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + rel);
    g.connect(out); return g;
  }
  const INST = {
    harpsi(c, out, f, t, dur, vol) {
      const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + .6); g.connect(out);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(5000, t); lp.frequency.exponentialRampToValueAtTime(900, t + .25); lp.connect(g);
      [osc(c, 'sawtooth', f), osc(c, 'square', f * 2, 4)].forEach(o => { o.connect(lp); o.start(t); o.stop(t + .65); });
    },
    pizz(c, out, f, t, dur, vol) {
      const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + .3); g.connect(out);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1600; lp.connect(g);
      const o = osc(c, 'triangle', f); o.connect(lp); o.start(t); o.stop(t + .35);
    },
    harp(c, out, f, t, dur, vol) {
      const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4); g.connect(out);
      [osc(c, 'sine', f), osc(c, 'triangle', f * 2)].forEach((o, i) => { const k = c.createGain(); k.gain.value = i ? .25 : 1; o.connect(k); k.connect(g); o.start(t); o.stop(t + 1.5); });
    },
    violin(c, out, f, t, dur, vol) {
      const g = env(c, out, t, .08, vol, dur, .25);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600; lp.Q.value = 2; lp.connect(g);
      const o = osc(c, 'sawtooth', f), vib = osc(c, 'sine', 5.5), vg = c.createGain();
      vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(f * .006, t + .3);
      vib.connect(vg); vg.connect(o.frequency); o.connect(lp);
      o.start(t); vib.start(t); o.stop(t + dur + .4); vib.stop(t + dur + .4);
    },
    flute(c, out, f, t, dur, vol) {
      const g = env(c, out, t, .05, vol, dur, .15);
      const o = osc(c, 'sine', f), o2 = osc(c, 'triangle', f * 2), k = c.createGain(); k.gain.value = .15;
      o.connect(g); o2.connect(k); k.connect(g);
      [o, o2].forEach(x => { x.start(t); x.stop(t + dur + .3); });
    },
    brass(c, out, f, t, dur, vol) {
      const g = env(c, out, t, .04, vol, dur, .2);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(600, t); lp.frequency.linearRampToValueAtTime(2200, t + .08); lp.frequency.linearRampToValueAtTime(1400, t + dur); lp.connect(g);
      [osc(c, 'sawtooth', f), osc(c, 'sawtooth', f, 8)].forEach(o => { o.connect(lp); o.start(t); o.stop(t + dur + .3); });
    },
    strings(c, out, f, t, dur, vol) {
      const g = env(c, out, t, .5, vol, dur, .6);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1300; lp.connect(g);
      [-8, 0, 8].forEach(d => { const o = osc(c, 'sawtooth', f, d); o.connect(lp); o.start(t); o.stop(t + dur + .7); });
    },
    organ(c, out, f, t, dur, vol) {
      const g = env(c, out, t, .12, vol, dur, .4);
      [[1, 'sine', 1], [2, 'sine', .5], [3, 'triangle', .25], [.5, 'sine', .6]].forEach(([m, type, lv]) => {
        const o = osc(c, type, f * m), k = c.createGain(); k.gain.value = lv; o.connect(k); k.connect(g); o.start(t); o.stop(t + dur + .5);
      });
    },
    bass(c, out, f, t, dur, vol) {
      const g = env(c, out, t, .01, vol, dur, .08);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500; lp.connect(g);
      [osc(c, 'triangle', f), osc(c, 'sine', f / 2)].forEach(o => { o.connect(lp); o.start(t); o.stop(t + dur + .2); });
    },
    timpani(c, out, f, t, dur, vol) {
      const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + .7); g.connect(out);
      const o = osc(c, 'sine', f * 1.5); o.frequency.exponentialRampToValueAtTime(f, t + .12); o.connect(g); o.start(t); o.stop(t + .75);
      noiseHit(c, out, t, vol * .5, 300, .1);
    },
    tick(c, out, f, t, dur, vol) { noiseHit(c, out, t, vol, 6000, .04, 'highpass'); }
  };
  function noiseHit(c, out, t, vol, freq, len, type = 'lowpass') {
    const n = Math.floor(c.sampleRate * len), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
    s.buffer = buf; fl.type = type; fl.frequency.value = freq; g.gain.value = vol;
    s.connect(fl); fl.connect(g); g.connect(out); s.start(t);
  }

  // Hall reverb from a decaying noise impulse.
  function makeBus(c, dest, vol) {
    const bus = c.createGain(); bus.gain.value = vol;
    const len = Math.floor(c.sampleRate * 2.6), ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    const verb = c.createConvolver(), wet = c.createGain(); verb.buffer = ir; wet.gain.value = .32;
    bus.connect(dest); bus.connect(verb); verb.connect(wet); wet.connect(dest);
    return bus;
  }

  // Schedules eighth-note step s of track tr at time t.
  function scheduleStep(c, bus, tr, s, t) {
    const per = tr.beats * 2, e = 60 / tr.bpm / 2;
    const bar = Math.floor(s / per), pos = s % per, chord = tr.prog[bar % tr.prog.length];
    if (pos === 0) [0, 2, 4].forEach(k => INST[tr.pad](c, bus, pitch(tr, chord + k - 7), t, e * per, tr.pad === 'organ' ? .035 : .03));
    const B = f => INST.bass(c, bus, f, t, e * .9, .12);
    if (tr.bass === 'half' && pos % (per / 2) === 0) INST.bass(c, bus, pitch(tr, chord - 14), t, e * per / 2, .12);
    if (tr.bass === 'drive') B(pitch(tr, chord - 14 + (pos % 4 === 2 ? 7 : 0)));
    if (tr.bass === 'waltz') {
      if (pos === 0) INST.bass(c, bus, pitch(tr, chord - 14), t, e * 2, .13);
      if (pos === 2 || pos === 4) [2, 4].forEach(k => INST.pizz(c, bus, pitch(tr, chord + k - 7), t, e, .05));
    }
    const a = tr.arp.pat[pos % tr.arp.pat.length];
    if (a !== null && a !== undefined) INST[tr.arp.inst](c, bus, pitch(tr, chord + a), t, e, tr.arp.vol);
    const m = tr.mel.notes[s % tr.mel.notes.length];
    if (m !== null) {
      let len = 1; while (len < 8 && tr.mel.notes[(s + len) % tr.mel.notes.length] === null) len++;
      INST[tr.mel.inst](c, bus, pitch(tr, m + 7), t, e * len * .95, tr.mel.vol);
    }
    if (tr.perc === 'battle') {
      if (pos === 0 || pos === 4) INST.timpani(c, bus, pitch(tr, chord - 21), t, e, .35);
      if (pos % 2 === 1) INST.tick(c, bus, 0, t, e, .05);
    }
    if (tr.perc === 'boss') {
      if (pos % 2 === 0) INST.timpani(c, bus, pitch(tr, chord - 21), t, e, pos === 0 ? .5 : .25);
      INST.tick(c, bus, 0, t, e, pos % 2 ? .06 : .03);
    }
  }

  function startSynth(id) {
    ensureCtx();
    const tr = TRACKS[id] || TRACKS.mus_court;
    const bus = makeBus(ctx, master, tr.vol);
    const e = 60 / tr.bpm / 2;
    synth = { bus, step: 0, next: ctx.currentTime + 0.1, timer: null };
    synth.timer = setInterval(() => {
      while (synth && synth.next < ctx.currentTime + 0.3) {
        scheduleStep(ctx, synth.bus, tr, synth.step, synth.next);
        synth.next += e; synth.step++;
      }
    }, 80);
  }
  // Renders `seconds` of a track offline (used to make review files).
  function renderMusic(id, seconds = 20) {
    const c = new OfflineAudioContext(2, Math.floor(44100 * seconds), 44100), tr = TRACKS[id];
    const bus = makeBus(c, c.destination, tr.vol), e = 60 / tr.bpm / 2;
    for (let s = 0, t = .05; t < seconds - 1; s++, t += e) scheduleStep(c, bus, tr, s, t);
    return c.startRendering().then(b => [b.getChannelData(0), b.getChannelData(1)]);
  }

  function stopSynth() {
    if (!synth) return;
    clearInterval(synth.timer);
    const bus = synth.bus;
    bus.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    setTimeout(() => bus.disconnect(), 1500);
    synth = null;
  }

  function play(id) {
    if (currentId === id) return;
    currentId = id;
    if (audioEl) { audioEl.pause(); audioEl = null; }
    stopSynth();
    ensureCtx();
    const a = new Audio(`assets/music/${id}.mp3`);
    a.loop = true; a.volume = muted ? 0 : 0.5;
    let fellBack = false;
    const fallback = () => { if (!fellBack && currentId === id) { fellBack = true; audioEl = null; startSynth(id); } };
    a.addEventListener('error', fallback);
    a.play().catch(fallback);
    audioEl = a;
  }

  function sfx(kind) {
    if (!ctx || muted) return;
    const t = ctx.currentTime, g = ctx.createGain(), o = ctx.createOscillator();
    g.connect(master);
    const map = { match: [880, 1320, 'sine'], hit: [140, 60, 'square'], card: [500, 900, 'triangle'], hurt: [200, 80, 'sawtooth'], win: [660, 1760, 'triangle'] };
    const [f1, f2, w] = map[kind] || map.card;
    o.type = w; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + 0.15);
    g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g); o.start(t); o.stop(t + 0.3);
  }

  // ---------- Voice: "Hyah!" when you attack, "Ugh!" when you're hit ----------
  // assets/sfx/attack.mp3 and assets/sfx/hurt.mp3 are used if present; otherwise a formant-synthesized voice
  // (a buzzing glottal source shaped by three vowel filters) plays instead.
  const VOWEL = { i: [280, 2250, 2900], a: [760, 1180, 2500], eu: [340, 1450, 2400], u: [320, 800, 2300] };
  const VOICES = {
    // 이-얍!: a breathy onset, "i" gliding into "a", pitch rising then dropping, cut off by the "p".
    attack: { dur: .36, pitch: [[0, 190], [.1, 290], [.36, 210]], vowels: [[0, 'i'], [.09, 'a']], amp: [[0, 0], [.02, .9], [.28, .8], [.34, 0]], breath: .35 },
    // 으-윽!: a strained "eu", a short catch in the throat, then a lower "euk".
    hurt: { dur: .5, pitch: [[0, 250], [.18, 210], [.24, 190], [.5, 140]], vowels: [[0, 'eu'], [.2, 'u'], [.26, 'eu']], amp: [[0, 0], [.03, .8], [.17, .6], [.21, .05], [.25, .9], [.44, .5], [.47, 0]], breath: .2 }
  };
  const voiceFiles = {};
  let lastVoice = 0;
  function loadVoiceFiles() {
    Object.keys(VOICES).forEach(k => {
      const a = new Audio(`assets/sfx/${k}.mp3`);
      a.preload = 'auto';
      a.addEventListener('canplaythrough', () => { voiceFiles[k] = a; }, { once: true });
    });
  }
  loadVoiceFiles();

  function voice(kind) {
    if (!ctx || muted || !VOICES[kind]) return;
    const now = ctx.currentTime;
    if (now - lastVoice < .45) return; // one shout at a time, even during cascades
    lastVoice = now;
    if (voiceFiles[kind]) { const a = voiceFiles[kind].cloneNode(); a.volume = .8; a.play().catch(() => {}); return; }
    synthVoice(ctx, master, kind, now + .01);
  }
  // Builds the synthesized voice on any audio context (also used to render it to a file for review).
  function synthVoice(c, dest, kind, t0) {
    const v = VOICES[kind];
    const out = c.createGain(); out.gain.value = 0; out.connect(dest);
    v.amp.forEach(([t, g]) => out.gain.linearRampToValueAtTime(g * .5, t0 + t));
    const src = c.createOscillator(); src.type = 'sawtooth';
    v.pitch.forEach(([t, f], i) => i ? src.frequency.linearRampToValueAtTime(f, t0 + t) : src.frequency.setValueAtTime(f, t0));
    const vib = c.createOscillator(), vibGain = c.createGain(); // a little shake makes it sound less like a machine
    vib.frequency.value = 7; vibGain.gain.value = 6; vib.connect(vibGain); vibGain.connect(src.frequency);
    const sum = c.createGain();
    [1, .5, .25].forEach((level, k) => {
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = [6, 9, 10][k];
      v.vowels.forEach(([t, name], i) => {
        const f = VOWEL[name][k];
        if (i === 0) bp.frequency.setValueAtTime(f, t0); else bp.frequency.linearRampToValueAtTime(f, t0 + t);
      });
      const g = c.createGain(); g.gain.value = level * 4;
      src.connect(bp); bp.connect(g); g.connect(sum);
    });
    sum.connect(out);
    // Breath noise at the start ("h") for a sharper attack.
    const len = Math.floor(c.sampleRate * .12), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const noise = c.createBufferSource(), nf = c.createBiquadFilter(), ng = c.createGain();
    noise.buffer = buf; nf.type = 'bandpass'; nf.frequency.value = 2500; nf.Q.value = 1; ng.gain.value = v.breath * .5;
    noise.connect(nf); nf.connect(ng); ng.connect(dest);
    src.start(t0); vib.start(t0); noise.start(t0);
    src.stop(t0 + v.dur + .05); vib.stop(t0 + v.dur + .05);
  }
  function renderVoice(kind) {
    const c = new OfflineAudioContext(1, 44100 * .7, 44100);
    synthVoice(c, c.destination, kind, .05);
    return c.startRendering().then(b => b.getChannelData(0));
  }

  function toggleMute() {
    muted = !muted;
    try { localStorage.setItem('vt_muted', muted ? '1' : '0'); } catch (e) {}
    if (master) master.gain.value = muted ? 0 : 0.3;
    if (audioEl) audioEl.volume = muted ? 0 : 0.5;
    return muted;
  }

  // ---------- Cinematic particles ----------
  // Draws one particle effect on a canvas until the returned stop() is called.
  function particles(cv, type) {
    const g = cv.getContext('2d'), R = Math.random;
    let w, h, raf, t = 0;
    const fit = () => { w = cv.width = cv.clientWidth; h = cv.height = cv.clientHeight; };
    fit(); window.addEventListener('resize', fit);
    const spawn = init => {
      switch (type) {
        case 'rain':    return { x: R() * w * 1.3, y: init ? R() * h : -30, v: 16 + R() * 10, l: 14 + R() * 18 };
        case 'petals':  return { x: R() * w, y: init ? R() * h : -20, v: .6 + R() * 1.2, s: 4 + R() * 5, a: R() * 6.28, sp: (R() - .5) * .06, ph: R() * 6.28 };
        case 'ash':     return { x: R() * w, y: init ? R() * h : -10, v: .3 + R() * .8, s: 1 + R() * 2.5, ph: R() * 6.28 };
        case 'mist':    return { x: R() * w, y: h * (.3 + R() * .7), v: (R() - .5) * .5, r: 120 + R() * 220, o: .04 + R() * .06 };
        case 'embers':  return { x: R() * w, y: init ? R() * h : h + 10, v: .6 + R() * 1.6, s: 1 + R() * 2.5, ph: R() * 6.28 };
        case 'sparkle': return { x: R() * w, y: R() * h, life: init ? R() * 100 : 0, max: 60 + R() * 120, s: 1 + R() * 2 };
        default:        return { x: R() * w, y: R() * h, vx: (R() - .5) * .3, vy: (R() - .5) * .3, s: .5 + R() * 1.8, ph: R() * 6.28 }; // dust
      }
    };
    const count = { rain: 160, petals: 40, ash: 90, mist: 14, embers: 70, sparkle: 60, dust: 80 }[type] || 60;
    const ps = [...Array(count)].map(() => spawn(true));
    const dot = (x, y, r, color) => { g.fillStyle = color; g.beginPath(); g.arc(x, y, r, 0, 6.28); g.fill(); };

    const step = () => {
      t++;
      g.clearRect(0, 0, w, h);
      ps.forEach((p, i) => {
        switch (type) {
          case 'rain':
            p.x -= p.v * .25; p.y += p.v;
            g.strokeStyle = 'rgba(180,200,230,.35)'; g.lineWidth = 1;
            g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x + p.l * .25, p.y - p.l); g.stroke();
            if (p.y > h + 30) ps[i] = spawn(false);
            break;
          case 'petals':
            p.y += p.v; p.x += Math.sin(t * .02 + p.ph) * .8; p.a += p.sp;
            g.save(); g.translate(p.x, p.y); g.rotate(p.a);
            g.fillStyle = 'rgba(211,93,140,.8)'; g.beginPath(); g.ellipse(0, 0, p.s, p.s * .55, 0, 0, 6.28); g.fill();
            g.restore();
            if (p.y > h + 20) ps[i] = spawn(false);
            break;
          case 'ash':
            p.y += p.v; p.x += Math.sin(t * .01 + p.ph) * .4;
            dot(p.x, p.y, p.s, 'rgba(200,200,200,.5)');
            if (p.y > h + 10) ps[i] = spawn(false);
            break;
          case 'mist': {
            p.x += p.v;
            if (p.x < -p.r) p.x = w + p.r; if (p.x > w + p.r) p.x = -p.r;
            const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            gr.addColorStop(0, `rgba(170,220,190,${p.o})`); gr.addColorStop(1, 'rgba(170,220,190,0)');
            g.fillStyle = gr; g.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
            break;
          }
          case 'embers': {
            p.y -= p.v; p.x += Math.sin(t * .03 + p.ph) * .6;
            const a = .5 + .5 * Math.sin(t * .1 + p.ph);
            g.shadowBlur = 8; g.shadowColor = '#ff8a3c';
            dot(p.x, p.y, p.s, `rgba(255,150,60,${a})`);
            g.shadowBlur = 0;
            if (p.y < -10) ps[i] = spawn(false);
            break;
          }
          case 'sparkle': {
            p.life++;
            const a = Math.sin(Math.PI * p.life / p.max);
            g.fillStyle = `rgba(232,194,122,${a})`;
            g.fillRect(p.x - p.s * 2, p.y - .5, p.s * 4, 1); g.fillRect(p.x - .5, p.y - p.s * 2, 1, p.s * 4);
            if (p.life > p.max) ps[i] = spawn(false);
            break;
          }
          default:
            p.x = (p.x + p.vx + w) % w; p.y = (p.y + p.vy + h) % h;
            dot(p.x, p.y, p.s, `rgba(255,220,170,${.3 + .3 * Math.sin(t * .05 + p.ph)})`);
        }
      });
      raf = requestAnimationFrame(step);
    };
    step();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', fit); };
  }

  // ---------- Cinematic sound effects (one per beat, synthesized) ----------
  function noiseSrc(c, len, shape = 2) {
    const n = Math.floor(c.sampleRate * len), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, shape);
    const s = c.createBufferSource(); s.buffer = buf; return s;
  }
  function tone(c, out, type, f1, f2, t, len, vol) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + len);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + len);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + len + .05);
  }
  function filtered(c, out, src, type, f1, f2, t, len, vol, q = 1) {
    const fl = c.createBiquadFilter(), g = c.createGain();
    fl.type = type; fl.Q.value = q; fl.frequency.setValueAtTime(f1, t); fl.frequency.exponentialRampToValueAtTime(f2, t + len);
    g.gain.setValueAtTime(vol, t);
    src.connect(fl); fl.connect(g); g.connect(out); src.start(t);
  }
  const CINE_SFX = {
    // rolling thunder: a crack, then a long low rumble
    thunder(c, out, t) { filtered(c, out, noiseSrc(c, .3, 3), 'highpass', 3000, 800, t, .3, .5);
      filtered(c, out, noiseSrc(c, 3.2, 1.5), 'lowpass', 600, 80, t + .05, 3, 1.2); },
    // low impact for a slam or a boss name
    boom(c, out, t) { tone(c, out, 'sine', 110, 30, t, 1.6, .9); filtered(c, out, noiseSrc(c, .8, 3), 'lowpass', 900, 100, t, .8, .7); },
    // heavy gate or door: thud plus a short creak
    door(c, out, t) { tone(c, out, 'sine', 70, 40, t + .35, .9, .8); filtered(c, out, noiseSrc(c, .5, 2), 'lowpass', 500, 120, t + .35, .5, .6);
      tone(c, out, 'sawtooth', 180, 120, t, .35, .05); },
    // blade drawn: a bright scrape and a ring
    sword(c, out, t) { filtered(c, out, noiseSrc(c, .45, 1), 'bandpass', 2500, 7000, t, .45, .5, 4);
      [2637, 3951, 5274].forEach((f, k) => tone(c, out, 'sine', f, f * .995, t + .4, 1.4, .08 / (k + 1))); },
    // wine poured: gurgling noise with a wobbling filter
    pour(c, out, t) { const s = noiseSrc(c, 1.6, .5), fl = c.createBiquadFilter(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
      fl.type = 'bandpass'; fl.Q.value = 6; fl.frequency.value = 900; lfo.frequency.value = 11; lg.gain.value = 350;
      lfo.connect(lg); lg.connect(fl.frequency); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.5, t + .2); g.gain.linearRampToValueAtTime(0, t + 1.6);
      s.connect(fl); fl.connect(g); g.connect(out); s.start(t); lfo.start(t); lfo.stop(t + 1.7); },
    // distant chapel bell: inharmonic partials
    bell(c, out, t) { [[220, .3], [440, .2], [524, .14], [660, .1], [880, .08]].forEach(([f, v]) => tone(c, out, 'sine', f, f * .998, t, 3.5, v)); },
    // two slow heartbeats
    heart(c, out, t) { [0, .28, 1.1, 1.38].forEach((d, k) => tone(c, out, 'sine', 60, 35, t + d, .25, k % 2 ? .5 : .8)); },
    // a fast sweep, for a title card
    whoosh(c, out, t) { filtered(c, out, noiseSrc(c, .8, 1), 'bandpass', 300, 3000, t, .8, .6, 2); }
  };
  function cineSfx(kind) {
    if (!ctx || muted || !CINE_SFX[kind]) return;
    CINE_SFX[kind](ctx, master, ctx.currentTime + .02);
  }

  // ---------- Cinematics ----------
  // Each beat: the art with a slow camera move, a foreground layer that moves faster (parallax), particles,
  // a flickering light, a colour grade, a typed subtitle with the speaker's name, and an optional sound or flash.
  // A boss entrance ends on a name card that slams in.
  const BEAT_MS = 5200, TITLE_MS = 2200, BOSS_MS = 2600, TYPE_MS = 34;
  const MOVES = ['in', 'left', 'out', 'right', 'up'];
  const FG_FOR = { rain: 'none', petals: 'none', ash: 'pillars', mist: 'vines', embers: 'pillars', sparkle: 'curtain', dust: 'candles' };
  const FG = {
    curtain: `<path d="M-20 -10h90c-6 80 4 170-6 260 10 60 0 110-10 170h-74z" fill="#2a0612"/><path d="M70 -10c-6 80 4 170-6 260 10 60 0 110-10 170" fill="none" stroke="#e8c27a" stroke-width="2" opacity=".6"/>
      <path d="M320 -10h-90c6 80-4 170 6 260-10 60 0 110 10 170h74z" fill="#2a0612"/><path d="M230 -10c6 80-4 170 6 260-10 60 0 110 10 170" fill="none" stroke="#e8c27a" stroke-width="2" opacity=".6"/>
      <path d="M-20 -10h340v34c-20 18-40 18-56 0-18 18-38 18-56 0-18 18-38 18-56 0-18 18-38 18-56 0-18 18-38 18-56 0-18 18-40 18-60 0z" fill="#1c040c"/>`,
    vines: `<g fill="none" stroke="#0a1a0e" stroke-width="7" stroke-linecap="round"><path d="M-10 420C40 360 20 300 70 260s30-90 10-130"/><path d="M310 420c-50-50-20-110-70-150s-20-80 0-120"/></g>
      <g fill="#0a1a0e"><path d="M48 330l-18-6 14 14zM70 260l-4-16 12 10zM62 190l-16 0 12 10zM262 320l18-4-12 14zM238 252l6-16-14 10zM246 180l16 2-12 10z"/></g>`,
    pillars: `<rect x="-30" y="-10" width="70" height="420" fill="#0a0608"/><rect x="40" y="-10" width="6" height="420" fill="#e8c27a" opacity=".18"/>
      <rect x="262" y="-10" width="70" height="420" fill="#0a0608"/><rect x="256" y="-10" width="6" height="420" fill="#e8c27a" opacity=".18"/>`,
    candles: `<g opacity=".55"><circle cx="40" cy="360" r="34" fill="#ffb860"/><circle cx="268" cy="372" r="24" fill="#ffd090"/><circle cx="230" cy="40" r="18" fill="#ffc070"/></g>`,
    bars: `<g fill="#050507">${[8, 58, 108, 158, 208, 258].map(x => `<rect x="${x}" y="-10" width="9" height="420"/>`).join('')}<rect x="-10" y="70" width="320" height="8"/></g>`
  };
  const fgSVG = kind => FG[kind] ? `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">${FG[kind]}</svg>` : '';

  function cinematic(id, onDone) {
    const v = ASSETS.videos[id];
    if (!v) { if (onDone) onDone(); return; }
    const ov = document.createElement('div');
    ov.className = 'cine grade-' + (v.grade || 'warm') + (v.boss ? ' is-boss' : '');
    ov.innerHTML = `<div class="cine-stage"></div><div class="cine-fg"></div><canvas class="cine-fx"></canvas>
      <div class="cine-light"></div><div class="cine-grade"></div><div class="cine-vignette"></div><div class="cine-flash"></div>
      <div class="cine-bar top"></div><div class="cine-bar bottom"></div>
      <div class="cine-title"></div><div class="cine-boss"></div>
      <div class="cine-sub"><div class="cine-who"></div><div class="cine-line"></div></div><div class="cine-progress"><div></div></div>
      <button class="cine-skip">${t('skip')}</button>`;
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('in'));
    const $ = s => ov.querySelector(s);
    const stage = $('.cine-stage'), fgEl = $('.cine-fg'), sub = $('.cine-sub'), who = $('.cine-who'), line = $('.cine-line');
    const ttl = $('.cine-title'), boss = $('.cine-boss'), prog = $('.cine-progress div'), flashEl = $('.cine-flash');
    let done = false, stopFx = null, timer = null, typer = null, typing = false, fullText = '';
    const finish = () => {
      if (done) return; done = true;
      clearTimeout(timer); clearInterval(typer); if (stopFx) stopFx();
      ov.classList.add('out');
      setTimeout(() => { ov.remove(); if (onDone) onDone(); }, 600);
    };
    $('.cine-skip').onclick = e => { e.stopPropagation(); finish(); };
    const replay = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
    const flash = () => replay(flashEl, 'go');
    const shake = () => replay(stage, 'shake');

    // Subtitle typed out a few letters at a time; a tap while typing shows the whole line.
    const showSub = b => {
      const name = b.who && ASSETS.images[b.who] ? ASSETS.images[b.who].title : '';
      who.textContent = name; who.style.display = name ? '' : 'none';
      fullText = b.text; line.textContent = '';
      replay(sub, 'in');
      clearInterval(typer); typing = true;
      const chars = [...fullText]; let n = 0;
      typer = setInterval(() => { n += 1; line.textContent = chars.slice(0, n).join(''); if (n >= chars.length) { clearInterval(typer); typing = false; } }, TYPE_MS);
    };
    const finishTyping = () => { clearInterval(typer); typing = false; line.textContent = fullText; };

    const bossCard = () => {
      const E = ENEMIES[v.boss];
      sub.classList.remove('in'); sub.classList.add('gone');
      boss.innerHTML = `<small>${v.title || ''}</small><b>${E ? E.name : ''}</b>`;
      boss.classList.add('in'); cineSfx('boom'); flash(); shake();
      clearTimeout(timer); timer = setTimeout(finish, BOSS_MS);
    };

    let i = 0, slides = false, ended = false;
    const slideshow = () => {
      if (slides || done) return;
      slides = true;
      if (v.fx) stopFx = particles($('.cine-fx'), v.fx);
      const total = v.beats.length * BEAT_MS + (v.boss ? BOSS_MS : v.title ? TITLE_MS : 0);
      prog.style.transition = `width ${total}ms linear`;
      requestAnimationFrame(() => { prog.style.width = '100%'; });
      const addLayer = k => { // crossfade the next image (and its foreground) over the current one
        const b = v.beats[k], move = b.move || MOVES[k % MOVES.length];
        const swap = (parent, el) => {
          const old = [...parent.children];
          parent.appendChild(el);
          requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
          setTimeout(() => old.forEach(o => o.remove()), 1600);
        };
        swap(stage, art(b.img, 'cine-layer cam-' + move));
        const fg = document.createElement('div');
        fg.className = 'cine-layer fg-' + move;
        fg.innerHTML = fgSVG(b.fg || v.fg || FG_FOR[v.fx] || 'none');
        swap(fgEl, fg);
      };
      const beatFx = b => {
        if (b.sfx) cineSfx(b.sfx);
        if (b.flash) flash();
        if (b.shake) shake();
      };
      const show = () => {
        if (done || ended) return;
        if (i >= v.beats.length) {
          if (v.boss) { ended = true; return bossCard(); }
          return finish();
        }
        const b = v.beats[i];
        addLayer(i); showSub(b); beatFx(b);
        i++;
        clearTimeout(timer); timer = setTimeout(show, BEAT_MS);
      };
      ov.onclick = () => {
        if (ended) return finish();
        if (typing) return finishTyping();
        ttl.classList.add('out'); show();
      };
      if (v.title && !v.boss) { // title card over the first image, then its subtitle
        ttl.textContent = v.title; ttl.classList.add('in'); cineSfx('whoosh');
        addLayer(0); i = 1;
        timer = setTimeout(() => {
          ttl.classList.add('out'); showSub(v.beats[0]); beatFx(v.beats[0]);
          timer = setTimeout(show, BEAT_MS);
        }, TITLE_MS);
      } else show();
    };

    const vid = document.createElement('video');
    vid.playsInline = true; vid.muted = false;
    vid.className = 'cine-video';
    let usedVideo = false;
    vid.addEventListener('loadeddata', () => {
      if (slides || done) return;
      usedVideo = true;
      stage.innerHTML = ''; stage.appendChild(vid);
      line.textContent = v.beats[0].text; who.style.display = 'none'; sub.classList.add('in');
      vid.play().catch(() => {});
    });
    vid.addEventListener('ended', finish);
    vid.addEventListener('error', () => { if (!usedVideo) slideshow(); });
    vid.src = `assets/video/${id}.mp4`;
    setTimeout(() => { if (!usedVideo) slideshow(); }, 1500); // some browsers never fire error for missing files
  }

  // App went to the background / came back: hold the music where it is.
  function suspend() { if (ctx && ctx.state === 'running') ctx.suspend(); if (audioEl) audioEl.pause(); }
  function resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); if (audioEl) audioEl.play().catch(() => {}); }

  return { art, play, sfx, cineSfx, voice, renderVoice, renderMusic, toggleMute, cinematic, suspend, resume, isMuted: () => muted, unlock: ensureCtx };
})();
