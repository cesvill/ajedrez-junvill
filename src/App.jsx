import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useUser } from './context/UserContext';
import { Header } from './components/Navigation/Header';
import { Navbar } from './components/Navigation/Navbar';
import { DeviceSimulatorBar, DEVICE_CONFIGS } from './components/Navigation/DeviceSimulatorBar';
import { Sparkles } from 'lucide-react';
import { HomeView } from './views/HomeView';
import { LessonsView } from './views/LessonsView';
import { LessonPlayerModal } from './views/LessonPlayerModal';
import { PlayView } from './views/PlayView';
import { RobotsView } from './views/RobotsView';
import { PuzzlesView } from './views/PuzzlesView';
import { TournamentsView } from './views/TournamentsView';
import { AvatarStudioView } from './views/AvatarStudioView';
import { ProfileModal } from './components/ProfileModal/ProfileModal';
import { DailyChallengeModal } from './views/DailyChallengeModal';
import { CertificatesModal } from './views/CertificatesModal';
import { PgnToolModal } from './views/PgnToolModal';
import { SettingsModal } from './views/SettingsModal';
import { AvatarBuilderModal } from './components/AvatarCreator/AvatarBuilderModal';
import { P2PPlayModal } from './views/P2PPlayModal';
import { FamilyChallengesModal } from './views/FamilyChallengesModal';
import { FamilyChatDrawer } from './components/FamilyChat/FamilyChatDrawer';
import { BugReportModal } from './components/BugReport/BugReportModal';
import { BugReportFloatingButton } from './components/BugReport/BugReportFloatingButton';
import { FamilyGatekeeperModal } from './components/FamilyGroups/FamilyGatekeeperModal';
import { ManualModal } from './components/Manual/ManualModal';
import { getVariantById } from './engine/variantsEngine';
import { ChessCuby3x3Modal } from './components/ChessCuby3x3/ChessCuby3x3Modal';
import { MultiplayerPartyView } from './views/MultiplayerPartyView';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { parseUrlState, syncUrl } from './engine/urlRouter';
import { getLessonById } from './curriculum/lessonsData';
import { getBotById } from './assets/botRoster';

export const App = () => {
  const { currentUser, activeGroup, isGroupUnlocked, pendingInvitationsForMe, acceptFamilyInvitation, declineFamilyInvitation } = useUser();
  // # OJO HUMANO: Perímetro cerrado Zero-DLP - Bloqueo estricto si no hay grupo desbloqueado o usuario autenticado (CWE-306)
  const isAppLocked = !isGroupUnlocked || !currentUser;
  const [activeTab, setActiveTab] = useState(() => parseUrlState()?.view || 'inicio'); // 'inicio' | 'aprender' | 'problemas' | 'robots' | 'jugar' | 'torneos' | 'yo' | 'multijugador'
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeBotMatch, setActiveBotMatch] = useState(null);

  // Modal de Portal de Acceso / Gatekeeper de Grupos Familiares
  const [isGatekeeperOpen, setIsGatekeeperOpen] = useState(() => {
    try {
      const hasChosen = localStorage.getItem('ajedrez_junvill_has_selected_profile');
      return !hasChosen;
    } catch (e) {
      return true;
    }
  });

  // Modales Globales
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFamilyChallengesOpen, setIsFamilyChallengesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAvatarBuilderOpen, setIsAvatarBuilderOpen] = useState(false);
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isCertificatesOpen, setIsCertificatesOpen] = useState(false);
  const [isPgnOpen, setIsPgnOpen] = useState(false);
  const [isP2POpen, setIsP2POpen] = useState(false);
  const [isBugReportOpen, setIsBugReportOpen] = useState(false);
  const [isCuby3x3Open, setIsCuby3x3Open] = useState(false);
  const [isFamilyChatOpen, setIsFamilyChatOpen] = useState(false);
  const [chatTargetUser, setChatTargetUser] = useState(null);
  const [bugReportContext, setBugReportContext] = useState({});
  const [urlRoomId, setUrlRoomId] = useState('');
  const [p2pInitialMode, setP2pInitialMode] = useState('join');

  // Detección de entorno local (solo en PC, nunca en Vercel ni producción remota)
  const isLocalEnvironment = typeof window !== 'undefined' && (
    Boolean(import.meta.env.DEV) || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.') ||
    window.location.hostname.endsWith('.local')
  );

  // Detección antirrecurrencia de iFrame y Estado del Simulador
  const isInsideSimulator = typeof window !== 'undefined' && (
    window.location.search.includes('simulator_view=1') || 
    window.self !== window.top
  );
  const [simulatedDevice, setSimulatedDevice] = useState('responsive');
  const [orientation, setOrientation] = useState('portrait');
  const [scaleMode, setScaleMode] = useState('fit');
  const [isBarMinimized, setIsBarMinimized] = useState(false);
  const iframeRef = useRef(null);

  // Monitorización de resolución de pantalla de PC para auto-ajuste (Fit to Screen)
  const [viewportSize, setViewportSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  }));

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectDevice = (device) => {
    setSimulatedDevice(device);
    const config = DEVICE_CONFIGS[device];
    if (config?.defaultOrientation) {
      setOrientation(config.defaultOrientation);
    }
  };

  const handleCycleScale = () => {
    setScaleMode((prev) => {
      if (prev === 'fit') return 1;
      if (prev === 1) return 0.85;
      if (prev === 0.85) return 0.75;
      return 'fit';
    });
  };

  const handleToggleSimulator = () => {
    setIsBarMinimized(false);
    if (simulatedDevice === 'responsive') {
      handleSelectDevice('galaxy_tab_s3');
    } else {
      handleSelectDevice('responsive');
    }
  };

  const isSimulated = isLocalEnvironment && !isInsideSimulator && simulatedDevice !== 'responsive';
  const devConfig = DEVICE_CONFIGS[simulatedDevice] || DEVICE_CONFIGS.responsive;

  let frameWidth = 800;
  let frameHeight = 1000;
  if (isSimulated && devConfig.width && devConfig.height) {
    frameWidth = orientation === 'portrait' ? devConfig.width : devConfig.height;
    frameHeight = orientation === 'portrait' ? devConfig.height : devConfig.width;
  }

  // Dimensiones totales del chasis físico (incluyendo biseles, marcos, botones y barra de estado)
  const chassisDims = useMemo(() => {
    if (!devConfig.width || !devConfig.height) return { width: 800, height: 1000 };
    if (simulatedDevice === 'galaxy_tab_s3') {
      if (orientation === 'landscape') {
        return { width: frameWidth + 130, height: frameHeight + 42 };
      } else {
        return { width: frameWidth + 42, height: frameHeight + 130 };
      }
    } else {
      return {
        width: frameWidth + 32,
        height: frameHeight + 58
      };
    }
  }, [simulatedDevice, orientation, frameWidth, frameHeight, devConfig]);

  // Factor de escala exacto para que el dispositivo se vea 100% completo en la pantalla del PC
  const fitScale = useMemo(() => {
    if (!isSimulated) return 1;
    const barHeight = isBarMinimized ? 0 : 54;
    const availableHeight = Math.max(200, viewportSize.height - barHeight - 36);
    const availableWidth = Math.max(200, viewportSize.width - 32);

    const scaleY = availableHeight / chassisDims.height;
    const scaleX = availableWidth / chassisDims.width;
    const computed = Math.min(scaleY, scaleX, 1.0);
    return Math.floor(computed * 100) / 100;
  }, [isSimulated, isBarMinimized, viewportSize, chassisDims]);

  const effectiveScale = scaleMode === 'fit' ? fitScale : scaleMode;


  const getIframeSrc = () => {
    const currentSearch = window.location.search;
    let newSearch = '';
    if (currentSearch) {
      const params = new URLSearchParams(currentSearch);
      params.set('simulator_view', '1');
      newSearch = `?${params.toString()}`;
    } else {
      newSearch = '?simulator_view=1';
    }
    return `${window.location.pathname}${newSearch}${window.location.hash}`;
  };

  const handleOpenP2P = (customRoomId = null, mode = 'join') => {
    const validRoom = typeof customRoomId === 'string' ? customRoomId : null;
    const validMode = typeof mode === 'string' ? mode : 'join';
    setUrlRoomId(validRoom);
    setP2pInitialMode(validMode);
    setIsP2POpen(true);
  };

  const handleOpenFamilyChat = (target = null) => {
    setChatTargetUser(target || null);
    setIsFamilyChatOpen(true);
  };

  // Sincronizar estado inicial desde la URL (Deep Linking al cargar la página o al navegar con botones del navegador)
  const applyUrlState = useCallback(() => {
    const { view, lessonId, botId, roomId, modal } = parseUrlState();

    if (roomId) {
      setUrlRoomId(roomId.toUpperCase());
      setIsP2POpen(true);
    } else if (modal === 'p2p') {
      setIsP2POpen(true);
    }

    if (modal === 'cuby3x3' || view === 'cuby3x3' || modal === 'cuby') {
      setIsCuby3x3Open(true);
    }

    if (lessonId) {
      let l = getLessonById(lessonId);
      if (!l && !isNaN(parseInt(lessonId))) {
        l = getLessonById(`l${String(lessonId).padStart(2, '0')}`) || getLessonById(`l0${lessonId}`);
      }
      if (l) {
        setActiveLesson(l);
        setActiveTab('aprender');
      }
    }

    if (botId) {
      const b = getBotById(botId);
      if (b) {
        setActiveBotMatch(b);
      }
    }

    if (modal) {
      if (modal === 'perfil') setIsProfileModalOpen(true);
      if (modal === 'grupos' || modal === 'familia') setIsGatekeeperOpen(true);
      if (modal === 'configuracion' || modal === 'servidor') setIsSettingsOpen(true);
      if (modal === 'reto_diario') setIsDailyOpen(true);
      if (modal === 'retos') setIsFamilyChallengesOpen(true);
      if (modal === 'certificados') setIsCertificatesOpen(true);
      if (modal === 'pgn') setIsPgnOpen(true);
      if (modal === 'avatar') setIsAvatarBuilderOpen(true);
    }

    if (['inicio', 'aprender', 'jugar', 'robots', 'problemas', 'torneos', 'yo', 'multijugador'].includes(view)) {
      setActiveTab(view);
    }
  }, []);

  useEffect(() => {
    applyUrlState();
    window.addEventListener('popstate', applyUrlState);

    const handleGlobalMutualMatch = (e) => {
      if (e.detail?.roomId) {
        setUrlRoomId(e.detail.roomId);
        setP2pInitialMode(e.detail.isHost ? 'host' : 'join');
        setIsP2POpen(true);
      }
    };
    window.addEventListener('junvill_mutual_match', handleGlobalMutualMatch);

    return () => {
      window.removeEventListener('popstate', applyUrlState);
      window.removeEventListener('junvill_mutual_match', handleGlobalMutualMatch);
    };
  }, [applyUrlState]);

  // Sincronización bidireccional entre la ventana anfitriona y el iFrame del simulador
  useEffect(() => {
    if (isInsideSimulator) {
      // Activar modo sin scrollbars toscas de escritorio en el iframe simulado
      document.documentElement.classList.add('in-simulator');
      // ========================================================
      // EMULADOR TÁCTIL (DRAG-TO-SCROLL) DE ALTA FIDELIDAD
      // Permite arrastrar verticalmente con clic sostenido como un dedo en móvil
      // ========================================================
      let isDragging = false;
      let hasMoved = false;
      let startX = 0;
      let startY = 0;
      let lastX = 0;
      let lastY = 0;
      let lastTime = 0;
      let velocityY = 0;
      let velocityX = 0;
      let scrollTarget = null;
      let momentumRaf = null;

      const stopMomentum = () => {
        if (momentumRaf) {
          cancelAnimationFrame(momentumRaf);
          momentumRaf = null;
        }
      };

      const findScrollableParent = (el) => {
        let curr = el;
        while (curr && curr !== document.body && curr !== document.documentElement) {
          try {
            const style = window.getComputedStyle(curr);
            const oy = style.overflowY;
            const ox = style.overflowX;
            const canScrollY = (oy === 'auto' || oy === 'scroll') && curr.scrollHeight > curr.clientHeight;
            const canScrollX = (ox === 'auto' || ox === 'scroll') && curr.scrollWidth > curr.clientWidth;
            if (canScrollY || canScrollX) {
              return curr;
            }
          } catch (err) {}
          curr = curr.parentElement;
        }
        return window;
      };

      // Prevenir el arrastre nativo de imágenes y enlaces HTML5 (excepto en el tablero de ajedrez)
      const handleNativeDragStart = (e) => {
        const target = e.target;
        if (target && target.closest) {
          const isChess = target.closest(
            '.chessboard-wrapper, .chessboard-container, .board-grid, .board-square, [data-square], .chess-piece'
          );
          if (isChess) return;
        }
        e.preventDefault();
      };

      const handlePointerDown = (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        stopMomentum();

        const target = e.target;
        if (target && target.closest) {
          // Excluir piezas, casillas de ajedrez y controles editables
          const isChess = target.closest(
            '.chessboard-wrapper, .chessboard-container, .board-grid, .board-square, [data-square], .chess-piece, .flying-piece-container, svg.board-arrow'
          );
          const isInput = target.closest('input, textarea, select, [contenteditable="true"]');
          if (isChess || isInput) {
            return;
          }
        }

        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = performance.now();
        velocityY = 0;
        velocityX = 0;
        scrollTarget = findScrollableParent(target);

        try {
          if (target && typeof target.setPointerCapture === 'function') {
            target.setPointerCapture(e.pointerId);
          }
        } catch (err) {}
      };

      const handlePointerMove = (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        const totalDist = Math.hypot(e.clientX - startX, e.clientY - startY);

        if (!hasMoved && totalDist > 5) {
          hasMoved = true;
          document.documentElement.classList.add('touch-dragging');
        }

        if (hasMoved) {
          const now = performance.now();
          const dt = now - lastTime;
          if (dt > 0) {
            const vy = deltaY / dt;
            const vx = deltaX / dt;
            velocityY = 0.7 * vy + 0.3 * velocityY;
            velocityX = 0.7 * vx + 0.3 * velocityX;
          }
          lastTime = now;
          lastX = e.clientX;
          lastY = e.clientY;

          if (scrollTarget === window) {
            window.scrollBy({ top: -deltaY, left: -deltaX, behavior: 'instant' });
          } else if (scrollTarget) {
            scrollTarget.scrollTop -= deltaY;
            scrollTarget.scrollLeft -= deltaX;
          }
        }
      };

      const handlePointerUp = (e) => {
        if (!isDragging) return;
        isDragging = false;
        document.documentElement.classList.remove('touch-dragging');

        try {
          if (e.target && typeof e.target.releasePointerCapture === 'function' && e.target.hasPointerCapture?.(e.pointerId)) {
            e.target.releasePointerCapture(e.pointerId);
          }
        } catch (err) {}

        if (hasMoved) {
          // Suprimir el click resultante tras haber arrastrado
          const suppressClick = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();
          };
          window.addEventListener('click', suppressClick, { capture: true, once: true });
          setTimeout(() => {
            window.removeEventListener('click', suppressClick, { capture: true });
          }, 150);

          // Desaceleración cinética (Momentum)
          const initVy = velocityY * 16;
          const initVx = velocityX * 16;
          if (Math.hypot(initVx, initVy) > 1.5) {
            let curVy = initVy;
            let curVx = initVx;
            const friction = 0.93;
            const target = scrollTarget;

            const momentumStep = () => {
              curVy *= friction;
              curVx *= friction;
              if (Math.hypot(curVx, curVy) < 0.25) {
                stopMomentum();
                return;
              }

              if (target === window) {
                window.scrollBy({ top: -curVy, left: -curVx, behavior: 'instant' });
              } else if (target) {
                target.scrollTop -= curVy;
                target.scrollLeft -= curVx;
              }
              momentumRaf = requestAnimationFrame(momentumStep);
            };
            momentumRaf = requestAnimationFrame(momentumStep);
          }
        }
      };

      window.addEventListener('dragstart', handleNativeDragStart);
      window.addEventListener('pointerdown', handlePointerDown, { passive: true });
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerup', handlePointerUp, { passive: false });
      window.addEventListener('pointercancel', handlePointerUp, { passive: false });
      window.addEventListener('blur', stopMomentum);

      // Dentro del iframe: notificar al padre cuando cambie la URL o hash
      const notifyParent = () => {
        try {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.delete('simulator_view');
          const cleanSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';
          window.parent.postMessage({ 
            type: 'JUNVILL_URL_SYNC', 
            search: cleanSearch, 
            hash: window.location.hash 
          }, '*');
        } catch (e) {}
      };

      const receiveFromParent = (e) => {
        if (e.data && e.data.type === 'SET_ROUTE') {
          if (e.data.search !== undefined || e.data.hash !== undefined) {
            const currentSearch = new URLSearchParams(e.data.search || '');
            currentSearch.set('simulator_view', '1');
            const newUrl = `${window.location.pathname}?${currentSearch.toString()}${e.data.hash || ''}`;
            window.history.replaceState(null, '', newUrl);
            applyUrlState();
          }
        }
      };

      window.addEventListener('popstate', notifyParent);
      window.addEventListener('hashchange', notifyParent);
      window.addEventListener('message', receiveFromParent);
      notifyParent();

      return () => {
        stopMomentum();
        window.removeEventListener('dragstart', handleNativeDragStart);
        window.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
        window.removeEventListener('blur', stopMomentum);
        document.documentElement.classList.remove('touch-dragging');
        document.documentElement.classList.remove('in-simulator');
        document.body.classList.remove('in-simulator');
        window.removeEventListener('popstate', notifyParent);
        window.removeEventListener('hashchange', notifyParent);
        window.removeEventListener('message', receiveFromParent);
      };

    } else {
      // En la ventana principal: escuchar los cambios del iframe y reflejarlos en la URL
      const receiveFromChild = (e) => {
        if (e.data && e.data.type === 'JUNVILL_URL_SYNC') {
          const newSearch = e.data.search || '';
          const newHash = e.data.hash || '';
          const targetUrl = `${window.location.pathname}${newSearch}${newHash}`;
          if (`${window.location.search}${window.location.hash}` !== `${newSearch}${newHash}`) {
            window.history.replaceState(null, '', targetUrl);
          }
        }
      };

      window.addEventListener('message', receiveFromChild);
      return () => window.removeEventListener('message', receiveFromChild);
    }
  }, [isInsideSimulator, applyUrlState]);

  // Actualizar URL dinámicamente cuando el usuario interactúa
  useEffect(() => {
    let currentModal = null;
    if (isProfileModalOpen) currentModal = 'perfil';
    else if (isFamilyChallengesOpen) currentModal = 'retos';
    else if (isSettingsOpen) currentModal = 'configuracion';
    else if (isDailyOpen) currentModal = 'reto_diario';
    else if (isCertificatesOpen) currentModal = 'certificados';
    else if (isPgnOpen) currentModal = 'pgn';
    else if (isP2POpen) currentModal = 'p2p';
    else if (isAvatarBuilderOpen) currentModal = 'avatar';

    syncUrl({
      view: activeTab,
      lessonId: activeTab === 'aprender' ? (activeLesson?.id || null) : null,
      botId: activeTab === 'jugar' ? (activeBotMatch?.id || null) : null,
      roomId: isP2POpen ? urlRoomId : null,
      modal: currentModal
    }, true);
  }, [
    activeTab,
    activeLesson,
    activeBotMatch,
    isProfileModalOpen,
    isFamilyChallengesOpen,
    isSettingsOpen,
    isDailyOpen,
    isCertificatesOpen,
    isPgnOpen,
    isP2POpen,
    isAvatarBuilderOpen,
    urlRoomId
  ]);

  const [targetPartyRoomId, setTargetPartyRoomId] = useState(null);
  const [playHubInitialTab, setPlayHubInitialTab] = useState('todos');

  const handleTabChange = (tabId) => {
    if (tabId === 'robots') {
      setPlayHubInitialTab('robots');
      setActiveTab('jugar');
      if (activeLesson) setActiveLesson(null);
      if (targetPartyRoomId) setTargetPartyRoomId(null);
      return;
    }
    if (tabId === 'jugar') {
      setPlayHubInitialTab('todos');
    }
    setActiveTab(tabId);
    if (tabId !== 'aprender') setActiveLesson(null);
    if (tabId !== 'jugar') setActiveBotMatch(null);
    if (tabId !== 'multijugador') setTargetPartyRoomId(null);
  };

  const handleOpenMultiplayer = (roomId = null) => {
    const safeRoomId = typeof roomId === 'string' && roomId.trim() 
      ? roomId.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '') 
      : null;
    setTargetPartyRoomId(safeRoomId && safeRoomId !== 'OBJECTOBJECT' ? safeRoomId : null);
    setActiveTab('multijugador');
  };

  const handleStartLesson = (lesson) => {
    setActiveLesson(lesson);
  };

  const handleStartBotMatch = (bot) => {
    setActiveBotMatch(bot);
    setPlayHubInitialTab('robots');
    setActiveTab('jugar');
  };

  const handleOpenBugReport = (context = {}) => {
    setBugReportContext({
      activeTab,
      activeLessonId: activeLesson?.id || null,
      activeBotId: activeBotMatch?.id || null,
      activeGroupId: activeGroup?.id || null,
      activeUserId: currentUser?.id || null,
      ...context
    });
    setIsBugReportOpen(true);
  };

  // RENDERIZADO 1: MODO SIMULADOR CON CHASIS FÍSICO REALISTA
  if (isSimulated) {
    return (
      <div className="device-sim-root">
        {!isBarMinimized ? (
          <DeviceSimulatorBar
            currentDevice={simulatedDevice}
            onSelectDevice={handleSelectDevice}
            orientation={orientation}
            onToggleOrientation={() => setOrientation((o) => (o === 'portrait' ? 'landscape' : 'portrait'))}
            scale={scaleMode}
            fitScale={fitScale}
            onCycleScale={handleCycleScale}
            onMinimize={() => setIsBarMinimized(true)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsBarMinimized(false)}
            className="device-sim-floating-pill"
            title="Restaurar barra del simulador"
          >
            <Sparkles size={14} color="#facc15" />
            <span>Simulador</span>
          </button>
        )}

        {/* Área de visualización con chasis centrado y escalador */}
        <div 
          className="device-sim-stage"
          style={{
            overflow: effectiveScale <= fitScale ? 'hidden' : 'auto',
            padding: effectiveScale <= fitScale ? '8px 12px' : '24px 16px'
          }}
        >
          <div 
            className="device-sim-viewport-scaler"
            style={{
              width: `${Math.round(chassisDims.width * effectiveScale)}px`,
              height: `${Math.round(chassisDims.height * effectiveScale)}px`
            }}
          >
            <div 
              className={`device-chassis ${
                simulatedDevice === 'galaxy_tab_s3'
                  ? `chassis-tabs3 ${orientation === 'landscape' ? 'chassis-tabs3-landscape' : 'chassis-tabs3-portrait'}`
                  : 'chassis-phone'
              }`}
              style={{
                transform: `scale(${effectiveScale})`,
                transformOrigin: 'center center',
                flexShrink: 0
              }}
            >
              {/* Bisel de Hardware: Samsung Galaxy Tab S3 (Cámara frontal, sensor y logo) */}
              {simulatedDevice === 'galaxy_tab_s3' && (
                <div className={`tabs3-bezel-header orientation-${orientation}`}>
                  <div className="tabs3-camera" title="Cámara Frontal 5 MP">
                    <div className="tabs3-camera-lens" />
                  </div>
                  <div className="tabs3-light-sensor" title="Sensor de Luz" />
                  <span className="tabs3-logo">SAMSUNG</span>
                </div>
              )}

              {/* Bisel de Hardware: Smartphone moderno (Barra de estado, Isla/Cámara, 5G y Batería) */}
              {simulatedDevice !== 'galaxy_tab_s3' && (
                <div className="phone-status-bar">
                  <span style={{ fontWeight: 800, color: '#e2e8f0' }}>9:41</span>
                  <div className="phone-island">
                    <div className="phone-camera-hole" />
                    <div className="phone-sensor-hole" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                    <span style={{ fontWeight: 800, color: '#e2e8f0' }}>5G</span>
                    <div className="phone-battery-icon">
                      <div className="phone-battery-fill" />
                    </div>
                  </div>
                </div>
              )}

              {/* iFrame con resolución física aislada al píxel */}
              <div 
                style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}
                className="device-screen-frame"
              >
                <iframe
                  ref={iframeRef}
                  src={getIframeSrc()}
                  title="Dispositivo Simulado - Ajedrez Junvill"
                  className="device-iframe"
                />
              </div>

              {/* Bisel Inferior: Botones físicos y capacitivos para Tablet Kiosco Samsung */}
              {simulatedDevice === 'galaxy_tab_s3' && (
                <div className={`tabs3-bezel-footer orientation-${orientation}`}>
                  <span 
                    className="tabs3-cap-btn" 
                    title="Multitarea"
                    onClick={() => {
                      if (iframeRef.current) {
                        try {
                          iframeRef.current.contentWindow?.postMessage({ type: 'SIM_MULTITASK' }, '*');
                        } catch (e) {}
                      }
                    }}
                  >
                    ≡
                  </span>
                  {/* Botón Home físico con sensor de huellas */}
                  <div 
                    className="tabs3-home-btn"
                    title="Botón Home Físico (Volver al inicio)"
                    onClick={() => {
                      if (iframeRef.current) {
                        iframeRef.current.src = `${window.location.pathname}?simulator_view=1`;
                      }
                    }}
                  />
                  <span 
                    className="tabs3-cap-btn" 
                    title="Atrás"
                    onClick={() => {
                      try {
                        iframeRef.current?.contentWindow?.history.back();
                      } catch (e) {}
                    }}
                  >
                    ↩
                  </span>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDERIZADO 2: VISTA REGULAR (En escritorio normal o en el interior del iframe)
  return (
    <ErrorBoundary componentName="Ajedrez Junvill">
      {/* Barra superior de simulación visible únicamente en PC local (nunca en Vercel ni producción remota) */}
      {isLocalEnvironment && !isInsideSimulator && !isBarMinimized && (
        <DeviceSimulatorBar
          currentDevice={simulatedDevice}
          onSelectDevice={handleSelectDevice}
          orientation={orientation}
          onToggleOrientation={() => setOrientation((o) => (o === 'portrait' ? 'landscape' : 'portrait'))}
          scale={scaleMode}
          fitScale={fitScale}
          onCycleScale={handleCycleScale}
          onMinimize={() => setIsBarMinimized(true)}
        />
      )}
      {isLocalEnvironment && !isInsideSimulator && isBarMinimized && (
        <button
          type="button"
          onClick={() => setIsBarMinimized(false)}
          className="device-sim-floating-pill"
          title="Restaurar barra del simulador"
        >
          <Sparkles size={14} color="#facc15" />
          <span>Simulador</span>
        </button>
      )}

      <div className="app-layout">
      {/* Cabecera Principal */}
      <Header
        activeTab={activeTab}
        isMultiplayerActive={activeTab === 'multijugador'}
        onOpenFamilyChat={() => handleOpenFamilyChat()}
        onTabChange={handleTabChange}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenGatekeeper={() => setIsGatekeeperOpen(true)}
        onOpenDaily={() => setIsDailyOpen(true)}
        onOpenCertificates={() => setIsCertificatesOpen(true)}
        onOpenPgn={() => setIsPgnOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBugReport={() => handleOpenBugReport()}
        onOpenManual={() => setIsManualOpen(true)}
        onOpenP2P={(customRoomId, mode) => handleOpenP2P(customRoomId, mode)}
        onOpenCuby3x3={() => setIsCuby3x3Open(true)}
        isLocalEnvironment={isLocalEnvironment && !isInsideSimulator}
        simulatedDevice={simulatedDevice}
        onToggleSimulator={handleToggleSimulator}
      />

      {/* 0. BANNER FLOTANTE GLOBAL DE RETO ENTRANTE */}
      {pendingInvitationsForMe && pendingInvitationsForMe.length > 0 && !isP2POpen && !isAppLocked && (
        <div style={{
          position: 'sticky',
          top: '56px',
          zIndex: 999,
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
          borderBottom: '2px solid #eab308',
          boxShadow: '0 6px 25px rgba(234, 179, 8, 0.45)',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          animation: 'pulseGlow 2s infinite ease-in-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.6rem' }}>⚔️</span>
            <div>
              <div style={{ fontWeight: '900', color: '#fef08a', fontSize: '0.96rem' }}>
                ¡{pendingInvitationsForMe[0].fromUser?.name || 'Un familiar'} te ha retado a una partida de Ajedrez!
              </div>
              <div style={{ fontSize: '0.78rem', color: '#e2e8f0', marginTop: '2px' }}>
                ⏱️ {pendingInvitationsForMe[0].timeControl === 0 ? 'Sin Tiempo' : `${Math.round((pendingInvitationsForMe[0].timeControl || 300) / 60)} min`} • Modalidad: <b style={{ color: '#38bdf8' }}>{getVariantById(pendingInvitationsForMe[0].gameVariant)?.name || pendingInvitationsForMe[0].gameVariant || 'Ajedrez Tradicional'}</b> • Sala: <b style={{ fontFamily: 'monospace', color: '#facc15' }}>{pendingInvitationsForMe[0].roomId}</b>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-gold"
              onClick={() => {
                const inv = acceptFamilyInvitation(pendingInvitationsForMe[0].id);
                if (inv) {
                  const isMulti = ['chaturaji', 'four_player', 'three_hex', 'three_circular'].includes(inv.gameVariant || inv.variantId);
                  if (isMulti) {
                    handleOpenMultiplayer(inv.roomId);
                  } else {
                    handleOpenP2P(inv.roomId, 'join');
                  }
                }
              }}
              style={{ padding: '8px 18px', fontSize: '0.88rem', fontWeight: '900', gap: '6px', background: '#eab308', color: '#000000', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              <span>Aceptar y Jugar Ahora ⚔️</span>
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => declineFamilyInvitation(pendingInvitationsForMe[0].id)}
              style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#fca5a5', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer' }}
            >
              Rechazar
            </button>
          </div>
        </div>
      )}

      {/* Contenedor de Vistas */}
      <main className={`main-content ${activeTab === 'multijugador' ? 'multiplayer-active' : ''}`}>
        {isAppLocked ? (
          <div style={{
            minHeight: '65vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            padding: '32px 20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '14px' }}>🔒</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: '#f8fafc', margin: '0 0 8px', fontSize: '1.5rem', fontWeight: 900 }}>
              Portal de Acceso Protegido
            </h2>
            <p style={{ maxWidth: '420px', fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
              Esta instancia de <b>Ajedrez Junvill</b> está protegida. Por favor desbloquea el grupo familiar y autentica tu perfil para ingresar.
            </p>
          </div>
        ) : (
          <>
        {activeTab === 'inicio' && (
          <HomeView
            onNavigate={handleTabChange}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenDailyChallenge={() => setIsDailyOpen(true)}
            onOpenFamilyChallenges={() => setIsFamilyChallengesOpen(true)}
            onOpenCertificates={() => setIsCertificatesOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenManual={() => setIsManualOpen(true)}
            onOpenAvatarBuilder={() => setIsAvatarBuilderOpen(true)}
            onOpenBugReport={handleOpenBugReport}
            onOpenP2P={(customRoomId, mode) => handleOpenP2P(customRoomId, mode)}
            onOpenCuby3x3={() => setIsCuby3x3Open(true)}
            onStartLesson={handleStartLesson}
            onStartBotGame={handleStartBotMatch}
            onOpenMultiplayer={handleOpenMultiplayer}
          />
        )}

        {activeTab === 'aprender' && (
          <LessonsView
            onStartLesson={handleStartLesson}
            onOpenBugReport={handleOpenBugReport}
          />
        )}

        {activeTab === 'problemas' && (
          <PuzzlesView
            onOpenBugReport={handleOpenBugReport}
            onOpenCuby3x3={() => setIsCuby3x3Open(true)}
          />
        )}

        {activeTab === 'robots' && (
          <RobotsView
            onStartBotMatch={handleStartBotMatch}
            onStartBotGame={handleStartBotMatch}
            onOpenBugReport={handleOpenBugReport}
          />
        )}

        {activeTab === 'jugar' && (
          <PlayView
            initialBotMatch={activeBotMatch}
            initialHubTab={playHubInitialTab}
            onExitMatch={() => setActiveBotMatch(null)}
            onOpenP2P={(customRoomId, mode) => handleOpenP2P(customRoomId, mode)}
            onOpenRobots={() => {
              setPlayHubInitialTab('robots');
              setActiveTab('jugar');
            }}
            onExitToMenu={() => handleTabChange('inicio')}
            onOpenBugReport={handleOpenBugReport}
            onOpenFamilyChat={(user) => handleOpenFamilyChat(user)}
            onOpenCuby3x3={() => setIsCuby3x3Open(true)}
            onOpenMultiplayer={handleOpenMultiplayer}
          />
        )}

        {activeTab === 'torneos' && (
          <TournamentsView
            onOpenBugReport={handleOpenBugReport}
          />
        )}

        {activeTab === 'yo' && (
          <AvatarStudioView
            onOpenAvatarBuilder={() => setIsAvatarBuilderOpen(true)}
          />
        )}

        {activeTab === 'multijugador' && (
          <MultiplayerPartyView
            initialRoomId={targetPartyRoomId}
            onBackToMenu={() => handleTabChange('inicio')}
            onTabChange={handleTabChange}
          />
        )}
          </>
        )}
      </main>

      {/* Botón Flotante Permanente de Reporte de Errores */}
      <BugReportFloatingButton onClick={() => handleOpenBugReport()} />

      {/* Navegación Inferior Móvil (adaptada automáticamente por CSS en móvil) */}
      {!isAppLocked && (
        <Navbar
          activeTab={
            activeTab === 'multijugador'
              ? 'jugar'
              : (activeTab === 'jugar' && playHubInitialTab === 'robots' ? 'robots' : activeTab)
          }
          onTabChange={handleTabChange}
          isMultiplayerActive={activeTab === 'multijugador'}
        />
      )}

      {/* Modal de Reproducción de Lección */}
      {activeLesson && (
        <LessonPlayerModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onOpenBugReport={handleOpenBugReport}
        />
      )}

      {/* Modal de Reporte de Errores y Diagnóstico */}
      <BugReportModal
        isOpen={isBugReportOpen}
        onClose={() => setIsBugReportOpen(false)}
        contextData={bugReportContext}
      />

      {/* Portal de Acceso Protegido y Grupos Familiares (Gatekeeper) */}
      <FamilyGatekeeperModal
        isOpen={isGatekeeperOpen || isAppLocked}
        onClose={() => {
          if (!isAppLocked) setIsGatekeeperOpen(false);
        }}
        onOpenAvatarBuilder={() => {
          if (!isAppLocked) {
            setIsGatekeeperOpen(false);
            setIsAvatarBuilderOpen(true);
          }
        }}
        onOpenP2P={(customRoomId) => {
          if (!isAppLocked) {
            setUrlRoomId(customRoomId || null);
            setIsGatekeeperOpen(false);
            setIsP2POpen(true);
          }
        }}
      />

      {/* Modales Globales */}
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onOpenAvatarBuilder={() => setIsAvatarBuilderOpen(true)}
          onOpenGatekeeper={() => {
            setIsProfileModalOpen(false);
            setIsGatekeeperOpen(true);
          }}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onOpenAvatarBuilder={() => setIsAvatarBuilderOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenBugReport={() => handleOpenBugReport()}
          onOpenP2P={() => {
            setIsSettingsOpen(false);
            setIsP2POpen(true);
          }}
        />
      )}

      {isAvatarBuilderOpen && (
        <AvatarBuilderModal
          isOpen={isAvatarBuilderOpen}
          onClose={() => setIsAvatarBuilderOpen(false)}
        />
      )}

      {isP2POpen && (
        <P2PPlayModal
          isOpen={isP2POpen}
          onClose={() => {
            setIsP2POpen(false);
            setUrlRoomId(null);
            setP2pInitialMode('join');
          }}
          initialRoomId={urlRoomId}
          initialMode={p2pInitialMode}
        />
      )}

      {/* Drawer de Chat Familiar en Tiempo Real */}
      <FamilyChatDrawer
        isOpen={isFamilyChatOpen}
        onClose={() => {
          setIsFamilyChatOpen(false);
          setChatTargetUser(null);
        }}
        targetUser={chatTargetUser}
        onOpenChallenge={(target) => {
          setIsFamilyChatOpen(false);
          if (target) {
            handleOpenP2P(null, 'host');
          }
        }}
      />

      {isFamilyChallengesOpen && (
        <FamilyChallengesModal
          isOpen={isFamilyChallengesOpen}
          onClose={() => setIsFamilyChallengesOpen(false)}
        />
      )}

      {isDailyOpen && (
        <DailyChallengeModal
          isOpen={isDailyOpen}
          onClose={() => setIsDailyOpen(false)}
        />
      )}

      {isCertificatesOpen && (
        <CertificatesModal
          isOpen={isCertificatesOpen}
          onClose={() => setIsCertificatesOpen(false)}
        />
      )}

      {isPgnOpen && (
        <PgnToolModal
          isOpen={isPgnOpen}
          onClose={() => setIsPgnOpen(false)}
        />
      )}

      {/* Modal de Manual de Ayuda y Guía del Usuario */}
      <ManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        initialSection={activeTab}
      />

      {/* Modal del Minijuego Ajedrez 3x3: Desafío de 5 Piezas (Puzle Cuby) */}
      {isCuby3x3Open && (
        <ChessCuby3x3Modal
          isOpen={isCuby3x3Open}
          onClose={() => setIsCuby3x3Open(false)}
        />
      )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
