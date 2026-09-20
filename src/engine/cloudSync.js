import { hashPassword, SECURE_DEFAULT_PASSWORD_HASH } from './cryptoAuth';

export function normalizeUserKey(nameOrId = '') {
  const str = String(nameOrId).toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
  if (str.includes('martin')) return 'martin';
  if (str.includes('leti')) return 'leti';
  if (str.includes('cesar')) return 'cesar';
  if (str.includes('estudiante') || str.includes('student')) return 'estudiante';
  return str || 'unknown';
}

export function getFenMoveCount(fen) {
  if (!fen || typeof fen !== 'string') return 0;
  const parts = fen.trim().split(/\s+/);
  if (parts.length < 2) return 0;
  const turn = parts[1];
  const fullMove = parseInt(parts[5], 10) || 1;
  return turn === 'b' ? (fullMove - 1) * 2 + 1 : (fullMove - 1) * 2;
}

export function recoverAllLocalUsersFromStorage() {
  const recoveredUsers = [];
  try {
    if (typeof localStorage === 'undefined') return [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (
        key.startsWith('ajedrez_junvill_') ||
        key.startsWith('junvill_') ||
        key.includes('user') ||
        key.includes('group')
      ) {
        try {
          const raw = localStorage.getItem(key);
          if (!raw || (!raw.trim().startsWith('{') && !raw.trim().startsWith('['))) continue;
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach(item => {
              if (item && item.users && Array.isArray(item.users)) {
                recoveredUsers.push(...item.users);
              } else if (item && (item.id || item.name) && (item.lessonProgress || item.stars !== undefined || item.elo)) {
                recoveredUsers.push(item);
              }
            });
          } else if (parsed && typeof parsed === 'object') {
            if (parsed.users && Array.isArray(parsed.users)) {
              recoveredUsers.push(...parsed.users);
            } else if ((parsed.id || parsed.name) && (parsed.lessonProgress || parsed.stars !== undefined || parsed.elo)) {
              recoveredUsers.push(parsed);
            }
          }
        } catch (e) {}
      }
    }
  } catch (e) {}
  return recoveredUsers;
}

export function deduplicateAndMergeUsers(...userLists) {
  const allUsers = userLists.flat().filter(Boolean);
  const buckets = new Map();

  allUsers.forEach(u => {
    if (!u) return;
    const key = normalizeUserKey(u.name || u.id);
    if (!buckets.has(key)) {
      buckets.set(key, []);
    }
    buckets.get(key).push(u);
  });

  const merged = [];

  buckets.forEach((userVariants, key) => {
    // Ordenar variantes para que las ediciones más recientes tengan prioridad absoluta
    userVariants.sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));
    const latestUser = userVariants[userVariants.length - 1] || userVariants[0];

    const existingId = userVariants.find(u => u.id)?.id;
    let canonicalId = existingId || `user_${key}`;
    let canonicalName = latestUser.name || userVariants[0].name || key;
    let canonicalRole = latestUser.role || userVariants[0].role || 'student';

    if (key === 'martin') {
      canonicalId = 'user_martin';
      canonicalName = 'Martin';
      canonicalRole = 'student';
    } else if (key === 'leti') {
      canonicalId = 'user_leti';
      canonicalName = 'Leti';
      canonicalRole = 'student';
    } else if (key === 'cesar') {
      canonicalId = 'user_cesar';
      canonicalName = 'César';
      canonicalRole = 'parent';
    } else if (key === 'estudiante') {
      canonicalId = 'user_estudiante';
      canonicalName = 'Estudiante Junvill';
      canonicalRole = 'student';
    }

    const mergedLessons = {};
    const mergedBotVictories = {};
    const mergedRadar = { tactica: 20, estrategia: 20, posicional: 20, calculo: 20, aperturas: 20, finales: 20 };
    const mergedStats = { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, puzzlesSolved: 0, hintsUsed: 0, accuracyAvg: 80 };
    let maxElo = 0;
    let maxPuzzleRating = 0;
    let maxStars = 0;
    let maxGems = 0;
    let title = latestUser.title || (canonicalRole === 'parent' ? 'Tutor Familiar' : 'Campeón Junior');
    let passwordHash = latestUser.passwordHash || (latestUser.password ? hashPassword(latestUser.password) : SECURE_DEFAULT_PASSWORD_HASH);
    let theme = latestUser.theme || 'modern_dark';
    let boardTheme = latestUser.boardTheme || 'board_emerald';
    let pieceTheme = latestUser.pieceTheme || 'staunton';
    let maxLastActive = 0;
    let latestAvatarConfig = latestUser.avatarConfig || null;
    let latestCoachSettings = latestUser.coachSettings || null;
    let latestSystemSettings = latestUser.systemSettings || null;
    let maxUpdatedAt = 0;
    const allUnlocked = new Set();

    userVariants.forEach(u => {
      const uTime = u.updatedAt || 0;
      if (u.elo && u.elo > maxElo) maxElo = u.elo;
      if (u.puzzleRating && u.puzzleRating > maxPuzzleRating) maxPuzzleRating = u.puzzleRating;
      if (u.stars !== undefined && u.stars > maxStars) maxStars = u.stars;
      if (u.gems !== undefined && u.gems > maxGems) maxGems = u.gems;
      
      if (u.avatarConfig && Object.keys(u.avatarConfig).length > 2) {
        if (!latestAvatarConfig || uTime >= maxUpdatedAt || uTime === 0) {
          latestAvatarConfig = { ...u.avatarConfig };
        }
      }
      if (u.title && u.title !== 'Novato Promesa') title = u.title;
      if (u.passwordHash) passwordHash = u.passwordHash;
      else if (u.password) passwordHash = hashPassword(u.password);
      if (u.theme) theme = u.theme;
      if (u.boardTheme) boardTheme = u.boardTheme;
      if (u.pieceTheme) pieceTheme = u.pieceTheme;
      if (u.coachSettings) latestCoachSettings = { ...u.coachSettings };
      if (u.systemSettings) latestSystemSettings = { ...u.systemSettings };
      if (uTime > maxUpdatedAt) maxUpdatedAt = uTime;
      if (u.lastActiveTimestamp && u.lastActiveTimestamp > maxLastActive) maxLastActive = u.lastActiveTimestamp;

      if (Array.isArray(u.unlockedItems)) {
        u.unlockedItems.forEach(item => allUnlocked.add(item));
      }

      // Fusionar lecciones acumuladas
      Object.entries(u.lessonProgress || {}).forEach(([lid, prog]) => {
        if (!mergedLessons[lid] || (prog.stars || 0) > (mergedLessons[lid].stars || 0)) {
          mergedLessons[lid] = {
            stars: Math.max(prog.stars || 0, mergedLessons[lid]?.stars || 0),
            completed: Boolean(prog.completed || mergedLessons[lid]?.completed || (prog.stars || 0) >= 5),
            updatedAt: Math.max(prog.updatedAt || 0, mergedLessons[lid]?.updatedAt || 0)
          };
        }
      });

      // Fusionar bots derrotados
      Object.entries(u.botVictories || {}).forEach(([botId, vicCount]) => {
        mergedBotVictories[botId] = Math.max(vicCount || 0, mergedBotVictories[botId] || 0);
      });

      // Fusionar radar
      Object.entries(u.radarSkills || {}).forEach(([cat, val]) => {
        mergedRadar[cat] = Math.max(val || 0, mergedRadar[cat] || 0);
      });

      // Fusionar estadísticas
      if (u.stats) {
        mergedStats.gamesPlayed = Math.max(mergedStats.gamesPlayed, u.stats.gamesPlayed || 0);
        mergedStats.wins = Math.max(mergedStats.wins, u.stats.wins || 0);
        mergedStats.losses = Math.max(mergedStats.losses, u.stats.losses || 0);
        mergedStats.draws = Math.max(mergedStats.draws, u.stats.draws || 0);
        mergedStats.puzzlesSolved = Math.max(mergedStats.puzzlesSolved, u.stats.puzzlesSolved || 0);
        mergedStats.hintsUsed = Math.max(mergedStats.hintsUsed, u.stats.hintsUsed || 0);
        mergedStats.accuracyAvg = Math.max(mergedStats.accuracyAvg, u.stats.accuracyAvg || 0);
      }
    });

    const completedCount = Object.values(mergedLessons).filter(p => p.completed || p.stars >= 5).length;
    const finalUnlocked = allUnlocked.size > 0 ? Array.from(allUnlocked) : ['board_emerald', 'board_wood', 'shirt_blue', 'shirt_green'];

    merged.push({
      id: canonicalId,
      name: canonicalName,
      lastActiveTimestamp: maxLastActive,
      passwordHash,
      role: canonicalRole,
      avatar: 'custom_dynamic',
      avatarConfig: latestAvatarConfig || {
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
        accessory: 'none',
        background: 'cyber_grid'
      },
      title,
      elo: maxElo || (canonicalRole === 'parent' ? 762 : 800),
      puzzleRating: maxPuzzleRating || 400,
      stars: maxStars || 0,
      gems: maxGems || 0,
      totalPoints: completedCount,
      theme,
      boardTheme,
      pieceTheme,
      systemSettings: latestSystemSettings || {
        soundEnabled: true,
        soundVolume: 85,
        autoQueen: true,
        showCoordinates: true,
        highlightMoves: true,
        highlightLastMove: true,
        moveMethod: 'drag_click'
      },
      unlockedItems: finalUnlocked,
      lessonProgress: mergedLessons,
      botVictories: mergedBotVictories,
      stats: mergedStats,
      radarSkills: mergedRadar,
      coachSettings: latestCoachSettings || { assistanceLevel: 'full', botDifficulty: 1, coachAvatar: 'coach_aurelio', soundEnabled: true },
      updatedAt: maxUpdatedAt || Date.now()
    });
  });

  const order = ['cesar', 'leti', 'martin', 'estudiante'];
  merged.sort((a, b) => {
    const ka = normalizeUserKey(a.name || a.id);
    const kb = normalizeUserKey(b.name || b.id);
    const ia = order.indexOf(ka);
    const ib = order.indexOf(kb);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return (a.name || '').localeCompare(b.name || '');
  });

  return merged;
}

/**
 * Motor de Sincronización en la Nube Centralizada (Cloud Synchronization Engine)
 * Sincroniza el avance de lecciones, estrellas, gemas y usuarios de la Familia Junvill
 * en tiempo real entre múltiples dispositivos (tablets, smartphones, laptops y PCs).
 */

const CLOUD_STORAGE_BASE = 'https://api.cl1p.net/ajedrez_junvill_cloud_sync_';

function createTimeoutSignal(ms) {
  try {
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
      return AbortSignal.timeout(ms);
    }
  } catch (e) {}
  try {
    if (typeof AbortController !== 'undefined') {
      const controller = new AbortController();
      setTimeout(() => {
        try { controller.abort(); } catch (e) {}
      }, ms);
      return controller.signal;
    }
  } catch (e) {}
  return undefined;
}

class CloudSyncService {
  constructor() {
    this.syncInterval = null;
    this.isSyncing = false;
    this.lastSyncTime = 0;
    this.listeners = new Set();
  }

  // Suscribirse a actualizaciones de la nube
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(cb => {
      try {
        cb(data);
      } catch (e) {
        console.error('Error en listener de CloudSync:', e);
      }
    });

    try {
      window.dispatchEvent(new CustomEvent('junvill_cloud_synced', { detail: data }));
    } catch (e) {}
  }

  // Fusión inteligente de usuarios (Merge CRDT sin pérdidas)
  mergeUsers(...userLists) {
    return deduplicateAndMergeUsers(...userLists);
  }

  deduplicateAndMergeUsers(...userLists) {
    return deduplicateAndMergeUsers(...userLists);
  }

  // Obtener estado más reciente desde la Nube Central (/api/sync)
  async fetchCloudGroup(groupId = 'group_junvill') {
    const gid = groupId || 'group_junvill';
    try {
      const signal = createTimeoutSignal(4000);
      const fetchOpts = {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      };
      if (signal) fetchOpts.signal = signal;

      const response = await fetch(`/api/sync?groupId=${encodeURIComponent(gid)}&_t=${Date.now()}`, fetchOpts);

      if (response.ok) {
        const json = await response.json();
        if (json && json.data && json.data.users && Array.isArray(json.data.users)) {
          return json.data;
        }
      }
    } catch (e) {
      // Silencioso
    }
    return null;
  }

  // Guardar y sincronizar estado en la Nube Central (/api/sync)
  async pushGroupToCloud(groupData, groupId = 'group_junvill') {
    if (!groupData) return null;
    this.isSyncing = true;
    const gid = groupId || 'group_junvill';
    const updatedPayload = {
      ...groupData,
      updatedAt: Date.now()
    };
    const payload = {
      groupId: gid,
      groupData: updatedPayload
    };

    try {
      const signal = createTimeoutSignal(4500);
      const fetchOpts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        cache: 'no-store',
        body: JSON.stringify(payload)
      };
      if (signal) fetchOpts.signal = signal;

      const res = await fetch('/api/sync', fetchOpts);
      if (res.ok) {
        this.lastSyncTime = Date.now();
        const resJson = await res.json();
        if (resJson && resJson.data) {
          this.isSyncing = false;
          return resJson.data;
        }
      }
    } catch (e) {
      // Silencioso
    } finally {
      this.isSyncing = false;
    }

    return groupData;
  }

  // Iniciar sincronización periódica automática
  startPeriodicSync(getActiveGroup, onCloudUpdate, intervalMs = 3000) {
    if (this.syncInterval) clearInterval(this.syncInterval);

    const performSync = async () => {
      try {
        const currentGroup = getActiveGroup();
        if (!currentGroup) return;

        // 1. Descargar estado más reciente de la nube
        const cloudGroup = await this.fetchCloudGroup(currentGroup.id);
        let groupToPush = currentGroup;

        if (cloudGroup) {
          // Fusionar usuarios (CRDT)
          const mergedUsers = (cloudGroup.users && Array.isArray(cloudGroup.users))
            ? this.mergeUsers(currentGroup.users, cloudGroup.users)
            : (currentGroup.users || []);

          // Fusionar tombstones acumulados
          const closedRoomIds = new Set([
            ...(Array.isArray(currentGroup.closedRoomIds) ? currentGroup.closedRoomIds : []),
            ...(Array.isArray(currentGroup.deletedMatches) ? currentGroup.deletedMatches : []),
            ...(Array.isArray(cloudGroup.closedRoomIds) ? cloudGroup.closedRoomIds : []),
            ...(Array.isArray(cloudGroup.deletedMatches) ? cloudGroup.deletedMatches : [])
          ].map(r => String(r || '').toUpperCase().replace(/[^A-Z0-9]/g, '')).filter(Boolean));

          const deletedInvIds = new Set([
            ...(Array.isArray(currentGroup.deletedInvitations) ? currentGroup.deletedInvitations : []),
            ...(Array.isArray(currentGroup.dismissedInvitationIds) ? currentGroup.dismissedInvitationIds : []),
            ...(Array.isArray(cloudGroup.deletedInvitations) ? cloudGroup.deletedInvitations : []),
            ...(Array.isArray(cloudGroup.dismissedInvitationIds) ? cloudGroup.dismissedInvitationIds : [])
          ].filter(Boolean));

          // Fusionar retos familiares activos (más recientes primero, sin revivir eliminados)
          const existingInvs = Array.isArray(currentGroup.activeInvitations) ? currentGroup.activeInvitations : [];
          const cloudInvs = Array.isArray(cloudGroup.activeInvitations) ? cloudGroup.activeInvitations : [];
          const now = Date.now();
          const combinedInvs = [...cloudInvs, ...existingInvs].filter(i => {
            if (!i || !i.id) return false;
            if (deletedInvIds.has(i.id)) return false;
            if (i.status && i.status !== 'pending') return false;
            if (i.roomId && closedRoomIds.has(String(i.roomId).toUpperCase().replace(/[^A-Z0-9]/g, ''))) return false;
            return (now - (i.createdAt || 0)) < 300000;
          });
          combinedInvs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          const pairInvMap = new Map();
          const mergedInvs = [];
          combinedInvs.forEach(i => {
            const u1 = i.fromUser?.id || i.fromUser?.name || '';
            const u2 = i.toUserId || i.toUserName || '';
            if (u1 && u2) {
              const pairKey = [String(u1).toLowerCase(), String(u2).toLowerCase()].sort().join('_');
              if (!pairInvMap.has(pairKey)) {
                pairInvMap.set(pairKey, i);
                mergedInvs.push(i);
              }
            } else if (i.id && !mergedInvs.some(prev => prev.id === i.id)) {
              mergedInvs.push(i);
            }
          });

          // Fusionar partidas activas / asíncronas con confirmación mutua en BD (sin revivir eliminadas)
          const existingMatches = Array.isArray(currentGroup.activeMatches) ? currentGroup.activeMatches : [];
          const cloudMatches = Array.isArray(cloudGroup.activeMatches) ? cloudGroup.activeMatches : [];
          const matchMap = new Map();
          [...cloudMatches, ...existingMatches].forEach(m => {
            if (m && m.roomId) {
              const cleanId = String(m.roomId).toUpperCase().replace(/[^A-Z0-9]/g, '');
              if (closedRoomIds.has(cleanId)) return;
              if (m.isGameOver || m.status === 'cancelled' || m.status === 'abandoned' || m.status === 'completed') return;

              const prev = matchMap.get(cleanId);
              if (!prev) {
                const hasGuest = Boolean(m.guestUser);
                const hasHost = Boolean(m.hostUser);
                const hostReady = Boolean(m.hostReady ?? hasHost);
                const guestReady = Boolean(m.guestReady ?? hasGuest);
                const bothConfirmed = Boolean(hasHost && hasGuest && (hostReady || m.hostHeartbeat) && (guestReady || m.guestHeartbeat));
                matchMap.set(cleanId, {
                  ...m,
                  roomId: cleanId,
                  hostUser: m.hostUser || null,
                  guestUser: m.guestUser || null,
                  hostReady,
                  guestReady,
                  hostHeartbeat: m.hostHeartbeat || (hasHost ? Date.now() : 0),
                  guestHeartbeat: m.guestHeartbeat || (hasGuest ? Date.now() : 0),
                  bothConfirmed,
                  connectionState: bothConfirmed ? 'MUTUALLY_CONFIRMED' : (hasGuest ? 'GUEST_JOINED' : 'WAITING_GUEST'),
                  hostColor: m.hostColor || (m.assignedColor === 'black' ? 'black' : 'white'),
                  guestColor: m.guestColor || (m.hostColor === 'black' || m.assignedColor === 'black' ? 'white' : 'black'),
                  assignedColor: m.assignedColor || m.hostColor || 'white',
                  timeControl: (m.timeControl !== undefined && m.timeControl !== null) ? m.timeControl : 300,
                  gameVariant: m.gameVariant || 'standard',
                  handicapConfig: m.handicapConfig || null,
                  status: m.status || (bothConfirmed || hasGuest ? 'active' : 'waiting'),
                  isWaiting: !bothConfirmed && !hasGuest,
                  updatedAt: m.updatedAt || Date.now()
                });
              } else {
                const guest = m.guestUser || prev.guestUser || null;
                const host = m.hostUser || prev.hostUser || null;
                const hostReady = Boolean(m.hostReady ?? prev.hostReady ?? Boolean(host));
                const guestReady = Boolean(m.guestReady ?? prev.guestReady ?? Boolean(guest));
                const hostHeartbeat = Math.max(m.hostHeartbeat || 0, prev.hostHeartbeat || 0, m.hostUser ? Date.now() : 0);
                const guestHeartbeat = Math.max(m.guestHeartbeat || 0, prev.guestHeartbeat || 0, m.guestUser ? Date.now() : 0);
                const isGuestPresent = Boolean(guest);
                const bothConfirmed = Boolean(host && guest && (hostReady || hostHeartbeat > 0) && (guestReady || guestHeartbeat > 0));
                const isStatusActive = bothConfirmed || m.status === 'active' || prev.status === 'active' || isGuestPresent;
                const prevMoveCount = getFenMoveCount(prev.fen);
                const newMoveCount = getFenMoveCount(m.fen);
                let isGameProgressNewer = false;
                if (newMoveCount > prevMoveCount) {
                  isGameProgressNewer = true;
                } else if (newMoveCount < prevMoveCount) {
                  isGameProgressNewer = false;
                } else {
                  if (m.fen && !prev.fen) isGameProgressNewer = true;
                  else if (prev.fen && !m.fen) isGameProgressNewer = false;
                  else isGameProgressNewer = (m.updatedAt || 0) >= (prev.updatedAt || 0);
                }

                const merged = {
                  ...prev,
                  ...m,
                  roomId: cleanId,
                  hostUser: host,
                  guestUser: guest,
                  hostReady,
                  guestReady,
                  hostHeartbeat,
                  guestHeartbeat,
                  bothConfirmed,
                  connectionState: bothConfirmed ? 'MUTUALLY_CONFIRMED' : (isGuestPresent ? 'GUEST_JOINED' : 'WAITING_GUEST'),
                  opponent: m.opponent || prev.opponent || (guest ? guest : null),
                  hostColor: prev.hostColor || m.hostColor || 'white',
                  guestColor: prev.guestColor || m.guestColor || ((prev.hostColor || m.hostColor) === 'black' ? 'white' : 'black'),
                  assignedColor: m.assignedColor || prev.assignedColor || 'white',
                  timeControl: (m.timeControl !== undefined && m.timeControl !== null) ? m.timeControl : (prev.timeControl !== undefined ? prev.timeControl : 300),
                  gameVariant: m.gameVariant || prev.gameVariant || 'standard',
                  handicapConfig: m.handicapConfig || prev.handicapConfig || null,
                  withAssistance: m.withAssistance !== undefined ? m.withAssistance : (prev.withAssistance !== undefined ? prev.withAssistance : true),
                  fen: isGameProgressNewer ? (m.fen || prev.fen) : (prev.fen || m.fen),
                  lastMove: isGameProgressNewer ? (m.lastMove || prev.lastMove) : (prev.lastMove || m.lastMove),
                  lastMoveSenderId: isGameProgressNewer ? (m.lastMoveSenderId || prev.lastMoveSenderId) : (prev.lastMoveSenderId || m.lastMoveSenderId),
                  turn: isGameProgressNewer ? (m.turn || prev.turn) : (prev.turn || m.turn),
                  whiteTime: isGameProgressNewer ? (m.whiteTime ?? prev.whiteTime) : (prev.whiteTime ?? m.whiteTime),
                  blackTime: isGameProgressNewer ? (m.blackTime ?? prev.blackTime) : (prev.blackTime ?? m.blackTime),
                  moveCount: Math.max(prevMoveCount, newMoveCount),
                  status: isStatusActive ? 'active' : (m.status || prev.status || 'waiting'),
                  isWaiting: !bothConfirmed && !isGuestPresent,
                  updatedAt: Math.max(prev.updatedAt || 0, m.updatedAt || 0)
                };
                matchMap.set(cleanId, merged);
              }
            }
          });
          const mergedMatches = Array.from(matchMap.values()).filter(m => !m.isGameOver && !closedRoomIds.has(m.roomId) && (now - (m.updatedAt || 0)) < 1800000);
          // Fusionar salas multijugador activas (Party Rooms)
          const existingParty = Array.isArray(currentGroup.activePartyRooms) ? currentGroup.activePartyRooms : [];
          const cloudParty = Array.isArray(cloudGroup.activePartyRooms) ? cloudGroup.activePartyRooms : [];
          const partyMap = new Map();
          [...cloudParty, ...existingParty].forEach(pr => {
            if (pr && pr.roomId) {
              const cleanId = String(pr.roomId).toUpperCase().replace(/[^A-Z0-9]/g, '');
              if (closedRoomIds.has(cleanId)) return;
              if (pr.status === 'cancelled' || pr.status === 'ended') return;
              const prev = partyMap.get(cleanId);
              if (!prev || (pr.updatedAt || 0) > (prev.updatedAt || 0)) {
                partyMap.set(cleanId, pr);
              }
            }
          });
          const mergedPartyRooms = Array.from(partyMap.values()).slice(0, 50);

          const updatedGroup = {
            ...currentGroup,
            ...cloudGroup,
            users: mergedUsers,
            activeInvitations: mergedInvs,
            activeMatches: mergedMatches,
            activePartyRooms: mergedPartyRooms,
            closedRoomIds: Array.from(closedRoomIds).slice(-100),
            deletedMatches: Array.from(closedRoomIds).slice(-100),
            deletedInvitations: Array.from(deletedInvIds).slice(-100),
            updatedAt: Math.max(currentGroup.updatedAt || 0, cloudGroup.updatedAt || 0, Date.now())
          };

          groupToPush = updatedGroup;

          // Solo notificar si hay cambios reales en usuarios, retos o partidas
          const hasChanged = 
            JSON.stringify(mergedUsers) !== JSON.stringify(currentGroup.users || []) ||
            JSON.stringify(mergedInvs) !== JSON.stringify(currentGroup.activeInvitations || []) ||
            JSON.stringify(mergedMatches) !== JSON.stringify(currentGroup.activeMatches || []) ||
            JSON.stringify(mergedPartyRooms) !== JSON.stringify(currentGroup.activePartyRooms || []);

          if (hasChanged) {
            if (onCloudUpdate) onCloudUpdate(updatedGroup);
            this.notifyListeners(updatedGroup);
          }
        }

        // 2. Subir estado fusionado y enriquecido a la nube
        await this.pushGroupToCloud(groupToPush, currentGroup.id);
      } catch (err) {
        // Silencioso en caso de desconexión momentánea
      }
    };

    // Sincronizar inmediatamente al iniciar
    performSync();

    // Sincronizar periódicamente
    this.syncInterval = setInterval(performSync, intervalMs);

    const handleFocus = () => performSync();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleFocus);

    return () => {
      if (this.syncInterval) clearInterval(this.syncInterval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleFocus);
    };
  }

  // Guardar y sincronizar una sala multijugador grupal en la nube central
  async pushPartyRoom(partyRoom, groupId = 'group_junvill') {
    if (!partyRoom || !partyRoom.roomId) return null;
    const gid = groupId || 'group_junvill';
    const payload = {
      groupId: gid,
      partyRoom: {
        ...partyRoom,
        updatedAt: Date.now()
      }
    };
    try {
      const signal = createTimeoutSignal(4000);
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        cache: 'no-store',
        signal,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return json.partyRoom || partyRoom;
      }
    } catch (e) {
      console.warn('[CloudSync] Error al sincronizar sala multijugador:', e);
    }
    return partyRoom;
  }

  // Consultar directamente una sala multijugador por código en la nube central
  async fetchPartyRoom(roomId, groupId = 'group_junvill') {
    if (!roomId) return null;
    const cleanId = String(roomId).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const gid = groupId || 'group_junvill';
    try {
      const signal = createTimeoutSignal(3500);
      const res = await fetch(`/api/sync?groupId=${encodeURIComponent(gid)}&partyRoomId=${encodeURIComponent(cleanId)}&_t=${Date.now()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
        signal
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.partyRoom) {
          return json.partyRoom;
        }
      }
    } catch (e) {
      // Silencioso
    }
    return null;
  }

  // Resuelve si un código de sala es un alias o pertenece a una partida paralela existente entre los mismos jugadores
  resolveCanonicalRoom(requestedRoomId, cloudData) {
    if (!cloudData || !requestedRoomId) return { canonicalRoomId: requestedRoomId, isAlias: false };
    const cleanReq = String(requestedRoomId).replace(/[-\s]/g, '').toUpperCase();
    
    // 1. Verificar alias directo de sala
    if (cloudData.roomAliases && cloudData.roomAliases[cleanReq]) {
      const canonical = cloudData.roomAliases[cleanReq];
      return {
        canonicalRoomId: canonical,
        isAlias: true
      };
    }

    // 2. Verificar si hay partidas activas paralelas entre la misma pareja de jugadores
    if (Array.isArray(cloudData.activeMatches)) {
      const myMatch = cloudData.activeMatches.find(m => (m.roomId || '').replace(/[-\s]/g, '').toUpperCase() === cleanReq);
      if (myMatch) {
        const u1 = myMatch.hostUser?.id || myMatch.hostUser?.name;
        const u2 = myMatch.opponent?.id || myMatch.opponent?.name || myMatch.guestUser?.id || myMatch.guestUser?.name;
        if (u1 && u2) {
          const k1 = normalizeUserKey(u1);
          const k2 = normalizeUserKey(u2);
          const parallelMatch = cloudData.activeMatches.find(m => {
            const mClean = (m.roomId || '').replace(/[-\s]/g, '').toUpperCase();
            if (mClean === cleanReq) return false;
            const mu1 = normalizeUserKey(m.hostUser?.id || m.hostUser?.name);
            const mu2 = normalizeUserKey(m.opponent?.id || m.opponent?.name || m.guestUser?.id || m.guestUser?.name);
            return (mu1 === k1 && mu2 === k2) || (mu1 === k2 && mu2 === k1);
          });
          if (parallelMatch) {
            const isMineEarlier = (myMatch.createdAt || myMatch.updatedAt || 0) <= (parallelMatch.createdAt || parallelMatch.updatedAt || 0);
            const winner = isMineEarlier ? myMatch : parallelMatch;
            const canonicalClean = (winner.roomId || '').replace(/[-\s]/g, '').toUpperCase();
            return {
              canonicalRoomId: canonicalClean,
              isAlias: canonicalClean !== cleanReq,
              canonicalMatch: winner
            };
          }
        }
      }
    }

    return { canonicalRoomId: cleanReq, isAlias: false };
  }
}

export const cloudSync = new CloudSyncService();
