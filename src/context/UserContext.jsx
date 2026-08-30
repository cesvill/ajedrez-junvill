import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { familySignaling } from '../engine/familySignaling';
import { audioManager } from '../engine/audio';
import { cloudSync, normalizeUserKey, deduplicateAndMergeUsers } from '../engine/cloudSync';

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
    id: 'user_cesar',
    name: 'César',
    password: DEFAULT_GENERIC_PASSWORD,
    role: 'parent',
    avatar: 'custom_dynamic',
    avatarConfig: {
      skin: '#fed7aa',
      hairStyle: 'messy',
      hairColor: '#27170a',
      eyeStyle: 'wink',
      shirtStyle: 'blazer',
      shirtColor: '#d97706',
      pantsStyle: 'formal',
      pantsColor: '#0f172a',
      shoesStyle: 'oxford',
      shoesColor: '#d97706',
      accessory: 'headphones',
      heldItem: 'trophy_cup',
      background: 'parchment_wood'
    },
    title: 'Tutor Familiar',
    elo: 762,
    puzzleRating: 650,
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
      'l01_piezas': { stars: 5, completed: true },
      'l02_capturas': { stars: 5, completed: true },
      'l04_valor_piezas': { stars: 5, completed: true },
      'l05_coronacion': { stars: 5, completed: true }
    },
    botVictories: {
      'qwerty': 4,
      'cosmo': 2,
      'monkey': 2,
      'mateo_kid': 1
    },
    stats: {
      gamesPlayed: 23,
      wins: 14,
      losses: 5,
      draws: 4,
      puzzlesSolved: 15,
      hintsUsed: 3,
      accuracyAvg: 85
    },
    radarSkills: {
      tactica: 55,
      estrategia: 45,
      posicional: 40,
      calculo: 45,
      aperturas: 40,
      finales: 35
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
    role: 'student',
    avatar: 'custom_dynamic',
    avatarConfig: {
      skin: '#fed7aa',
      hairStyle: 'long',
      hairColor: '#451a03',
      eyeStyle: 'happy',
      shirtStyle: 'hoodie',
      shirtColor: '#ec4899',
      pantsStyle: 'skirt',
      pantsColor: '#7e22ce',
      shoesStyle: 'sneakers',
      shoesColor: '#ffffff',
      accessory: 'medal',
      heldItem: 'queen_piece',
      background: 'royal_castle'
    },
    title: 'Campeona Junior',
    elo: 1210,
    puzzleRating: 850,
    stars: 610,
    gems: 59,
    totalPoints: 24,
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
    unlockedItems: ['board_emerald', 'board_wood', 'shirt_blue', 'shirt_green'],
    lessonProgress: {
      "l01_piezas": {
            "stars": 5,
            "completed": true
      },
      "l02_capturas": {
            "stars": 5,
            "completed": true
      },
      "l03_desprotegidas": {
            "stars": 5,
            "completed": true
      },
      "l04_valor_piezas": {
            "stars": 5,
            "completed": true
      },
      "l05_coronacion": {
            "stars": 5,
            "completed": true
      },
      "l06_jaque": {
            "stars": 5,
            "completed": true
      },
      "l07_escapar_jaque": {
            "stars": 5,
            "completed": true
      },
      "l08_mate_1": {
            "stars": 5,
            "completed": true
      },
      "l09_rey_ahogado": {
            "stars": 5,
            "completed": true
      },
      "l10_enroque": {
            "stars": 5,
            "completed": true
      },
      "l11_al_paso": {
            "stars": 5,
            "completed": true
      },
      "l12_ataque_doble_peon": {
            "stars": 5,
            "completed": true
      },
      "l13_mate_pasillo": {
            "stars": 5,
            "completed": true
      },
      "l14_mate_dama_rey": {
            "stars": 5,
            "completed": true
      },
      "l15_mate_torre_rey": {
            "stars": 5,
            "completed": true
      },
      "l16_clavada_absoluta": {
            "stars": 5,
            "completed": true
      },
      "l17_clavada_relativa": {
            "stars": 5,
            "completed": true
      },
      "l18_horquilla_caballo": {
            "stars": 5,
            "completed": true
      },
      "l19_enfilada_skewer": {
            "stars": 5,
            "completed": true
      },
      "l20_ataque_descubierta": {
            "stars": 5,
            "completed": true
      },
      "l21_jaque_descubierta": {
            "stars": 5,
            "completed": true
      },
      "l22_jaque_doble": {
            "stars": 5,
            "completed": true
      },
      "l23_ataque_doble_dama": {
            "stars": 5,
            "completed": true
      },
      "l24_mate_pastor": {
            "stars": 5,
            "completed": true
      }
},
    botVictories: {
      'qwerty': 6,
      'cosmo': 4,
      'monkey': 3,
      'mateo_kid': 2
    },
    stats: {
      gamesPlayed: 18,
      wins: 15,
      losses: 3,
      draws: 0,
      puzzlesSolved: 35,
      hintsUsed: 4,
      accuracyAvg: 88
    },
    radarSkills: {
      tactica: 70,
      estrategia: 55,
      posicional: 50,
      calculo: 60,
      aperturas: 55,
      finales: 50
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
      pantsStyle: 'sweatpants',
      pantsColor: '#0f172a',
      shoesStyle: 'sneakers',
      shoesColor: '#dc2626',
      accessory: 'cap_back',
      heldItem: 'knight_piece',
      background: 'cyber_grid'
    },
    title: 'Campeón Junior',
    elo: 1495,
    puzzleRating: 950,
    stars: 300,
    gems: 62,
    totalPoints: 31,
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
    unlockedItems: ['board_emerald', 'board_wood', 'shirt_blue', 'shirt_green'],
    lessonProgress: {
      "l01_piezas": {
            "stars": 5,
            "completed": true
      },
      "l02_capturas": {
            "stars": 5,
            "completed": true
      },
      "l03_desprotegidas": {
            "stars": 5,
            "completed": true
      },
      "l04_valor_piezas": {
            "stars": 5,
            "completed": true
      },
      "l05_coronacion": {
            "stars": 5,
            "completed": true
      },
      "l06_jaque": {
            "stars": 5,
            "completed": true
      },
      "l07_escapar_jaque": {
            "stars": 5,
            "completed": true
      },
      "l08_mate_1": {
            "stars": 5,
            "completed": true
      },
      "l09_rey_ahogado": {
            "stars": 5,
            "completed": true
      },
      "l10_enroque": {
            "stars": 5,
            "completed": true
      },
      "l11_al_paso": {
            "stars": 5,
            "completed": true
      },
      "l12_ataque_doble_peon": {
            "stars": 5,
            "completed": true
      },
      "l13_mate_pasillo": {
            "stars": 5,
            "completed": true
      },
      "l14_mate_dama_rey": {
            "stars": 5,
            "completed": true
      },
      "l15_mate_torre_rey": {
            "stars": 5,
            "completed": true
      },
      "l16_clavada_absoluta": {
            "stars": 5,
            "completed": true
      },
      "l17_clavada_relativa": {
            "stars": 5,
            "completed": true
      },
      "l18_horquilla_caballo": {
            "stars": 5,
            "completed": true
      },
      "l19_enfilada_skewer": {
            "stars": 5,
            "completed": true
      },
      "l20_ataque_descubierta": {
            "stars": 5,
            "completed": true
      },
      "l21_jaque_descubierta": {
            "stars": 5,
            "completed": true
      },
      "l22_jaque_doble": {
            "stars": 5,
            "completed": true
      },
      "l23_ataque_doble_dama": {
            "stars": 5,
            "completed": true
      },
      "l24_mate_pastor": {
            "stars": 5,
            "completed": true
      },
      "l25_sobrecarga": {
            "stars": 5,
            "completed": true
      },
      "l26_pieza_atrapada": {
            "stars": 5,
            "completed": true
      },
      "l27_despeje_casillas": {
            "stars": 5,
            "completed": true
      },
      "l28_despeje_lineas": {
            "stars": 5,
            "completed": true
      },
      "l29_intercepcion_lineas": {
            "stars": 5,
            "completed": true
      },
      "l30_rayos_x": {
            "stars": 5,
            "completed": true
      },
      "l31_jaque_perpetuo": {
            "stars": 5,
            "completed": true
      }
},
    botVictories: {
      'qwerty': 8,
      'monkey': 5,
      'mateo_kid': 4,
      'cosmo': 3,
      'shark': 2
    },
    stats: {
      gamesPlayed: 25,
      wins: 21,
      losses: 4,
      draws: 0,
      puzzlesSolved: 48,
      hintsUsed: 5,
      accuracyAvg: 92
    },
    radarSkills: {
      tactica: 80,
      estrategia: 65,
      posicional: 60,
      calculo: 75,
      aperturas: 65,
      finales: 60
    },
    coachSettings: {
      assistanceLevel: 'full',
      botDifficulty: 1,
      coachAvatar: 'coach_aurelio',
      soundEnabled: true
    }
  },
  {
    id: 'user_estudiante',
    name: 'Estudiante Junvill',
    password: DEFAULT_GENERIC_PASSWORD,
    role: 'student',
    avatar: 'custom_dynamic',
    avatarConfig: {
      skin: '#fed7aa',
      hairStyle: 'short',
      hairColor: '#27170a',
      eyeStyle: 'happy',
      shirtStyle: 'tshirt',
      shirtColor: '#3b82f6',
      pantsStyle: 'jeans',
      pantsColor: '#1e3a8a',
      shoesStyle: 'sneakers',
      shoesColor: '#ffffff',
      accessory: 'none',
      background: 'parchment_wood'
    },
    title: 'Aprendiz Promesa',
    elo: 827,
    puzzleRating: 600,
    stars: 100,
    gems: 25,
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
      'qwerty': 3,
      'cosmo': 1
    },
    stats: {
      gamesPlayed: 10,
      wins: 7,
      losses: 3,
      draws: 0,
      puzzlesSolved: 15,
      hintsUsed: 3,
      accuracyAvg: 82
    },
    radarSkills: {
      tactica: 45,
      estrategia: 35,
      posicional: 30,
      calculo: 40,
      aperturas: 35,
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
              // Fusión y deduplicación canónica estricta
              g.users = cloudSync.mergeUsers(g.users || [], DEFAULT_JUNVILL_USERS);
            } else {
              g.users = cloudSync.mergeUsers(g.users || [], []);
            }
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

  const INVITATIONS_STORAGE_KEY = 'ajedrez_junvill_family_invitations_v1';
  const MESSAGES_STORAGE_KEY = 'ajedrez_junvill_family_messages_v1';
  const PRESENCE_LOCAL_PREFIX = 'junvill_presence_';

  // 3.1 PRESENCIA EN LÍNEA EN TIEMPO REAL
  const [presenceHeartbeats, setPresenceHeartbeats] = useState({});

  // 3.2 MENSAJERÍA FAMILIAR DIRECTA
  const [familyMessages, setFamilyMessages] = useState(() => {
    try {
      const raw = localStorage.getItem('ajedrez_junvill_family_messages_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.slice(-200);
      }
      return [];
    } catch (e) {
      return [];
    }
  });
  const [incomingToast, setIncomingToast] = useState(null);

  // 4. ESTADO DE INVITACIONES / RETOS FAMILIARES ACTIVOS
  const [familyInvitations, setFamilyInvitations] = useState(() => {
    try {
      const saved = localStorage.getItem(INVITATIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const now = Date.now();
          // Mantener invitaciones de menos de 45 minutos
          return parsed.filter(inv => (now - (inv.createdAt || 0)) < 45 * 60 * 1000);
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // Derivaciones limpias y deduplicadas
  const activeGroup = useMemo(() => groups.find(g => g.id === activeGroupId) || groups[0] || DEFAULT_FAMILY_GROUPS[0], [groups, activeGroupId]);
  const isGroupUnlocked = activeGroup ? unlockedGroupIds.includes(activeGroup.id) : false;
  const users = useMemo(() => activeGroup ? cloudSync.mergeUsers(DEFAULT_JUNVILL_USERS, activeGroup.users || []) : DEFAULT_JUNVILL_USERS, [activeGroup]);
  const currentUser = useMemo(() => users.find(u => u.id === activeUserId || normalizeUserKey(u.id || u.name) === normalizeUserKey(activeUserId)) || users[0] || DEFAULT_JUNVILL_USERS[0], [users, activeUserId]);

  // Sincronización en tiempo real de invitaciones, mensajes y presencia entre pestañas y dispositivos
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === INVITATIONS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setFamilyInvitations(parsed);
        } catch (err) {}
      } else if (e.key === MESSAGES_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setFamilyMessages(parsed);
        } catch (err) {}
      } else if (e.key && e.key.startsWith('junvill_presence_') && e.newValue) {
        const userId = e.key.replace('junvill_presence_', '');
        setPresenceHeartbeats(prev => ({ ...prev, [userId]: parseInt(e.newValue, 10) }));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Emisión periódica de presencia activa (Heartbeat)
  useEffect(() => {
    if (!currentUser?.id) return;
    const targetIds = (users || []).map(u => u.id).filter(id => id !== currentUser.id);

    try {
      localStorage.setItem(`junvill_presence_${currentUser.id}`, Date.now().toString());
    } catch (e) {}

    familySignaling.broadcastHeartbeat(currentUser.id, {
      userName: currentUser.name,
      avatar: currentUser.avatar,
      avatarConfig: currentUser.avatarConfig
    }, targetIds);

    const timer = setInterval(() => {
      try {
        localStorage.setItem(`junvill_presence_${currentUser.id}`, Date.now().toString());
      } catch (e) {}

      familySignaling.broadcastHeartbeat(currentUser.id, {
        userName: currentUser.name,
        avatar: currentUser.avatar,
        avatarConfig: currentUser.avatarConfig
      }, targetIds);
    }, 6000);

    return () => clearInterval(timer);
  }, [currentUser?.id, users]);

  // 5. SEÑALIZACIÓN ENTRE DISPOSITIVOS EN TIEMPO REAL (PeerJS Global)
  useEffect(() => {
    if (!currentUser?.id) return;

    familySignaling.init(currentUser.id, {
      onReceiveInvitation: (incomingInvitation) => {
        if (!incomingInvitation) return;
        try { audioManager.playVictory(); } catch (e) {}

        // Verificar si yo ya le había enviado un reto a ese mismo usuario (Reto mutuo simultáneo)
        const myPendingToOpponent = familyInvitations.find(inv =>
          inv.status === 'pending' &&
          (inv.fromUser?.id === currentUser.id || (inv.fromUser?.name || '').toLowerCase() === (currentUser.name || '').toLowerCase()) &&
          (inv.toUserId === incomingInvitation.fromUser?.id || (inv.toUserName || '').toLowerCase() === (incomingInvitation.fromUser?.name || '').toLowerCase())
        );

        if (myPendingToOpponent) {
          // Ambos se retaron al tiempo: gana el reto con createdAt menor (el primero en crearse)
          const isMyOlder = (myPendingToOpponent.createdAt || 0) <= (incomingInvitation.createdAt || Infinity);
          const winnerInvitation = isMyOlder ? myPendingToOpponent : incomingInvitation;

          window.dispatchEvent(new CustomEvent('junvill_mutual_match', {
            detail: {
              roomId: winnerInvitation.roomId,
              opponent: incomingInvitation.fromUser,
              invitation: winnerInvitation,
              isHost: isMyOlder
            }
          }));
        }

        setFamilyInvitations(prev => {
          const filtered = prev.filter(i => i.id !== incomingInvitation.id && i.roomId !== incomingInvitation.roomId);
          const updated = [incomingInvitation, ...filtered];
          try { localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(updated)); } catch (e) {}
          return updated;
        });
      },
      onInvitationStatusChange: (invitationId, status) => {
        if (status === 'accepted' || status === 'declined') {
          setFamilyInvitations(prev => {
            const updated = prev.filter(i => i.id !== invitationId);
            try { localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(updated)); } catch (e) {}
            return updated;
          });
        }
      },
      onProgressUpdate: (incomingGroupData) => {
        if (!incomingGroupData || !incomingGroupData.users) return;
        setGroups(prev => {
          const targetId = incomingGroupData.id || 'group_junvill';
          const nextGroups = prev.map(g => {
            if (g.id === targetId) {
              const mergedUsers = cloudSync.mergeUsers(g.users, incomingGroupData.users);
              return { ...g, ...incomingGroupData, users: mergedUsers, updatedAt: Date.now() };
            }
            return g;
          });
          try { localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(nextGroups)); } catch (e) {}
          return nextGroups;
        });
      },
      onHeartbeat: (senderUserId, payload) => {
        const now = Date.now();
        const normKey = normalizeUserKey(senderUserId);
        setPresenceHeartbeats(prev => ({
          ...prev,
          [senderUserId]: now,
          [normKey]: now,
          [`user_${normKey}`]: now
        }));
        try {
          localStorage.setItem(`junvill_presence_${senderUserId}`, now.toString());
          localStorage.setItem(`junvill_presence_${normKey}`, now.toString());
        } catch (e) {}
      },
      onMessage: (msg) => {
        if (!msg) return;
        try { audioManager.playMove(); } catch (e) {}
        setFamilyMessages(prev => {
          const updated = [...prev, msg];
          try { localStorage.setItem('ajedrez_junvill_family_messages_v1', JSON.stringify(updated.slice(-200))); } catch (e) {}
          return updated;
        });
      }
    });
  }, [currentUser?.id, familyInvitations]);

  // 6. PARTIDA FAMILIAR P2P EN CURSO
  const ONGOING_P2P_KEY = `junvill_ongoing_p2p_game_v1_${currentUser?.id || 'default'}`;
  const [activeP2PGame, setActiveP2PGame] = useState(() => {
    try {
      const raw = localStorage.getItem(`junvill_ongoing_p2p_game_v1_${activeUserId || 'default'}`);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  });

  const saveActiveP2PGame = useCallback((gameData) => {
    try {
      const key = `junvill_ongoing_p2p_game_v1_${currentUser?.id || 'default'}`;
      if (!gameData) {
        localStorage.removeItem(key);
        setActiveP2PGame(null);
      } else {
        localStorage.setItem(key, JSON.stringify(gameData));
        setActiveP2PGame(gameData);

        // Sincronizar inmediatamente la partida activa en la nube para juego asíncrono
        if (activeGroup) {
          const currentMatches = Array.isArray(activeGroup.activeMatches) ? activeGroup.activeMatches : [];
          const updatedMatches = [
            gameData,
            ...currentMatches.filter(m => m.roomId !== gameData.roomId)
          ];
          cloudSync.pushGroupToCloud({
            ...activeGroup,
            activeMatches: updatedMatches,
            updatedAt: Date.now()
          }, activeGroupId || 'group_junvill').catch(() => {});
        }
      }
    } catch (e) {}
  }, [currentUser?.id, activeGroup, activeGroupId]);

  const clearActiveP2PGame = useCallback((targetRoomId = null) => {
    try {
      const key = `junvill_ongoing_p2p_game_v1_${currentUser?.id || 'default'}`;
      localStorage.removeItem(key);
      setActiveP2PGame(null);

      if (activeGroup) {
        const currentMatches = Array.isArray(activeGroup.activeMatches) ? activeGroup.activeMatches : [];
        const filteredMatches = targetRoomId 
          ? currentMatches.filter(m => m.roomId !== targetRoomId)
          : currentMatches.filter(m => m.roomId !== activeP2PGame?.roomId);
        cloudSync.pushGroupToCloud({
          ...activeGroup,
          activeMatches: filteredMatches,
          updatedAt: Date.now()
        }, activeGroupId || 'group_junvill').catch(() => {});
      }
    } catch (e) {}
  }, [currentUser?.id, activeGroup, activeGroupId, activeP2PGame?.roomId]);

  // Invitaciones dirigidas al usuario actual (Entrantes infalibles normalizadas)
  const pendingInvitationsForMe = familyInvitations.filter(inv => {
    if (inv.status !== 'pending' || !currentUser) return false;
    const myKey = normalizeUserKey(currentUser.name || currentUser.id);
    const targetKey = normalizeUserKey(inv.toUserName || inv.toUserId);
    const fromKey = normalizeUserKey(inv.fromUser?.name || inv.fromUser?.id);
    return myKey === targetKey && myKey !== fromKey;
  });

  // Invitaciones enviadas por el usuario actual (Salientes en espera)
  const outgoingInvitationsByMe = familyInvitations.filter(inv => {
    if (inv.status !== 'pending' || !currentUser) return false;
    const myKey = normalizeUserKey(currentUser.name || currentUser.id);
    const fromKey = normalizeUserKey(inv.fromUser?.name || inv.fromUser?.id);
    return myKey === fromKey;
  });

  // Helper para consultar si un familiar está conectado en tiempo real (Multi-fuente: WebRTC + LocalStorage + Cloud)
  const isUserOnline = useCallback((userIdOrUser) => {
    if (!userIdOrUser) return false;
    const userId = typeof userIdOrUser === 'string' ? userIdOrUser : userIdOrUser.id;
    const userName = typeof userIdOrUser === 'object' ? userIdOrUser.name : '';

    if (userId === currentUser?.id || normalizeUserKey(userId) === normalizeUserKey(currentUser?.id)) {
      return true;
    }

    const normKey = normalizeUserKey(userName || userId);
    const lastHbTime = Math.max(
      presenceHeartbeats[userId] || 0,
      presenceHeartbeats[normKey] || 0,
      presenceHeartbeats[`user_${normKey}`] || 0
    );

    let localTime = 0;
    try {
      localTime = Math.max(
        parseInt(localStorage.getItem(`junvill_presence_${userId}`) || '0', 10),
        parseInt(localStorage.getItem(`junvill_presence_${normKey}`) || '0', 10),
        parseInt(localStorage.getItem(`junvill_presence_user_${normKey}`) || '0', 10)
      );
    } catch (e) {}

    let cloudLastActive = 0;
    if (typeof userIdOrUser === 'object' && userIdOrUser.lastActiveTimestamp) {
      cloudLastActive = userIdOrUser.lastActiveTimestamp;
    } else {
      const found = (users || []).find(u => u.id === userId || normalizeUserKey(u.name || u.id) === normKey);
      if (found?.lastActiveTimestamp) {
        cloudLastActive = found.lastActiveTimestamp;
      }
    }

    const userObjUpdatedAt = (typeof userIdOrUser === 'object' && userIdOrUser.updatedAt) ? userIdOrUser.updatedAt : 0;
    const mostRecent = Math.max(lastHbTime, localTime, cloudLastActive, userObjUpdatedAt);
    // Considerar en línea si se ha comunicado en los últimos 5 minutos (300s) para soportar navegación y móviles
    return (Date.now() - mostRecent) < 300000;
  }, [currentUser?.id, presenceHeartbeats, users]);

  // Enviar Mensaje Directo a un familiar
  const sendFamilyMessage = useCallback((toUser, text, isEmote = false) => {
    if (!currentUser || !toUser || !text) return null;
    const msgObj = {
      id: `fmsg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      fromUser: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        avatarConfig: currentUser.avatarConfig
      },
      toUserId: toUser.id,
      toUserName: toUser.name,
      text: String(text).trim(),
      isEmote: !!isEmote,
      timestamp: Date.now(),
      read: true
    };

    setFamilyMessages(prev => {
      const updated = [...prev, msgObj];
      try {
        localStorage.setItem('ajedrez_junvill_family_messages_v1', JSON.stringify(updated.slice(-200)));
      } catch (e) {}
      return updated;
    });

    familySignaling.sendMessage(toUser.id, msgObj);
    return msgObj;
  }, [currentUser]);

  const markMessagesAsRead = useCallback((withUserId) => {
    setFamilyMessages(prev => {
      const updated = prev.map(m => (m.fromUser?.id === withUserId && !m.read) ? { ...m, read: true } : m);
      try {
        localStorage.setItem('ajedrez_junvill_family_messages_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const unreadMessagesCount = familyMessages.filter(m => m.toUserId === currentUser?.id && !m.read).length;

  // Enviar / Crear Reto Familiar (con soporte para minijuegos y variantes)
  const sendFamilyInvitation = (
    toUser, 
    timeControl = 300, 
    withAssistance = true, 
    customRoomId = null,
    gameVariant = 'standard',
    customMessage = '',
    handicapConfig = null
  ) => {
    if (!currentUser || !toUser) return null;

    // 1. DETECCIÓN DE RETO MUTUO: Si el otro usuario ya te envió una invitación pendiente
    const existingOpponentInvitation = familyInvitations.find(inv => 
      inv.status === 'pending' && 
      (inv.fromUser?.id === toUser.id || (inv.fromUser?.name || '').toLowerCase() === (toUser.name || '').toLowerCase()) &&
      (inv.toUserId === currentUser.id || (inv.toUserName || '').toLowerCase() === (currentUser.name || '').toLowerCase())
    );

    if (existingOpponentInvitation) {
      // ¡Emparejamiento mutuo inmediato! Aceptar la sala y condiciones del rival que retó primero
      acceptFamilyInvitation(existingOpponentInvitation.id);

      window.dispatchEvent(new CustomEvent('junvill_mutual_match', {
        detail: {
          roomId: existingOpponentInvitation.roomId,
          opponent: existingOpponentInvitation.fromUser,
          invitation: existingOpponentInvitation,
          isHost: false
        }
      }));

      return {
        ...existingOpponentInvitation,
        isMutualMatch: true
      };
    }

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randCode = '';
    for (let i = 0; i < 4; i++) {
      randCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newRoomId = customRoomId || `JUN${randCode}`;

    const invitation = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      roomId: newRoomId,
      groupId: activeGroupId || 'group_junvill',
      fromUser: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        avatarConfig: currentUser.avatarConfig,
        elo: currentUser.elo || 600,
        role: currentUser.role || 'student'
      },
      toUserId: toUser.id,
      toUserName: toUser.name,
      timeControl: timeControl || 300,
      withAssistance: withAssistance !== false,
      gameVariant: gameVariant || 'standard',
      customMessage: customMessage || '',
      handicapConfig: handicapConfig || null,
      createdAt: Date.now(),
      status: 'pending'
    };

    setFamilyInvitations(prev => {
      const filtered = prev.filter(i => !(i.fromUser?.id === currentUser.id && i.toUserId === toUser.id));
      const updated = [invitation, ...filtered];
      try {
        localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Enviar a la nube central para sincronización inmediata cross-device
    if (activeGroup) {
      cloudSync.pushGroupToCloud({
        ...activeGroup,
        activeInvitations: [invitation, ...familyInvitations.filter(i => !(i.fromUser?.id === currentUser.id && i.toUserId === toUser.id))],
        updatedAt: Date.now()
      }, activeGroupId || 'group_junvill').catch(() => {});
    }

    // Notificar instantáneamente al dispositivo del rival por PeerJS
    familySignaling.sendInvitation(toUser.id, invitation);

    return invitation;
  };

  // Aceptar Reto Familiar
  const acceptFamilyInvitation = (invitationId) => {
    const inv = familyInvitations.find(i => i.id === invitationId);
    if (!inv) return null;

    const remainingInvs = familyInvitations.filter(i => i.id !== invitationId);
    setFamilyInvitations(remainingInvs);
    try {
      localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(remainingInvs));
    } catch (e) {}

    if (activeGroup) {
      cloudSync.pushGroupToCloud({
        ...activeGroup,
        activeInvitations: remainingInvs,
        updatedAt: Date.now()
      }, activeGroupId || 'group_junvill').catch(() => {});
    }

    if (inv?.fromUser?.id) {
      familySignaling.sendStatus(inv.fromUser.id, invitationId, 'accepted');
    }

    return inv;
  };

  // Rechazar Reto Familiar
  const declineFamilyInvitation = (invitationId) => {
    const inv = familyInvitations.find(i => i.id === invitationId);
    const remainingInvs = familyInvitations.filter(i => i.id !== invitationId);
    setFamilyInvitations(remainingInvs);
    try {
      localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(remainingInvs));
    } catch (e) {}

    if (activeGroup) {
      cloudSync.pushGroupToCloud({
        ...activeGroup,
        activeInvitations: remainingInvs,
        updatedAt: Date.now()
      }, activeGroupId || 'group_junvill').catch(() => {});
    }

    if (inv?.fromUser?.id) {
      familySignaling.sendStatus(inv.fromUser.id, invitationId, 'declined');
    }
  };

  const [isRefreshingInvitations, setIsRefreshingInvitations] = useState(false);

  // Búsqueda Manual e Inmediata de Retos e Invitaciones (Nube + Señalización WebRTC)
  const refreshInvitationsNow = async () => {
    setIsRefreshingInvitations(true);
    try {
      // 1. Consultar Nube Central de inmediato
      const cloudData = await cloudSync.fetchCloudGroup(activeGroupId || 'group_junvill');
      if (cloudData && Array.isArray(cloudData.activeInvitations)) {
        const now = Date.now();
        setFamilyInvitations(prev => {
          const combined = [...cloudData.activeInvitations, ...prev];
          const map = new Map();
          combined.forEach(inv => {
            if (inv && inv.id) map.set(inv.id, inv);
          });
          const updated = Array.from(map.values()).filter(inv => (now - (inv.createdAt || 0)) < 600000);
          try { localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(updated)); } catch (e) {}
          return updated;
        });
      }

      // 2. Transmitir latido de búsqueda por WebRTC
      if (currentUser?.id && users) {
        const otherUserIds = users.filter(u => u.id !== currentUser.id).map(u => u.id);
        familySignaling.broadcastHeartbeat(currentUser.id, { action: 'SEARCH_INVITATIONS', timestamp: Date.now() }, otherUserIds);
      }
      
      // 3. Audio de feedback sutil
      try { audioManager.playMove(); } catch (e) {}
    } catch (e) {
      console.warn('Error al refrescar retos:', e);
    } finally {
      setTimeout(() => setIsRefreshingInvitations(false), 700);
    }
  };

  // Sincronización continua de estado con localStorage / sessionStorage
  useEffect(() => {
    try {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
      localStorage.setItem(ACTIVE_GROUP_KEY, activeGroupId || 'group_junvill');
      sessionStorage.setItem(UNLOCKED_GROUPS_KEY, JSON.stringify(unlockedGroupIds));
      localStorage.setItem(ACTIVE_USER_KEY, activeUserId || '');
    } catch (e) {}
  }, [groups, activeGroupId, unlockedGroupIds, activeUserId]);

  // Refs para sincronización estable sin bucles infinitos de re-render
  const activeGroupRef = useRef(activeGroup);
  activeGroupRef.current = activeGroup;
  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;
  const familyInvitationsRef = useRef(familyInvitations);
  familyInvitationsRef.current = familyInvitations;
  const activeP2PGameRef = useRef(activeP2PGame);
  activeP2PGameRef.current = activeP2PGame;

  // 7. SINCRONIZACIÓN PERIÓDICA CON LA BASE DE DATOS CENTRAL EN LA NUBE (Latidos en vivo y presencia)
  useEffect(() => {
    const cleanup = cloudSync.startPeriodicSync(
      () => {
        const curGroup = activeGroupRef.current;
        if (!curGroup) return null;
        const now = Date.now();
        const curUser = currentUserRef.current;
        const curInvs = familyInvitationsRef.current || [];
        const curP2P = activeP2PGameRef.current;

        const updatedUsers = (curGroup.users || []).map(u => {
          if (curUser && (u.id === curUser.id || normalizeUserKey(u.name || u.id) === normalizeUserKey(curUser.name || curUser.id))) {
            return { ...u, lastActiveTimestamp: now, updatedAt: Math.max(u.updatedAt || 0, now) };
          }
          return u;
        });
        return { 
          ...curGroup, 
          users: updatedUsers, 
          activeInvitations: curInvs.filter(inv => (now - (inv.createdAt || 0)) < 600000),
          activeMatches: curP2P ? [curP2P] : (curGroup.activeMatches || []),
          updatedAt: now 
        };
      },
      (updatedCloudGroup) => {
        if (!updatedCloudGroup || !updatedCloudGroup.id) return;
        
        // Sincronizar retos recibidos en la nube
        if (Array.isArray(updatedCloudGroup.activeInvitations)) {
          const now = Date.now();
          setFamilyInvitations(prev => {
            const combined = [...updatedCloudGroup.activeInvitations, ...prev];
            const map = new Map();
            combined.forEach(inv => {
              if (inv && inv.id) map.set(inv.id, inv);
            });
            const updated = Array.from(map.values()).filter(inv => (now - (inv.createdAt || 0)) < 600000);
            try { localStorage.setItem(INVITATIONS_STORAGE_KEY, JSON.stringify(updated)); } catch (e) {}
            return updated;
          });
        }

        // Sincronizar partidas activas / asíncronas
        const curUser = currentUserRef.current;
        if (Array.isArray(updatedCloudGroup.activeMatches) && curUser) {
          const myKey = normalizeUserKey(curUser.name || curUser.id);
          const myMatch = updatedCloudGroup.activeMatches.find(m => {
            const oppKey = normalizeUserKey(m.opponent?.name || m.opponent?.id || '');
            const whiteKey = normalizeUserKey(m.playerWhite?.name || m.playerWhite?.id || '');
            const blackKey = normalizeUserKey(m.playerBlack?.name || m.playerBlack?.id || '');
            return (whiteKey === myKey || blackKey === myKey || oppKey === myKey || m.userId === curUser.id);
          });
          const curP2P = activeP2PGameRef.current;
          if (myMatch && (!curP2P || (myMatch.updatedAt || 0) > (curP2P.updatedAt || 0))) {
            setActiveP2PGame(myMatch);
            try {
              localStorage.setItem(`junvill_ongoing_p2p_game_v1_${curUser.id}`, JSON.stringify(myMatch));
            } catch (e) {}
          }
        }

        setGroups(prev => {
          const exists = prev.some(g => g.id === updatedCloudGroup.id);
          let nextGroups;
          if (exists) {
            nextGroups = prev.map(g => g.id === updatedCloudGroup.id ? updatedCloudGroup : g);
          } else {
            nextGroups = [...prev, updatedCloudGroup];
          }
          try {
            localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(nextGroups));
          } catch (e) {}
          return nextGroups;
        });
      },
      3500
    );

    return cleanup;
  }, [activeGroupId]);

  // Actualizar usuarios dentro del grupo activo (o grupo específico) de forma atómica y síncrona
  const setUsersForActiveGroup = (updater, targetGroupId = null) => {
    const targetId = targetGroupId || activeGroupId || 'group_junvill';
    setGroups(prev => {
      const updated = prev.map(g => {
        if (g.id === targetId) {
          const currentUsers = Array.isArray(g.users) ? g.users : [];
          const nextUsers = typeof updater === 'function' ? updater(currentUsers) : updater;
          const updatedG = { ...g, users: nextUsers };
          // Enviar inmediatamente a la base de datos central en la nube
          cloudSync.pushGroupToCloud(updatedG, targetId).catch(() => {});
          return updatedG;
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
    const normKey = normalizeUserKey(userId);
    const now = Date.now();

    setGroups(prev => {
      const updated = prev.map(g => {
        if (g.id === effectiveGroupId) {
          let userFound = false;
          const currentUsers = Array.isArray(g.users) && g.users.length > 0 ? g.users : DEFAULT_JUNVILL_USERS;
          const updatedUsers = currentUsers.map(u => {
            if (u.id === userId || normalizeUserKey(u.id || u.name) === normKey) {
              userFound = true;
              return { ...u, ...updates, updatedAt: now };
            }
            return u;
          });

          if (!userFound) {
            const baseUser = DEFAULT_JUNVILL_USERS.find(du => du.id === userId || normalizeUserKey(du.id || du.name) === normKey) || { id: userId, name: userId };
            updatedUsers.push({ ...baseUser, ...updates, updatedAt: now });
          }

          const deduplicated = deduplicateAndMergeUsers(DEFAULT_JUNVILL_USERS, updatedUsers);
          const updatedG = { ...g, users: deduplicated, updatedAt: now };
          cloudSync.pushGroupToCloud(updatedG, effectiveGroupId).catch(() => {});
          try {
            familySignaling.broadcastProgressUpdate(updatedG, deduplicated.map(u => u.id));
          } catch (e) {}
          return updatedG;
        }
        return g;
      });
      try {
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const forceCloudSync = async () => {
    try {
      const currentG = activeGroup;
      if (!currentG) return { success: false, message: 'No hay grupo familiar activo' };
      const cloudG = await cloudSync.fetchCloudGroup(currentG.id);
      if (cloudG && cloudG.users && Array.isArray(cloudG.users)) {
        const mergedUsers = cloudSync.mergeUsers(currentG.users, cloudG.users);
        const mergedG = { ...currentG, ...cloudG, users: mergedUsers, updatedAt: Date.now() };
        setGroups(prev => {
          const next = prev.map(g => g.id === mergedG.id ? mergedG : g);
          try { localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
          return next;
        });
        await cloudSync.pushGroupToCloud(mergedG, currentG.id);
        try { audioManager?.playVictory?.(); } catch (e) {}
        return { success: true, message: '¡Avance sincronizado con éxito desde la Nube Central!', data: mergedG };
      } else {
        await cloudSync.pushGroupToCloud(currentG, currentG.id);
        return { success: true, message: '¡Avance local respaldado exitosamente en la Nube Central!', data: currentG };
      }
    } catch (e) {
      return { success: false, message: 'No se pudo conectar con la Nube Central: ' + e.message };
    }
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

    const completedCount = Object.values(updatedProgress).filter(p => p.completed || p.stars >= 5).length;

    const newRadar = { ...(currentUser.radarSkills || {}) };
    if (category && newRadar[category] !== undefined) {
      newRadar[category] = Math.min(100, newRadar[category] + (pointsDiff * 2));
    }

    editUser(currentUser.id, {
      totalPoints: completedCount,
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
      forceCloudSync,
      exportSaveData,
      importSaveData,
      resetUserData,
      serverMetrics,
      familyInvitations,
      pendingInvitationsForMe,
      outgoingInvitationsByMe,
      sendFamilyInvitation,
      acceptFamilyInvitation,
      declineFamilyInvitation,
      activeP2PGame,
      saveActiveP2PGame,
      clearActiveP2PGame,
      isUserOnline,
      familyMessages,
      sendFamilyMessage,
      markMessagesAsRead,
      unreadMessagesCount,
      refreshInvitationsNow,
      isRefreshingInvitations,
      incomingToast,
      setIncomingToast
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
