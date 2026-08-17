import React, { useState } from 'react';
import { DynamicAvatar, SKIN_TONES, HAIR_COLORS, SHIRT_COLORS, DEFAULT_AVATAR_CONFIG } from './DynamicAvatar';
import { useUser } from '../../context/UserContext';
import { audioManager } from '../../engine/audio';
import confetti from 'canvas-confetti';
import { X, Sparkles, Shuffle, Check, Palette, Smile, Shirt, Crown, Image } from 'lucide-react';

const HAIR_STYLES = [
  { id: 'messy', label: 'Despeinado Moderno' },
  { id: 'short', label: 'Corto Clásico' },
  { id: 'ponytail', label: 'Coleta Gamer' },
  { id: 'curly', label: 'Rizado' },
  { id: 'afro', label: 'Afro' },
  { id: 'bun', label: 'Moño Distinguido' },
  { id: 'crest', label: 'Cresta Urbana' },
  { id: 'bald_senior', label: 'Senior con Gafas' },
  { id: 'long', label: 'Largo' },
];

const EYE_STYLES = [
  { id: 'happy', label: 'Alegre / Sonriente' },
  { id: 'determined', label: 'Determinado / Foco' },
  { id: 'wink', label: 'Guiño Pícaro' },
  { id: 'glasses', label: 'Gafas de Lectura' },
  { id: 'sunglasses', label: 'Gafas de Sol' },
  { id: 'cyber_visor', label: 'Visor Holográfico' },
];

const SHIRT_STYLES = [
  { id: 'hoodie', label: 'Sudadera con Capucha' },
  { id: 'tshirt', label: 'Camiseta Junvill' },
  { id: 'blazer', label: 'Blazer de Campeón' },
  { id: 'vest', label: 'Chaleco de Maestro' },
  { id: 'royal_robe', label: 'Túnica Real de Oro' },
  { id: 'armor', label: 'Armadura de Torneo' },
];

const ACCESSORIES = [
  { id: 'none', label: 'Sin Accesorio' },
  { id: 'headphones', label: 'Auriculares Gaming' },
  { id: 'crown', label: 'Corona Dorada' },
  { id: 'cap_back', label: 'Gorra hacia Atrás' },
  { id: 'headband', label: 'Diadema Deportiva' },
  { id: 'monocle', label: 'Monóculo Clásico' },
];

const BACKGROUNDS = [
  { id: 'blue_sky', label: 'Cielo Abierto' },
  { id: 'night_stars', label: 'Espacio Estelar' },
  { id: 'cyber_grid', label: 'Cyber Neón' },
  { id: 'parchment_wood', label: 'Madera de Academia' },
  { id: 'royal_castle', label: 'Castillo de Junvill' },
];

export const AvatarBuilderModal = ({ isOpen, onClose }) => {
  const { currentUser, updateCurrentUser } = useUser();
  const [config, setConfig] = useState(() => currentUser?.avatarConfig || DEFAULT_AVATAR_CONFIG);
  const [activeSubTab, setActiveSubTab] = useState('skin'); // 'skin' | 'hair' | 'eyes' | 'shirt' | 'accessory' | 'bg'

  if (!isOpen) return null;

  const handleRandomize = () => {
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].id;
    const randomHairStyle = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].id;
    const randomHairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].id;
    const randomEye = EYE_STYLES[Math.floor(Math.random() * EYE_STYLES.length)].id;
    const randomShirtStyle = SHIRT_STYLES[Math.floor(Math.random() * SHIRT_STYLES.length)].id;
    const randomShirtColor = SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)].id;
    const randomAcc = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id;
    const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)].id;

    setConfig({
      skin: randomSkin,
      hairStyle: randomHairStyle,
      hairColor: randomHairColor,
      eyeStyle: randomEye,
      shirtStyle: randomShirtStyle,
      shirtColor: randomShirtColor,
      accessory: randomAcc,
      background: randomBg
    });
    audioManager.playMove();
  };

  const handleSave = () => {
    updateCurrentUser({
      avatarConfig: config,
      avatar: 'custom_dynamic'
    });
    audioManager.playVictory();
    confetti({ particleCount: 50, spread: 60 });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '880px', width: '95vw', padding: '24px', maxHeight: '92vh' }} onClick={(e) => e.stopPropagation()}>
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1.5px solid var(--bg-parchment-border)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={22} color="#f59e0b" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-parchment-main)', margin: 0 }}>
              Estudio de Creación de Avatares Junvill
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* CONTENIDO 2 COLUMNAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '20px' }}>
          {/* COLUMNA IZQUIERDA: TARIMA DE PREVISUALIZACIÓN */}
          <div style={{
            background: 'var(--bg-parchment)',
            border: '2px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            textAlign: 'center'
          }}>
            <div style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.25))' }}>
              <DynamicAvatar config={config} size={140} />
            </div>

            <div>
              <div style={{ fontWeight: '900', fontSize: '1.15rem', color: 'var(--text-parchment-main)' }}>
                {currentUser?.name || 'Estudiante'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark)', fontWeight: '700' }}>
                {currentUser?.title || 'Aprendiz'} • {currentUser?.elo || 600} Elo
              </div>
            </div>

            <button
              onClick={handleRandomize}
              className="btn-secondary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <Shuffle size={16} />
              <span>🎲 Aleatorio</span>
            </button>
          </div>

          {/* COLUMNA DERECHA: SUBPESTAÑAS Y SELECTORES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* SUBPESTAÑAS */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'skin', label: '🎨 Piel' },
                { id: 'hair', label: '💇 Cabello' },
                { id: 'eyes', label: '👀 Rostro' },
                { id: 'shirt', label: '👕 Ropa' },
                { id: 'accessory', label: '👑 Accesorios' },
                { id: 'bg', label: '🌈 Fondo' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  style={{
                    background: activeSubTab === tab.id ? 'var(--color-primary)' : 'var(--bg-parchment)',
                    color: activeSubTab === tab.id ? 'white' : 'var(--text-parchment-muted)',
                    border: '1px solid var(--bg-parchment-border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* SELECTOR: PIEL */}
            {activeSubTab === 'skin' && (
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '800', marginBottom: '10px', color: 'var(--text-parchment-main)' }}>
                  Selecciona el Tono de Piel:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {SKIN_TONES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setConfig({ ...config, skin: s.id })}
                      style={{
                        background: 'var(--bg-parchment)',
                        border: `2.5px solid ${config.skin === s.id ? 'var(--color-primary)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: s.id, border: '1px solid rgba(0,0,0,0.2)' }} />
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-parchment-main)' }}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SELECTOR: CABELLO Y COLOR */}
            {activeSubTab === 'hair' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                    Estilo de Peinado:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {HAIR_STYLES.map(h => (
                      <button
                        key={h.id}
                        onClick={() => setConfig({ ...config, hairStyle: h.id })}
                        style={{
                          background: config.hairStyle === h.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                          border: `1.5px solid ${config.hairStyle === h.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                          borderRadius: 'var(--radius-sm)',
                          padding: '8px 6px',
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          color: 'var(--text-parchment-main)',
                          cursor: 'pointer'
                        }}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                    Color de Tinte:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {HAIR_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setConfig({ ...config, hairColor: c.id })}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: c.id,
                          border: `3px solid ${config.hairColor === c.id ? '#ffffff' : 'transparent'}`,
                          boxShadow: 'var(--shadow-sm)',
                          cursor: 'pointer'
                        }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SELECTOR: ROSTRO Y OJOS */}
            {activeSubTab === 'eyes' && (
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '800', marginBottom: '10px', color: 'var(--text-parchment-main)' }}>
                  Expresión y Mirada:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {EYE_STYLES.map(e => (
                    <button
                      key={e.id}
                      onClick={() => setConfig({ ...config, eyeStyle: e.id })}
                      style={{
                        background: config.eyeStyle === e.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                        border: `1.5px solid ${config.eyeStyle === e.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 12px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        color: 'var(--text-parchment-main)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SELECTOR: ROPA */}
            {activeSubTab === 'shirt' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                    Atuendo / Traje:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {SHIRT_STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setConfig({ ...config, shirtStyle: s.id })}
                        style={{
                          background: config.shirtStyle === s.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                          border: `1.5px solid ${config.shirtStyle === s.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                          borderRadius: 'var(--radius-sm)',
                          padding: '8px 10px',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          color: 'var(--text-parchment-main)',
                          cursor: 'pointer'
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                    Color de Prenda:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {SHIRT_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setConfig({ ...config, shirtColor: c.id })}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: c.id,
                          border: `3px solid ${config.shirtColor === c.id ? '#ffffff' : 'transparent'}`,
                          boxShadow: 'var(--shadow-sm)',
                          cursor: 'pointer'
                        }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SELECTOR: ACCESORIOS */}
            {activeSubTab === 'accessory' && (
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '800', marginBottom: '10px', color: 'var(--text-parchment-main)' }}>
                  Sombrero o Accesorio:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {ACCESSORIES.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setConfig({ ...config, accessory: a.id })}
                      style={{
                        background: config.accessory === a.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                        border: `1.5px solid ${config.accessory === a.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 12px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        color: 'var(--text-parchment-main)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SELECTOR: FONDO */}
            {activeSubTab === 'bg' && (
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '800', marginBottom: '10px', color: 'var(--text-parchment-main)' }}>
                  Escenario de Fondo:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {BACKGROUNDS.map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => setConfig({ ...config, background: bg.id })}
                      style={{
                        background: config.background === bg.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                        border: `1.5px solid ${config.background === bg.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 12px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        color: 'var(--text-parchment-main)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTONES DE GUARDAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid var(--bg-parchment-border)', paddingTop: '16px' }}>
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn-gold" onClick={handleSave} style={{ padding: '10px 24px' }}>
            <Check size={18} />
            <span>Guardar y Equipar Avatar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
