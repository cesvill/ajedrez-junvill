import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const UserContext = createContext();

export const DEFAULT_GENERIC_PASSWORD = 'JunV1ll123';

const STORAGE_KEY = 'ajedrez_junvill_users_v4';
const ACTIVE_USER_KEY = 'ajedrez_junvill_active_user_id_v4';

const DEFAULT_USERS = [
  {
    id: 'user_1',
    name: 'Estudiante Junvill',
    password: DEFAULT_GENERIC_PASSWORD,
    role: 'student', // 'student' | 'coach' | 'parent'
    avatar: 'custom_dynamic',
    avatarConfig: {
      skin: '#fed7aa',
      hairStyle: 'messy',
      hairColor: '#451a03',
      eyeStyle: 'happy',
      shirtStyle: 'hoodie',
      shirtColor: '#2563eb',
      accessory: 'headphones',
      background: 'blue_sky'
    },
    title: 'Aprendiz Promesa',
    elo: 650,
    puzzleRating: 600,
    stars: 80,
    gems: 25,
    totalPoints: 20,
    theme: 'modern_dark', // 'modern_dark' | 'kids_vibrant' | 'classic_parchment'
    boardTheme: 'board_emerald',
    pieceTheme: 'staunton',
    systemSettings: {
      soundEnabled: true,
      soundVolume: 85,
      autoQueen: true,
      showCoordinates: true,
      highlightMoves: true,
      highlightLastMove: true,
      moveMethod: 'drag_click' // 'drag_click' | 'click_only'
    },
    unlockedItems: ['board_emerald', 'board_wood', 'shirt_blue', 'shirt_red'],
    lessonProgress: {
      'l01_piezas': { stars: 5, completed: true },
      'l02_capturas': { stars: 5, completed: true },
      'l03_desprotegidas': { stars: 5, completed: true },
      'l04_valor_piezas': { stars: 5, completed: true }
    },
    botVictories: {
      'qwerty': 3,
      'cosmo': 1,
      'monkey': 2
    },
    stats: {
      gamesPlayed: 8,
      wins: 5,
      losses: 2,
      draws: 1,
      puzzlesSolved: 32,
      hintsUsed: 12,
      accuracyAvg: 86
    },
    radarSkills: {
      tactica: 50,
      estrategia: 40,
      posicional: 35,
      calculo: 45,
      aperturas: 40,
      finales: 30
    },
    coachSettings: {
      assistanceLevel: 'full', // 'full' | 'moderate' | 'minimal' | 'off'
      botDifficulty: 1,
      coachAvatar: 'coach_aurelio',
      soundEnabled: true
    }
  }
];

export const UserProvider = ({ children }) => {
  const isServerLoadedRef = useRef(false);

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(u => {
          if (!u.role) u.role = 'student';
          if (!u.password) u.password = DEFAULT_GENERIC_PASSWORD;
          if (!u.systemSettings) {
            u.systemSettings = {
              soundEnabled: true,
              soundVolume: 80,
              autoQueen: true,
              showCoordinates: true,
              highlightMoves: true,
              highlightLastMove: true,
              moveMethod: 'drag_click'
            };
          }
          return u;
        });
      }
      return DEFAULT_USERS;
    } catch (e) {
      console.error("Error loading users", e);
      return DEFAULT_USERS;
    }
  });

  const [activeUserId, setActiveUserId] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_USER_KEY);
      return saved || 'user_1';
    } catch (e) {
      return 'user_1';
    }
  });

  const [isDbSynced, setIsDbSynced] = useState(false);

  // Función para consultar usuarios del servidor sin sobreescribir
  const fetchUsersFromServer = () => {
    fetch('/api/db/users')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.users) && data.users.length > 0) {
          setUsers(prev => {
            const userMap = new Map();
            // Primero agregar usuarios del servidor
            data.users.forEach(u => userMap.set(u.id, u));
            // Preservar cualquier usuario local que no esté aún en el servidor
            prev.forEach(u => {
              if (!userMap.has(u.id)) {
                userMap.set(u.id, u);
              }
            });
            const merged = Array.from(userMap.values());
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
          setIsDbSynced(true);
        }
      })
      .catch(err => {
        console.log("Modo almacenamiento local activo (offline/sin backend):", err);
      })
      .finally(() => {
        isServerLoadedRef.current = true;
      });
  };

  // Sincronizar desde la base de datos JSON del servidor al iniciar
  useEffect(() => {
    fetchUsersFromServer();

    // Sincronización periódica cada 12 segundos para detectar nuevos jugadores creados en otros dispositivos
    const interval = setInterval(fetchUsersFromServer, 12000);
    const handleFocus = () => fetchUsersFromServer();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const syncToServer = (usersList) => {
    if (!isServerLoadedRef.current) return; // Evitar sobreescribir antes de leer la BD del servidor
    try {
      fetch('/api/db/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usersList)
      })
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.success) {
          setIsDbSynced(true);
        }
      })
      .catch(() => setIsDbSynced(false));
    } catch (e) {
      // Ignorar si no hay servidor
    }
  };

  useEffect(() => {
    if (!isServerLoadedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      syncToServer(users);
    } catch (e) {
      console.error("Error saving users", e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_USER_KEY, activeUserId);
    } catch (e) {
      console.error("Error saving active user", e);
    }
  }, [activeUserId]);

  const currentUser = users.find(u => u.id === activeUserId) || users[0] || DEFAULT_USERS[0];

  const createUser = (name, avatar = 'custom_dynamic', role = 'student', customConfig = null, password = DEFAULT_GENERIC_PASSWORD) => {
    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim() || 'Nuevo Jugador',
      password: (password || DEFAULT_GENERIC_PASSWORD).trim() || DEFAULT_GENERIC_PASSWORD,
      role,
      avatar,
      avatarConfig: customConfig || {
        skin: '#fed7aa',
        hairStyle: 'short',
        hairColor: '#27170a',
        eyeStyle: 'happy',
        shirtStyle: 'tshirt',
        shirtColor: '#3b82f6',
        accessory: 'none',
        background: 'blue_sky'
      },
      title: role === 'coach' ? 'Entrenador Titular' : role === 'parent' ? 'Tutor Familiar' : 'Novato Promesa',
      elo: role === 'coach' ? 1600 : 400,
      puzzleRating: role === 'coach' ? 1600 : 400,
      stars: 30,
      gems: 10,
      totalPoints: 0,
      theme: 'modern_dark',
      boardTheme: 'board_emerald',
      pieceTheme: 'staunton',
      systemSettings: {
        soundEnabled: true,
        soundVolume: 80,
        autoQueen: true,
        showCoordinates: true,
        highlightMoves: true,
        highlightLastMove: true,
        moveMethod: 'drag_click'
      },
      unlockedItems: ['board_emerald', 'board_wood', 'shirt_blue'],
      lessonProgress: {},
      botVictories: {},
      stats: {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        puzzlesSolved: 0,
        hintsUsed: 0,
        accuracyAvg: 0
      },
      radarSkills: {
        tactica: role === 'coach' ? 60 : 15,
        estrategia: role === 'coach' ? 60 : 15,
        posicional: role === 'coach' ? 60 : 15,
        calculo: role === 'coach' ? 60 : 15,
        aperturas: role === 'coach' ? 60 : 15,
        finales: role === 'coach' ? 60 : 15
      },
      coachSettings: {
        assistanceLevel: 'full',
        botDifficulty: 1,
        coachAvatar: 'coach_aurelio',
        soundEnabled: true
      }
    };

    setUsers(prev => [...prev, newUser]);
    setActiveUserId(newUser.id);
    try {
      fetch('/api/db/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upsert', user: newUser })
      }).catch(() => {});
    } catch (e) {}
    return newUser;
  };

  const verifyPassword = (userId, enteredPassword) => {
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    const expected = user.password || DEFAULT_GENERIC_PASSWORD;
    return (enteredPassword || '').trim() === expected.trim();
  };

  const changeUserPassword = (userId, newPassword) => {
    const trimmed = (newPassword || '').trim() || DEFAULT_GENERIC_PASSWORD;
    editUser(userId, { password: trimmed });
    return true;
  };

  const updateCurrentUser = (updates) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, ...updates };
      }
      return u;
    }));
  };

  const editUser = (userId, updates) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, ...updates };
      }
      return u;
    }));
  };

  // Resetear el avance de un usuario específico a su estado inicial
  const resetUserProgress = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const baseElo = u.role === 'coach' ? 1600 : 400;
        return {
          ...u,
          elo: baseElo,
          puzzleRating: baseElo,
          stars: 30,
          gems: 10,
          totalPoints: 0,
          lessonProgress: {},
          botVictories: {},
          stats: {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            puzzlesSolved: 0,
            hintsUsed: 0,
            accuracyAvg: 0
          },
          radarSkills: {
            tactica: u.role === 'coach' ? 60 : 15,
            estrategia: u.role === 'coach' ? 60 : 15,
            posicional: u.role === 'coach' ? 60 : 15,
            calculo: u.role === 'coach' ? 60 : 15,
            aperturas: u.role === 'coach' ? 60 : 15,
            finales: u.role === 'coach' ? 60 : 15
          }
        };
      }
      return u;
    }));
  };

  const deleteUser = (userId) => {
    if (users.length <= 1) {
      alert('Debe existir al menos un perfil de usuario en la plataforma.');
      return false;
    }
    const filtered = users.filter(u => u.id !== userId);
    setUsers(filtered);
    if (activeUserId === userId) {
      setActiveUserId(filtered[0].id);
    }
    try {
      fetch('/api/db/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', userId })
      }).catch(() => {});
    } catch (e) {}
    return true;
  };

  const addRewards = (starsAmount = 0, gemsAmount = 0) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== currentUser.id) return u;
      return {
        ...u,
        stars: (u.stars || 0) + starsAmount,
        gems: (u.gems || 0) + gemsAmount
      };
    }));
  };

  const recordLessonScore = (lessonId, starsEarned, category = 'tactica') => {
    setUsers(prev => prev.map(u => {
      if (u.id !== currentUser.id) return u;

      const currentProgress = u.lessonProgress[lessonId] || { stars: 0, completed: false };
      const newStars = Math.max(currentProgress.stars, starsEarned);
      const pointsDiff = newStars - currentProgress.stars;
      const isCompleted = newStars >= 5;

      const updatedProgress = {
        ...u.lessonProgress,
        [lessonId]: { stars: newStars, completed: isCompleted }
      };

      let totalPts = 0;
      Object.values(updatedProgress).forEach(p => {
        totalPts += (p.stars || 0);
      });

      const newRadar = { ...u.radarSkills };
      if (category && newRadar[category] !== undefined) {
        newRadar[category] = Math.min(100, newRadar[category] + (pointsDiff * 2));
      }

      return {
        ...u,
        totalPoints: totalPts,
        elo: u.elo + (pointsDiff * 6),
        stars: u.stars + (pointsDiff * 5),
        gems: u.gems + (isCompleted ? 2 : 0),
        lessonProgress: updatedProgress,
        radarSkills: newRadar
      };
    }));
  };

  const recordPuzzleSuccess = (puzzleElo = 10) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== currentUser.id) return u;
      const stats = { ...u.stats };
      stats.puzzlesSolved += 1;
      const newRadar = { ...u.radarSkills };
      newRadar.tactica = Math.min(100, (newRadar.tactica || 20) + 1);
      newRadar.calculo = Math.min(100, (newRadar.calculo || 20) + 1);

      return {
        ...u,
        puzzleRating: (u.puzzleRating || 400) + puzzleElo,
        stars: u.stars + 3,
        gems: u.gems + 1,
        stats,
        radarSkills: newRadar
      };
    }));
  };

  const recordBotWin = (botId, eloGain = 15) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== currentUser.id) return u;
      const botVics = { ...u.botVictories };
      botVics[botId] = (botVics[botId] || 0) + 1;
      const stats = { ...u.stats };
      stats.gamesPlayed += 1;
      stats.wins += 1;

      return {
        ...u,
        botVictories: botVics,
        elo: u.elo + eloGain,
        stars: u.stars + 15,
        gems: u.gems + 3,
        stats
      };
    }));
  };

  const recordGameResult = (result, eloChange = 0, accuracy = 80) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== currentUser.id) return u;
      const stats = { ...u.stats };
      stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
      if (result === 'win') stats.wins = (stats.wins || 0) + 1;
      else if (result === 'loss') stats.losses = (stats.losses || 0) + 1;
      else if (result === 'draw') stats.draws = (stats.draws || 0) + 1;

      return {
        ...u,
        elo: Math.max(100, (u.elo || 400) + eloChange),
        stats
      };
    }));
  };

  const unlockItem = (itemId, costStars = 0, costGems = 0) => {
    if (currentUser.stars < costStars || currentUser.gems < costGems) return false;

    setUsers(prev => prev.map(u => {
      if (u.id !== currentUser.id) return u;
      return {
        ...u,
        stars: u.stars - costStars,
        gems: u.gems - costGems,
        unlockedItems: [...(u.unlockedItems || []), itemId]
      };
    }));
    return true;
  };

  // --- GESTIÓN DE RETOS FAMILIARES (PAPÁ & MAMÁ) ---
  const addCustomChallenge = (targetUserId, challengeData) => {
    const newChallenge = {
      id: `ch_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      period: challengeData.period || 'daily', // 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
      title: challengeData.title || 'Reto Especial Familiar',
      description: challengeData.description || '',
      category: challengeData.category || 'custom', // 'lessons' | 'daily_challenge' | 'puzzles' | 'elo' | 'bots' | 'games' | 'custom'
      target: Number(challengeData.target) || 1,
      rewardType: challengeData.rewardType || 'surprise', // 'surprise' | 'in_game' | 'real_world'
      rewardTitle: challengeData.rewardTitle || 'Premio Sorpresa',
      secretReward: challengeData.secretReward || '¡Un premio sorpresa de la familia!',
      inGameReward: challengeData.inGameReward || { stars: 25, gems: 5 },
      assignedBy: challengeData.assignedBy || 'Papá',
      completed: false,
      claimed: false,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => prev.map(u => {
      if (u.id !== targetUserId) return u;
      const currentChallenges = u.customChallenges || [];
      return {
        ...u,
        customChallenges: [...currentChallenges, newChallenge]
      };
    }));

    return newChallenge;
  };

  const editCustomChallenge = (targetUserId, challengeId, updates) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== targetUserId) return u;
      const updatedList = (u.customChallenges || []).map(ch => {
        if (ch.id === challengeId) {
          return { ...ch, ...updates };
        }
        return ch;
      });
      return {
        ...u,
        customChallenges: updatedList
      };
    }));
  };

  const deleteCustomChallenge = (targetUserId, challengeId) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== targetUserId) return u;
      return {
        ...u,
        customChallenges: (u.customChallenges || []).filter(ch => ch.id !== challengeId)
      };
    }));
  };

  const toggleManualChallenge = (targetUserId, challengeId, isCompleted) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== targetUserId) return u;
      const updatedList = (u.customChallenges || []).map(ch => {
        if (ch.id === challengeId) {
          return { ...ch, completed: isCompleted, completedAt: isCompleted ? new Date().toISOString() : null };
        }
        return ch;
      });
      return {
        ...u,
        customChallenges: updatedList
      };
    }));
  };

  const claimChallengeReward = (targetUserId, challengeId) => {
    let claimedChallenge = null;
    setUsers(prev => prev.map(u => {
      if (u.id !== targetUserId) return u;
      let starsToAdd = 0;
      let gemsToAdd = 0;

      const updatedList = (u.customChallenges || []).map(ch => {
        if (ch.id === challengeId && !ch.claimed) {
          claimedChallenge = ch;
          if (ch.rewardType === 'in_game' && ch.inGameReward) {
            starsToAdd = ch.inGameReward.stars || 0;
            gemsToAdd = ch.inGameReward.gems || 0;
          }
          return {
            ...ch,
            completed: true,
            claimed: true,
            claimedAt: new Date().toISOString()
          };
        }
        return ch;
      });

      return {
        ...u,
        stars: (u.stars || 0) + starsToAdd,
        gems: (u.gems || 0) + gemsToAdd,
        customChallenges: updatedList
      };
    }));

    return claimedChallenge;
  };

  // Exportar e Importar datos de progreso
  const exportSaveData = () => {
    return JSON.stringify({ users, activeUserId, exportedAt: new Date().toISOString() }, null, 2);
  };

  const importSaveData = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.users && Array.isArray(parsed.users)) {
        setUsers(parsed.users);
        if (parsed.activeUserId) setActiveUserId(parsed.activeUserId);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error importing data", e);
      return false;
    }
  };

  const resetUserData = () => {
    setUsers(DEFAULT_USERS);
    setActiveUserId(DEFAULT_USERS[0].id);
  };

  return (
    <UserContext.Provider value={{
      users,
      currentUser,
      activeUserId,
      setActiveUserId,
      createUser,
      editUser,
      updateCurrentUser,
      deleteUser,
      resetUserProgress,
      verifyPassword,
      changeUserPassword,
      DEFAULT_GENERIC_PASSWORD,
      isDbSynced,
      addRewards,
      recordLessonScore,
      recordPuzzleSuccess,
      recordBotWin,
      recordGameResult,
      unlockItem,
      exportSaveData,
      importSaveData,
      resetUserData,
      addCustomChallenge,
      editCustomChallenge,
      deleteCustomChallenge,
      toggleManualChallenge,
      claimChallengeReward
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe utilizarse dentro de un UserProvider');
  }
  return context;
};
