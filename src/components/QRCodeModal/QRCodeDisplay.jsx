import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, Download, ExternalLink } from 'lucide-react';

export const QRCodeDisplay = ({
  value,
  size = 200,
  title = "Escanea con la cámara de tu celular",
  subtitle = "Abre instantáneamente la partida o lección sin escribir enlaces"
}) => {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    if (!value || !canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    }, (error) => {
      if (error) {
        console.error("Error generating QR code:", error);
      } else if (canvasRef.current) {
        setDataUrl(canvasRef.current.toDataURL());
      }
    });
  }, [value, size]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = 'qr-ajedrez-junvill.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'rgba(15, 23, 42, 0.95)',
      border: '1.5px solid rgba(255, 255, 255, 0.18)',
      borderRadius: 'var(--radius-lg, 12px)',
      padding: '18px 20px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      textAlign: 'center',
      width: '100%',
      maxWidth: '360px',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#fde047' }}>
        <QrCode size={20} />
        <span style={{ fontSize: '0.92rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Código QR de Acceso
        </span>
      </div>

      <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.35' }}>
        {subtitle}
      </p>

      {/* Contenedor Blanco del Canvas QR */}
      <div style={{
        background: '#ffffff',
        padding: '12px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <canvas ref={canvasRef} style={{ width: `${size}px`, height: `${size}px`, display: 'block' }} />
      </div>

      <div style={{ marginTop: '12px', fontSize: '0.78rem', color: '#94a3b8', wordBreak: 'break-all', maxWidth: '100%', fontFamily: 'monospace' }}>
        {value}
      </div>

      {/* Botones de Acción */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '14px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn-gold"
          onClick={handleCopyUrl}
          style={{ padding: '8px 14px', fontSize: '0.82rem', gap: '6px' }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? '¡Copiado!' : 'Copiar URL'}</span>
        </button>

        <button
          type="button"
          className="btn-secondary"
          onClick={handleDownloadQR}
          style={{ padding: '8px 14px', fontSize: '0.82rem', gap: '6px' }}
          title="Descargar imagen QR en PNG"
        >
          <Download size={15} />
          <span>Guardar QR</span>
        </button>
      </div>
    </div>
  );
};
