import React from 'react';
import { useUser } from '../../context/UserContext';
import { Target, Compass, Layers, Calculator, BookOpen, Flag, Shield } from 'lucide-react';

const SKILLS = [
  { key: 'tactica', label: 'Táctica', icon: Target, angle: 0 },
  { key: 'calculo', label: 'Cálculo', icon: Calculator, angle: 60 },
  { key: 'aperturas', label: 'Aperturas', icon: BookOpen, angle: 120 },
  { key: 'estrategia', label: 'Estrategia', icon: Compass, angle: 180 },
  { key: 'posicional', label: 'Posicional', icon: Layers, angle: 240 },
  { key: 'finales', label: 'Finales', icon: Flag, angle: 300 },
];

export const YusupovRadar = ({ size = 280 }) => {
  const { currentUser } = useUser();
  const skills = currentUser?.radarSkills || {
    tactica: 30,
    calculo: 30,
    aperturas: 25,
    estrategia: 25,
    posicional: 20,
    finales: 20
  };

  const center = size / 2;
  const radius = (size / 2) - 42;

  // Convertir ángulo y valor (0-100) a coordenadas polares X,Y
  const getCoordinates = (value, angleDeg) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);
    return { x, y };
  };

  // Puntos del polígono del jugador
  const polygonPoints = SKILLS.map(skill => {
    const val = Math.max(10, Math.min(100, skills[skill.key] || 15));
    const coords = getCoordinates(val, skill.angle);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  // Círculos concéntricos de referencia (25%, 50%, 75%, 100%)
  const gridLevels = [25, 50, 75, 100];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Rejilla concéntrica hexagonal */}
        {gridLevels.map(level => {
          const points = SKILLS.map(skill => {
            const coords = getCoordinates(level, skill.angle);
            return `${coords.x},${coords.y}`;
          }).join(' ');
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="var(--bg-parchment-border)"
              strokeWidth="1"
              strokeDasharray={level < 100 ? "3,3" : "none"}
            />
          );
        })}

        {/* Ejes radiales */}
        {SKILLS.map(skill => {
          const target = getCoordinates(100, skill.angle);
          return (
            <line
              key={skill.key}
              x1={center}
              y1={center}
              x2={target.x}
              y2={target.y}
              stroke="var(--bg-parchment-border)"
              strokeWidth="1"
            />
          );
        })}

        {/* Polígono de Habilidades del Jugador */}
        <polygon
          points={polygonPoints}
          fill="rgba(59, 130, 246, 0.35)"
          stroke="#3b82f6"
          strokeWidth="2.5"
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Puntos de vértice con valores */}
        {SKILLS.map(skill => {
          const val = Math.max(10, Math.min(100, skills[skill.key] || 15));
          const coords = getCoordinates(val, skill.angle);
          const labelCoords = getCoordinates(120, skill.angle);

          return (
            <g key={skill.key}>
              <circle
                cx={coords.x}
                cy={coords.y}
                r="4.5"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={labelCoords.x}
                y={labelCoords.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--text-parchment-main)"
                fontSize="11"
                fontWeight="700"
                fontFamily="var(--font-sans)"
              >
                {skill.label} ({skills[skill.key] || 15}%)
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
