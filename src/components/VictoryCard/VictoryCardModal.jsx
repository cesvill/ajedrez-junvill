import React, { useRef } from 'react';
import { AvatarIcon } from '../../assets/avatars';
import { BotAvatarRenderer } from '../../assets/botRoster';
import { Trophy, Share2, Download, X, Sparkles, Star, Flame, Crown, Swords } from 'lucide-react';
import { audioManager } from '../../engine/audio';

export const VictoryCardModal = ({
  isOpen,
  onClose,
  currentUser,
  opponent = null,
  summary = null,
  moveCount = 20,
  accuracy = 88
}) => {
  if (!isOpen) return null;

  const cardRef = useRef(null);

  const playerName = currentUser?.name || 'Campeón';
  const playerTitle = currentUser?.title || 'Aprendiz';
  const oppName = opponent?.name || 'Robot';
  const oppElo = opponent?.elo || 600;
  const isWin = summary?.result !== 'loss';

  const shareText = `🏆 ¡Acabo de ${isWin ? 'ganar' : 'jugar'} una emocionante partida en Ajedrez Junvill! ♟️✨\n\n` +
    `👤 Jugador: ${playerName} (${currentUser?.elo || 650} Elo)\n` +
    `⚔️ Rival: ${oppName} (${oppElo} Elo)\n` +
    `🎯 Movimientos: ${moveCount} jugadas • Precisión: ${accuracy}%\n` +
    `⭐ Estrellas ganadas: +15 ⭐\n\n` +
    `¡Aprende y juega ajedrez en familia con Ajedrez Junvill! 👑`;

  const handleShareWhatsApp = () => {
    try { audioManager?.playVictory?.(); } catch (e) {}
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleDownloadCard = () => {
    try { audioManager?.playHint?.(); } catch (e) {}
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');

    // Fondo degradado de lujo
    const grad = ctx.createLinearGradient(0, 0, 600, 750);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 750);

    // Marco dorado
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 10;
    ctx.strokeRect(15, 15, 570, 720);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(25, 25, 550, 700);

    // Título
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('AJEDREZ JUNVILL', 300, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(isWin ? '🏆 TARJETA DE VICTORIA 🏆' : '♟️ TARJETA DE COMBATE ♟️', 300, 125);

    // Caja de Jugador
    ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
    ctx.fillRect(50, 160, 500, 140);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 160, 500, 140);

    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(playerName, 300, 205);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px sans-serif';
    ctx.fillText(`${playerTitle} • ${currentUser?.elo || 650} Elo`, 300, 235);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`⭐ ${currentUser?.stars || 80} Estrellas • 💎 ${currentUser?.gems || 25} Gemas`, 300, 270);

    // Vs
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('⚔️ VS ⚔️', 300, 345);

    // Caja de Rival
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fillRect(50, 380, 500, 120);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 380, 500, 120);

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(oppName, 300, 425);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Oponente Robot • ${oppElo} Elo`, 300, 455);

    // Estadísticas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(50, 530, 500, 120);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(50, 530, 500, 120);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`🎯 Precisión de Jugadas: ${accuracy}%`, 300, 575);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Duración: ${moveCount} turnos • Recompensa: +15 Elo ⭐`, 300, 615);

    // Footer
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'italic 14px sans-serif';
    ctx.fillText('Ajedrez Junvill - Formando a los Grandes Maestros del Mañana', 300, 695);

    // Descarga
    const link = document.createElement('a');
    link.download = `Victoria_Ajedrez_Junvill_${playerName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 130, padding: '12px' }} onClick={onClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '24px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '2px solid var(--color-gold)',
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
          textAlign: 'center',
          color: '#ffffff'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-gold)', fontWeight: '900', fontSize: '0.85rem' }}>
            <Sparkles size={16} />
            <span>CROMO COLECCIONABLE DE VICTORIA</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tarjeta Visual de Colección */}
        <div
          ref={cardRef}
          style={{
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '2px solid #f59e0b',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 12px 30px rgba(245, 158, 11, 0.25)',
            position: 'relative'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>🏆</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#fbbf24', margin: '0 0 4px', fontWeight: '900' }}>
            {isWin ? '¡Gran Victoria en Ajedrez!' : '¡Partida Destacada!'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 16px' }}>
            {summary?.title || `Enfrentamiento vs ${oppName}`}
          </p>

          {/* Duelo de Avatares */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '14px 0', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 6px', overflow: 'hidden', border: '2px solid #3b82f6' }}>
                <AvatarIcon avatarId={currentUser.avatar} avatarConfig={currentUser.avatarConfig} size={48} />
              </div>
              <div style={{ fontWeight: '900', color: '#60a5fa', fontSize: '0.88rem' }}>{playerName}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{currentUser.elo} Elo</div>
            </div>

            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#f59e0b' }}>VS</div>

            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 6px', overflow: 'hidden', border: '2px solid #ef4444' }}>
                {opponent ? <BotAvatarRenderer bot={opponent} size={48} /> : <div style={{ fontSize: '1.8rem' }}>🤖</div>}
              </div>
              <div style={{ fontWeight: '900', color: '#f87171', fontSize: '0.88rem' }}>{oppName}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{oppElo} Elo</div>
            </div>
          </div>

          {/* Estadísticas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '14px' }}>
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.70rem', color: '#94a3b8' }}>Precisión</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#10b981' }}>{accuracy}%</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.70rem', color: '#94a3b8' }}>Jugadas</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#38bdf8' }}>{moveCount}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', padding: '8px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.70rem', color: '#94a3b8' }}>Recompensa</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '900', color: '#fbbf24' }}>+15 ⭐</div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-gold"
            onClick={handleShareWhatsApp}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.90rem',
              fontWeight: '900',
              justifyContent: 'center',
              background: '#25D366',
              borderColor: '#128C7E',
              color: '#ffffff'
            }}
          >
            <Share2 size={16} />
            <span>Compartir en WhatsApp</span>
          </button>

          <button
            className="btn-secondary"
            onClick={handleDownloadCard}
            style={{
              padding: '12px 18px',
              fontSize: '0.90rem',
              fontWeight: '800',
              justifyContent: 'center',
              gap: '6px'
            }}
            title="Descargar imagen PNG para guardar"
          >
            <Download size={16} />
            <span>Descargar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
