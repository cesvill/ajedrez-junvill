import React from 'react';
import { DynamicAvatar, DEFAULT_AVATAR_CONFIG } from '../components/AvatarCreator/DynamicAvatar';

/**
 * Galería de Avatares Ilustrados para Estudiantes y Tutores Junvill
 */

export const AVATAR_LIST = [
  { id: 'teen_gamer', name: 'Mateo Jugador', role: 'Estudiante Táctico', color: '#2563eb' },
  { id: 'girl_gamer', name: 'Sofía Aprendiz', role: 'Estudiante Estratega', color: '#db2777' },
  { id: 'king', name: 'Rey Sabio', role: 'Estratega Calmado', color: '#d97706' },
  { id: 'queen', name: 'Dama Audaz', role: 'Atacante Dinámica', color: '#9333ea' },
  { id: 'knight', name: 'Caballero Ágil', role: 'Táctico Impredecible', color: '#0284c7' },
  { id: 'owl', name: 'Búho Visionario', role: 'Calculador Profundo', color: '#059669' },
  { id: 'bishop', name: 'Alfil Iluminado', role: 'Dominador de Diagonales', color: '#d946ef' },
  { id: 'pawn', name: 'Peón Valiente', role: 'Promesa del Futuro', color: '#ea580c' },
  { id: 'dragon', name: 'Dragón Táctico', role: 'Furia Combinativa', color: '#dc2626' }
];

export const AvatarIcon = ({ avatarId = 'coach_aurelio', avatarConfig = null, size = 44, className = "" }) => {
  if (avatarConfig || avatarId === 'custom_dynamic') {
    return <DynamicAvatar config={avatarConfig || DEFAULT_AVATAR_CONFIG} size={size} className={className} />;
  }

  switch (avatarId) {
    // --- TUTORES OFICIALES JUNVILL ---
    case 'coach_aurelio':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#fef3c7" stroke="#b45309" strokeWidth="3" />
          {/* Cabello plateado y calvicie superior */}
          <path d="M 22,48 Q 20,30 35,22 Q 50,20 65,22 Q 80,30 78,48" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
          {/* Rostro senior */}
          <circle cx="50" cy="50" r="24" fill="#fed7aa" />
          {/* Barba y bigote canoso */}
          <path d="M 32,54 Q 50,84 68,54 Q 50,72 32,54 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M 40,56 Q 50,62 60,56" fill="none" stroke="#94a3b8" strokeWidth="2" />
          {/* Gafas redondas de lectura */}
          <circle cx="41" cy="46" r="7" fill="none" stroke="#78350f" strokeWidth="2.5" />
          <circle cx="59" cy="46" r="7" fill="none" stroke="#78350f" strokeWidth="2.5" />
          <line x1="48" y1="46" x2="52" y2="46" stroke="#78350f" strokeWidth="2.5" />
          <circle cx="41" cy="46" r="2.5" fill="#451a03" />
          <circle cx="59" cy="46" r="2.5" fill="#451a03" />
          {/* Chaleco de maestro */}
          <path d="M 25,92 L 38,72 L 62,72 L 75,92 Z" fill="#b45309" />
          <polygon points="50,72 46,84 54,84" fill="#dc2626" />
        </svg>
      );

    case 'coach_beatriz':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#d1fae5" stroke="#047857" strokeWidth="3" />
          {/* Moño plateado elegante */}
          <circle cx="50" cy="22" r="12" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
          <path d="M 25,46 Q 24,28 50,26 Q 76,28 75,46" fill="#cbd5e1" />
          {/* Rostro distinguido */}
          <circle cx="50" cy="52" r="22" fill="#ffedd5" />
          {/* Gafas elegantes cuadradas */}
          <rect x="34" y="44" width="13" height="10" rx="3" fill="none" stroke="#065f46" strokeWidth="2" />
          <rect x="53" y="44" width="13" height="10" rx="3" fill="none" stroke="#065f46" strokeWidth="2" />
          <line x1="47" y1="49" x2="53" y2="49" stroke="#065f46" strokeWidth="2" />
          <circle cx="40" cy="49" r="2" fill="#1e293b" />
          <circle cx="60" cy="49" r="2" fill="#1e293b" />
          {/* Sonrisa serena */}
          <path d="M 44,63 Q 50,68 56,63" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
          {/* Blazer verde esmeralda y collar de perlas */}
          <path d="M 24,92 Q 50,74 76,92 Z" fill="#047857" />
          <circle cx="50" cy="80" r="3" fill="#fef08a" />
        </svg>
      );

    case 'coach_mateo':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
          {/* Cabello juvenil moderno despeinado */}
          <path d="M 24,44 Q 30,16 55,20 Q 76,18 76,42 Q 62,28 24,44 Z" fill="#451a03" />
          {/* Rostro joven */}
          <circle cx="50" cy="52" r="22" fill="#fed7aa" />
          {/* Ojos expresivos */}
          <circle cx="42" cy="48" r="3.5" fill="#1e3a8a" />
          <circle cx="58" cy="48" r="3.5" fill="#1e3a8a" />
          {/* Sonrisa enérgica */}
          <path d="M 43,62 Q 50,70 57,62" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
          {/* Sudadera moderna con capucha */}
          <path d="M 22,92 Q 50,72 78,92 Z" fill="#2563eb" />
          <polygon points="50,76 46,92 54,92" fill="#93c5fd" />
        </svg>
      );

    case 'coach_valeria':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#fce7f3" stroke="#db2777" strokeWidth="3" />
          {/* Cabello castaño largo con coleta */}
          <path d="M 25,42 Q 22,18 50,18 Q 78,18 75,42" fill="#78350f" />
          <path d="M 72,30 Q 88,45 80,68" fill="none" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />
          {/* Rostro joven */}
          <circle cx="50" cy="52" r="22" fill="#fed7aa" />
          <circle cx="42" cy="48" r="3.5" fill="#581c87" />
          <circle cx="58" cy="48" r="3.5" fill="#581c87" />
          {/* Auriculares gamer / streamer */}
          <path d="M 26,48 Q 24,20 50,20 Q 76,20 74,48" fill="none" stroke="#ec4899" strokeWidth="4" />
          <rect x="22" y="44" width="7" height="12" rx="3" fill="#db2777" />
          <rect x="71" y="44" width="7" height="12" rx="3" fill="#db2777" />
          {/* Sonrisa brillante */}
          <path d="M 44,63 Q 50,69 56,63" fill="none" stroke="#be185d" strokeWidth="2.5" strokeLinecap="round" />
          {/* Chaqueta casual */}
          <path d="M 24,92 Q 50,72 76,92 Z" fill="#db2777" />
        </svg>
      );

    case 'coach_ada':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="3" />
          {/* Cabeza cibernética */}
          <rect x="28" y="28" width="44" height="44" rx="14" fill="#312e81" stroke="#8b5cf6" strokeWidth="2" />
          {/* Visor holográfico luminoso */}
          <rect x="34" y="42" width="32" height="10" rx="4" fill="#38bdf8" />
          <circle cx="42" cy="47" r="2" fill="#ffffff" />
          <circle cx="58" cy="47" r="2" fill="#ffffff" />
          {/* Líneas de circuito */}
          <line x1="50" y1="28" x2="50" y2="18" stroke="#a78bfa" strokeWidth="3" />
          <circle cx="50" cy="16" r="4" fill="#38bdf8" />
          <line x1="38" y1="62" x2="62" y2="62" stroke="#a78bfa" strokeWidth="2" />
          {/* Cuello y armadura */}
          <path d="M 26,92 Q 50,76 74,92 Z" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="2" />
        </svg>
      );

    case 'coach_junvill_king':
    case 'king':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
          {/* Corona */}
          <path d="M 25,45 L 30,25 L 42,36 L 50,18 L 58,36 L 70,25 L 75,45 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
          <circle cx="50" cy="16" r="3" fill="#ef4444" />
          <circle cx="30" cy="23" r="2.5" fill="#3b82f6" />
          <circle cx="70" cy="23" r="2.5" fill="#3b82f6" />
          {/* Cara sonriente y barba */}
          <circle cx="50" cy="56" r="22" fill="#fed7aa" />
          <circle cx="43" cy="52" r="2.5" fill="#451a03" />
          <circle cx="57" cy="52" r="2.5" fill="#451a03" />
          <path d="M 45,62 Q 50,67 55,62" fill="none" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
          <path d="M 36,65 Q 50,88 64,65 Q 50,80 36,65 Z" fill="#ffffff" stroke="#d1d5db" strokeWidth="1.5" />
        </svg>
      );

    case 'teen_gamer':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#eff6ff" stroke="#3b82f6" strokeWidth="3" />
          <path d="M 26,44 Q 32,20 54,22 Q 74,20 74,44" fill="#451a03" />
          <circle cx="50" cy="54" r="22" fill="#fed7aa" />
          <circle cx="43" cy="50" r="3" fill="#1e293b" />
          <circle cx="57" cy="50" r="3" fill="#1e293b" />
          <path d="M 45,62 Q 50,68 55,62" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
          <path d="M 26,92 Q 50,74 74,92 Z" fill="#2563eb" />
        </svg>
      );

    case 'girl_gamer':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#fdf2f8" stroke="#ec4899" strokeWidth="3" />
          <path d="M 25,42 Q 22,18 50,18 Q 78,18 75,42" fill="#78350f" />
          <circle cx="50" cy="54" r="22" fill="#fed7aa" />
          <circle cx="43" cy="50" r="3" fill="#581c87" />
          <circle cx="57" cy="50" r="3" fill="#581c87" />
          <path d="M 45,62 Q 50,68 55,62" fill="none" stroke="#be185d" strokeWidth="2" strokeLinecap="round" />
          <path d="M 26,92 Q 50,74 74,92 Z" fill="#db2777" />
        </svg>
      );

    case 'queen':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#fae8ff" stroke="#9333ea" strokeWidth="3" />
          <path d="M 28,42 L 35,24 L 50,34 L 65,24 L 72,42 Z" fill="#c084fc" stroke="#7e22ce" strokeWidth="2" />
          <circle cx="35" cy="22" r="3" fill="#f43f5e" />
          <circle cx="50" cy="32" r="3" fill="#38bdf8" />
          <circle cx="65" cy="22" r="3" fill="#f43f5e" />
          <circle cx="50" cy="56" r="20" fill="#fce7f3" />
          <circle cx="44" cy="54" r="2.5" fill="#581c87" />
          <circle cx="56" cy="54" r="2.5" fill="#581c87" />
          <path d="M 46,64 Q 50,68 54,64" fill="none" stroke="#be185d" strokeWidth="2" strokeLinecap="round" />
          <path d="M 30,50 Q 24,70 34,80 M 70,50 Q 76,70 66,80" fill="none" stroke="#6b21a8" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'knight':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
          <path d="M 35,68 C 30,48 42,28 65,22 C 60,32 68,36 68,44 C 62,45 52,50 48,56 C 45,62 48,72 35,68 Z" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="2.5" />
          <path d="M 58,22 Q 45,14 38,28 Q 32,40 35,50" fill="none" stroke="#1e40af" strokeWidth="3" />
          <circle cx="55" cy="35" r="3.5" fill="#1e3a8a" />
          <polygon points="50,42 42,48 48,50" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="1" />
        </svg>
      );

    case 'owl':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#d1fae5" stroke="#059669" strokeWidth="3" />
          <polygon points="30,30 25,18 40,26" fill="#047857" />
          <polygon points="70,30 75,18 60,26" fill="#047857" />
          <ellipse cx="50" cy="54" rx="26" ry="24" fill="#10b981" />
          <circle cx="40" cy="48" r="10" fill="#ffffff" stroke="#065f46" strokeWidth="2" />
          <circle cx="60" cy="48" r="10" fill="#ffffff" stroke="#065f46" strokeWidth="2" />
          <circle cx="40" cy="48" r="5" fill="#064e3b" />
          <circle cx="60" cy="48" r="5" fill="#064e3b" />
          <polygon points="46,56 54,56 50,64" fill="#f59e0b" />
        </svg>
      );

    case 'bishop':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#fdf4ff" stroke="#d946ef" strokeWidth="3" />
          <path d="M 32,70 C 30,45 42,24 50,18 C 58,24 70,45 68,70 Z" fill="#e879f9" stroke="#a21caf" strokeWidth="2.5" />
          <circle cx="50" cy="16" r="3" fill="#fbbf24" />
          <line x1="50" y1="32" x2="50" y2="52" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <line x1="42" y1="40" x2="58" y2="40" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="44" cy="58" r="2.5" fill="#701a75" />
          <circle cx="56" cy="58" r="2.5" fill="#701a75" />
        </svg>
      );

    case 'pawn':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#ffedd5" stroke="#ea580c" strokeWidth="3" />
          <path d="M 28,75 Q 50,90 72,75 L 68,52 L 32,52 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="2" />
          <circle cx="50" cy="40" r="16" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
          <circle cx="44" cy="38" r="2.5" fill="#7c2d12" />
          <circle cx="56" cy="38" r="2.5" fill="#7c2d12" />
          <path d="M 45,46 Q 50,50 55,46" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
          <polygon points="50,20 54,26 46,26" fill="#ef4444" />
        </svg>
      );

    case 'dragon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="48" fill="#fee2e2" stroke="#dc2626" strokeWidth="3" />
          <path d="M 26,45 Q 35,20 65,25 Q 75,35 70,55 Q 58,75 35,68 Q 22,60 26,45 Z" fill="#f87171" stroke="#991b1b" strokeWidth="2.5" />
          <polygon points="40,20 44,12 48,22" fill="#b91c1c" />
          <polygon points="55,22 60,14 63,25" fill="#b91c1c" />
          <circle cx="54" cy="38" r="3.5" fill="#fef08a" />
          <circle cx="54" cy="38" r="1.5" fill="#7f1d1d" />
          <path d="M 40,58 Q 50,62 58,54" fill="none" stroke="#7f1d1d" strokeWidth="2" />
          <path d="M 28,52 Q 18,52 14,46 Q 20,44 26,48 Z" fill="#f59e0b" />
        </svg>
      );

    default:
      return (
        <div style={{ width: size, height: size, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
          ♟️
        </div>
      );
  }
};
