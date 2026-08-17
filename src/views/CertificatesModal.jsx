import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { getCoachById } from '../assets/coachesData';
import { X, Award, Printer, Crown, CheckCircle } from 'lucide-react';

const DIPLOMA_STAGES = [
  { id: 'etapa-1-basicos', title: 'Diplomado en Fundamentos y Reglas', stageName: 'Etapa 1 (0 - 800 Elo)', desc: 'Por haber completado con éxito los 24 conceptos básicos de iniciación al ajedrez.' },
  { id: 'etapa-2-tactica', title: 'Diplomado en Táctica y Combinaciones', stageName: 'Etapa 2 (800 - 1200 Elo)', desc: 'Por dominar las clavadas, tenedores, enfiladas y sacrificios de demolición.' },
  { id: 'etapa-3-finales', title: 'Diplomado en Estrategia y Finales', stageName: 'Etapa 3 (1200 - 1500 Elo)', desc: 'Por la asimilación de la técnica de finales de reyes, peones y torres.' },
  { id: 'etapa-4-mediojuego', title: 'Diplomado en Medio Juego y Aperturas', stageName: 'Etapa 4 (1500 - 1800 Elo)', desc: 'Por la comprensión profunda del control central, profilaxis y estructuras.' },
  { id: 'etapa-5-maestria', title: 'Gran Maestría y Nivel FIDE Junvill', stageName: 'Etapa 5 (1800 - 2200+ Elo)', desc: 'Por culminar el árbol de 110 puntos y alcanzar la máxima excelencia competitiva.' },
];

export const CertificatesModal = ({ isOpen, onClose }) => {
  const { currentUser } = useUser();
  const activeCoach = getCoachById(currentUser?.coachSettings?.coachAvatar || 'coach_aurelio');
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);

  if (!isOpen) return null;

  const currentDiploma = DIPLOMA_STAGES[selectedStageIdx];
  const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '780px', width: '95vw', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={22} color="#f59e0b" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-parchment-main)', margin: 0 }}>
              Certificados y Diplomas Oficiales Junvill
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* SELECTOR DE ETAPA DE DIPLOMA */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px' }}>
          {DIPLOMA_STAGES.map((stg, i) => (
            <button
              key={stg.id}
              onClick={() => setSelectedStageIdx(i)}
              style={{
                background: selectedStageIdx === i ? 'var(--color-primary)' : 'var(--bg-parchment)',
                color: selectedStageIdx === i ? 'white' : 'var(--text-parchment-muted)',
                border: '1.5px solid var(--bg-parchment-border)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Etapa {i + 1}
            </button>
          ))}
        </div>

        {/* DIPLOMA OFICIAL (ESTILO PERGAMINO REAL IMPRIMIBLE) */}
        <div style={{
          background: '#fffdfa',
          border: '8px double #b45309',
          borderRadius: '12px',
          padding: '36px 30px',
          textAlign: 'center',
          color: '#292524',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          position: 'relative',
          marginBottom: '20px'
        }}>
          {/* Sello de Agua / Corona */}
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>👑</div>

          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', letterSpacing: '2px', color: '#b45309', fontWeight: '800', textTransform: 'uppercase' }}>
            Academia de Ajedrez Junvill
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', color: '#78350f', margin: '8px 0 4px', fontWeight: '900' }}>
            DIPLOMA DE EXCELENCIA
          </h1>

          <div style={{ fontSize: '0.88rem', color: '#78716c', fontStyle: 'italic', marginBottom: '16px' }}>
            Otorga el presente reconocimiento oficial a:
          </div>

          {/* Nombre del Alumno */}
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            fontWeight: '900',
            color: '#1c1917',
            borderBottom: '2px solid #d97706',
            display: 'inline-block',
            padding: '0 30px 4px',
            marginBottom: '14px'
          }}>
            {currentUser.name}
          </div>

          <p style={{ fontSize: '0.92rem', color: '#44403c', maxWidth: '520px', margin: '0 auto 18px', lineHeight: '1.4' }}>
            {currentDiploma.desc}
          </p>

          <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#b45309', marginBottom: '24px' }}>
            {currentDiploma.title} ({currentDiploma.stageName})
          </div>

          {/* Firmas y Sellos */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px solid #e7e5e4' }}>
            <div>
              <div style={{ fontFamily: 'cursive', fontSize: '1.2rem', color: '#78350f', marginBottom: '2px' }}>
                {activeCoach.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#78716c', textTransform: 'uppercase', fontWeight: '700' }}>
                Tutor Maestro Titular
              </div>
            </div>

            {/* Sello Dorado */}
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fde68a 0%, #f59e0b 80%, #b45309 100%)',
              border: '3px solid #78350f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#451a03',
              fontSize: '0.62rem',
              fontWeight: '900',
              textAlign: 'center',
              textTransform: 'uppercase',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}>
              Sello<br />Oficial
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#292524', marginBottom: '2px' }}>
                {today}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#78716c', textTransform: 'uppercase', fontWeight: '700' }}>
                Fecha de Emisión
              </div>
            </div>
          </div>
        </div>

        {/* BOTÓN IMPRIMIR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn-gold" onClick={handlePrint}>
            <Printer size={18} />
            <span>Imprimir Diploma / Guardar en PDF</span>
          </button>

          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
