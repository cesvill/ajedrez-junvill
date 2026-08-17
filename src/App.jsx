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
import { BugReportModal } from './components/BugReport/BugReportModal';
import { BugReportFloatingButton } from './components/BugReport/BugReportFloatingButton';
import { WelcomeProfileModal } from './components/ProfileModal/WelcomeProfileModal';
import { ManualModal } from './components/Manual/ManualModal';
import { parseUrlState, syncUrl } from './engine/urlRouter';
import { getLessonById } from './curriculum/lessonsData';
import { getBotById } from './assets/botRoster';

export const App = () => {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState('inicio'); // 'inicio' | 'aprender' | 'problemas' | 'robots' | 'jugar' | 'torneos' | 'yo'
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeBotMatch, setActiveBotMatch] = useState(null);

  // Modal de Primer Acceso / Escaneo QR
  const [isWelcomeProfileOpen, setIsWelcomeProfileOpen] = useState(() => {
    try {
      const hasChosen = localStorage.getItem('ajedrez_junvill_has_selected_profile');
      return !hasChosen;
    } catch (e) {
      return false;
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
  const [bugReportContext, setBugReportContext] = useState({});
  const [urlRoomId, setUrlRoomId] = useState('');

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
      if (modal === 'configuracion' || modal === 'servidor') setIsSettingsOpen(true);
      if (modal === 'reto_diario') setIsDailyOpen(true);
      if (modal === 'retos' || modal === 'familia') setIsFamilyChallengesOpen(true);
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
    return () => window.removeEventListener('popstate', applyUrlState);
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

  const handleTabChange = (newTab) => {
    if (newTab !== 'jugar') {
      setActiveBotMatch(null);
    }
    if (newTab !== 'aprender') {
      setActiveLesson(null);
    }
    setActiveTab(newTab);
  };

  const handleOpenBugReport = (customContext = {}) => {
    setBugReportContext({
      view: activeTab,
      lesson: activeLesson,
      botMatch: activeBotMatch,
      ...customContext
    });
    setIsBugReportOpen(true);
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', currentUser?.theme || 'modern_dark');
  }, [currentUser?.theme]);

  const handleStartBotGame = (bot) => {
    setActiveBotMatch(bot);
    setActiveTab('jugar');
  };

  const isPlayingActiveGame = activeTab === 'jugar';

  return (
    <div id="app-root" data-theme={currentUser?.theme || 'modern_dark'}>
      {/* Barra superior Header siempre visible */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDaily={() => setIsDailyOpen(true)}
        onOpenCertificates={() => setIsCertificatesOpen(true)}
        onOpenPgn={() => setIsPgnOpen(true)}
        onOpenBugReport={() => handleOpenBugReport()}
        onOpenManual={() => setIsManualOpen(true)}
      />

      <main className="main-content">
        {activeTab === 'inicio' && (
          <HomeView
            onNavigate={(targetTab) => setActiveTab(targetTab)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenDaily={() => setIsDailyOpen(true)}
            onOpenCertificates={() => setIsCertificatesOpen(true)}
            onOpenP2P={() => setIsP2POpen(true)}
            onOpenFamilyChallenges={() => setIsFamilyChallengesOpen(true)}
            onStartLesson={(lesson) => {
              setActiveLesson(lesson);
              setActiveTab('aprender');
            }}
            onStartBotGame={(bot) => handleStartBotGame(bot)}
          />
        )}

        {activeTab === 'jugar' && (
          <PlayView
            key={`play_view_${currentUser?.id || 'default'}`}
            activeBot={activeBotMatch}
            onOpenP2P={() => setIsP2POpen(true)}
            onOpenRobots={() => setActiveTab('robots')}
            onOpenBugReport={handleOpenBugReport}
            onExitToMenu={(targetTab = 'inicio') => {
              setActiveBotMatch(null);
              setActiveTab(targetTab);
            }}
          />
        )}

        {activeTab === 'robots' && (
          <RobotsView
            onStartBotGame={handleStartBotGame}
          />
        )}

        {activeTab === 'problemas' && (
          <PuzzlesView />
        )}

        {activeTab === 'aprender' && (
          <LessonsView
            onSelectLesson={(lesson) => setActiveLesson(lesson)}
          />
        )}

        {activeTab === 'torneos' && (
          <TournamentsView />
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

      {/* Modal de Bienvenida y Selección de Perfil para Primer Acceso o Escaneo QR */}
      <WelcomeProfileModal
        isOpen={isWelcomeProfileOpen}
        onClose={() => setIsWelcomeProfileOpen(false)}
        onOpenAvatarBuilder={() => {
          setIsWelcomeProfileOpen(false);
          setIsAvatarBuilderOpen(true);
        }}
        roomToJoin={urlRoomId}
      />

      {/* Modales Globales */}
      {isProfileModalOpen && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onOpenAvatarBuilder={() => setIsAvatarBuilderOpen(true)}
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
          onClose={() => setIsP2POpen(false)}
          initialRoomId={urlRoomId}
        />
      )}

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
  );
};

export default App;
