import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from './context/UserContext';
import { Header } from './components/Navigation/Header';
import { Navbar } from './components/Navigation/Navbar';
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
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { parseUrlState, syncUrl } from './engine/urlRouter';
import { getLessonById } from './curriculum/lessonsData';
import { getBotById } from './assets/botRoster';

export const App = () => {
  const { currentUser, activeGroup, isGroupUnlocked, pendingInvitationsForMe, acceptFamilyInvitation, declineFamilyInvitation } = useUser();
  const [activeTab, setActiveTab] = useState(() => parseUrlState()?.view || 'inicio'); // 'inicio' | 'aprender' | 'problemas' | 'robots' | 'jugar' | 'torneos' | 'yo'
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
  const [isFamilyChatOpen, setIsFamilyChatOpen] = useState(false);
  const [chatTargetUser, setChatTargetUser] = useState(null);
  const [bugReportContext, setBugReportContext] = useState({});
  const [urlRoomId, setUrlRoomId] = useState('');
  const [p2pInitialMode, setP2pInitialMode] = useState('join');

  const handleOpenP2P = (customRoomId = null, mode = 'join') => {
    setUrlRoomId(customRoomId || null);
    setP2pInitialMode(mode || 'join');
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

    if (['inicio', 'aprender', 'jugar', 'robots', 'problemas', 'torneos', 'yo'].includes(view)) {
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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== 'aprender') setActiveLesson(null);
    if (tabId !== 'jugar') setActiveBotMatch(null);
  };

  const handleStartLesson = (lesson) => {
    setActiveLesson(lesson);
  };

  const handleStartBotMatch = (bot) => {
    setActiveBotMatch(bot);
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

  return (
    <ErrorBoundary componentName="Ajedrez Junvill">
      <div className="app-layout">
      {/* Cabecera Principal */}
      <Header
        activeTab={activeTab}
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
      />

      {/* 0. BANNER FLOTANTE GLOBAL DE RETO ENTRANTE */}
      {pendingInvitationsForMe && pendingInvitationsForMe.length > 0 && !isP2POpen && (
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
                ⏱️ {Math.round((pendingInvitationsForMe[0].timeControl || 300) / 60)} min • Modalidad: <b style={{ color: '#38bdf8' }}>{pendingInvitationsForMe[0].gameVariant || 'Ajedrez Tradicional'}</b> • Sala: <b style={{ fontFamily: 'monospace', color: '#facc15' }}>{pendingInvitationsForMe[0].roomId}</b>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-gold"
              onClick={() => {
                const inv = acceptFamilyInvitation(pendingInvitationsForMe[0].id);
                if (inv) handleOpenP2P(inv.roomId, 'join');
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
      <main className="main-content">
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
            onStartLesson={handleStartLesson}
            onStartBotGame={handleStartBotMatch}
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
            onExitMatch={() => setActiveBotMatch(null)}
            onOpenP2P={(customRoomId, mode) => handleOpenP2P(customRoomId, mode)}
            onOpenRobots={() => handleTabChange('robots')}
            onExitToMenu={() => handleTabChange('inicio')}
            onOpenBugReport={handleOpenBugReport}
            onOpenFamilyChat={(user) => handleOpenFamilyChat(user)}
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
      </main>

      {/* Botón Flotante Permanente de Reporte de Errores */}
      <BugReportFloatingButton onClick={() => handleOpenBugReport()} />

      {/* Navegación Inferior Móvil (adaptada automáticamente por CSS en móvil) */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

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
        isOpen={isGatekeeperOpen || (!activeGroup && !currentUser)}
        onClose={() => setIsGatekeeperOpen(false)}
        onOpenAvatarBuilder={() => {
          setIsGatekeeperOpen(false);
          setIsAvatarBuilderOpen(true);
        }}
        onOpenP2P={(customRoomId) => {
          setUrlRoomId(customRoomId || null);
          setIsGatekeeperOpen(false);
          setIsP2POpen(true);
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
      </div>
    </ErrorBoundary>
  );
};

export default App;
