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

// Usuarios oficiales predeterminados para la Familia Junvill
export const DEFAULT_JUNVILL_USERS = [
  {
    id: 'user_1',
    name: 'Estudiante Junvill',
    password: DEFAULT_GENERIC_PASSWORD,
    role: 'student',
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
  },
  {
    id: 'user_1786849943311',
    name: 'César',
    password: DEFAULT_GENERIC_PASSWORD,
    role: 'parent',
    avatar: 'custom_dynamic',
    avatarConfig: {
      skin: '#fed7aa',
      hairStyle: 'messy',
      hairColor: '#27170a',
      eyeStyle: 'wink',
      shirtStyle: 'tshirt',
      shirtColor: '#d97706',
      accessory: 'headphones',
      background: 'parchment_wood'
    },
    title: 'Tutor Familiar',
    elo: 676,
    puzzleRating: 400,
    stars: 225,
    gems: 42,
    totalPoints: 15,
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
    lessonProgress: {
      'l02_capturas': { stars: 5, completed: true },
      'l04_valor_piezas': { stars: 5, completed: true },
      'l05_coronacion': { stars: 5, completed: true }
    },
    botVictories: {
      'qwerty': 1,
      'cosmo': 1,
      'monkey': 1,
      'mateo_kid': 1,
      'shark': 1,
      'sofia_teen': 1,
      'spark': 1
    },
    stats: {
      gamesPlayed: 23,
      wins: 14,
      losses: 5,
      draws: 4,
      puzzlesSolved: 0,
      hintsUsed: 0,
      accuracyAvg: 0
    },
    radarSkills: {
      tactica: 35,
      estrategia: 25,
      posicional: 15,
      calculo: 15,
      aperturas: 15,
      finales: 15
    },
    coachSettings: {
      assistanceLevel: 'full',
      botDifficulty: 1,
      coachAvatar: 'coach_aurelio',
      soundEnabled: true
    }
  },
  {
    id: 'user_leti',
    name: 'Leti',
    password: DEFAULT_GENERIC_PASSWORD,
    role: 'parent',
    avatar: 'custom_dynamic',
    avatarConfig: {
      skin: '#fed7aa',
      hairStyle: 'long',
      hairColor: '#451a03',
      eyeStyle: 'happy',
      shirtStyle: 'hoodie',
      shirtColor: '#ec4899',
      accessory: 'none',
      background: 'parchment_wood'
    },
    title: 'Tutora Familiar',
    elo: 550,
    puzzleRating: 500,
    stars: 60,
    gems: 15,
    totalPoints: 10,
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
    lessonProgress: {
      'l01_piezas': { stars: 5, completed: true },
      'l02_capturas': { stars: 5, completed: true }
    },
    botVictories: {
      'qwerty': 2,
      'cosmo': 1
    },
    stats: {
      gamesPlayed: 5,
      wins: 3,
      losses: 2,
      draws: 0,
      puzzlesSolved: 10,
      hintsUsed: 4,
      accuracyAvg: 80
    },
    radarSkills: {
      tactica: 40,
      estrategia: 30,
      posicional: 25,
      calculo: 30,
      aperturas: 30,
      finales: 25
    },
    coachSettings: {
      assistanceLevel: 'full',
      botDifficulty: 1,
      coachAvatar: 'coach_aurelio',
      soundEnabled: true
    }
  },
  {
    id: 'user_martin',
    name: 'Martin',
    password: DEFAULT_GENERIC_PASSWORD,
    role: 'student',
    avatar: 'custom_dynamic',
    avatarConfig: {
      skin: '#fed7aa',
      hairStyle: 'short',
      hairColor: '#1e293b',
      eyeStyle: 'happy',
      shirtStyle: 'tshirt',
      shirtColor: '#10b981',
      accessory: 'cap',
      background: 'blue_sky'
    },
    title: 'Campeón Junior',
    elo: 500,
    puzzleRating: 450,
    stars: 50,
    gems: 15,
    totalPoints: 10,
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
    unlockedItems: ['board_emerald', 'board_wood', 'shirt_blue'],
    lessonProgress: {
      'l01_piezas': { stars: 5, completed: true },
      'l02_capturas': { stars: 5, completed: true }
    },
    botVictories: {
      'qwerty': 2,
      'monkey': 1
    },
    stats: {
      gamesPlayed: 6,
      wins: 4,
      losses: 2,
      draws: 0,
      puzzlesSolved: 12,
      hintsUsed: 5,
      accuracyAvg: 82
    },
    radarSkills: {
      tactica: 45,
      estrategia: 30,
      posicional: 20,
      calculo: 35,
      aperturas: 30,
      finales: 20
    },
    coachSettings: {
      assistanceLevel: 'full',
      botDifficulty: 1,
      coachAvatar: 'coach_aurelio',
      soundEnabled: true
    }
  }
];

export const DEFAULT_FAMILY_GROUPS = [
  {
    id: 'group_junvill',
    name: 'Familia Junvill',
    password: DEFAULT_GENERIC_PASSWORD,
    adminName: 'César Villamil',
    adminEmail: 'junvill13@gmail.com',
    emblem: '👑',
    themeColor: '#ca8a04',
    isDefault: true,
    isProtected: true,
    createdAt: '2026-08-18',
    users: DEFAULT_JUNVILL_USERS
  }
];

export const UserProvider = ({ children }) => {
  // 1. ESTADO DE GRUPOS FAMILIARES CON PERSISTENCIA INMEDIATA
  const [groups, setGroups] = useState(() => {
    try {
      const savedGroups = localStorage.getItem(GROUPS_STORAGE_KEY);
      if (savedGroups) {
        const parsed = JSON.parse(savedGroups);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(g => {
            if (!g.password) g.password = DEFAULT_GENERIC_PASSWORD;
            if (g.id === 'group_junvill') {
              if (!g.adminEmail) g.adminEmail = 'junvill13@gmail.com';
              if (!Array.isArray(g.users) || g.users.length === 0) {
                g.users = DEFAULT_JUNVILL_USERS;
              } else {
                // Asegurar que César, Estudiante, Leti y Martin estén presentes en Familia Junvill
                const existingNames = g.users.map(u => (u.name || '').toLowerCase().trim());
                DEFAULT_JUNVILL_USERS.forEach(defUser => {
                  const defName = defUser.name.toLowerCase().trim();
                  if (!existingNames.some(en => en === defName || en.includes(defName) || defName.includes(en))) {
                    g.users.push(defUser);
                  }
                });
              }
            }
            if (!Array.isArray(g.users)) g.users = [];
            return g;
          });
          return normalized;
        }
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return ['group_junvill'];
    } catch (e) {
      return ['group_junvill'];
    }
  });

  // 3. ESTADO DE USUARIO ACTIVO
  const [activeUserId, setActiveUserId] = useState(() => {
    try {
      return localStorage.getItem(ACTIVE_USER_KEY) || 'user_1786849943311';
    } catch (e) {
      return 'user_1786849943311';
    }
  });

  // Derivaciones
  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0] || DEFAULT_FAMILY_GROUPS[0];
  const isGroupUnlocked = activeGroup ? unlockedGroupIds.includes(activeGroup.id) : false;
  const users = activeGroup ? (activeGroup.users || []) : [];
  const currentUser = users.find(u => u.id === activeUserId) || users[0] || DEFAULT_JUNVILL_USERS[0];

  // Sincronización continua de estado con localStorage / sessionStorage
  useEffect(() => {
    try {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
      localStorage.setItem(ACTIVE_GROUP_KEY, activeGroupId || 'group_junvill');
      sessionStorage.setItem(UNLOCKED_GROUPS_KEY, JSON.stringify(unlockedGroupIds));
      localStorage.setItem(ACTIVE_USER_KEY, activeUserId || '');
    } catch (e) {}
  }, [groups, activeGroupId, unlockedGroupIds, activeUserId]);

  // Actualizar usuarios dentro del grupo activo (o grupo específico) de forma atómica y síncrona
  const setUsersForActiveGroup = (updater, targetGroupId = null) => {
    const targetId = targetGroupId || activeGroupId || 'group_junvill';
    setGroups(prev => {
      const updated = prev.map(g => {
        if (g.id === targetId) {
          const currentUsers = Array.isArray(g.users) ? g.users : [];
          const nextUsers = typeof updater === 'function' ? updater(currentUsers) : updater;
          return { ...g, users: nextUsers };
        }
        return g;
      });
      try {
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // ==========================================
  // GESTIÓN DE GRUPOS FAMILIARES
  // ==========================================

  const createFamilyGroup = (name, password, adminName = 'Tutor Familiar', adminEmail = '', emblem = '🛡️', themeColor = '#ca8a04') => {
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
      adminEmail: (adminEmail || '').trim().toLowerCase(),
      emblem: emblem || '🛡️',
      themeColor: themeColor || '#ca8a04',
      isDefault: false,
      isProtected: true,
      createdAt: new Date().toISOString().split('T')[0],
      users: []
    };

    setGroups(prev => {
      const updated = [...prev, newGroup];
      try {
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(ACTIVE_GROUP_KEY, newGroup.id);
      } catch (e) {}
      return updated;
    });

    setUnlockedGroupIds(prev => {
      const nextUnlocked = [...new Set([...prev, newGroup.id])];
      try {
        sessionStorage.setItem(UNLOCKED_GROUPS_KEY, JSON.stringify(nextUnlocked));
      } catch (e) {}
      return nextUnlocked;
    });

    setActiveGroupId(newGroup.id);
    return { success: true, group: newGroup };
  };

  const recoverGroupPassword = (groupId, enteredAdminEmail, newPassword) => {
    const targetGroup = groups.find(g => g.id === groupId);
    if (!targetGroup) return { success: false, error: 'Grupo familiar no encontrado.' };

    const registeredEmail = (targetGroup.adminEmail || '').trim().toLowerCase();
    const entered = (enteredAdminEmail || '').trim().toLowerCase();

    if (!entered) {
      return { success: false, error: 'Por favor ingresa el correo de recuperación.' };
    }

    if (targetGroup.id === 'group_junvill') {
      if (entered !== 'junvill13@gmail.com') {
        return { success: false, error: 'El correo ingresado no coincide con el correo de recuperación de la Familia Junvill.' };
      }
    } else if (registeredEmail && registeredEmail !== entered) {
      return { success: false, error: 'El correo ingresado no coincide con el correo de recuperación registrado para este grupo.' };
    } else if (!registeredEmail) {
      return { success: false, error: 'Este grupo no tiene configurado un correo de recuperación.' };
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, error: 'La nueva contraseña debe tener al menos 4 caracteres.' };
    }

    const trimmedNewPwd = newPassword.trim();
    setGroups(prev => {
      const updated = prev.map(g => {
        if (g.id === groupId) {
          return { ...g, password: trimmedNewPwd };
        }
        return g;
      });
      try {
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    return { success: true, message: '¡Contraseña restablecida exitosamente!' };
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

    const nextUnlocked = [...new Set([...unlockedGroupIds, groupId])];
    setUnlockedGroupIds(nextUnlocked);
    setActiveGroupId(groupId);

    try {
      sessionStorage.setItem(UNLOCKED_GROUPS_KEY, JSON.stringify(nextUnlocked));
      localStorage.setItem(ACTIVE_GROUP_KEY, groupId);
    } catch (e) {}

    if (targetGroup.users && targetGroup.users.length > 0) {
      setActiveUserId(targetGroup.users[0].id);
      try {
        localStorage.setItem(ACTIVE_USER_KEY, targetGroup.users[0].id);
      } catch (e) {}
    }
    return { success: true, group: targetGroup };
  };

  const leaveFamilyGroup = () => {
    setActiveGroupId('group_junvill');
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
    try {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(filtered));
      localStorage.setItem(ACTIVE_GROUP_KEY, 'group_junvill');
    } catch (e) {}
    return true;
  };

  // ==========================================
  // GESTIÓN DE USUARIOS / JUGADORES
  // ==========================================

  const createUser = (name, avatar = 'custom_dynamic', role = 'student', customConfig = null, password = DEFAULT_GENERIC_PASSWORD, targetGroupId = null) => {
    const effectiveGroupId = targetGroupId || activeGroupId || 'group_junvill';
    const targetGroup = groups.find(g => g.id === effectiveGroupId) || groups[0];

    if (targetGroup && (targetGroup.users || []).length >= MAX_PLAYERS_PER_GROUP) {
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

    // Actualización atómica en el estado y guardado síncrono en localStorage
    setGroups(prev => {
      const updated = prev.map(g => {
        if (g.id === effectiveGroupId) {
          const currentUsers = Array.isArray(g.users) ? g.users : [];
          return { ...g, users: [...currentUsers, newUser] };
        }
        return g;
      });
      try {
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setActiveGroupId(effectiveGroupId);
    setActiveUserId(newUser.id);

    try {
      localStorage.setItem(ACTIVE_GROUP_KEY, effectiveGroupId);
      localStorage.setItem(ACTIVE_USER_KEY, newUser.id);
      localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
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
    if (!currentUser) return;
    editUser(currentUser.id, updates);
  };

  const editUser = (userId, updates) => {
    const effectiveGroupId = activeGroupId || 'group_junvill';
    setGroups(prev => {
      const updated = prev.map(g => {
        if (g.id === effectiveGroupId) {
          const updatedUsers = (g.users || []).map(u => u.id === userId ? { ...u, ...updates } : u);
          return { ...g, users: updatedUsers };
        }
        return g;
      });
      try {
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const resetUserProgress = (userId) => {
    const effectiveGroupId = activeGroupId || 'group_junvill';
    setGroups(prev => {
      const updated = prev.map(g => {
        if (g.id === effectiveGroupId) {
          const updatedUsers = (g.users || []).map(u => {
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
          });
          return { ...g, users: updatedUsers };
        }
        return g;
      });
      try {
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const deleteUser = (userId) => {
    if (users.length <= 1) {
      alert('Debe existir al menos un perfil de usuario en el grupo familiar.');
      return false;
    }
    const effectiveGroupId = activeGroupId || 'group_junvill';
    const filtered = users.filter(u => u.id !== userId);

    setGroups(prev => {
      const updated = prev.map(g => {
        if (g.id === effectiveGroupId) {
          return { ...g, users: (g.users || []).filter(u => u.id !== userId) };
        }
        return g;
      });
      try {
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (activeUserId === userId && filtered.length > 0) {
      setActiveUserId(filtered[0].id);
      try {
        localStorage.setItem(ACTIVE_USER_KEY, filtered[0].id);
      } catch (e) {}
    }
    return true;
  };

  // ==========================================
  // RECOMPENSAS Y MÉTRICAS EDUCATIVAS
  // ==========================================

  const addRewards = (starsAmount = 0, gemsAmount = 0) => {
    if (!currentUser) return;
    editUser(currentUser.id, {
      stars: (currentUser.stars || 0) + starsAmount,
      gems: (currentUser.gems || 0) + gemsAmount
    });
  };

  const recordLessonScore = (lessonId, starsEarned, category = 'tactica') => {
    if (!currentUser) return;
    const currentProgress = currentUser.lessonProgress?.[lessonId] || { stars: 0, completed: false };
    const newStars = Math.max(currentProgress.stars, starsEarned);
    const pointsDiff = newStars - currentProgress.stars;
    const isCompleted = newStars >= 5;

    const updatedProgress = {
      ...(currentUser.lessonProgress || {}),
      [lessonId]: { stars: newStars, completed: isCompleted }
    };

    let totalPts = 0;
    Object.values(updatedProgress).forEach(p => {
      totalPts += (p.stars || 0);
    });

    const newRadar = { ...(currentUser.radarSkills || {}) };
    if (category && newRadar[category] !== undefined) {
      newRadar[category] = Math.min(100, newRadar[category] + (pointsDiff * 2));
    }

    editUser(currentUser.id, {
      totalPoints: totalPts,
      elo: (currentUser.elo || 400) + (pointsDiff * 6),
      stars: (currentUser.stars || 0) + (pointsDiff * 5),
      gems: (currentUser.gems || 0) + (isCompleted ? 2 : 0),
      lessonProgress: updatedProgress,
      radarSkills: newRadar
    });
  };

  const recordPuzzleSuccess = (puzzleElo = 10) => {
    if (!currentUser) return;
    const stats = { ...(currentUser.stats || { puzzlesSolved: 0 }) };
    stats.puzzlesSolved += 1;
    const newRadar = { ...(currentUser.radarSkills || {}) };
    newRadar.tactica = Math.min(100, (newRadar.tactica || 20) + 1);
    newRadar.calculo = Math.min(100, (newRadar.calculo || 20) + 1);

    editUser(currentUser.id, {
      puzzleRating: (currentUser.puzzleRating || 400) + puzzleElo,
      stars: (currentUser.stars || 0) + 3,
      gems: (currentUser.gems || 0) + 1,
      stats,
      radarSkills: newRadar
    });
  };

  const recordBotWin = (botId, eloGain = 15) => {
    if (!currentUser) return;
    const botVics = { ...(currentUser.botVictories || {}) };
    botVics[botId] = (botVics[botId] || 0) + 1;
    const stats = { ...(currentUser.stats || { gamesPlayed: 0, wins: 0 }) };
    stats.gamesPlayed += 1;
    stats.wins += 1;

    editUser(currentUser.id, {
      elo: (currentUser.elo || 400) + eloGain,
      stars: (currentUser.stars || 0) + 10,
      gems: (currentUser.gems || 0) + 2,
      botVictories: botVics,
      stats
    });
  };

  const recordGameResult = (result, eloChange = 0) => {
    if (!currentUser) return;
    const stats = { ...(currentUser.stats || { gamesPlayed: 0, wins: 0, losses: 0, draws: 0 }) };
    stats.gamesPlayed += 1;
    if (result === 'win') stats.wins += 1;
    else if (result === 'loss') stats.losses += 1;
    else if (result === 'draw') stats.draws += 1;

    editUser(currentUser.id, {
      elo: Math.max(100, (currentUser.elo || 400) + eloChange),
      stats
    });
  };

  const unlockItem = (itemId) => {
    if (!currentUser) return;
    const items = currentUser.unlockedItems || [];
    if (items.includes(itemId)) return;
    editUser(currentUser.id, {
      unlockedItems: [...items, itemId]
    });
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
        try {
          localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(parsed.groups));
        } catch (e) {}
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
    setActiveUserId('user_1786849943311');
    try {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(DEFAULT_FAMILY_GROUPS));
      localStorage.setItem(ACTIVE_GROUP_KEY, 'group_junvill');
      localStorage.setItem(ACTIVE_USER_KEY, 'user_1786849943311');
    } catch (e) {}
  };

  // Métricas y Salud del Servidor
  const serverMetrics = {
    maxGroups: MAX_FAMILY_GROUPS,
    currentGroups: groups.length,
    maxPlayersPerGroup: MAX_PLAYERS_PER_GROUP,
    maxConcurrent: MAX_CONCURRENT_USERS,
    activeConnections: Math.min(users.length + 1, MAX_CONCURRENT_USERS),
    isCapacityAvailable: groups.length < MAX_FAMILY_GROUPS,
    serverHealth: 'optimal'
  };

  return (
    <UserContext.Provider value={{
      groups,
      activeGroup,
      activeGroupId,
      unlockedGroupIds,
      isGroupUnlocked,
      createFamilyGroup,
      recoverGroupPassword,
      unlockFamilyGroup,
      leaveFamilyGroup,
      deleteFamilyGroup,
      users,
      currentUser,
      setActiveUserId,
      createUser,
      editUser,
      deleteUser,
      verifyPassword,
      changeUserPassword,
      updateCurrentUser,
      resetUserProgress,
      addRewards,
      recordLessonScore,
      recordPuzzleSuccess,
      recordBotWin,
      recordGameResult,
      unlockItem,
      exportSaveData,
      importSaveData,
      resetUserData,
      serverMetrics
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
