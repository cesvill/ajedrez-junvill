import React from 'react';
import { Bug } from 'lucide-react';

export const BugReportFloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bug-report-floating-btn"
      title="¿Viste algún error? Reportar problema con captura de estado"
      aria-label="Reportar error"
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 9990,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.95) 100%)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(4px)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.6), 0 3px 8px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(239, 68, 68, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)';
      }}
    >
      <Bug size={20} />
    </button>
  );
};
