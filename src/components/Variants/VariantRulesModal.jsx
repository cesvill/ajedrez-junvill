import React from 'react';
import { getVariantById } from '../../engine/variantsEngine';
import { X, Target, Zap, Lightbulb, Swords, CheckCircle } from 'lucide-react';

export const VariantRulesModal = ({ isOpen, onClose, variantId = 'standard' }) => {
  if (!isOpen) return null;

  const variant = getVariantById(variantId);
  const rules = variant?.rules || {
    goal: 'Dar Jaque Mate al Rey rival.',
    mechanics: ['Reglas estándar del ajedrez.'],
    proTip: 'Controla el centro y cuida a tu rey.'
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 130, padding: '14px' }} onClick={onClose}>
      <div
        className="modal-card"
        style={{
          maxWidth: '540px',
          width: '100%',
          padding: '24px',
          background: 'var(--bg-parchment-card)',
          border: `2px solid ${variant.borderColor || 'var(--color-gold)'}`,
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABECERA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1.5px solid var(--bg-parchment-border)', paddingBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                background: variant.borderColor || '#3b82f6',
                color: 'white',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.70rem',
                fontWeight: '900',
                textTransform: 'uppercase'
              }}>
                {variant.badge}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-parchment-muted)', fontWeight: '700' }}>
                REGLAS MÍNIMAS DE LA MODALIDAD
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-parchment-main)', margin: 0, fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{variant.icon}</span>
              <span>{variant.name}</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)', padding: '4px' }}
            title="Cerrar reglas"
          >
            <X size={22} />
          </button>
        </div>

        {/* CUERPO DE REGLAS ESPECÍFICAS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 1. OBJETIVO DE VICTORIA */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.10)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '10px',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', color: '#f59e0b', fontSize: '0.86rem', marginBottom: '4px' }}>
              <Target size={16} />
              <span>¿CÓMO SE GANA EN ESTE JUEGO?</span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-parchment-main)', margin: 0, lineHeight: '1.45', fontWeight: '600' }}>
              {rules.goal}
            </p>
          </div>

          {/* 2. PARTICULARIDADES Y REGLAS ESPECIALES */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', color: 'var(--text-parchment-main)', fontSize: '0.86rem', marginBottom: '8px' }}>
              <Zap size={16} color="#38bdf8" />
              <span>PARTICULARIDADES & DIFERENCIAS:</span>
            </div>

            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rules.mechanics.map((rule, idx) => (
                <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-parchment-muted)', lineHeight: '1.4' }}>
                  <strong style={{ color: 'var(--text-parchment-main)' }}>{rule}</strong>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. CONSEJO TÁCTICO */}
          {rules.proTip && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.10)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '10px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', color: '#10b981', fontSize: '0.84rem', marginBottom: '4px' }}>
                <Lightbulb size={16} />
                <span>CONSEJO TÁCTICO DE DON AURELIO:</span>
              </div>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-parchment-main)', margin: 0, lineHeight: '1.4', fontStyle: 'italic' }}>
                "{rules.proTip}"
              </p>
            </div>
          )}

          {/* BOTÓN ENTENDIDO */}
          <button
            type="button"
            className="btn-gold"
            onClick={onClose}
            style={{ width: '100%', padding: '11px', fontSize: '0.90rem', justifyContent: 'center', marginTop: '4px', fontWeight: '800' }}
          >
            <CheckCircle size={16} />
            <span>¡Entendido, a jugar!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
