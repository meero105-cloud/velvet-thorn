// Velvet Thorn — hand-drawn SVG art (300×400, 3:4) for every image id in ASSETS.images.
// Style: candlelit silhouettes with a warm rim light and gold details. All characters are adults, fully clothed.
// A real file in assets/img/<id>.* still replaces these (see Media.art).
const Art = (() => {
  let ID = '';
  const gid = k => `vt-${ID}-${k}`;

  // Seeded random so scattered details (petals, ash, rain) are the same every time.
  let seed = 1;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const scatter = (n, f) => { let s = ''; for (let i = 0; i < n; i++) s += f(rand, i); return s; };

  const DARK = '#0b0609', RIM = '#f3cf92';
  // A dark shape with a warm rim light along its left edge.
  const rim = (d, fill = DARK, light = RIM, dx = -3) =>
    `<path d="${d}" fill="${light}" opacity=".55" transform="translate(${dx} -1)"/><path d="${d}" fill="${fill}"/>`;
  const glow = (x, y, r, o = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${gid('glow')})" opacity="${o}"/>`;
  const candle = (x, y, h = 40) => `${glow(x, y - 8, 70, .9)}<rect x="${x - 5}" y="${y}" width="10" height="${h}" rx="2" fill="#e8dcc0"/>
    <path d="M${x} ${y - 16}c5 6 5 11 0 14-5-3-5-8 0-14z" fill="#ffd27a"/><path d="M${x} ${y - 9}c2 3 2 5 0 7-2-2-2-4 0-7z" fill="#fff6d0"/>`;

  // Bust building blocks (front-facing, centered at x=150).
  const HEAD = 'M150 98c-26 0-44 22-44 52 0 32 20 58 44 58s44-26 44-58c0-30-18-52-44-52z';
  const NECK = 'M133 196h34l5 46h-44z';
  const SHOULDERS = 'M28 400c6-72 50-130 122-142 72 12 116 70 122 142z';
  const bust = (coat = DARK) => rim(SHOULDERS, coat) + rim(NECK) + rim(HEAD);
  const faceLight = `<path d="M150 99c-24 2-42 24-42 52 0 30 18 55 42 56z" fill="#f6d6b4" opacity=".07"/>`;
  const eyes = (c, y = 150) => `<path d="M127 ${y}q9-5 17 0M156 ${y}q9-5 17 0" stroke="${c}" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".85"/>`;
  const gold = (d, w = 1.6, o = 1) => `<path d="${d}" fill="none" stroke="#e8c27a" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${o}"/>`;

  function frame(palette, body, cy = 38) {
    const [a, b] = palette;
    return `<defs>
      <radialGradient id="${gid('bg')}" cx="50%" cy="${cy}%" r="80%"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></radialGradient>
      <radialGradient id="${gid('glow')}"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".6"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>
      <radialGradient id="${gid('vig')}" cx="50%" cy="45%" r="75%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".8"/></radialGradient>
      <linearGradient id="${gid('steel')}" x1="0" x2="1"><stop offset="0" stop-color="#6f7c8a"/><stop offset=".5" stop-color="#f4f7fb"/><stop offset="1" stop-color="#7d8a98"/></linearGradient>
    </defs>
    <rect width="300" height="400" fill="url(#${gid('bg')})"/>${body}<rect width="300" height="400" fill="url(#${gid('vig')})"/>`;
  }

  const DRAW = {
    // ---------- Portraits ----------
    exile: () => glow(150, 120, 170, .5) +
      rim('M60 400c0-90 20-170 40-210 10-60 30-104 50-108 20 4 40 48 50 108 20 40 40 120 40 210z', '#120c1c') +
      `<path d="M150 112c-20 2-34 26-34 54 0 26 14 46 34 50 20-4 34-24 34-50 0-28-14-52-34-54z" fill="#05030a"/>
       <path d="M150 114c-16 3-28 26-28 52 0 24 12 42 28 46z" fill="#f6d6b4" opacity=".12"/>` + eyes('#c9b8ff', 160) +
      gold('M100 190c20 30 80 30 100 0', 1.2, .6) +
      `<circle cx="196" cy="352" r="7" fill="none" stroke="#dfe6f0" stroke-width="3"/><circle cx="196" cy="346" r="3" fill="#f4f7fb"/>` + glow(196, 350, 22, .8),

    seraphine: () => glow(150, 110, 160, .6) +
      `<path d="M78 252C66 170 100 116 150 110c50 6 84 60 72 142l-26-6c6-58-16-96-46-98-30 2-52 40-46 98z" fill="#3a0812"/>` +
      gold('M78 252C66 170 100 116 150 110c50 6 84 60 72 142', 1.4, .8) + bust('#2a0610') + faceLight + eyes('#ffb0b8') +
      `<path d="M108 110l6-30 8 26 10-34 8 32 10-42 10 42 8-32 10 34 8-26 6 30z" fill="#140608"/>` +
      gold('M108 110l6-30 8 26 10-34 8 32 10-42 10 42 8-32 10 34 8-26 6 30z', 1.5) +
      gold('M96 312q54 44 108 0', 1.6) + `<circle cx="150" cy="292" r="7" fill="#c0203a" stroke="#e8c27a" stroke-width="1.5"/>` +
      `<path d="M142 186q8 4 16 0" stroke="#d06070" stroke-width="2" fill="none" stroke-linecap="round"/>`,

    cassian: () => glow(150, 120, 160, .5) + bust('#0a1220') +
      `<path d="M106 142c-4-34 18-52 44-52s50 14 44 50c-8-18-26-28-48-26-18 2-32 12-40 28z" fill="#04060a"/>` + faceLight + eyes('#9ecbff') +
      `<path d="M132 262l18 52 18-52z" fill="#cfd8e8" opacity=".3"/>` + gold('M118 262l32 56 32-56', 1.4, .8) +
      `<path d="M140 184q10 7 20 0" stroke="#b8c8e0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>` +
      `<g transform="rotate(-12 225 345)"><rect x="190" y="320" width="72" height="52" rx="3" fill="#2a1a0c" stroke="#e8c27a" stroke-width="1.4"/>
       <path d="M200 334h52M200 344h52M200 354h40" stroke="#e8c27a" stroke-opacity=".5"/></g>`,

    isolde: () => glow(150, 120, 160, .5) + bust('#06140c') +
      `<circle cx="150" cy="88" r="22" fill="#06100a"/><path d="M106 146c-2-34 18-50 44-50s48 16 44 50c-10-16-26-24-44-24s-34 8-44 24z" fill="#06100a"/>` +
      faceLight + eyes('#a8f0c0') +
      `<path d="M30 400c4-40 20-78 52-98 34 18 102 18 136 0 32 20 48 58 52 98z" fill="#0e3a1e"/>` + gold('M82 302c34 18 102 18 136 0', 1.4, .8) +
      gold('M122 246q28 26 56 0', 1.4) + `<path d="M150 260l5 8-5 8-5-8z" fill="#3fbf6a" stroke="#e8c27a"/>` +
      `<path d="M144 186q6 4 12 0" stroke="#d07080" stroke-width="2" fill="none" stroke-linecap="round"/>` +
      `<path d="M214 286h28c0 16-6 24-14 24s-14-8-14-24z" fill="#1f6a3a" stroke="#e8c27a" stroke-width="1.4"/><path d="M228 310v22M218 334h20" stroke="#e8c27a" stroke-width="2"/>`,

    rhoen: () => glow(150, 120, 170, .5) + bust('#120e08') +
      `<path d="M108 138c0-28 18-44 42-44s42 16 42 44c-10-12-26-18-42-18s-32 6-42 18z" fill="#0a0704"/>` + faceLight + eyes('#ffd08a') +
      `<path d="M163 158l10 24" stroke="#d89080" stroke-width="2" opacity=".6"/>` +
      `<ellipse cx="74" cy="292" rx="52" ry="30" fill="#1a1408"/><ellipse cx="226" cy="292" rx="52" ry="30" fill="#1a1408"/>` +
      gold('M22 292a52 30 0 0 1 104 0M174 292a52 30 0 0 1 104 0', 1.6) +
      `<path d="M110 304q40 30 80 0l-6 96h-68z" fill="#1a140a"/>` + gold('M110 304q40 30 80 0', 1.6) +
      `<rect x="146" y="318" width="8" height="26" fill="#6a2e16"/><rect x="128" y="342" width="44" height="7" rx="3" fill="#e8c27a"/>
       <path d="M146 349h8l-1 51h-6z" fill="url(#${gid('steel')})"/>`,

    valen: () => glow(150, 120, 160, .55) +
      `<path d="M92 256c-8-70 20-120 58-126 38 6 66 56 58 126l-18-4c4-48-14-82-40-84-26 2-44 36-40 84z" fill="#2a0a22"/>` +
      bust('#1e0818') + `<path d="M104 146c2-32 20-48 46-48 28 0 44 18 44 48-14-20-40-30-90 0z" fill="#0a0308"/>` + faceLight +
      `<path d="M110 142c18-14 62-14 80 0-2 18-20 24-30 16-4-4-16-4-20 0-10 8-28 2-30-16z" fill="#efe2f4" opacity=".88"/>` +
      gold('M110 142c18-14 62-14 80 0M118 150q6 6 12 2M182 150q-6 6-12 2M150 136v6', 1.1) +
      `<ellipse cx="132" cy="146" rx="7" ry="4" fill="#12040e"/><ellipse cx="168" cy="146" rx="7" ry="4" fill="#12040e"/>
       <circle cx="132" cy="146" r="2" fill="#f2a8d8"/><circle cx="168" cy="146" r="2" fill="#f2a8d8"/>` +
      `<path d="M143 186q7 5 14 0" stroke="#e090b0" stroke-width="2" fill="none" stroke-linecap="round"/>` +
      `<path d="M196 372c10-22 32-34 54-32 9 1 10 9 2 13l-20 8 32-4c9 0 9 9 0 11l-38 9z" fill="#efe2f4" opacity=".85"/>`,

    courtier: () => glow(150, 120, 160, .5) + bust('#2a2214') +
        [[150, 92, 40], [112, 112, 30], [188, 112, 30], [100, 150, 26], [200, 150, 26], [104, 186, 22], [196, 186, 22], [130, 76, 24], [170, 76, 24]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#d8d0c0" opacity=".92"/>`).join('') +
      `<path d="M120 110c10-10 50-10 60 0v20H120z" fill="#d8d0c0"/>` +
      `<path d="M150 104c-22 0-34 20-34 44 0 26 14 46 34 46s34-20 34-46c0-24-12-44-34-44z" fill="#120c06"/>` + eyes('#fff0d0', 146) +
      `<path d="M96 214a56 56 0 0 1 108 0l-54 30z" fill="#c8a0b0"/>` +
      [0, 1, 2, 3, 4, 5, 6].map(i => { const a = Math.PI + i * Math.PI / 6; return `<path d="M150 244L${150 + 56 * Math.cos(a)} ${214 + 56 * Math.sin(a)}" stroke="#7a5060" stroke-width="1"/>`; }).join('') +
      gold('M96 214a56 56 0 0 1 108 0', 1.4),

    rival: () => glow(150, 120, 160, .5) + bust('#200406') +
      [[118, 104], [150, 92], [182, 104], [104, 136], [196, 136], [100, 170], [200, 170], [108, 200], [192, 200]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="18" fill="#140405"/>`).join('') +
      `<path d="M150 108c-22 0-34 20-34 44 0 28 14 50 34 50s34-22 34-50c0-24-12-44-34-44z" fill="${DARK}"/>` + faceLight +
      eyes('#ff8a8a', 152) + `<path d="M124 138l20 7M176 138l-20 7" stroke="#ff8a8a" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>` +
      `<path d="M30 400c4-40 20-78 52-98 34 18 102 18 136 0 32 20 48 58 52 98z" fill="#5a0a10"/>` + gold('M82 302c34 18 102 18 136 0', 1.4, .7) +
      `<path d="M142 188q8-4 16 0" stroke="#d06070" stroke-width="2" fill="none" stroke-linecap="round"/>` +
      `<path d="M40 372c6-18 26-26 40-20 8 4 6 14-2 16l-30 8z" fill="#e8d8d8" opacity=".85"/>` +
      `<circle cx="70" cy="350" r="14" fill="#a8102a"/><circle cx="64" cy="346" r="7" fill="#d0245e"/>` +
      scatter(6, r => `<ellipse cx="${50 + r() * 60}" cy="${376 + r() * 20}" rx="4" ry="2.5" fill="#c0203a" transform="rotate(${r() * 180} ${70} 380)"/>`),

    duelist: () => `<circle cx="70" cy="70" r="34" fill="#e8e8f8" opacity=".25"/>` + glow(150, 120, 160, .4) +
      `<path d="M50 396L252 54" stroke="url(#${gid('steel')})" stroke-width="3.5" stroke-linecap="round"/>` +
      `<circle cx="70" cy="362" r="16" fill="none" stroke="#e8c27a" stroke-width="2.5"/>` + bust('#0c0c18') +
      `<path d="M108 140c2-30 20-46 42-46s40 16 42 46c-12-14-28-20-42-20s-30 6-42 20z" fill="#040408"/>` + faceLight +
      `<path d="M106 140c22-12 66-12 88 0l-4 20c-18 4-28-2-40 0-12-2-22 4-40 0z" fill="#000"/>` +
      `<ellipse cx="132" cy="148" rx="6" ry="3.5" fill="#e8ecff"/><ellipse cx="168" cy="148" rx="6" ry="3.5" fill="#e8ecff"/>` +
      `<path d="M126 262l24 60 24-60" fill="#e8e8f0" opacity=".45"/>` + gold('M106 140c22-12 66-12 88 0', 1, .7),

    informant: () => `<rect x="8" y="0" width="56" height="400" fill="#141a20"/>` + gold('M64 0v400M8 0v400', 1, .35) +
      glow(170, 140, 150, .4) +
      rim('M86 400c-2-70 6-130 20-166 0-80 22-136 64-140 42 4 64 60 64 140 14 36 22 96 20 166z', '#0e1418') +
      `<path d="M170 118c-20 0-34 26-34 54 0 24 14 40 34 42 20-2 34-18 34-42 0-28-14-54-34-54z" fill="#030405"/>` +
      `<circle cx="160" cy="168" r="2.6" fill="#9fb8c8"/><circle cx="182" cy="168" r="2.6" fill="#9fb8c8"/>` +
      `<g transform="rotate(14 100 330)"><rect x="80" y="318" width="44" height="30" fill="#e8dcc0"/><path d="M80 318l22 14 22-14" fill="none" stroke="#8a7a60"/></g>` +
      `<path d="M96 344c10-8 24-8 30 0" stroke="#0e1418" stroke-width="10" stroke-linecap="round"/>`,

    // ---------- Scenes ----------
    title: () => glow(150, 130, 200, .55) +
      `<g opacity=".45">${bust('#1a0610')}</g>` +
      `<path d="M112 142c18-14 58-14 76 0-2 18-18 24-28 16-4-4-16-4-20 0-10 8-26 2-28-16z" fill="#e8c27a" opacity=".55"/>` +
      `<path d="M60 330c0-24 40-34 90-34s90 10 90 34-40 40-90 40-90-16-90-40z" fill="#6a0a24"/>` + gold('M60 330c0 24 40 40 90 40s90-16 90-40', 1.4, .8) +
      `<path d="M98 300v-50l22 20 30-44 30 44 22-20v50z" fill="#e8c27a" stroke="#9a6a1c" stroke-width="2"/>` +
      `<path d="M98 300h104" stroke="#9a6a1c" stroke-width="5"/><circle cx="150" cy="280" r="6" fill="#c0203a"/>` +
      `<path d="M110 266l-8-6M190 266l8-6M150 222v-10" stroke="#e8c27a" stroke-width="2"/>` +
      scatter(14, r => `<ellipse cx="${20 + r() * 260}" cy="${200 + r() * 190}" rx="5" ry="3" fill="#c0203a" opacity=".8" transform="rotate(${r() * 180} 150 300)"/>`),

    ev_velvet: () => [50, 150, 250].map(x => gold(`M${x - 40} 400V150a40 40 0 0 1 80 0V400`, 1.2, .25)).join('') +
      gold('M150 0v40M110 60h80M120 60l30-20 30 20', 1.4, .7) + [110, 130, 150, 170, 190].map(x => glow(x, 56, 20, .9)).join('') +
      `<g opacity=".35">${scatter(6, (r, i) => `<ellipse cx="${30 + i * 48}" cy="${300 + r() * 20}" rx="14" ry="40" fill="#000"/><circle cx="${30 + i * 48}" cy="${250 + r() * 20}" r="11" fill="#000"/>`)}</g>` +
      `<g transform="translate(-55 40) scale(.8)">${bust('#200a18')}</g>` +
      `<g transform="translate(115 30) scale(.8)">${bust('#2a0a22')}<path d="M110 142c18-14 62-14 80 0-2 18-20 24-30 16-4-4-16-4-20 0-10 8-28 2-30-16z" fill="#efe2f4" opacity=".85"/></g>` +
      `<path d="M150 300c-4-10 4-18 12-16l12 4" fill="#efe2f4" opacity=".85"/>` + glow(150, 300, 30, .8),

    ev_letter: () => `<rect x="0" y="270" width="300" height="130" fill="#1e120a"/><path d="M0 270h300" stroke="#e8c27a" stroke-opacity=".3"/>` +
      candle(60, 200, 70) +
      `<g transform="rotate(-8 160 300)"><rect x="96" y="262" width="140" height="92" fill="#e8dcc0"/><path d="M96 262l70 46 70-46" fill="none" stroke="#a89070" stroke-width="1.4"/>
       <circle cx="166" cy="310" r="16" fill="#0a0a0a"/><path d="M160 304l6 6 6-6M166 310v8" stroke="#3a3030" stroke-width="2"/></g>` +
      `<g transform="rotate(28 230 320)"><path d="M222 260h10l-2 90h-6z" fill="url(#${gid('steel')})"/><rect x="214" y="350" width="26" height="6" rx="2" fill="#e8c27a"/><rect x="223" y="356" width="8" height="20" fill="#3a1a0c"/></g>`,

    ev_garden: () => `<circle cx="214" cy="80" r="42" fill="#e8f0e0" opacity=".85"/>` + glow(214, 80, 110, .5) +
      scatter(5, (r, i) => { const x = 20 + i * 62 + r() * 10, h = 150 + r() * 60;
        return `<path d="M${x} 400V${400 - h}" stroke="#1a4a2a" stroke-width="3"/>` + scatter(6, (q, j) => `<ellipse cx="${x + (j % 2 ? 7 : -7)}" cy="${400 - h + 14 + j * 18}" rx="7" ry="10" fill="#8a4ab8" opacity=".85"/>`); }) +
      `<path d="M142 214h36c0 22-8 32-18 32s-18-10-18-32z" fill="#1f6a3a" stroke="#e8c27a" stroke-width="1.4"/><path d="M160 246v30M146 278h28" stroke="#e8c27a" stroke-width="2.5"/>` +
      `<path d="M182 168c-10 10-16 26-18 46" stroke="#c0203a" stroke-width="3" fill="none"/><path d="M176 150h26l-4 22h-18z" fill="#2a1a0c" stroke="#e8c27a"/>` +
      scatter(7, r => `<ellipse cx="${r() * 300}" cy="${320 + r() * 70}" rx="${60 + r() * 50}" ry="14" fill="#c8f0d8" opacity=".09"/>`),

    ev_chapel: () => `<path d="M90 300V120a60 60 0 0 1 120 0v180z" fill="#1c1c26"/>` + gold('M90 300V120a60 60 0 0 1 120 0v180M150 60v240M90 180h120', 1.4, .5) +
      `<path d="M110 70l18 30-26 14z" fill="#0b0b0e"/>` +
      `<path d="M100 120L40 400h160L200 120z" fill="#e8e8f0" opacity=".08"/>` +
      `<rect x="212" y="210" width="70" height="190" fill="#120e0c"/><path d="M212 230a35 30 0 0 1 70 0" fill="#120e0c"/>` + gold('M212 400V230a35 30 0 0 1 70 0v170', 1.2, .5) +
      `<rect x="232" y="260" width="30" height="70" fill="#050404"/>` +
      `<path d="M0 340h180M0 370h180" stroke="#2a2a30" stroke-width="10"/>` +
      scatter(70, r => `<circle cx="${r() * 300}" cy="${r() * 400}" r="${.8 + r() * 1.8}" fill="#c8c8d0" opacity="${.3 + r() * .5}"/>`),

    ev_mirror: () => gold('M30 0v400M270 0v400', 1, .2) +
      `<ellipse cx="150" cy="190" rx="92" ry="130" fill="#e8c27a"/><ellipse cx="150" cy="190" rx="80" ry="118" fill="#0c0612"/>` +
      gold('M150 58c-14-20-34-10-30 6M150 58c14-20 34-10 30 6M150 322c-14 20-34 10-30-6M150 322c14 20 34 10 30-6M58 190c-20-14-10-34 6-30M242 190c20-14 10-34-6-30', 2) +
      `<ellipse cx="150" cy="190" rx="80" ry="118" fill="url(#${gid('glow')})" opacity=".35"/>` +
      `<path d="M100 172c16-12 84-12 100 0-2 30-24 38-36 26-6-6-22-6-28 0-12 12-34 4-36-26z" fill="#b48ae8" opacity=".55"/>` +
      `<ellipse cx="126" cy="180" rx="9" ry="5" fill="#0c0612"/><ellipse cx="174" cy="180" rx="9" ry="5" fill="#0c0612"/>` +
      `<path d="M128 232q22 16 44 0" stroke="#e8d8ff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>` + candle(40, 330, 50) + candle(260, 330, 50),

    ev_bath: () => [20, 240].map(x => `<rect x="${x}" y="0" width="40" height="300" fill="#2a1a20"/>` + gold(`M${x} 0v300M${x + 40} 0v300`, 1, .3)).join('') +
      `<rect x="0" y="300" width="300" height="100" fill="#1a2a2e"/>` + scatter(6, (r, i) => gold(`M${20 + r() * 200} ${318 + i * 13}h${30 + r() * 40}`, 1, .25)) +
      scatter(10, r => `<ellipse cx="${20 + r() * 260}" cy="${310 + r() * 80}" rx="5" ry="3" fill="#d35d8c" opacity=".85"/>`) +
      `<g transform="translate(-48 70) scale(.62)">${bust('#3e3030')}<path d="M110 262l40 40 40-40" stroke="#d8c8b8" stroke-width="4" fill="none"/></g>` +
      `<g transform="translate(110 64) scale(.64)">${bust('#3e3030')}<path d="M110 262l40 40 40-40" stroke="#d8c8b8" stroke-width="4" fill="none"/></g>` +
      `<rect x="0" y="300" width="300" height="100" fill="#1a2a2e" opacity=".55"/>` +
      scatter(8, r => `<ellipse cx="${r() * 300}" cy="${60 + r() * 240}" rx="${50 + r() * 60}" ry="${18 + r() * 16}" fill="#ffffff" opacity=".07"/>`),

    cellar: () => `<path d="M0 400V120a150 110 0 0 1 300 0v280z" fill="#1a100a" opacity=".6"/>` + gold('M0 400V120a150 110 0 0 1 300 0v280', 1.2, .25) +
      [[50, 330], [100, 330], [75, 280]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="26" fill="#3d2414" stroke="#1a0e06" stroke-width="3"/><circle cx="${x}" cy="${y}" r="16" fill="none" stroke="#6a4424" stroke-width="2"/><circle cx="${x}" cy="${y}" r="4" fill="#1a0e06"/>`).join('') +
      rim('M170 400v-70c0-10 8-14 16-14v-56c0-16 12-24 30-24h22c18 0 30 8 30 24v56c8 0 16 4 16 14v70h-20v-30h-74v30z', '#2a1810') +
      candle(150, 300, 30),

    victory: () => `<rect y="250" width="300" height="150" fill="#3a1a06" opacity=".5"/>` + glow(150, 330, 220, .7) +
      rim('M90 360V150c0-30 26-50 60-56 34 6 60 26 60 56v210z', '#120806') +
      `<path d="M78 360v-60h144v60z" fill="#120806"/>` +
      gold('M90 360V150c0-30 26-50 60-56 34 6 60 26 60 56v210', 1.4, .6) +
      scatter(9, (r, i) => { const y = 120 + i * 26, s = i % 2 ? 1 : -1; return `<path d="M${150 + s * 60} ${y}l${s * 14} -6 ${-s * 6} 12z" fill="#3a2a1a"/>`; }) +
      `<g transform="translate(66 170) scale(.56)">${rim('M60 400c0-90 20-170 40-210 10-60 30-104 50-108 20 4 40 48 50 108 20 40 40 120 40 210z', '#0c0812')}</g>` +
      `<path d="M136 334v-14l7 6 7-10 7 10 7-6v14z" fill="#e8c27a"/>` + glow(150, 326, 26, .9),

    defeat: () => scatter(60, r => { const x = r() * 320, y = r() * 400; return `<path d="M${x} ${y}l-8 22" stroke="#b8c8e0" stroke-width="1" opacity=".35"/>`; }) +
      [40, 72, 104, 136].map(x => `<path d="M${x} 330V70l6-14 6 14v260" fill="#0a0a0c" stroke="#3a3a44"/>`).join('') +
      [164, 196, 228, 260].map(x => `<path d="M${x} 330V70l6-14 6 14v260" fill="#0a0a0c" stroke="#3a3a44"/>`).join('') +
      gold('M36 110h116M160 110h116', 2, .35) +
      `<ellipse cx="150" cy="370" rx="110" ry="18" fill="#1a1a22"/><ellipse cx="150" cy="370" rx="110" ry="18" fill="#b8c8e0" opacity=".08"/>` +
      `<path d="M126 364c8-6 40-6 48 0-2 9-12 12-18 8-3-2-9-2-12 0-6 4-16 1-18-8z" fill="#e8c27a" opacity=".85"/>`
  };

  function draw(id) {
    const f = DRAW[id], m = ASSETS.images[id];
    if (!f || !m) return null;
    ID = id; seed = 7 + id.length * 131;
    return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${m.title}">${frame(m.palette, f())}</svg>`;
  }
  return { draw };
})();
