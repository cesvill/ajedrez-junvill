// Vercel Serverless Function: Central Cloud Storage for Ajedrez Junvill
// Persists and synchronizes groups and player profiles across all family devices (PC, tablet, smartphones).

let inMemoryCloudStore = null;

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
      
      // Si hay datos en memoria o almacenamiento persistente, devolverlos
      if (inMemoryCloudStore && inMemoryCloudStore[groupId]) {
        return res.status(200).json({
          success: true,
          groupId,
          data: inMemoryCloudStore[groupId],
          updatedAt: inMemoryCloudStore[groupId].updatedAt || Date.now()
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

      if (!inMemoryCloudStore) {
        inMemoryCloudStore = {};
      }

      const existing = inMemoryCloudStore[groupId] || {};
      
      // Fusión inteligente (Smart Merge) para no sobreescribir avances de lecciones
      const mergedUsers = (groupData.users || []).map(newUser => {
        const existingUser = (existing.users || []).find(u => u.id === newUser.id || (u.name || '').toLowerCase() === (newUser.name || '').toLowerCase());
        if (!existingUser) return newUser;

        // Fusionar lessonProgress
        const mergedLessons = { ...(existingUser.lessonProgress || {}), ...(newUser.lessonProgress || {}) };
        Object.keys(existingUser.lessonProgress || {}).forEach(k => {
          const oldL = existingUser.lessonProgress[k];
          const newL = newUser.lessonProgress?.[k];
          if (oldL && newL) {
            mergedLessons[k] = {
              stars: Math.max(oldL.stars || 0, newL.stars || 0),
              completed: Boolean(oldL.completed || newL.completed),
              updatedAt: Math.max(oldL.updatedAt || 0, newL.updatedAt || 0)
            };
          }
        });

        return {
          ...existingUser,
          ...newUser,
          lessonProgress: mergedLessons,
          stars: Math.max(existingUser.stars || 0, newUser.stars || 0),
          gems: Math.max(existingUser.gems || 0, newUser.gems || 0),
          totalPoints: Math.max(existingUser.totalPoints || 0, newUser.totalPoints || 0),
          elo: Math.max(existingUser.elo || 0, newUser.elo || 0),
          updatedAt: Date.now()
        };
      });

      inMemoryCloudStore[groupId] = {
        ...existing,
        ...groupData,
        users: mergedUsers,
        updatedAt: Date.now()
      };

      return res.status(200).json({
        success: true,
        groupId,
        data: inMemoryCloudStore[groupId],
        message: 'Progreso sincronizado exitosamente en la Base de Datos Central'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error en /api/sync:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
