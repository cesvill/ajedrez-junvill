import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { X, Copy, Check, FileText, Download } from 'lucide-react';

export const PgnToolModal = ({ isOpen, onClose, moveHistory, currentFen }) => {
  const { currentUser } = useUser();
  const [copied, setCopied] = useState(false);
  const [inputPgn, setInputPgn] = useState('');

  if (!isOpen) return null;

  // Generar PGN formateado estándar FIDE
  const generatePgnText = () => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '.');
    let pgn = `[Event "Partida de Entrenamiento Ajedrez Junvill"]\n`;
    pgn += `[Site "Ajedrez Junvill WebApp"]\n`;
    pgn += `[Date "${today}"]\n`;
    pgn += `[Round "1"]\n`;
    pgn += `[White "${currentUser.name}"]\n`;
    pgn += `[Black "Bot Oponente"]\n`;
    pgn += `[Result "*"]\n\n`;

    if (moveHistory && moveHistory.length > 0) {
      for (let i = 0; i < moveHistory.length; i += 2) {
        const moveNum = Math.floor(i / 2) + 1;
        const wMove = moveHistory[i]?.san || '';
        const bMove = moveHistory[i + 1]?.san || '';
        pgn += `${moveNum}. ${wMove} ${bMove} `;
      }
    } else {
      pgn += '{ Sin jugadas registradas aún }';
    }

    return pgn.trim();
  };

  const pgnContent = generatePgnText();

  const handleCopy = () => {
    navigator.clipboard.writeText(pgnContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '560px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--color-primary)" />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-parchment-main)', margin: 0 }}>
              Exportar e Importar PGN / FEN
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-parchment-muted)' }}>
            <X size={22} />
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-parchment-muted)', marginBottom: '12px' }}>
          Copia la notación PGN oficial para analizarla en ChessBase, Lichess o compartirla:
        </p>

        {/* Caja de PGN */}
        <textarea
          readOnly
          value={pgnContent}
          style={{
            width: '100%',
            height: '140px',
            background: 'var(--bg-parchment)',
            border: '1.5px solid var(--bg-parchment-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: 'var(--text-parchment-main)',
            resize: 'none',
            marginBottom: '14px'
          }}
        />

        {/* FEN Actual */}
        {currentFen && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-parchment-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Código FEN de la posición actual:
            </div>
            <div style={{ background: 'var(--bg-parchment)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-gold-dark)', overflowX: 'auto', whiteSpace: 'nowrap', border: '1px solid var(--bg-parchment-border)' }}>
              {currentFen}
            </div>
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn-gold" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? '¡PGN Copiado!' : 'Copiar PGN al Portapapeles'}</span>
          </button>

          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
