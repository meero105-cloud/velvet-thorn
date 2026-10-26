// Velvet Thorn — ad layer.
// In the app: AdMob bottom banner (320×50) and a rewarded ad for the revive (@capacitor-community/admob).
// In a browser: a labelled banner placeholder and a stand-in rewarded ad (a short countdown) for testing.
// The "Remove ads" purchase (js/shop.js) turns both off: no banner, and the revive is free.
const Ads = (() => {
  const TEST_SECONDS = 3;
  const AdMob = IS_APP && Capacitor.Plugins ? Capacitor.Plugins.AdMob : null;
  const ids = APP_CONFIG.admob[APP_PLATFORM] || {};
  const testing = APP_CONFIG.admob.testing;

  let adFree = false;
  try { adFree = localStorage.getItem('vt_adfree') === '1'; } catch (e) {}
  function setAdFree(on) { adFree = !!on; try { localStorage.setItem('vt_adfree', adFree ? '1' : '0'); } catch (e) {} }

  // App start: SDK, then the privacy consent form where the law needs one (EU/UK), then iOS tracking permission.
  let ready = null;
  function init() {
    if (!AdMob) return Promise.resolve();
    if (!ready) ready = (async () => {
      try {
        await AdMob.initialize({ initializeForTesting: testing });
        const info = await AdMob.requestConsentInfo();
        if (info.isConsentFormAvailable && info.status === 'REQUIRED') await AdMob.showConsentForm();
        if (APP_PLATFORM === 'ios') {
          const st = await AdMob.trackingAuthorizationStatus();
          if (st.status === 'notDetermined') await AdMob.requestTrackingAuthorization();
        }
      } catch (e) { console.warn('AdMob init', e); }
    })();
    return ready;
  }

  function rewarded() {
    if (adFree) return Promise.resolve(true); // the reward without the ad
    return AdMob ? nativeRewarded() : testRewarded();
  }
  // Resolves true only when the player earned the reward. If no ad can load (offline, no fill),
  // the player still gets the revive: it is not their fault.
  async function nativeRewarded() {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="panel ad-test"><small>${t('adLoading')}</small></div>`;
    document.body.appendChild(ov);
    Media.suspend();
    const handles = [];
    try {
      await init();
      await AdMob.prepareRewardVideoAd({ adId: ids.rewarded, isTesting: testing });
      return await new Promise(async resolve => {
        let earned = false;
        handles.push(await AdMob.addListener('onRewardedVideoAdReward', () => { earned = true; }));
        handles.push(await AdMob.addListener('onRewardedVideoAdDismissed', () => resolve(earned)));
        handles.push(await AdMob.addListener('onRewardedVideoAdFailedToShow', () => resolve(true)));
        ov.remove();
        AdMob.showRewardVideoAd().catch(() => resolve(true));
      });
    } catch (e) {
      return true;
    } finally {
      ov.remove();
      handles.forEach(h => h.remove());
      Media.resume();
    }
  }
  function testRewarded() {
    return new Promise(resolve => {
      const ov = document.createElement('div');
      ov.className = 'overlay';
      ov.innerHTML = `<div class="panel ad-test"><small>${t('adTest')}</small><h2 class="ad-count">${TEST_SECONDS}</h2>
        <button class="btn sm" id="ad-close">${t('adClose')}</button></div>`;
      document.body.appendChild(ov);
      let left = TEST_SECONDS;
      const timer = setInterval(() => {
        left--;
        ov.querySelector('.ad-count').textContent = left;
        if (left <= 0) { clearInterval(timer); ov.remove(); resolve(true); }
      }, 1000);
      ov.querySelector('#ad-close').onclick = () => { clearInterval(timer); ov.remove(); resolve(false); };
    });
  }

  // Bottom banner. The page keeps a 320×50 strip free (body.has-banner) so the banner never covers the board.
  // In the app the native AdMob banner sits on top of that strip; in a browser a placeholder fills it.
  let nativeShown = false;
  function banner() {
    let el = document.getElementById('ad-banner');
    if (adFree) {
      if (el) el.remove();
      document.body.classList.remove('has-banner');
      if (AdMob && nativeShown) { nativeShown = false; AdMob.removeBanner().catch(() => {}); }
      return;
    }
    if (!el) { el = document.createElement('div'); el.id = 'ad-banner'; document.body.appendChild(el); }
    el.innerHTML = AdMob ? '<div class="ad-slot native"></div>' : `<div class="ad-slot">${t('adBanner')}</div>`;
    document.body.classList.add('has-banner');
    if (AdMob && !nativeShown) {
      nativeShown = true;
      init().then(() => { if (!adFree && nativeShown) return AdMob.showBanner({ adId: ids.banner, adSize: 'BANNER', position: 'BOTTOM_CENTER', margin: 0, isTesting: testing }); })
        .catch(e => { nativeShown = false; console.warn('banner', e); });
    }
  }

  return { init, rewarded, banner, isAdFree: () => adFree, setAdFree: on => { setAdFree(on); banner(); } };
})();
