import React from 'react';
import { Download, Share, PlusSquare, Smartphone, WifiOff, X, Zap, Monitor } from 'lucide-react';

export const PWAInstallModal = ({ isOpen, onClose, isIOS, hasNativePrompt, onNativeInstall }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 200, padding: '16px' }} onClick={onClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '24px',
          background: 'var(--bg-parchment-card, #0f172a)',
          border: '2px solid var(--color-gold, #ca8a04)',
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
          color: 'var(--text-parchment-main, #f8fafc)',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera con Icono de App */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-10px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-parchment-muted, #94a3b8)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <img
            src="/icon-192.png"
            alt="Ajedrez Junvill"
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '18px',
              boxShadow: '0 8px 24px rgba(202, 138, 4, 0.35)',
              border: '2px solid var(--color-gold, #ca8a04)'
            }}
          />
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--color-gold, #facc15)', margin: '0 0 6px' }}>
          Instalar Ajedrez Junvill
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-parchment-muted, #94a3b8)', margin: '0 0 18px', lineHeight: '1.4' }}>
          Disfruta de la mejor experiencia nativa en tu dispositivo móvil o computadora.
        </p>

        {/* Beneficios Clave de la PWA */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.80rem', fontWeight: '800', color: '#10b981', marginBottom: '2px' }}>
              <WifiOff size={14} />
              <span>100% Offline</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted, #94a3b8)' }}>Juega contra robots y minijuegos sin internet.</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.80rem', fontWeight: '800', color: '#38bdf8', marginBottom: '2px' }}>
              <Zap size={14} />
              <span>Carga Ultrarrápida</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted, #94a3b8)' }}>Abre al instante a 60 FPS sin esperas.</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.80rem', fontWeight: '800', color: '#ec4899', marginBottom: '2px' }}>
              <Smartphone size={14} />
              <span>Pantalla Completa</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted, #94a3b8)' }}>Sin barras de navegador molestas.</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.80rem', fontWeight: '800', color: '#f59e0b', marginBottom: '2px' }}>
              <Monitor size={14} />
              <span>Multiplataforma</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-parchment-muted, #94a3b8)' }}>Android, iOS, Windows, Mac y Linux.</div>
          </div>
        </div>

        {/* Guía Específica por Dispositivo */}
        {isIOS ? (
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1.5px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'left',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '900', color: '#38bdf8', marginBottom: '10px' }}>
              📱 Cómo instalar en iPhone o iPad (Safari):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#38bdf8', color: '#0f172a', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.74rem' }}>1</span>
                <span>Toca el botón <b>Compartir</b> (<Share size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />) en Safari.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#38bdf8', color: '#0f172a', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.74rem' }}>2</span>
                <span>Baja y pulsa <b>"Añadir a pantalla de inicio"</b> (<PlusSquare size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />).</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#38bdf8', color: '#0f172a', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.74rem' }}>3</span>
                <span>Pulsa <b>Añadir</b> en la esquina superior derecha. ¡Listo!</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn-gold"
            onClick={() => {
              if (onNativeInstall) onNativeInstall();
              onClose();
            }}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '0.96rem',
              fontWeight: '900',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(234, 179, 8, 0.35)',
              marginBottom: '10px'
            }}
          >
            <Download size={18} />
            <span>Instalar Aplicación Ahora 🚀</span>
          </button>
        )}

        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
          style={{ width: '100%', padding: '10px', fontSize: '0.82rem', justifyContent: 'center' }}
        >
          <span>Continuar en Navegador</span>
        </button>
      </div>
    </div>
  );
};
