// Velvet Thorn — the one-time "Remove ads" purchase.
// In the app: Google Play Billing / StoreKit 2 through @capgo/native-purchases (no server needed).
// In a browser: a test purchase dialog, so the flow can be tried without a store.
// Owning the product turns ads off (Ads.setAdFree). "Restore purchases" asks the store again,
// which Apple requires and which helps players on a new phone.
const Shop = (() => {
  const ID = APP_CONFIG.iap.removeAds;
  const IAP = IS_APP && Capacitor.Plugins ? Capacitor.Plugins.NativePurchases : null;
  let price = APP_CONFIG.iap.fallbackPrice, onChange = () => {};

  // Android reports purchaseState "1" (PURCHASED) or "2" (PENDING); iOS leaves it unset.
  const isOwned = tx => tx && tx.productIdentifier === ID && !tx.revocationDate &&
    (tx.purchaseState === undefined || tx.purchaseState === '1' || tx.purchaseState === 'PURCHASED');

  async function check() {
    try {
      const { purchases } = await IAP.getPurchases({ productType: 'inapp' });
      if (purchases.some(isOwned)) Ads.setAdFree(true);
    } catch (e) { console.warn('purchases', e); }
    onChange();
  }
  async function init(changed) {
    if (changed) onChange = changed;
    if (!IAP) return;
    try {
      const { product } = await IAP.getProduct({ productIdentifier: ID, productType: 'inapp' });
      if (product && product.priceString) price = product.priceString;
    } catch (e) { console.warn('product', e); }
    await check();
  }

  // Resolves true when the purchase went through.
  async function buy() {
    if (Ads.isAdFree()) return true;
    if (!IAP) return testBuy();
    try {
      const tx = await IAP.purchaseProduct({ productIdentifier: ID, productType: 'inapp', autoAcknowledgePurchases: true });
      if (isOwned(tx)) { Ads.setAdFree(true); onChange(); return true; }
      toast(t('buyPending'));
      return false;
    } catch (e) {
      if (!/cancel/i.test(String(e && (e.code || e.message)))) toast(t('buyFail'));
      return false;
    }
  }
  async function restore() {
    if (IAP) {
      try { await IAP.restorePurchases(); } catch (e) { console.warn('restore', e); }
      await check();
    }
    toast(Ads.isAdFree() ? t('restoreDone') : t('restoreNone'));
  }

  function testBuy() {
    return new Promise(resolve => {
      const ov = document.createElement('div');
      ov.className = 'overlay';
      ov.innerHTML = `<div class="panel"><h2>${t('removeAdsHead')}</h2><p class="sub">${t('removeAdsNote')}</p>
        <p class="sub"><small>${t('buyTest')}</small></p>
        <div class="menu col"><button class="btn primary" id="buy-ok">${t('buyBtn', price)}</button>
        <button class="btn" id="buy-no">${t('cancel')}</button></div></div>`;
      document.body.appendChild(ov);
      ov.querySelector('#buy-ok').onclick = () => { ov.remove(); Ads.setAdFree(true); onChange(); resolve(true); };
      ov.querySelector('#buy-no').onclick = () => { ov.remove(); resolve(false); };
    });
  }

  return { init, buy, restore, price: () => price };
})();
