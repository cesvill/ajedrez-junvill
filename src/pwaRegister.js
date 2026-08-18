/**
 * Registro de Service Worker para Ajedrez Junvill
 */

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registrado exitosamente con scope:', registration.scope);

          // Detectar nuevas versiones del Service Worker
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] Nueva versión disponible en segundo plano.');
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn('[PWA] Error al registrar Service Worker:', error);
        });
    });
  }
};
