// Copies the web game (game/) into www/, which Capacitor packages into the Android app.
// Release builds (AD_RELEASE=1) get the real AdMob units from ads.json; test builds keep Google's test units.
// The AdMob app id from ads.json goes into the Android manifest for every build (test units still work with it).
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..'), www = path.join(root, 'www');
const KEEP = ['index.html', 'style.css', 'js', 'assets'];
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });
for (const name of KEEP)
  fs.cpSync(path.join(root, 'game', name), path.join(www, name), { recursive: true, filter: f => !/(README|\.txt$|\.md$)/.test(path.basename(f)) });

const ids = JSON.parse(fs.readFileSync(path.join(root, 'ads.json'), 'utf8'));
const manifest = path.join(root, 'android/app/src/main/AndroidManifest.xml');
if (ids.app) {
  const m = fs.readFileSync(manifest, 'utf8');
  const out = m.replace(/(com\.google\.android\.gms\.ads\.APPLICATION_ID"\s*android:value=")[^"]*"/, `$1${ids.app}"`);
  if (out === m && !m.includes(ids.app)) throw new Error('AdMob APPLICATION_ID not found in AndroidManifest.xml');
  fs.writeFileSync(manifest, out);
}
if (process.env.AD_RELEASE === '1') {
  if (!ids.app || !ids.banner || !ids.rewarded) {
    console.warn('WARNING: ads.json is not filled in yet; this release bundle still shows TEST ads.');
  } else {
    const cfg = path.join(www, 'js/config.js');
    let src = fs.readFileSync(cfg, 'utf8');
    const line = `    android: { banner: '${ids.banner}', rewarded: '${ids.rewarded}' },`;
    if (!/^\s*android: \{.*\},$/m.test(src) || !/testing: true/.test(src)) throw new Error('ad lines not found in game/js/config.js');
    src = src.replace(/^\s*android: \{.*\},$/m, line).replace('testing: true', 'testing: false');
    fs.writeFileSync(cfg, src);
    console.log('using release ad units');
  }
}
console.log('www/ written');
