const cacheNames = [
  'bv-cache',
  'ionic-cache',
  'legacy-app-cache',
  'legacy-web-cache',
  'miscellaneous-app-cache',
  'authentication-app-cache',
  'transfers-app-cache',
  'settings-app-cache',
  'customer-assistance-app-cache'
];

const deleteLegacyServiceWorker = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    const serviceWorkerRegistrations = await navigator.serviceWorker.getRegistrations();
    const legacyServiceWorkerRegistration = serviceWorkerRegistrations.find(serviceWorkerRegistration =>
      serviceWorkerRegistration.active.scriptURL.includes('/bv_service-worker.js')
    );
    const unregistered = legacyServiceWorkerRegistration ? await legacyServiceWorkerRegistration.unregister() : false;
    return unregistered;
  }
  return false;
};

const deleteCache = async (cacheName: string): Promise<boolean> => {
  if (caches.has(cacheName)) {
    return await caches.delete(cacheName);
  }
  return false;
};

const deleteLegacyPWA = async (): Promise<boolean> => {
  try {
    const serviceWorkerDeleted = await deleteLegacyServiceWorker();
    const bvCachedDeleted = await deleteCache('bv-cache');
    const ionicCacheDeleted = await deleteCache('ionic-cache');
    return serviceWorkerDeleted && bvCachedDeleted && ionicCacheDeleted;
  } catch (error) {
    return false;
  }
};

export const deleteApplicationCache = async (): Promise<boolean> => {
  try {
    const serviceWorkerDeleted = await deleteLegacyServiceWorker();
    cacheNames.forEach(async cacheName => await deleteCache(cacheName));
    return serviceWorkerDeleted;
  } catch (error) {
    return false;
  }
};

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/container/service-worker.js', { scope: '/' });
    });
  }
};

deleteLegacyPWA().then(() => registerServiceWorker());
