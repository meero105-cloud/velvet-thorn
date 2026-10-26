// Velvet Thorn — game data (single source of truth for content + AI asset prompts)
// CONTENT RULE: suggestive, never explicit. All characters are adults. See CONTENT_GUIDELINES.md.
// Story text here is the Korean original; English overlays it from js/lang/en.js (see js/i18n.js).
// AI prompts stay in English (most generation tools work best in English).

const STYLE = 'dark fantasy oil painting, baroque palace, candlelight chiaroscuro, crimson and gold palette, ' +
  'elegant adult characters in ornate period costume, fully clothed, tasteful and suggestive mood, cinematic composition';
// Paste into the tool's negative-prompt field. Many models ignore negation inside the main prompt.
const NEGATIVE_PROMPT = 'nudity, nipples, genitals, see-through clothing, lingerie, sexual act, childlike or youthful-looking face, minor, gore';

const ASSETS = {
  images: {
    title:        { title: '벨벳 쏜', emblem: 'crown', palette: ['#12060c', '#5c1430'],
      prompt: 'Key art: a thorned crown resting on a velvet cushion, a masked figure in the shadows behind, rose petals, ' + STYLE },
    exile:        { title: '추방자', emblem: 'mask', palette: ['#0d0a12', '#3b2a55'],
      prompt: 'Portrait of a cloaked adult noble returning from exile, face half in shadow, gender-ambiguous, silver signet ring, ' + STYLE },
    seraphine:    { title: '세라핀 여왕', emblem: 'crown', palette: ['#1a0508', '#7a1022'],
      prompt: 'Portrait of Queen Seraphine, regal woman in her forties, crown of black thorns, high-collared crimson gown, cold alluring gaze, throne room, ' + STYLE },
    cassian:      { title: '첩보대장 카시안 베이', emblem: 'eye', palette: ['#060b12', '#1d3b5c'],
      prompt: 'Portrait of Lord Cassian Vey, the spymaster, handsome man in his thirties, black velvet doublet open at the collar, ledger in hand, knowing smile, ' + STYLE },
    isolde:       { title: '이졸데 마로우 공작부인', emblem: 'chalice', palette: ['#07100a', '#28502f'],
      prompt: 'Portrait of Lady Isolde Marrow, poisoner duchess in her thirties, emerald gown with bare shoulders, holding a jeweled wine goblet, poison garden behind, ' + STYLE },
    rhoen:        { title: '여왕의 검, 로엔 경', emblem: 'dagger', palette: ['#100c06', '#5c4314'],
      prompt: 'Portrait of Ser Rhoen, the Queen\'s Blade, scarred knight in his thirties, gilded half-armor, sword lowered, smoldering loyal stare, ' + STYLE },
    valen:        { title: '벨벳 가문의 발렌', emblem: 'rose', palette: ['#14060f', '#6b1d52'],
      prompt: 'Portrait of Valen, masked diplomat-envoy of the Velvet House, adult in late twenties, high-collared silk coat and lace half-mask, offering a gloved hand, candlelit salon, ' + STYLE },
    courtier:     { title: '수다쟁이 궁정인', emblem: 'mask', palette: ['#0f0d0a', '#4a3b22'],
      prompt: 'Adult powdered-wig courtier whispering behind a lace fan, ballroom background, ' + STYLE },
    rival:        { title: '질투하는 경쟁자', emblem: 'rose', palette: ['#120708', '#5a1a1a'],
      prompt: 'Jealous adult noble rival in a red gown glaring across a ballroom, crushed rose in gloved hand, ' + STYLE },
    duelist:      { title: '가면 쓴 결투가', emblem: 'dagger', palette: ['#08080d', '#2c2c4a'],
      prompt: 'Adult masked duelist in a white shirt and black domino mask, rapier raised, moonlit gallery, ' + STYLE },
    informant:    { title: '궁정 밀고자', emblem: 'eye', palette: ['#07090b', '#26323a'],
      prompt: 'Adult hooded palace informant slipping a folded note behind a pillar, ' + STYLE },
    ev_velvet:    { title: '벨벳 가문', emblem: 'rose', palette: ['#16050f', '#7a2056'],
      prompt: 'Scene: Valen offering a gloved hand for a slow dance, crowded masquerade salon, intimate distance, ' + STYLE },
    ev_letter:    { title: '검은 밀랍 편지', emblem: 'letter', palette: ['#0a0a0a', '#3a3030'],
      prompt: 'Scene: a letter sealed in black wax on a desk beside a guttering candle and a dagger, ' + STYLE },
    ev_garden:    { title: '달빛 정원', emblem: 'chalice', palette: ['#050d08', '#1f4a2a'],
      prompt: 'Scene: Lady Isolde pouring wine in a moonlit poison garden, foxgloves and nightshade, flirtatious menace, ' + STYLE },
    ev_chapel:    { title: '잿빛 예배당', emblem: 'tower', palette: ['#0b0b0e', '#3d3d48'],
      prompt: 'Scene: ruined chapel with ash falling like snow, a lone confession booth, ' + STYLE },
    ev_mirror:    { title: '가면무도회의 거울', emblem: 'mask', palette: ['#0c0612', '#40205e'],
      prompt: 'Scene: an ornate mirror reflecting a different masked face than the viewer, ' + STYLE },
    ev_bath:      { title: '장미 목욕탕', emblem: 'rose', palette: ['#14080c', '#6a2a3a'],
      prompt: 'Scene: steam-filled marble bathhouse, two adult figures talking in confidence, both fully covered in thick robes closed to the neck, rose petals floating on the water, ' + STYLE },
    cellar:       { title: '포도주 저장고', emblem: 'chalice', palette: ['#0c0705', '#3d2414'],
      prompt: 'Scene: quiet candlelit wine cellar, a single armchair, refuge from the court, ' + STYLE },
    victory:      { title: '가시 왕좌', emblem: 'crown', palette: ['#1a0d03', '#8a5a12'],
      prompt: 'Scene: the Exile standing before an empty thorn throne at dawn, crown in hand, ' + STYLE },
    defeat:       { title: '다시 추방되다', emblem: 'letter', palette: ['#050505', '#2a1015'],
      prompt: 'Scene: palace gates closing on a rainy night, a dropped mask in the mud, ' + STYLE }
  },

  music: {
    mus_title: { prompt: 'Dark baroque harpsichord and string quartet, slow, melancholic and seductive, A minor, 60 bpm, loopable, instrumental' },
    mus_court: { prompt: 'Courtly intrigue waltz, pizzicato strings, whispering choir pads, mysterious, 72 bpm, loopable, instrumental' },
    mus_duel:  { prompt: 'Tense baroque battle music, driving cellos, harpsichord ostinato, timpani, 110 bpm, loopable, instrumental' },
    mus_boss:  { prompt: 'Epic dark choral boss theme, pipe organ and full orchestra, 126 bpm, D minor, loopable, instrumental' },
    mus_salon: { prompt: 'Sultry candlelit salon music, solo violin and harp, slow dance, 84 bpm, loopable, instrumental' }
  },

  // Cinematics: if assets/video/<id>.mp4 exists it plays; otherwise the beats below play as a procedural cinematic.
  // fx: particle layer (rain | petals | ash | mist | embers | sparkle | dust). title: big title card. mus: music for the scene.
  // grade: colour grade (warm | cold | green | red). boss: enemy id; ends on that enemy's name card instead of a title card.
  // beats[]: img, text, who (speaker image id, shows a name tag), move (in | out | left | right | up),
  //   fg (foreground: curtain | vines | pillars | candles | bars | none), sfx (thunder | boom | door | sword | pour | bell | heart | whoosh),
  //   flash, shake.
  videos: {
    vid_prologue: { fx: 'rain', title: 'VELVET THORN', mus: 'mus_title', grade: 'cold',
      prompt: '10s cinematic: a hooded figure rides through rain toward a gothic palace, gates open, candlelit masquerade inside, slow push-in, ' + STYLE,
      beats: [
        { img: 'exile', text: '7년 전, 당신의 가문은 저지르지도 않은 반역죄로 불태워졌다.', sfx: 'thunder', flash: true, move: 'in' },
        { img: 'defeat', text: '당신은 빗속에서 성문 밖으로 내던져졌다. 가면 하나만 남긴 채.', sfx: 'door', shake: true, move: 'out' },
        { img: 'title', text: '오늘 밤 가시 궁정에서 가면무도회가 열린다. 모든 가면 뒤에는 빚이 숨어 있다.', fg: 'curtain', sfx: 'bell', move: 'up' },
        { img: 'seraphine', text: '세라핀 여왕이 당신을 불러들였다. 자비 때문은 아니다.', fg: 'pillars', move: 'left' },
        { img: 'seraphine', who: 'seraphine', text: '"돌아왔구나, 추방자. 춤을 출 시간이다."', fg: 'none', move: 'in' }
      ] },
    vid_ch1: { fx: 'sparkle', title: '1장 · 가면무도회', mus: 'mus_court',
      prompt: '8s cinematic: grand ballroom masquerade, swirling gowns, a knight watching from the balcony, ' + STYLE,
      beats: [
        { img: 'courtier', text: '샹들리에 아래, 백 개의 가면이 한꺼번에 당신을 돌아본다.', move: 'in' },
        { img: 'rival', text: '모두가 당신의 귀환을 반기는 것은 아니다.', move: 'right' },
        { img: 'rhoen', text: '로엔 경은 여왕의 비밀을 지킨다. 어쩌면 당신의 비밀 하나도.', fg: 'pillars', move: 'up' }
      ] },
    vid_ch2: { fx: 'mist', title: '2장 · 독의 정원', mus: 'mus_salon', grade: 'green',
      prompt: '8s cinematic: moonlit poison garden, a goblet tipping, green mist, a woman laughing softly, ' + STYLE,
      beats: [
        { img: 'ev_garden', text: '궁정 담장 너머, 달빛만 들어갈 수 있는 정원이 있다.', move: 'up' },
        { img: 'informant', text: '이곳의 꽃은 저마다 누군가의 죽음을 기억한다.', move: 'left' },
        { img: 'isolde', text: '이졸데 공작부인은 얼굴을 잊지 않는다. 독의 양도.', sfx: 'pour', move: 'in' }
      ] },
    vid_ch3: { fx: 'embers', title: '3장 · 가시 왕좌', mus: 'mus_title', grade: 'red',
      prompt: '8s cinematic: throne room doors open, thorned vines crawling over marble, queen rising from throne, ' + STYLE,
      beats: [
        { img: 'cassian', text: '장부가 덮였다. 이제 남은 이름은 하나뿐이다.', move: 'right' },
        { img: 'victory', text: '가시 덩굴이 대리석 계단을 기어오른다.', fg: 'vines', sfx: 'door', move: 'up' },
        { img: 'seraphine', text: '여왕이 기다리고 있다. 그녀는 처음부터 당신일 줄 알았다.', move: 'in' }
      ] },
    vid_ending: { fx: 'petals', title: '가시 왕좌', mus: 'mus_title',
      prompt: '10s cinematic: dawn breaking over the palace, thorn vines wither and bloom into roses, the Exile ascends the stairs, ' + STYLE,
      beats: [
        { img: 'victory', text: '궁정이 무릎을 꿇는다. 누군가는 두려움에, 누군가는 더 따뜻한 무언가에.', sfx: 'bell', move: 'up' },
        { img: 'seraphine', text: '가시 왕관이 바닥에 떨어진다. 아무도 줍지 않는다.', move: 'out' },
        { img: 'exile', text: '7년 전의 불길이 마침내 꺼졌다.', move: 'in' },
        { img: 'valen', who: 'valen', text: '"모든 왕관은 가면이에요. 잘 쓰세요."', fg: 'curtain', move: 'left' }
      ] },
    vid_defeat: { fx: 'rain', grade: 'cold',
      prompt: '6s cinematic: palace gates slam shut in the rain, a mask falls into a puddle, ' + STYLE,
      beats: [
        { img: 'defeat', text: '성문이 다시 닫힌다. 빗물 속으로 가면이 떨어진다.', sfx: 'door', shake: true, move: 'out' },
        { img: 'exile', text: '궁정은 운 없는 자에게 자비가 없다. 하지만 추방자는 돌아온다.', sfx: 'thunder', flash: true, move: 'in' }
      ] },

    // Story scenes: play before each event.
    vid_ev_velvet: { fx: 'sparkle',
      prompt: '8s cinematic: slow dolly through a candlelit masquerade salon, dancers part, a masked envoy turns and extends a gloved hand toward camera, ' + STYLE,
      beats: [
        { img: 'ev_velvet', text: '음악이 바뀐다. 춤추던 사람들이 길을 비킨다.', move: 'in' },
        { img: 'valen', text: '레이스 가면 너머, 누군가 당신만 보고 있다.', move: 'left' }
      ] },
    vid_ev_bath: { fx: 'mist',
      prompt: '8s cinematic: steam drifting across a marble bathhouse, rose petals on dark water, a robed scarred knight sits waiting, camera glides past pillars, ' + STYLE,
      beats: [
        { img: 'ev_bath', text: '수증기가 대리석 기둥 사이를 흐른다.', fg: 'pillars', move: 'right' },
        { img: 'rhoen', text: '여왕의 검이 칼 없이 기다리고 있다.', fg: 'none', move: 'in' }
      ] },
    vid_ev_garden: { fx: 'mist', grade: 'green',
      prompt: '8s cinematic: moonlight through foxgloves and nightshade, wine poured in slow motion into a jeweled goblet, green mist curling, ' + STYLE,
      beats: [
        { img: 'ev_garden', text: '달빛 아래, 독초들이 은빛으로 빛난다.', move: 'up' },
        { img: 'isolde', text: '포도주가 잔을 채우는 소리만 들린다.', sfx: 'pour', move: 'in' }
      ] },
    vid_ev_letter: { fx: 'dust',
      prompt: '6s cinematic: extreme close-up of a black wax seal with a family crest, candle flame gutters, a dagger glints beside the letter, ' + STYLE,
      beats: [
        { img: 'ev_letter', text: '검은 밀랍. 그리고 7년 전 불타 버린 문장.', sfx: 'heart', move: 'in' },
        { img: 'informant', text: '누군가 당신의 과거를 알고 있다. 그리고 그 값을 원한다.', fg: 'pillars', move: 'left' }
      ] },
    vid_ev_mirror: { fx: 'sparkle', fg: 'candles',
      prompt: '6s cinematic: an ornate mirror in a dark corridor, the reflection wears a different mask and smiles a beat too early, slow push-in, ' + STYLE,
      beats: [
        { img: 'ev_mirror', text: '거울 속 가면이 먼저 웃는다.', sfx: 'heart', move: 'in' },
        { img: 'exile', text: '당신은 가면을 고쳐 쓴다. 거울 속 얼굴은 그러지 않는다.', move: 'out' }
      ] },
    vid_ev_chapel: { fx: 'ash', grade: 'cold',
      prompt: '8s cinematic: ash falling like snow through a broken chapel roof, shafts of pale light, an open confession booth, slow crane down, ' + STYLE,
      beats: [
        { img: 'ev_chapel', text: '무너진 지붕 사이로 재가 눈처럼 내린다.', sfx: 'bell', move: 'up' },
        { img: 'ev_chapel', text: '고해소의 커튼이 저절로 흔들린다.', fg: 'none', move: 'in' }
      ] },
    vid_cellar: { fx: 'dust',
      prompt: '6s cinematic: descending stone stairs into a quiet candlelit wine cellar, dust in the candlelight, a single armchair, ' + STYLE,
      beats: [
        { img: 'cellar', text: '연회의 소음이 멀어진다. 잠시, 아무도 없다.', sfx: 'door', move: 'out' }
      ] },

    // Boss and elite entrances: play before the duel and end on the enemy's name card.
    vid_boss_rhoen: { fx: 'embers', title: '충성의 기사', boss: 'rhoen', mus: 'mus_boss', grade: 'red',
      prompt: '8s cinematic: an armored knight walks out of darkness onto a ballroom balcony, draws a gilded sword, candles flare, low angle, ' + STYLE,
      beats: [
        { img: 'ev_velvet', text: '발코니의 촛불이 한꺼번에 흔들린다.', fg: 'curtain', move: 'right' },
        { img: 'rhoen', who: 'rhoen', text: '"폐하의 명이다. 물러설 곳은 없다."', sfx: 'sword', move: 'up' }
      ] },
    vid_boss_isolde: { fx: 'mist', title: '독의 공작부인', boss: 'isolde', mus: 'mus_boss', grade: 'green',
      prompt: '8s cinematic: a duchess in emerald rises from a garden bench, poison mist swirls around her, she raises a goblet in a toast, ' + STYLE,
      beats: [
        { img: 'ev_garden', text: '잔이 넘칠 만큼 채워진다.', sfx: 'pour', move: 'up' },
        { img: 'isolde', who: 'isolde', text: '"마지막 잔은 늘 제가 따르죠."', move: 'in' }
      ] },
    vid_boss_seraphine: { fx: 'embers', title: '가시 왕좌의 주인', boss: 'seraphine', mus: 'mus_boss', grade: 'red',
      prompt: '10s cinematic: throne room doors swing open, thorned vines crawl across marble, the queen rises from the thorn throne, crown of black thorns, ' + STYLE,
      beats: [
        { img: 'victory', text: '왕좌의 방 문이 열린다.', fg: 'vines', sfx: 'door', shake: true, move: 'in' },
        { img: 'seraphine', who: 'seraphine', text: '"7년을 기다렸다. 실망시키지 마라."', move: 'up' }
      ] },
    vid_elite_cassian: { fx: 'dust', title: '모든 것을 아는 자', boss: 'cassian', mus: 'mus_boss', grade: 'cold',
      prompt: '6s cinematic: a candlelit archive, a man in black velvet closes a ledger and looks up with a knowing smile, ' + STYLE,
      beats: [
        { img: 'informant', text: '기록 보관소의 촛불 하나가 꺼진다.', fg: 'candles', move: 'right' },
        { img: 'cassian', who: 'cassian', text: '"당신 이름은 이 장부 맨 위에 있어요."', move: 'left' }
      ] }
  }
};

// Tile suits on the puzzle board. base = effect per tile before blessings.
const SUITS = [
  { key: 'blade', name: '칼날',   glyph: '🗡', color: '#c0392b', base: 2, unit: '피해' },
  { key: 'rose',  name: '장미',   glyph: '🌹', color: '#d35d8c', base: 2, unit: '보호막' },
  { key: 'wine',  name: '포도주', glyph: '🍷', color: '#3f9f6a', base: 2, unit: '회복' },
  { key: 'mask',  name: '가면',   glyph: '🎭', color: '#8e5bd1', base: 1, unit: '게이지' }
];
const THORN = 4; // obstacle tile: can't be moved, cleared by a match next to it

const PLAYER_HP = 60;
const GAUGE_MAX = 15;       // mask gauge needed for the finisher
const FINISHER_DMG = 20;
// Difficulty tiers, played in order: each is one full pass of the 17 stages (easy → normal → hard).
// hp / atk multiply enemy hp and attack/guard/heal. After the last tier comes the endless Throne Challenge.
const TIERS = [
  { hp: 0.7, atk: 0.65 },
  { hp: 1.5, atk: 1.25 },
  { hp: 2.8, atk: 1.8 }
];
const THRONE_HP = 1.4;      // per Throne Challenge round after the hard tier, compounding
const THRONE_ATK = 1.2;

// Enemy actions: atk (damage), thorn (plant n thorns), guard (enemy shield), heal (enemy hp).
// every = how many of your moves between enemy actions. actions cycle in order.
const ENEMIES = {
  courtier:  { name: '수다쟁이 궁정인', hp: 65, img: 'courtier', every: 2,
    line: '"어머, 추방자가 돌아왔다고요? 다들 알고 싶어 하겠네요."',
    actions: [{ t: 'atk', v: 18 }, { t: 'thorn', v: 2 }] },
  rival:     { name: '질투하는 경쟁자', hp: 85, img: 'rival', every: 3,
    line: '"그 자리는 원래 내 것이었어."',
    actions: [{ t: 'atk', v: 31 }, { t: 'guard', v: 10 }, { t: 'atk', v: 36 }] },
  informant: { name: '궁정 밀고자', hp: 75, img: 'informant', every: 2,
    line: '"당신 이름은 이미 첩보대장의 장부에 올라 있소."',
    actions: [{ t: 'thorn', v: 2 }, { t: 'atk', v: 21 }] },
  duelist:   { name: '가면 쓴 결투가', hp: 90, img: 'duelist', every: 2,
    line: '"말은 필요 없소. 검을 드시오."',
    actions: [{ t: 'atk', v: 18 }, { t: 'atk', v: 18 }, { t: 'atk', v: 36 }] },
  cassian:   { name: '첩보대장 카시안 베이', hp: 160, img: 'cassian', every: 2, elite: true,
    line: '"당신에 대해선 다 알고 있어요. 당신이 모르는 것까지."',
    actions: [{ t: 'atk', v: 36 }, { t: 'thorn', v: 3 }, { t: 'guard', v: 15 }] },
  rhoen:     { name: '여왕의 검, 로엔 경', hp: 170, img: 'rhoen', every: 2, boss: true,
    line: '"여왕 폐하의 명이다. 개인적인 감정은 없다."',
    actions: [{ t: 'guard', v: 12 }, { t: 'atk', v: 42 }, { t: 'atk', v: 26 }] },
  isolde:    { name: '이졸데 마로우 공작부인', hp: 220, img: 'isolde', every: 2, boss: true,
    line: '"한 잔 더 하실래요? 이번 건 정말 괜찮은 거예요."',
    actions: [{ t: 'thorn', v: 3 }, { t: 'atk', v: 39 }, { t: 'heal', v: 20 }, { t: 'atk', v: 52 }] },
  seraphine: { name: '세라핀 여왕', hp: 300, img: 'seraphine', every: 2, boss: true,
    line: '"돌아올 줄 알았어. 이번엔 끝까지 지켜보겠다."',
    actions: [{ t: 'thorn', v: 4 }, { t: 'atk', v: 47 }, { t: 'guard', v: 20 }, { t: 'atk', v: 68 }] }
};

// Fixed stage order per chapter. duel | event | rest
const CHAPTERS = [
  { name: '가면무도회', video: 'vid_ch1', nodes: [
    { type: 'duel', enemy: 'courtier' }, { type: 'event', id: 'velvet' },
    { type: 'duel', enemy: 'rival' }, { type: 'event', id: 'bath' },
    { type: 'duel', enemy: 'rhoen' } ] },
  { name: '독의 정원', video: 'vid_ch2', nodes: [
    { type: 'duel', enemy: 'informant' }, { type: 'event', id: 'garden' },
    { type: 'duel', enemy: 'duelist' }, { type: 'event', id: 'letter' },
    { type: 'rest' }, { type: 'duel', enemy: 'isolde' } ] },
  { name: '가시 왕좌', video: 'vid_ch3', nodes: [
    { type: 'duel', enemy: 'cassian' }, { type: 'event', id: 'mirror' },
    { type: 'duel', enemy: 'rival' }, { type: 'event', id: 'chapel' },
    { type: 'rest' }, { type: 'duel', enemy: 'seraphine' } ] }
];

// Blessings: picked after each duel, they stack for the rest of the run.
const BLESSINGS = {
  sharp:    { name: '벼린 칼날',     text: '🗡 칼날 타일 하나당 피해 +1' },
  velvet:   { name: '두꺼운 벨벳',   text: '🌹 장미 타일 하나당 보호막 +1' },
  vintage:  { name: '오래된 포도주', text: '🍷 포도주 타일 하나당 회복 +1' },
  whisper:  { name: '가면의 속삭임', text: '필살기에 필요한 게이지 -2 (최소 6)' },
  crown:    { name: '왕의 칼날',     text: '필살기 피해 +10' },
  guard:    { name: '벨벳 가면',     text: '결투를 보호막 8로 시작' },
  heart:    { name: '강철 심장',     text: '최대 체력 +10, 체력 10 회복', instant: true },
  rest:     { name: '짧은 휴식',     text: '체력 40% 회복', instant: true }
};

// Story events. fx keys: heal, hurt, maxhp, bless (blessing id or 'random'), gallery (image id), gamble
const EVENTS = {
  velvet: { title: '벨벳 가문', img: 'ev_velvet', music: 'mus_salon',
    text: '무도회장 가장자리에서 발렌이 당신을 찾아낸다. "동맹이 필요해 보이네요." 재스민 향이 느껴질 만큼 가까이에서 속삭인다. "아니면 잠깐 숨 돌릴 틈이라도."',
    choices: [
      { label: '춤을 받아들인다', desc: '무작위 축복 1개. 갤러리 장면 해금.', fx: { bless: 'random', gallery: 'ev_velvet' } },
      { label: '아는 것을 묻는다', desc: '체력 5 잃음. 「벼린 칼날」 획득.', fx: { hurt: 5, bless: 'sharp' } },
      { label: '정중히 거절한다', desc: '체력 8 회복.', fx: { heal: 8 } }
    ] },
  bath: { title: '장미 목욕탕', img: 'ev_bath', music: 'mus_salon',
    text: '왕실 목욕탕의 수증기 속, 로엔 경이 갑옷을 벗고 가운 차림으로 앉아 있다. 팔의 흉터가 그대로 드러나 있다. "여기선 칼은 없다. 물어보아라."',
    choices: [
      { label: '그날의 화재에 대해 묻는다', desc: '「왕의 칼날」 획득. 갤러리 장면 해금.', fx: { bless: 'crown', gallery: 'ev_bath' } },
      { label: '그냥 쉰다', desc: '체력 12 회복.', fx: { heal: 12 } }
    ] },
  garden: { title: '달빛 정원', img: 'ev_garden', music: 'mus_salon',
    text: '이졸데 공작부인이 잔을 건넨다. "오랜 친구를 위하여." 그녀가 나직이 웃는다. "아니면 오랜 원수를 위하여. 이 시간엔 도무지 구분이 안 돼서요."',
    choices: [
      { label: '마신다', desc: '50%: 체력 15 회복. 50%: 체력 8 잃고 「가면의 속삭임」 획득.', fx: { gamble: true } },
      { label: '장미 덤불에 쏟아 버린다', desc: '「두꺼운 벨벳」 획득.', fx: { bless: 'velvet' } }
    ] },
  letter: { title: '검은 밀랍 편지', img: 'ev_letter',
    text: '베개 위에 편지 한 통이 놓여 있다. 죽은 아버지의 문장으로 봉인되어 있다. 이걸 둔 자는 당신이 어디서 자는지 알고 있다.',
    choices: [
      { label: '봉인을 뜯는다', desc: '최대 체력 4 잃음. 무작위 축복 1개.', fx: { maxhp: -4, bless: 'random' } },
      { label: '읽지 않고 태운다', desc: '체력 10 회복.', fx: { heal: 10 } }
    ] },
  mirror: { title: '가면무도회의 거울', img: 'ev_mirror',
    text: '거울 속 당신은 다른 가면을 쓰고 있다. 그리고 당신보다 먼저 웃는다.',
    choices: [
      { label: '거울을 만진다', desc: '체력 6 잃음. 무작위 축복 1개.', fx: { hurt: 6, bless: 'random' } },
      { label: '눈을 돌린다', desc: '아무 일도 일어나지 않는다. 아마도.', fx: {} }
    ] },
  chapel: { title: '잿빛 예배당', img: 'ev_chapel',
    text: '무너진 지붕 사이로 재가 내린다. 고해실 문이 열려 있다. 이제 여기서 고해를 듣는 사람은 없다. 어쩌면 그래서 오는 것이다.',
    choices: [
      { label: '고해한다', desc: '체력 20 회복.', fx: { heal: 20 } },
      { label: '기도한다', desc: '최대 체력 +5.', fx: { maxhp: 5 } }
    ] }
};
