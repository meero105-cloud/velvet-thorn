// Velvet Thorn — line icons (24×24, stroked), so tiles and buttons look the same on every device (emoji don't).
const ICONS = {
  blade: 'M19 4l1 1-11 11-2-2zM5 14l5 5M4 20l2.5-2.5',
  rose: 'M12 4c4 0 6 3 4.5 6 2 2-1 6-4.5 5.5C8.5 16 6 12 7.5 10 6 7 8 4 12 4zM12 15.5V21M12 18c-2 0-3-1-3.5-2',
  wine: 'M7 3h10c0 5-2 8-5 8s-5-3-5-8zM12 11v8M8 21h8',
  mask: 'M3 8c3-2 15-2 18 0 0 5-3 8-6 8-1.5 0-2-2-3-2s-1.5 2-3 2c-3 0-6-3-6-8zM7 10.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M14 10.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0',
  thorn: 'M12 3v18M12 8L8 6M12 12l4-2M12 16l-4-2',
  shield: 'M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
  crown: 'M4 18V8l4 4 4-7 4 7 4-4v10zM4 21h16',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
  pause: 'M8 5v14M16 5v14',
  help: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.4M12 17h.01',
  sound: 'M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12',
  mute: 'M4 9v6h4l5 4V5L8 9zM17 9l5 5M22 9l-5 5',
  globe: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',
  star: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z'
};
const SUIT_ICON = ['blade', 'rose', 'wine', 'mask'];
const icon = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;

// Board tiles: full-color art on a gem-like tile (gradients are shared defs injected once below).
const TILE_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="vtSteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d8a98"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#8f9cab"/></linearGradient>
  <linearGradient id="vtGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1b8"/><stop offset=".5" stop-color="#e8c27a"/><stop offset="1" stop-color="#9a6a1c"/></linearGradient>
  <radialGradient id="vtRose" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ff8fb0"/><stop offset=".55" stop-color="#d0245e"/><stop offset="1" stop-color="#6a0a2a"/></radialGradient>
  <linearGradient id="vtWine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0405a"/><stop offset="1" stop-color="#5a0816"/></linearGradient>
  <linearGradient id="vtGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="#ffffff" stop-opacity=".12"/></linearGradient>
  <linearGradient id="vtMask" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9a6f5"/><stop offset=".5" stop-color="#7a4fc4"/><stop offset="1" stop-color="#3a2066"/></linearGradient>
  <linearGradient id="vtLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fcf7f"/><stop offset="1" stop-color="#1f5a2a"/></linearGradient>
</defs></svg>`;
const TILE_ART = [
  // blade: steel sword with a gold guard, tilted
  `<g transform="rotate(45 24 24)"><path d="M24 3l4 6v22h-8V9z" fill="url(#vtSteel)" stroke="#3a4450" stroke-width=".8"/><path d="M24 7v22" stroke="#ffffff" stroke-opacity=".7" stroke-width="1"/>
   <rect x="13" y="30" width="22" height="4.5" rx="2.2" fill="url(#vtGold)" stroke="#6a4410" stroke-width=".7"/><rect x="22" y="34.5" width="4" height="8" rx="1" fill="#6a2e16"/><circle cx="24" cy="44.5" r="3" fill="url(#vtGold)" stroke="#6a4410" stroke-width=".7"/></g>`,
  // rose: red bloom, green stem and leaves
  `<path d="M24 30v15" stroke="#2f7a3e" stroke-width="3" stroke-linecap="round"/><path d="M24 37c-7-5-12-2-14 2 6 3 10 2 14-2z" fill="url(#vtLeaf)"/><path d="M24 34c7-5 12-2 14 2-6 3-10 2-14-2z" fill="url(#vtLeaf)"/>
   <circle cx="24" cy="19" r="13" fill="url(#vtRose)" stroke="#5a0820" stroke-width=".8"/><path d="M15 19c0-8 18-8 18 0" fill="none" stroke="#ffb8cc" stroke-opacity=".7" stroke-width="1.4"/>
   <path d="M18.5 21c0-6 11-6 11 0s-11 5-11 0z" fill="#a8124a"/><path d="M21.5 20c0-3 5-3 5 0" fill="none" stroke="#ffd1dc" stroke-width="1.4" stroke-linecap="round"/>`,
  // wine: glass goblet with red wine, gold stem
  `<path d="M12 7h24c0 14-6 21-12 21S12 21 12 7z" fill="url(#vtGlass)" stroke="#ffffff" stroke-opacity=".6" stroke-width=".9"/>
   <path d="M13.3 14h21.4c-1.4 8.5-5.8 12.6-10.7 12.6S14.7 22.5 13.3 14z" fill="url(#vtWine)"/><path d="M16 10c0 7 2 11 5 13.5" fill="none" stroke="#ffffff" stroke-opacity=".8" stroke-width="1.5" stroke-linecap="round"/>
   <rect x="22.5" y="28" width="3" height="10" fill="url(#vtGold)"/><ellipse cx="24" cy="41" rx="9" ry="3.2" fill="url(#vtGold)" stroke="#6a4410" stroke-width=".7"/>`,
  // mask: violet masquerade mask with gold trim
  `<g transform="translate(24 22) scale(1.15) translate(-24 -22)"><path d="M5 17c9-7 29-7 38 0 0 13-8 17-12.5 17-3 0-4.5-4-6.5-4s-3.5 4-6.5 4C13 34 5 30 5 17z" fill="url(#vtMask)" stroke="#e8c27a" stroke-width="1.4"/>
   <ellipse cx="16.5" cy="21.5" rx="4.6" ry="3.1" fill="#12081a"/><ellipse cx="31.5" cy="21.5" rx="4.6" ry="3.1" fill="#12081a"/>
   <path d="M9 16c8-4 22-4 30 0" fill="none" stroke="#ffffff" stroke-opacity=".45" stroke-width="1.2"/><circle cx="24" cy="15.5" r="2.2" fill="url(#vtGold)"/></g>`
];
const THORN_ART = `<path d="M9 41C17 31 27 20 39 7" fill="none" stroke="#8a5e4e" stroke-width="4" stroke-linecap="round"/>
  <path d="M15 33l-6-2 5 6zM22 25l-2-7 6 4zM28 19l7 1-5 4zM33 13l-1-6 4 4z" fill="#d0a890"/>`;
const tileArt = v => `<svg class="tile-art" viewBox="0 0 48 48" aria-hidden="true">${v === THORN ? THORN_ART : TILE_ART[v]}</svg>`;
document.body.insertAdjacentHTML('afterbegin', TILE_DEFS);
