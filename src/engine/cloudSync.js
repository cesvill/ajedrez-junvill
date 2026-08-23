/**
 * Motor de Sincronización en la Nube Centralizada (Cloud Synchronization Engine)
 * Sincroniza el avance de lecciones, estrellas, gemas y usuarios de la Familia Junvill
 * en tiempo real entre múltiples dispositivos (tablets, smartphones, laptops y PCs).
 */

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
  }

  // Fusión inteligente de usuarios (Merge CRDT sin pérdidas)
  mergeUsers(localUsers = [], cloudUsers = []) {
    const userMap = new Map();

    // 1. Agregar usuarios locales
    (localUsers || []).forEach(u => {
      if (u && u.id) {
        userMap.set(u.id, { ...u });
      }
    });

    // 2. Fusionar con usuarios de la nube
    (cloudUsers || []).forEach(cUser => {
      if (!cUser || !cUser.id) return;
      const lUser = userMap.get(cUser.id);

      if (!lUser) {
        // Usuario nuevo creado en otro dispositivo (ej. Martin, Leti)
        userMap.set(cUser.id, { ...cUser });
        return;
      }

      // Fusionar lecciones completadas (conserva el mayor número de estrellas y estado completado)
      const mergedLessonProgress = {
        ...(lUser.lessonProgress || {}),
        ...(cUser.lessonProgress || {})
      };

      const allLessonKeys = Array.from(new Set([
        ...Object.keys(lUser.lessonProgress || {}),
        ...Object.keys(cUser.lessonProgress || {})
      ]));

      allLessonKeys.forEach(k => {
        const lProgress = lUser.lessonProgress?.[k];
        const cProgress = cUser.lessonProgress?.[k];
        if (lProgress && cProgress) {
          mergedLessonProgress[k] = {
            stars: Math.max(lProgress.stars || 0, cProgress.stars || 0),
            completed: Boolean(lProgress.completed || cProgress.completed),
            updatedAt: Math.max(lProgress.updatedAt || 0, cProgress.updatedAt || 0)
          };
        } else if (cProgress) {
          mergedLessonProgress[k] = cProgress;
        } else if (lProgress) {
          mergedLessonProgress[k] = lProgress;
        }
      });

      // Fusionar estadísticas y victorias contra bots
      const mergedBotVictories = {
        ...(lUser.botVictories || {}),
        ...(cUser.botVictories || {})
      };
      const allBotKeys = Array.from(new Set([
        ...Object.keys(lUser.botVictories || {}),
        ...Object.keys(cUser.botVictories || {})
      ]));
      allBotKeys.forEach(k => {
        mergedBotVictories[k] = Math.max(lUser.botVictories?.[k] || 0, cUser.botVictories?.[k] || 0);
      });

      // Fusionar habilidades del radar
      const mergedRadar = {
        tactica: Math.max(lUser.radarSkills?.tactica || 0, cUser.radarSkills?.tactica || 0),
        estrategia: Math.max(lUser.radarSkills?.estrategia || 0, cUser.radarSkills?.estrategia || 0),
        posicional: Math.max(lUser.radarSkills?.posicional || 0, cUser.radarSkills?.posicional || 0),
        calculo: Math.max(lUser.radarSkills?.calculo || 0, cUser.radarSkills?.calculo || 0),
        aperturas: Math.max(lUser.radarSkills?.aperturas || 0, cUser.radarSkills?.aperturas || 0),
        finales: Math.max(lUser.radarSkills?.finales || 0, cUser.radarSkills?.finales || 0)
      };

      userMap.set(cUser.id, {
        ...lUser,
        ...cUser,
        name: cUser.name || lUser.name,
        role: cUser.role || lUser.role,
        avatar: cUser.avatar || lUser.avatar,
        avatarConfig: cUser.avatarConfig || lUser.avatarConfig,
        stars: Math.max(lUser.stars || 0, cUser.stars || 0),
        gems: Math.max(lUser.gems || 0, cUser.gems || 0),
        totalPoints: Math.max(lUser.totalPoints || 0, cUser.totalPoints || 0),
        elo: Math.max(lUser.elo || 600, cUser.elo || 600),
        puzzleRating: Math.max(lUser.puzzleRating || 400, cUser.puzzleRating || 400),
        lessonProgress: mergedLessonProgress,
        botVictories: mergedBotVictories,
        radarSkills: mergedRadar,
        stats: {
          gamesPlayed: Math.max(lUser.stats?.gamesPlayed || 0, cUser.stats?.gamesPlayed || 0),
          wins: Math.max(lUser.stats?.wins || 0, cUser.stats?.wins || 0),
          losses: Math.max(lUser.stats?.losses || 0, cUser.stats?.losses || 0),
          draws: Math.max(lUser.stats?.draws || 0, cUser.stats?.draws || 0),
          puzzlesSolved: Math.max(lUser.stats?.puzzlesSolved || 0, cUser.stats?.puzzlesSolved || 0),
          hintsUsed: Math.max(lUser.stats?.hintsUsed || 0, cUser.stats?.hintsUsed || 0),
          accuracyAvg: Math.max(lUser.stats?.accuracyAvg || 0, cUser.stats?.accuracyAvg || 0)
        },
        updatedAt: Date.now()
      });
    });

    return Array.from(userMap.values());
  }

  // Obtener estado más reciente desde la Nube Central
  async fetchCloudGroup(groupId = 'group_junvill') {
    try {
      // 1. Intentar Vercel Serverless Endpoint
      const response = await fetch(`/api/sync?groupId=${encodeURIComponent(groupId)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const json = await response.json();
        if (json && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      // Endpoint local / offline fallback
    }

    return null;
  }

  // Guardar y sincronizar estado en la Nube Central
  async pushGroupToCloud(groupData, groupId = 'group_junvill') {
    if (!groupData) return null;
    this.isSyncing = true;

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          groupId,
          groupData: {
            ...groupData,
            updatedAt: Date.now()
          }
        })
      });

      if (response.ok) {
        const json = await response.json();
        this.lastSyncTime = Date.now();
        return json.data || groupData;
      }
    } catch (e) {
      // Modo offline: se sincronizará al reconectar
    } finally {
      this.isSyncing = false;
    }

    return groupData;
  }

  // Iniciar sincronización periódica automática
  startPeriodicSync(getActiveGroup, onCloudUpdate, intervalMs = 15000) {
    if (this.syncInterval) clearInterval(this.syncInterval);

    const performSync = async () => {
      try {
        const currentGroup = getActiveGroup();
        if (!currentGroup) return;

        // 1. Descargar estado de la nube
        const cloudGroup = await this.fetchCloudGroup(currentGroup.id);
        if (cloudGroup && cloudGroup.users && Array.isArray(cloudGroup.users)) {
          // Fusionar usuarios
          const mergedUsers = this.mergeUsers(currentGroup.users, cloudGroup.users);
          const hasChanges = JSON.stringify(mergedUsers) !== JSON.stringify(currentGroup.users);

          if (hasChanges) {
            const updatedGroup = {
              ...currentGroup,
              ...cloudGroup,
              users: mergedUsers,
              updatedAt: Date.now()
            };
            if (onCloudUpdate) onCloudUpdate(updatedGroup);
            this.notifyListeners(updatedGroup);
          }
        }

        // 2. Subir estado local actualizado a la nube
        await this.pushGroupToCloud(currentGroup, currentGroup.id);
      } catch (err) {
        // Silencioso en caso de desconexión momentánea
      }
    };

    // Sincronizar inmediatamente al iniciar
    performSync();

    // Sincronizar periódicamente
    this.syncInterval = setInterval(performSync, intervalMs);

    // Sincronizar cuando el usuario regresa a la pestaña (focus)
    const handleFocus = () => performSync();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleFocus);

    return () => {
      if (this.syncInterval) clearInterval(this.syncInterval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleFocus);
    };
  }
}

export const cloudSync = new CloudSyncService();
