// Velvet Thorn — app settings for the store build.
// The ad unit ids below are Google's public TEST ids: they always show test ads and never pay.
// Before release, put your own ids from the AdMob console here (and the AdMob APP id in the
// Android manifest and iOS Info.plist, see velvet-thorn-app/README.md), then set testing to false.
const APP_CONFIG = {
  admob: {
    testing: true,
    android: { banner: 'ca-app-pub-3940256099942544/6300978111', rewarded: 'ca-app-pub-3940256099942544/5224354917' },
    ios:     { banner: 'ca-app-pub-3940256099942544/2934735716', rewarded: 'ca-app-pub-3940256099942544/1712485313' }
  },
  // One-time "Remove ads" purchase. Create a non-consumable product with this id in Google Play Console
  // and App Store Connect. The store shows the local price; fallbackPrice is shown only until it loads.
  iap: { removeAds: 'remove_ads', fallbackPrice: '$1.99' }
};
// True inside the Capacitor app (Android/iOS), false in a browser.
const IS_APP = !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
const APP_PLATFORM = IS_APP ? Capacitor.getPlatform() : 'web';
