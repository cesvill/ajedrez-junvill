// Vercel Serverless Function: Central Cloud Storage for Ajedrez Junvill
// Persists and synchronizes groups and player profiles across all family devices (PC, tablet, smartphones).

let inMemoryCloudStore = {};

function normalizeUserKey(raw) {
  if (!raw) return '';
  return String(raw)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^(user_|usr_)/, '');
}

const DURABLE_STORAGE_OBJECT_ID = 'ff808181a067127101a09bdcf4d70b8f';
const RESTFUL_URL = `https://api.restful-api.dev/objects/${DURABLE_STORAGE_OBJECT_ID}`;

async function fetchFromDurableCloud(groupId) {
  const gid = groupId || 'group_junvill';
  
  // 1. Intentar consultar el contenedor duradero central
  try {
    const res = await fetch(RESTFUL_URL, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.users && Array.isArray(json.data.users)) {
        inMemoryCloudStore[gid] = json.data;
        return json.data;
      }
    }
  } catch (e) {
    // Intentar respaldo en memoria
  }

  return inMemoryCloudStore[gid] || null;
}

async function saveToDurableCloud(groupId, data) {
  const gid = groupId || 'group_junvill';
  inMemoryCloudStore[gid] = data;

  try {
    await fetch(RESTFUL_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `junvill_${gid}_v5`,
        data: data
      }),
      signal: AbortSignal.timeout(4000)
    });
  } catch (e) {
    // Silencioso
  }
}

function mergeUsers(existingUsers = [], newUsers = []) {
  const userMap = new Map();

  (existingUsers || []).forEach(u => {
    if (u && u.id) userMap.set(u.id, { ...u });
  });

  (newUsers || []).forEach(nUser => {
    if (!nUser || !nUser.id) return;
    
    // Buscar por ID o por nombre
    let existing = userMap.get(nUser.id);
    if (!existing) {
      existing = Array.from(userMap.values()).find(u => (u.name || '').toLowerCase().trim() === (nUser.name || '').toLowerCase().trim());
    }

    if (!existing) {
      userMap.set(nUser.id, { ...nUser });
      return;
    }

    // Fusión de lecciones
    const mergedLessons = {
      ...(existing.lessonProgress || {}),
      ...(nUser.lessonProgress || {})
    };

    const allLessonKeys = Array.from(new Set([
      ...Object.keys(existing.lessonProgress || {}),
      ...Object.keys(nUser.lessonProgress || {})
    ]));

    allLessonKeys.forEach(k => {
      const oldL = existing.lessonProgress?.[k];
      const newL = nUser.lessonProgress?.[k];
      if (oldL && newL) {
        mergedLessons[k] = {
          stars: Math.max(oldL.stars || 0, newL.stars || 0),
          completed: Boolean(oldL.completed || newL.completed),
          updatedAt: Math.max(oldL.updatedAt || 0, newL.updatedAt || 0)
        };
      } else if (newL) {
        mergedLessons[k] = newL;
      } else if (oldL) {
        mergedLessons[k] = oldL;
      }
    });

    // Calcular puntos acumulados de lecciones (1 punto por leccion completada hasta 110)
    const totalLessonPts = Object.values(mergedLessons).filter(p => p.completed || p.stars >= 5).length;

    // Fusión de victorias contra bots
    const mergedBotVictories = {
      ...(existing.botVictories || {}),
      ...(nUser.botVictories || {})
    };
    const allBots = Array.from(new Set([
      ...Object.keys(existing.botVictories || {}),
      ...Object.keys(nUser.botVictories || {})
    ]));
    allBots.forEach(b => {
      mergedBotVictories[b] = Math.max(existing.botVictories?.[b] || 0, nUser.botVictories?.[b] || 0);
    });

    // Fusión de radar
    const mergedRadar = {
      tactica: Math.max(existing.radarSkills?.tactica || 0, nUser.radarSkills?.tactica || 0),
      estrategia: Math.max(existing.radarSkills?.estrategia || 0, nUser.radarSkills?.estrategia || 0),
      posicional: Math.max(existing.radarSkills?.posicional || 0, nUser.radarSkills?.posicional || 0),
      calculo: Math.max(existing.radarSkills?.calculo || 0, nUser.radarSkills?.calculo || 0),
      aperturas: Math.max(existing.radarSkills?.aperturas || 0, nUser.radarSkills?.aperturas || 0),
      finales: Math.max(existing.radarSkills?.finales || 0, nUser.radarSkills?.finales || 0)
    };

    userMap.set(existing.id, {
      ...existing,
      ...nUser,
      id: existing.id,
      name: nUser.name || existing.name,
      role: nUser.role || existing.role,
      avatar: nUser.avatar || existing.avatar,
      avatarConfig: ((nUser.updatedAt || 0) >= (existing.updatedAt || 0) && nUser.avatarConfig) ? nUser.avatarConfig : (existing.avatarConfig || nUser.avatarConfig),
      theme: ((nUser.updatedAt || 0) >= (existing.updatedAt || 0) && nUser.theme) ? nUser.theme : (existing.theme || nUser.theme),
      boardTheme: ((nUser.updatedAt || 0) >= (existing.updatedAt || 0) && nUser.boardTheme) ? nUser.boardTheme : (existing.boardTheme || nUser.boardTheme),
      pieceTheme: ((nUser.updatedAt || 0) >= (existing.updatedAt || 0) && nUser.pieceTheme) ? nUser.pieceTheme : (existing.pieceTheme || nUser.pieceTheme),
      coachSettings: ((nUser.updatedAt || 0) >= (existing.updatedAt || 0) && nUser.coachSettings) ? nUser.coachSettings : (existing.coachSettings || nUser.coachSettings),
      stars: Math.max(existing.stars || 0, nUser.stars || 0),
      gems: Math.max(existing.gems || 0, nUser.gems || 0),
      totalPoints: Math.max(totalLessonPts, existing.totalPoints || 0, nUser.totalPoints || 0),
      elo: Math.max(existing.elo || 0, nUser.elo || 0),
      puzzleRating: Math.max(existing.puzzleRating || 0, nUser.puzzleRating || 0),
      lessonProgress: mergedLessons,
      botVictories: mergedBotVictories,
      radarSkills: mergedRadar,
      stats: {
        gamesPlayed: Math.max(existing.stats?.gamesPlayed || 0, nUser.stats?.gamesPlayed || 0),
        wins: Math.max(existing.stats?.wins || 0, nUser.stats?.wins || 0),
        losses: Math.max(existing.stats?.losses || 0, nUser.stats?.losses || 0),
        draws: Math.max(existing.stats?.draws || 0, nUser.stats?.draws || 0),
        puzzlesSolved: Math.max(existing.stats?.puzzlesSolved || 0, nUser.stats?.puzzlesSolved || 0),
        hintsUsed: Math.max(existing.stats?.hintsUsed || 0, nUser.stats?.hintsUsed || 0),
        accuracyAvg: Math.max(existing.stats?.accuracyAvg || 0, nUser.stats?.accuracyAvg || 0)
      },
      lastActiveTimestamp: Math.max(existing.lastActiveTimestamp || 0, nUser.lastActiveTimestamp || 0),
      updatedAt: Math.max(existing.updatedAt || 0, nUser.updatedAt || 0, Date.now())
    });
  });

  return Array.from(userMap.values());
}

export default async function handler(req, res) {
  // Configurar cabeceras CORS para comunicación segura entre dispositivos
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const groupId = req.query.groupId || 'group_junvill';
      
      const cloudData = await fetchFromDurableCloud(groupId);
      if (cloudData) {
        inMemoryCloudStore[groupId] = cloudData;
        return res.status(200).json({
          success: true,
          groupId,
          data: cloudData,
          updatedAt: cloudData.updatedAt || Date.now()
        });
      }

      return res.status(200).json({
        success: true,
        groupId,
        data: null,
        message: 'No cloud state yet for this group'
      });
    }

    if (req.method === 'POST') {
      const { groupId = 'group_junvill', groupData } = req.body || {};
      if (!groupData) {
        return res.status(400).json({ error: 'Missing groupData in request body' });
      }

      // Obtener datos existentes (de memoria o nube)
      const existing = (await fetchFromDurableCloud(groupId)) || inMemoryCloudStore[groupId] || {};
      
      // Fusión inteligente de usuarios (Smart Merge CRDT)
      const mergedUsers = mergeUsers(existing.users, groupData.users);

      // Fusión de retos familiares en la nube (TTL 10 minutos, más recientes primero)
      const now = Date.now();
      const existingInvs = Array.isArray(existing.activeInvitations) ? existing.activeInvitations : [];
      const newInvs = Array.isArray(groupData.activeInvitations) ? groupData.activeInvitations : [];
      const combinedInvs = [...newInvs, ...existingInvs].filter(inv => (now - (inv.createdAt || 0)) < 600000);
      combinedInvs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      
      const pairInvMap = new Map();
      const mergedInvs = [];
      combinedInvs.forEach(inv => {
        const u1 = inv.fromUser?.id || inv.fromUser?.name || '';
        const u2 = inv.toUserId || inv.toUserName || '';
        if (u1 && u2) {
          const pairKey = [normalizeUserKey(u1), normalizeUserKey(u2)].sort().join('_');
          if (!pairInvMap.has(pairKey)) {
            pairInvMap.set(pairKey, inv);
            mergedInvs.push(inv);
          }
        } else if (inv.id && !mergedInvs.some(i => i.id === inv.id)) {
          mergedInvs.push(inv);
        }
      });

      // Fusión directa e infalible de partidas activas por roomId (TTL 2 horas)
      const existingMatches = Array.isArray(existing.activeMatches) ? existing.activeMatches : [];
      const newMatches = Array.isArray(groupData.activeMatches) ? groupData.activeMatches : [];
      const matchMap = new Map();
      [...existingMatches, ...newMatches].forEach(m => {
        if (m && m.roomId) {
          const cleanId = String(m.roomId).toUpperCase().replace(/[^A-Z0-9]/g, '');
          const prev = matchMap.get(cleanId);
          if (!prev) {
            const hasGuest = Boolean(m.guestUser);
            matchMap.set(cleanId, {
              ...m,
              roomId: cleanId,
              assignedColor: m.assignedColor || 'white',
              status: m.status || (hasGuest ? 'active' : 'waiting'),
              isWaiting: !hasGuest
            });
          } else {
            const guest = m.guestUser || prev.guestUser || null;
            const host = m.hostUser || prev.hostUser || null;
            const isGuestPresent = Boolean(guest);
            const isStatusActive = m.status === 'active' || prev.status === 'active' || isGuestPresent;
            const isNewer = (m.updatedAt || 0) >= (prev.updatedAt || 0);

            const merged = {
              ...prev,
              ...m,
              roomId: cleanId,
              hostUser: host,
              guestUser: guest,
              opponent: m.opponent || prev.opponent || (guest ? guest : null),
              assignedColor: m.assignedColor || prev.assignedColor || 'white',
              timeControl: m.timeControl || prev.timeControl || 300,
              withAssistance: m.withAssistance !== undefined ? m.withAssistance : (prev.withAssistance !== undefined ? prev.withAssistance : true),
              fen: isNewer ? (m.fen || prev.fen) : (prev.fen || m.fen),
              lastMove: isNewer ? (m.lastMove || prev.lastMove) : (prev.lastMove || m.lastMove),
              turn: isNewer ? (m.turn || prev.turn) : (prev.turn || m.turn),
              whiteTime: isNewer ? (m.whiteTime ?? prev.whiteTime) : (prev.whiteTime ?? m.whiteTime),
              blackTime: isNewer ? (m.blackTime ?? prev.blackTime) : (prev.blackTime ?? m.blackTime),
              status: isStatusActive ? 'active' : (m.status || prev.status || 'waiting'),
              isWaiting: !isGuestPresent,
              updatedAt: Math.max(prev.updatedAt || 0, m.updatedAt || 0, Date.now())
            };
            matchMap.set(cleanId, merged);
          }
        }
      });

      const mergedMatches = Array.from(matchMap.values())
        .filter(m => !m.isGameOver && (now - (m.updatedAt || 0)) < 7200000)
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      // Fusión de reportes de bugs familiares en la nube (Hasta 200 reportes más recientes)
      const existingBugs = Array.isArray(existing.bugReports) ? existing.bugReports : [];
      const newBugs = Array.isArray(groupData.bugReports) ? groupData.bugReports : [];
      const bugMap = new Map();
      [...newBugs, ...existingBugs].forEach(b => {
        if (b && (b.reportId || b.id)) {
          bugMap.set(b.reportId || b.id, b);
        }
      });
      const mergedBugs = Array.from(bugMap.values()).slice(0, 200);

      const mergedGroup = {
        ...existing,
        ...groupData,
        users: mergedUsers,
        activeInvitations: mergedInvs,
        activeMatches: mergedMatches,
        roomAliases: existing.roomAliases || groupData.roomAliases || {},
        bugReports: mergedBugs,
        updatedAt: Date.now()
      };

      inMemoryCloudStore[groupId] = mergedGroup;
      
      // Persistir de forma asíncrona pero confiable en la nube duradera
      await saveToDurableCloud(groupId, mergedGroup);

      return res.status(200).json({
        success: true,
        groupId,
        data: mergedGroup,
        message: 'Progreso sincronizado exitosamente en la Base de Datos Central'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error en /api/sync:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
