// Vercel Serverless Function: Central Cloud Storage for Ajedrez Junvill
// Persists and synchronizes groups and player profiles across all family devices (PC, tablet, smartphones).

let inMemoryCloudStore = {};

const CLOUD_STORAGE_BASE = 'https://api.cl1p.net/ajedrez_junvill_cloud_sync_';

async function fetchFromDurableCloud(groupId) {
  try {
    const cleanId = String(groupId || 'group_junvill').replace(/[^a-zA-Z0-9_-]/g, '');
    const res = await fetch(`${CLOUD_STORAGE_BASE}${cleanId}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.users && Array.isArray(data.users)) {
        return data;
      }
    }
  } catch (e) {
    // Fallback to memory
  }
  return inMemoryCloudStore[groupId] || null;
}

async function saveToDurableCloud(groupId, data) {
  try {
    const cleanId = String(groupId || 'group_junvill').replace(/[^a-zA-Z0-9_-]/g, '');
    await fetch(`${CLOUD_STORAGE_BASE}${cleanId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(4000)
    });
  } catch (e) {
    // Fallback to memory
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

      // Fusión de retos familiares en la nube (TTL 10 minutos)
      const now = Date.now();
      const existingInvs = Array.isArray(existing.activeInvitations) ? existing.activeInvitations : [];
      const newInvs = Array.isArray(groupData.activeInvitations) ? groupData.activeInvitations : [];
      const combinedInvs = [...existingInvs, ...newInvs].filter(inv => (now - (inv.createdAt || 0)) < 600000);
      
      const invMap = new Map();
      combinedInvs.forEach(inv => {
        if (inv && inv.id) invMap.set(inv.id, inv);
      });
      const mergedInvs = Array.from(invMap.values());

      // Fusión de partidas activas por turnos / asíncronas en la nube (TTL 7 días)
      const existingMatches = Array.isArray(existing.activeMatches) ? existing.activeMatches : [];
      const newMatches = Array.isArray(groupData.activeMatches) ? groupData.activeMatches : [];
      const matchMap = new Map();
      [...existingMatches, ...newMatches].forEach(m => {
        if (m && m.roomId) {
          const prev = matchMap.get(m.roomId);
          if (!prev || (m.updatedAt || 0) >= (prev.updatedAt || 0)) {
            matchMap.set(m.roomId, m);
          }
        }
      });
      const mergedMatches = Array.from(matchMap.values()).filter(m => !m.isGameOver && (now - (m.updatedAt || 0)) < 86400000 * 7);

      const mergedGroup = {
        ...existing,
        ...groupData,
        users: mergedUsers,
        activeInvitations: mergedInvs,
        activeMatches: mergedMatches,
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
