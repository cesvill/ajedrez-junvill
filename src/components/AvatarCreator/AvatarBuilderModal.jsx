import React, { useState } from 'react';
import { 
  DynamicAvatar, 
  SKIN_TONES, 
  HAIR_COLORS, 
  SHIRT_COLORS, 
  PANTS_COLORS, 
  SHOES_COLORS, 
  DEFAULT_AVATAR_CONFIG 
} from './DynamicAvatar';
import { FullBodyAvatar } from './FullBodyAvatar';
import { useUser } from '../../context/UserContext';
import { audioManager } from '../../engine/audio';
import confetti from 'canvas-confetti';
import { X, Sparkles, Shuffle, Check, Palette, Smile, Shirt, Crown, Image, Eye, Trophy } from 'lucide-react';

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
  { id: 'polo', label: 'Camisa Polo' },
  { id: 'cape', label: 'Capa con Hombreras' },
  { id: 'bomber', label: 'Chaqueta Bomber' },
];

const PANTS_STYLES = [
  { id: 'jeans', label: 'Jeans Denim Clásicos' },
  { id: 'sweatpants', label: 'Jogger Deportivo' },
  { id: 'formal', label: 'Pantalón de Vestir' },
  { id: 'skirt', label: 'Falda Tableada' },
  { id: 'shorts', label: 'Shorts Atléticos' },
  { id: 'cargo', label: 'Pantalón Cargo' },
  { id: 'armor_legs', label: 'Grebas Blindadas' },
];

const SHOES_STYLES = [
  { id: 'sneakers', label: 'Zapatillas Deportivas' },
  { id: 'boots', label: 'Botas de Combate' },
  { id: 'oxford', label: 'Zapatos Oxford' },
  { id: 'knight_boots', label: 'Botas de Acero' },
];

const ACCESSORIES = [
  { id: 'none', label: 'Sin Accesorio' },
  { id: 'headphones', label: 'Auriculares Gaming' },
  { id: 'crown', label: 'Corona Dorada' },
  { id: 'cap_back', label: 'Gorra hacia Atrás' },
  { id: 'headband', label: 'Diadema Deportiva' },
  { id: 'monocle', label: 'Monóculo Clásico' },
  { id: 'medal', label: 'Medalla de Oro' },
];

const HELD_ITEMS = [
  { id: 'pawn_gold', label: '♟️ Peón Dorado' },
  { id: 'knight_piece', label: '♞ Caballo Cristal' },
  { id: 'queen_piece', label: '♛ Reina Legendaria' },
  { id: 'trophy_cup', label: '🏆 Trofeo de Campeón' },
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
  const [activeSubTab, setActiveSubTab] = useState('shirt'); // 'shirt' | 'pants' | 'shoes' | 'hair' | 'eyes' | 'skin' | 'accessory' | 'heldItem' | 'bg'
  const [previewMode, setPreviewMode] = useState('fullbody'); // 'fullbody' | 'bust'

  if (!isOpen) return null;

  const handleRandomize = () => {
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].id;
    const randomHairStyle = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].id;
    const randomHairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].id;
    const randomEye = EYE_STYLES[Math.floor(Math.random() * EYE_STYLES.length)].id;
    const randomShirtStyle = SHIRT_STYLES[Math.floor(Math.random() * SHIRT_STYLES.length)].id;
    const randomShirtColor = SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)].id;
    const randomPantsStyle = PANTS_STYLES[Math.floor(Math.random() * PANTS_STYLES.length)].id;
    const randomPantsColor = PANTS_COLORS[Math.floor(Math.random() * PANTS_COLORS.length)].id;
    const randomShoesStyle = SHOES_STYLES[Math.floor(Math.random() * SHOES_STYLES.length)].id;
    const randomShoesColor = SHOES_COLORS[Math.floor(Math.random() * SHOES_COLORS.length)].id;
    const randomAcc = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id;
    const randomHeld = HELD_ITEMS[Math.floor(Math.random() * HELD_ITEMS.length)].id;
    const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)].id;

    setConfig({
      skin: randomSkin,
      hairStyle: randomHairStyle,
      hairColor: randomHairColor,
      eyeStyle: randomEye,
      shirtStyle: randomShirtStyle,
      shirtColor: randomShirtColor,
      pantsStyle: randomPantsStyle,
      pantsColor: randomPantsColor,
      shoesStyle: randomShoesStyle,
      shoesColor: randomShoesColor,
      accessory: randomAcc,
      heldItem: randomHeld,
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
      <div className="modal-card" style={{ maxWidth: '940px', width: '96vw', padding: '20px', maxHeight: '94vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1.5px solid var(--bg-parchment-border)', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={22} color="#f59e0b" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-parchment-main)', margin: 0 }}>
              Estudio de Creación y Guardarropa Junvill
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* CONTENIDO 2 COLUMNAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 1fr) minmax(320px, 1.6fr)', gap: '20px', marginBottom: '16px' }}>
          {/* COLUMNA IZQUIERDA: TARIMA DE PREVISUALIZACIÓN */}
          <div style={{
            background: 'var(--bg-parchment)',
            border: '2px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            textAlign: 'center'
          }}>
            {/* TOGGLE MODO DE VISTA */}
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.1)', padding: '3px', borderRadius: '20px' }}>
              <button
                type="button"
                onClick={() => setPreviewMode('fullbody')}
                style={{
                  background: previewMode === 'fullbody' ? 'var(--color-primary)' : 'transparent',
                  color: previewMode === 'fullbody' ? '#fff' : 'var(--text-parchment-muted)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                🧍 Cuerpo Entero
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('bust')}
                style={{
                  background: previewMode === 'bust' ? 'var(--color-primary)' : 'transparent',
                  color: previewMode === 'bust' ? '#fff' : 'var(--text-parchment-muted)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                👤 Busto
              </button>
            </div>

            <div style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.25))', minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {previewMode === 'fullbody' ? (
                <FullBodyAvatar config={config} height={190} width={150} showPedestal={true} />
              ) : (
                <DynamicAvatar config={config} size={130} />
              )}
            </div>

            <div>
              <div style={{ fontWeight: '900', fontSize: '1.10rem', color: 'var(--text-parchment-main)' }}>
                {currentUser?.name || 'Estudiante'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-gold-dark)', fontWeight: '700' }}>
                {currentUser?.title || 'Aprendiz'} • {currentUser?.elo || 600} Elo
              </div>
            </div>

            <button
              onClick={handleRandomize}
              className="btn-secondary"
              style={{ padding: '6px 16px', fontSize: '0.80rem' }}
            >
              <Shuffle size={15} />
              <span>🎲 Aleatorio</span>
            </button>
          </div>

          {/* COLUMNA DERECHA: SUBPESTAÑAS Y SELECTORES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* SUBPESTAÑAS */}
            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'shirt', label: '👕 Vestimenta Sup.' },
                { id: 'pants', label: '👖 Pantalones' },
                { id: 'shoes', label: '👟 Calzado' },
                { id: 'hair', label: '💇 Cabello' },
                { id: 'eyes', label: '👀 Rostro' },
                { id: 'skin', label: '🎨 Piel' },
                { id: 'accessory', label: '👑 Accesorios' },
                { id: 'heldItem', label: '♟️ En Mano' },
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
                    padding: '5px 11px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 1. SELECTOR: VESTIMENTA SUPERIOR */}
            {activeSubTab === 'shirt' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-parchment-main)' }}>
                    Estilo de Prenda Superior:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {SHIRT_STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setConfig({ ...config, shirtStyle: s.id })}
                        style={{
                          background: config.shirtStyle === s.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                          border: `1.5px solid ${config.shirtStyle === s.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                          borderRadius: 'var(--radius-sm)',
                          padding: '7px 6px',
                          fontSize: '0.74rem',
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
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-parchment-main)' }}>
                    Color de Vestimenta Superior:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {SHIRT_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setConfig({ ...config, shirtColor: c.id })}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: c.id,
                          border: `2.5px solid ${config.shirtColor === c.id ? '#ffffff' : 'rgba(0,0,0,0.2)'}`,
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

            {/* 2. SELECTOR: VESTIMENTA INFERIOR / PANTALONES */}
            {activeSubTab === 'pants' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-parchment-main)' }}>
                    Estilo de Pantalón o Falda:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {PANTS_STYLES.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setConfig({ ...config, pantsStyle: p.id })}
                        style={{
                          background: config.pantsStyle === p.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                          border: `1.5px solid ${config.pantsStyle === p.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                          borderRadius: 'var(--radius-sm)',
                          padding: '7px 6px',
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          color: 'var(--text-parchment-main)',
                          cursor: 'pointer'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-parchment-main)' }}>
                    Color de Pantalón / Falda:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {PANTS_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setConfig({ ...config, pantsColor: c.id })}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: c.id,
                          border: `2.5px solid ${config.pantsColor === c.id ? '#ffffff' : 'rgba(0,0,0,0.2)'}`,
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

            {/* 3. SELECTOR: CALZADO / ZAPATOS */}
            {activeSubTab === 'shoes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-parchment-main)' }}>
                    Estilo de Calzado:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {SHOES_STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setConfig({ ...config, shoesStyle: s.id })}
                        style={{
                          background: config.shoesStyle === s.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                          border: `1.5px solid ${config.shoesStyle === s.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
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
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-parchment-main)' }}>
                    Color de Calzado:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {SHOES_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setConfig({ ...config, shoesColor: c.id })}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: c.id,
                          border: `2.5px solid ${config.shoesColor === c.id ? '#ffffff' : 'rgba(0,0,0,0.2)'}`,
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

            {/* 4. SELECTOR: CABELLO Y COLOR */}
            {activeSubTab === 'hair' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-parchment-main)' }}>
                    Estilo de Peinado:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {HAIR_STYLES.map(h => (
                      <button
                        key={h.id}
                        onClick={() => setConfig({ ...config, hairStyle: h.id })}
                        style={{
                          background: config.hairStyle === h.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                          border: `1.5px solid ${config.hairStyle === h.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                          borderRadius: 'var(--radius-sm)',
                          padding: '7px 6px',
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
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '6px', color: 'var(--text-parchment-main)' }}>
                    Color de Tinte:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {HAIR_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setConfig({ ...config, hairColor: c.id })}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: c.id,
                          border: `2.5px solid ${config.hairColor === c.id ? '#ffffff' : 'rgba(0,0,0,0.2)'}`,
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

            {/* 5. SELECTOR: ROSTRO Y OJOS */}
            {activeSubTab === 'eyes' && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                  Expresión y Mirada:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {EYE_STYLES.map(e => (
                    <button
                      key={e.id}
                      onClick={() => setConfig({ ...config, eyeStyle: e.id })}
                      style={{
                        background: config.eyeStyle === e.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                        border: `1.5px solid ${config.eyeStyle === e.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '9px 10px',
                        fontSize: '0.76rem',
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

            {/* 6. SELECTOR: PIEL */}
            {activeSubTab === 'skin' && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                  Selecciona el Tono de Piel:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {SKIN_TONES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setConfig({ ...config, skin: s.id })}
                      style={{
                        background: 'var(--bg-parchment)',
                        border: `2px solid ${config.skin === s.id ? 'var(--color-primary)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: s.id, border: '1px solid rgba(0,0,0,0.2)' }} />
                      <span style={{ fontSize: '0.66rem', fontWeight: '700', color: 'var(--text-parchment-main)' }}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 7. SELECTOR: ACCESORIOS */}
            {activeSubTab === 'accessory' && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                  Sombrero o Accesorio:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {ACCESSORIES.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setConfig({ ...config, accessory: a.id })}
                      style={{
                        background: config.accessory === a.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                        border: `1.5px solid ${config.accessory === a.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '9px 10px',
                        fontSize: '0.76rem',
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

            {/* 8. SELECTOR: OBJETO EN MANO */}
            {activeSubTab === 'heldItem' && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                  Pieza o Trofeo Favorito en Mano:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {HELD_ITEMS.map(h => (
                    <button
                      key={h.id}
                      onClick={() => setConfig({ ...config, heldItem: h.id })}
                      style={{
                        background: config.heldItem === h.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                        border: `1.5px solid ${config.heldItem === h.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '9px 10px',
                        fontSize: '0.76rem',
                        fontWeight: '700',
                        color: 'var(--text-parchment-main)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 9. SELECTOR: FONDO */}
            {activeSubTab === 'bg' && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-parchment-main)' }}>
                  Escenario de Fondo:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {BACKGROUNDS.map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => setConfig({ ...config, background: bg.id })}
                      style={{
                        background: config.background === bg.id ? 'var(--color-gold-light)' : 'var(--bg-parchment)',
                        border: `1.5px solid ${config.background === bg.id ? 'var(--color-gold)' : 'var(--bg-parchment-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '9px 10px',
                        fontSize: '0.76rem',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid var(--bg-parchment-border)', paddingTop: '12px' }}>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
            Cancelar
          </button>

          <button className="btn-gold" onClick={handleSave} style={{ padding: '9px 22px', fontSize: '0.86rem' }}>
            <Check size={18} />
            <span>Guardar y Equipar Avatar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
