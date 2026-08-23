/**
 * Registro de Service Worker para Ajedrez Junvill
 */

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registrado exitosamente con scope:', registration.scope);
          // Si hay un worker esperando, pedirle que tome el control
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        })
        .catch((error) => {
          console.warn('[PWA] Error al registrar Service Worker:', error);
        });
    });
  }
};
