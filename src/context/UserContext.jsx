import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const UserContext = createContext();

export const DEFAULT_GENERIC_PASSWORD = 'JunV1ll123';
export const MAX_FAMILY_GROUPS = 5;
export const MAX_PLAYERS_PER_GROUP = 10;
export const MAX_CONCURRENT_USERS = 25;

const GROUPS_STORAGE_KEY = 'ajedrez_junvill_groups_v5';
const ACTIVE_GROUP_KEY = 'ajedrez_junvill_active_group_id_v5';
const UNLOCKED_GROUPS_KEY = 'ajedrez_junvill_unlocked_groups_v5';
const ACTIVE_USER_KEY = 'ajedrez_junvill_active_user_id_v5';

// Usuarios iniciales para el grupo oficial Junvill
const DEFAULT_JUNVILL_USERS = [
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
    elo: 680,
    puzzleRating: 600,
    stars: 105,
    gems: 27,
    totalPoints: 25,
    theme: 'modern_dark',
    boardTheme: 'board_emerald',
    pieceTheme: 'staunton',
    systemSettings: {
      soundEnabled: true,
      soundVolume: 85,
      autoQueen: true,
      showCoordinates: true,
      highlightMoves: true,
      highlightLastMove: true,
      moveMethod: 'drag_click'
    },
    unlockedItems: ['board_emerald', 'board_wood', 'shirt_blue', 'shirt_red'],
    lessonProgress: {
      'l01_piezas': { stars: 5, completed: true },
      'l02_capturas': { stars: 5, completed: true },
      'l03_desprotegidas': { stars: 5, completed: true },
      'l04_valor_piezas': { stars: 5, completed: true },
      'l07_escapar_jaque': { stars: 5, completed: true }
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
      tactica: 60,
      estrategia: 40,
      posicional: 35,
      calculo: 45,
      aperturas: 40,
      finales: 30
    },
    coachSettings: {
      assistanceLevel: 'full',
      botDifficulty: 1,
      coachAvatar: 'coach_aurelio',
      soundEnabled: true
    }
  }
];

const DEFAULT_FAMILY_GROUPS = [
  {
    id: 'group_junvill',
    name: 'Familia Junvill',
    password: DEFAULT_GENERIC_PASSWORD,
    adminName: 'César Villamil',
    emblem: '👑',
    themeColor: '#ca8a04',
    isDefault: true,
    isProtected: true,
    createdAt: '2026-08-18',
    users: DEFAULT_JUNVILL_USERS
  }
];

export const UserProvider = ({ children }) => {
  const isServerLoadedRef = useRef(false);

  // 1. ESTADO DE GRUPOS FAMILIARES
  const [groups, setGroups] = useState(() => {
    try {
      const savedGroups = localStorage.getItem(GROUPS_STORAGE_KEY);
      if (savedGroups) {
        const parsed = JSON.parse(savedGroups);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(g => {
            if (!g.password) g.password = DEFAULT_GENERIC_PASSWORD;
            if (!Array.isArray(g.users)) g.users = [];
            return g;
          });
        }
      }

      // Migración desde v4 si existe
      const legacyUsers = localStorage.getItem('ajedrez_junvill_users_v4');
      if (legacyUsers) {
        try {
          const parsedLegacy = JSON.parse(legacyUsers);
          if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
            return [
              {
                id: 'group_junvill',
                name: 'Familia Junvill',
                password: DEFAULT_GENERIC_PASSWORD,
                adminName: 'César Villamil',
                emblem: '👑',
                themeColor: '#ca8a04',
                isDefault: true,
                isProtected: true,
                createdAt: '2026-08-18',
                users: parsedLegacy
              }
            ];
          }
        } catch (e) {}
      }

      return DEFAULT_FAMILY_GROUPS;
    } catch (e) {
      console.error('Error cargando grupos:', e);
      return DEFAULT_FAMILY_GROUPS;
    }
  });

  // 2. ESTADO DE GRUPO ACTIVO & GRUPOS DESBLOQUEADOS EN SESIÓN
  const [activeGroupId, setActiveGroupId] = useState(() => {
    try {
      return localStorage.getItem(ACTIVE_GROUP_KEY) || 'group_junvill';
    } catch (e) {
      return 'group_junvill';
    }
  });

  const [unlockedGroupIds, setUnlockedGroupIds] = useState(() => {
    try {
      const saved = sessionStorage.getItem(UNLOCKED_GROUPS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 3. ESTADO DE USUARIO ACTIVO
  const [activeUserId, setActiveUserId] = useState(() => {
    try {
      return localStorage.getItem(ACTIVE_USER_KEY) || 'user_1';
    } catch (e) {
      return 'user_1';
    }
  });

  const [isDbSynced, setIsDbSynced] = useState(false);

  // Derivaciones
  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0] || null;
  const isGroupUnlocked = activeGroup ? unlockedGroupIds.includes(activeGroup.id) : false;
  const users = activeGroup ? (activeGroup.users || []) : [];
  const currentUser = users.find(u => u.id === activeUserId) || users[0] || DEFAULT_JUNVILL_USERS[0];

  // Sincronización con Backend / LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
      localStorage.setItem(ACTIVE_GROUP_KEY, activeGroupId || '');
      sessionStorage.setItem(UNLOCKED_GROUPS_KEY, JSON.stringify(unlockedGroupIds));
      localStorage.setItem(ACTIVE_USER_KEY, activeUserId || '');
    } catch (e) {}
  }, [groups, activeGroupId, unlockedGroupIds, activeUserId]);

  // Actualizar usuarios dentro del grupo activo
  const setUsersForActiveGroup = (updater) => {
    if (!activeGroupId) return;
    setGroups(prev => prev.map(g => {
      if (g.id === activeGroupId) {
        const nextUsers = typeof updater === 'function' ? updater(g.users || []) : updater;
        return { ...g, users: nextUsers };
      }
      return g;
    }));
  };

  // ==========================================
  // GESTIÓN DE GRUPOS FAMILIARES
  // ==========================================

  const createFamilyGroup = (name, password, adminName = 'Tutor Familiar', emblem = '🛡️', themeColor = '#ca8a04') => {
    if (groups.length >= MAX_FAMILY_GROUPS) {
      return { 
        success: false, 
        error: `Límite máximo de ${MAX_FAMILY_GROUPS} grupos familiares alcanzado en este entorno.` 
      };
    }

    const trimmedName = (name || '').trim();
    if (!trimmedName) {
      return { success: false, error: 'Debes especificar un nombre para el grupo familiar.' };
    }

    const trimmedPassword = (password || '').trim() || DEFAULT_GENERIC_PASSWORD;

    const newGroup = {
      id: `grp_${Date.now()}`,
      name: trimmedName,
      password: trimmedPassword,
      adminName: (adminName || '').trim() || 'Tutor Familiar',
      emblem: emblem || '🛡️',
      themeColor: themeColor || '#ca8a04',
      isDefault: false,
      isProtected: true,
      createdAt: new Date().toISOString().split('T')[0],
      users: []
    };

    setGroups(prev => [...prev, newGroup]);
    setUnlockedGroupIds(prev => [...new Set([...prev, newGroup.id])]);
    setActiveGroupId(newGroup.id);
    return { success: true, group: newGroup };
  };

  const unlockFamilyGroup = (groupId, enteredPassword) => {
    const targetGroup = groups.find(g => g.id === groupId);
    if (!targetGroup) {
      return { success: false, error: 'Grupo familiar no encontrado.' };
    }

    const expected = targetGroup.password || DEFAULT_GENERIC_PASSWORD;
    if ((enteredPassword || '').trim() !== expected.trim()) {
      return { success: false, error: 'Contraseña del grupo familiar incorrecta.' };
    }

    setUnlockedGroupIds(prev => [...new Set([...prev, groupId])]);
    setActiveGroupId(groupId);
    if (targetGroup.users && targetGroup.users.length > 0) {
      setActiveUserId(targetGroup.users[0].id);
    }
    return { success: true, group: targetGroup };
  };

  const leaveFamilyGroup = () => {
    setActiveGroupId(null);
  };

  const deleteFamilyGroup = (groupId, adminPassword) => {
    const targetGroup = groups.find(g => g.id === groupId);
    if (!targetGroup) return false;
    if (targetGroup.isDefault) {
      alert('El grupo principal Familia Junvill no puede ser eliminado.');
      return false;
    }
    if ((adminPassword || '').trim() !== (targetGroup.password || '').trim()) {
      alert('Contraseña de administrador incorrecta para eliminar el grupo.');
      return false;
    }

    const filtered = groups.filter(g => g.id !== groupId);
    setGroups(filtered);
    setActiveGroupId('group_junvill');
    return true;
  };

  // ==========================================
  // GESTIÓN DE USUARIOS / JUGADORES
  // ==========================================

  const createUser = (name, avatar = 'custom_dynamic', role = 'student', customConfig = null, password = DEFAULT_GENERIC_PASSWORD) => {
    if (!activeGroup) return null;

    if ((activeGroup.users || []).length >= MAX_PLAYERS_PER_GROUP) {
      alert(`Este grupo familiar ya alcanzó el límite máximo de ${MAX_PLAYERS_PER_GROUP} jugadores.`);
      return null;
    }

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

    setUsersForActiveGroup(prev => [...prev, newUser]);
    setActiveUserId(newUser.id);
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
    setUsersForActiveGroup(prev => prev.map(u => {
      if (u.id === currentUser?.id) {
        return { ...u, ...updates };
      }
      return u;
    }));
  };

  const editUser = (userId, updates) => {
    setUsersForActiveGroup(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, ...updates };
      }
      return u;
    }));
  };

  const resetUserProgress = (userId) => {
    setUsersForActiveGroup(prev => prev.map(u => {
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
      alert('Debe existir al menos un perfil de usuario en el grupo familiar.');
      return false;
    }
    const filtered = users.filter(u => u.id !== userId);
    setUsersForActiveGroup(filtered);
    if (activeUserId === userId) {
      setActiveUserId(filtered[0].id);
    }
    return true;
  };

  // ==========================================
  // RECOMPENSAS Y MÉTRICAS EDUCATIVAS
  // ==========================================

  const addRewards = (starsAmount = 0, gemsAmount = 0) => {
    setUsersForActiveGroup(prev => prev.map(u => {
      if (u.id !== currentUser?.id) return u;
      return {
        ...u,
        stars: (u.stars || 0) + starsAmount,
        gems: (u.gems || 0) + gemsAmount
      };
    }));
  };

  const recordLessonScore = (lessonId, starsEarned, category = 'tactica') => {
    setUsersForActiveGroup(prev => prev.map(u => {
      if (u.id !== currentUser?.id) return u;

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
    setUsersForActiveGroup(prev => prev.map(u => {
      if (u.id !== currentUser?.id) return u;
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
    setUsersForActiveGroup(prev => prev.map(u => {
      if (u.id !== currentUser?.id) return u;
      const botVics = { ...u.botVictories };
      botVics[botId] = (botVics[botId] || 0) + 1;
      const stats = { ...u.stats };
      stats.gamesPlayed += 1;
      stats.wins += 1;

      return {
        ...u,
        elo: u.elo + eloGain,
        stars: u.stars + 10,
        gems: u.gems + 2,
        botVictories: botVics,
        stats
      };
    }));
  };

  const recordGameResult = (result, eloChange = 0) => {
    setUsersForActiveGroup(prev => prev.map(u => {
      if (u.id !== currentUser?.id) return u;
      const stats = { ...u.stats };
      stats.gamesPlayed += 1;
      if (result === 'win') stats.wins += 1;
      else if (result === 'loss') stats.losses += 1;
      else if (result === 'draw') stats.draws += 1;

      return {
        ...u,
        elo: Math.max(100, u.elo + eloChange),
        stats
      };
    }));
  };

  const unlockItem = (itemId) => {
    setUsersForActiveGroup(prev => prev.map(u => {
      if (u.id !== currentUser?.id) return u;
      const items = u.unlockedItems || [];
      if (items.includes(itemId)) return u;
      return {
        ...u,
        unlockedItems: [...items, itemId]
      };
    }));
  };

  const exportSaveData = () => {
    return JSON.stringify({ groups, activeGroupId, activeUserId, exportedAt: new Date().toISOString() }, null, 2);
  };

  const importSaveData = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.groups && Array.isArray(parsed.groups)) {
        setGroups(parsed.groups);
        if (parsed.activeGroupId) setActiveGroupId(parsed.activeGroupId);
        if (parsed.activeUserId) setActiveUserId(parsed.activeUserId);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error importing data', e);
      return false;
    }
  };

  const resetUserData = () => {
    setGroups(DEFAULT_FAMILY_GROUPS);
    setActiveGroupId('group_junvill');
    setActiveUserId('user_1');
  };

  // Métricas y Salud del Servidor
  const serverMetrics = {
    maxGroups: MAX_FAMILY_GROUPS,
    currentGroups: groups.length,
    maxPlayersPerGroup: MAX_PLAYERS_PER_GROUP,
    maxConcurrent: MAX_CONCURRENT_USERS,
    activeConnections: Math.min(users.length + 1, MAX_CONCURRENT_USERS),
    isCapacityAvailable: groups.length < MAX_FAMILY_GROUPS,
    serverHealth: 'optimal' // 'optimal' | 'moderate' | 'full'
  };

  return (
    <UserContext.Provider value={{
      groups,
      activeGroup,
      activeGroupId,
      setActiveGroupId,
      isGroupUnlocked,
      createFamilyGroup,
      unlockFamilyGroup,
      leaveFamilyGroup,
      deleteFamilyGroup,
      serverMetrics,
      MAX_FAMILY_GROUPS,
      MAX_PLAYERS_PER_GROUP,
      MAX_CONCURRENT_USERS,
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
      resetUserData
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
