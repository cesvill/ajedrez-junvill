
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
    const existingId = userVariants.find(u => u.id)?.id;
    let canonicalId = existingId || `user_${key}`;
    let canonicalName = userVariants[0].name || key;
    let canonicalRole = userVariants[0].role || 'student';

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
    let maxElo = canonicalRole === 'parent' ? 762 : 800;
    let maxPuzzleRating = 400;
    let maxStars = 30;
    let maxGems = 10;
    let avatarConfig = null;
    let title = canonicalRole === 'parent' ? 'Tutor Familiar' : 'Campeón Junior';
    let password = 'JunV1ll123';
    let theme = 'modern_dark';
    let boardTheme = 'board_emerald';
    let pieceTheme = 'staunton';
    let maxLastActive = 0;

    // Ordenar variantes para que las ediciones más recientes tengan prioridad absoluta
    userVariants.sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));

    let latestAvatarConfig = null;
    let latestCoachSettings = null;
    let latestSystemSettings = null;
    let maxUpdatedAt = 0;

    userVariants.forEach(u => {
      const uTime = u.updatedAt || 0;
      if (u.elo && u.elo > maxElo) maxElo = u.elo;
      if (u.puzzleRating && u.puzzleRating > maxPuzzleRating) maxPuzzleRating = u.puzzleRating;
      if (u.stars && u.stars > maxStars) maxStars = u.stars;
      if (u.gems && u.gems > maxGems) maxGems = u.gems;
      
      // La configuración de avatar toma la versión más reciente por fecha de edición
      if (u.avatarConfig && Object.keys(u.avatarConfig).length > 2) {
        if (!latestAvatarConfig || uTime >= maxUpdatedAt || uTime === 0) {
          latestAvatarConfig = { ...u.avatarConfig };
        }
      }
      if (u.title && u.title !== 'Novato Promesa') title = u.title;
      if (u.password) password = u.password;
      if (u.theme) theme = u.theme;
      if (u.boardTheme) boardTheme = u.boardTheme;
      if (u.pieceTheme) pieceTheme = u.pieceTheme;
      if (u.coachSettings) latestCoachSettings = { ...u.coachSettings };
      if (u.systemSettings) latestSystemSettings = { ...u.systemSettings };
      if (uTime > maxUpdatedAt) maxUpdatedAt = uTime;
      if (u.lastActiveTimestamp && u.lastActiveTimestamp > maxLastActive) maxLastActive = u.lastActiveTimestamp;

      // Fusionar lecciones
      Object.entries(u.lessonProgress || {}).forEach(([lid, prog]) => {
        if (!mergedLessons[lid] || (prog.stars || 0) > (mergedLessons[lid].stars || 0)) {
          mergedLessons[lid] = {
            stars: Math.max(prog.stars || 0, mergedLessons[lid]?.stars || 0),
            completed: Boolean(prog.completed || mergedLessons[lid]?.completed || (prog.stars || 0) >= 5),
            updatedAt: Math.max(prog.updatedAt || 0, mergedLessons[lid]?.updatedAt || 0)
          };
        }
      });

      // Fusionar bots
      Object.entries(u.botVictories || {}).forEach(([botId, vicCount]) => {
        mergedBotVictories[botId] = Math.max(vicCount || 0, mergedBotVictories[botId] || 0);
      });

      // Fusionar radar
      Object.entries(u.radarSkills || {}).forEach(([cat, val]) => {
        mergedRadar[cat] = Math.max(val || 0, mergedRadar[cat] || 0);
      });

      // Fusionar stats
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

    merged.push({
      id: canonicalId,
      name: canonicalName,
      lastActiveTimestamp: maxLastActive,
      password,
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
      elo: maxElo,
      puzzleRating: maxPuzzleRating,
      stars: maxStars,
      gems: maxGems,
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
      unlockedItems: ['board_emerald', 'board_wood', 'shirt_blue', 'shirt_green'],
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
        headers: { 'Accept': 'application/json' }
      };
      if (signal) fetchOpts.signal = signal;

      const response = await fetch(`/api/sync?groupId=${encodeURIComponent(gid)}`, fetchOpts);

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

          // Fusionar retos familiares activos (más recientes primero)
          const existingInvs = Array.isArray(currentGroup.activeInvitations) ? currentGroup.activeInvitations : [];
          const cloudInvs = Array.isArray(cloudGroup.activeInvitations) ? cloudGroup.activeInvitations : [];
          const now = Date.now();
          const combinedInvs = [...cloudInvs, ...existingInvs].filter(i => (now - (i.createdAt || 0)) < 600000);
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

          // Fusionar partidas activas / asíncronas
          const existingMatches = Array.isArray(currentGroup.activeMatches) ? currentGroup.activeMatches : [];
          const cloudMatches = Array.isArray(cloudGroup.activeMatches) ? cloudGroup.activeMatches : [];
          const matchMap = new Map();
          [...cloudMatches, ...existingMatches].forEach(m => {
            if (m && m.roomId) {
              const cleanId = String(m.roomId).toUpperCase().replace(/[^A-Z0-9]/g, '');
              const prev = matchMap.get(cleanId);
              if (!prev) {
                matchMap.set(cleanId, { ...m, roomId: cleanId });
              } else {
                const merged = {
                  ...prev,
                  ...m,
                  roomId: cleanId,
                  hostUser: m.hostUser || prev.hostUser,
                  guestUser: m.guestUser || prev.guestUser,
                  opponent: m.opponent || prev.opponent,
                  fen: (m.updatedAt || 0) >= (prev.updatedAt || 0) ? (m.fen || prev.fen) : (prev.fen || m.fen),
                  lastMove: (m.updatedAt || 0) >= (prev.updatedAt || 0) ? (m.lastMove || prev.lastMove) : (prev.lastMove || m.lastMove),
                  turn: (m.updatedAt || 0) >= (prev.updatedAt || 0) ? (m.turn || prev.turn) : (prev.turn || m.turn),
                  whiteTime: (m.updatedAt || 0) >= (prev.updatedAt || 0) ? (m.whiteTime ?? prev.whiteTime) : (prev.whiteTime ?? m.whiteTime),
                  blackTime: (m.updatedAt || 0) >= (prev.updatedAt || 0) ? (m.blackTime ?? prev.blackTime) : (prev.blackTime ?? m.blackTime),
                  status: (m.status === 'active' || prev.status === 'active') ? 'active' : (m.status || prev.status),
                  isWaiting: Boolean(!m.guestUser && !prev.guestUser),
                  updatedAt: Math.max(prev.updatedAt || 0, m.updatedAt || 0)
                };
                matchMap.set(cleanId, merged);
              }
            }
          });
          const mergedMatches = Array.from(matchMap.values()).filter(m => !m.isGameOver && (now - (m.updatedAt || 0)) < 7200000);
          mergedMatches.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));

          const updatedGroup = {
            ...currentGroup,
            ...cloudGroup,
            users: mergedUsers,
            activeInvitations: mergedInvs,
            activeMatches: mergedMatches,
            updatedAt: Math.max(currentGroup.updatedAt || 0, cloudGroup.updatedAt || 0, Date.now())
          };

          groupToPush = updatedGroup;

          // Solo notificar si hay cambios reales en usuarios, retos o partidas
          const hasChanged = 
            JSON.stringify(mergedUsers) !== JSON.stringify(currentGroup.users || []) ||
            JSON.stringify(mergedInvs) !== JSON.stringify(currentGroup.activeInvitations || []) ||
            JSON.stringify(mergedMatches) !== JSON.stringify(currentGroup.activeMatches || []);

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

    // Sincronizar cuando el usuario regresa a la pestaña (focus / visibilidad)
    const handleFocus = () => performSync();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleFocus);
    return () => {
      if (this.syncInterval) clearInterval(this.syncInterval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleFocus);
    };
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
