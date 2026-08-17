/**
 * Enrutador de Deep Linking y Sincronización de URLs para Ajedrez Junvill
 * Permite que cada pestaña, lección, partida vs bot, sala P2P y modal
 * tenga su propia URL única y navegable directamente.
 */

export const parseUrlState = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') || 'aprender';
    const lessonId = params.get('lesson') || null;
    const botId = params.get('bot') || null;
    const roomId = params.get('room') || null;
    const modal = params.get('modal') || null;
    const tab = params.get('tab') || null;

    return {
      view,
      lessonId,
      botId,
      roomId,
      modal,
      tab
    };
  } catch (e) {
    console.error("Error parsing URL state:", e);
    return { view: 'aprender' };
  }
};

export const syncUrl = ({ view, lessonId, botId, roomId, modal, tab }, replace = false) => {
  try {
    const url = new URL(window.location.href);
    const params = new URLSearchParams();

    if (view && view !== 'aprender') {
      params.set('view', view);
    }
    if (lessonId) {
      params.set('lesson', lessonId);
    }
    if (botId) {
      params.set('bot', botId);
    }
    if (roomId) {
      params.set('room', roomId);
    }
    if (modal) {
      params.set('modal', modal);
    }
    if (tab) {
      params.set('tab', tab);
    }

    const queryString = params.toString();
    const newRelativePath = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

    if (window.location.search !== (queryString ? `?${queryString}` : '')) {
      if (replace) {
        window.history.replaceState({ view, lessonId, botId, roomId, modal, tab }, '', newRelativePath);
      } else {
        window.history.pushState({ view, lessonId, botId, roomId, modal, tab }, '', newRelativePath);
      }
    }
  } catch (e) {
    console.error("Error updating URL state:", e);
  }
};
