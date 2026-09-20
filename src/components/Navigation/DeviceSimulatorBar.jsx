import React, { useState } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Eye,
  EyeOff
} from 'lucide-react';

export const DEVICE_CONFIGS = {
  responsive: {
    id: 'responsive',
    name: 'Escritorio / Fluido (100%)',
    shortName: 'Escritorio',
    width: null,
    height: null,
    tag: '100% Widescreen',
    icon: Monitor,
    activeClass: 'active-responsive'
  },
  galaxy_tab_s3: {
    id: 'galaxy_tab_s3',
    name: 'Samsung Galaxy Tab S3 SM-T820',
    shortName: 'Tab S3 (4:3)',
    width: 768,
    height: 1024,
    tag: '1024 × 768 px (4:3) • Super AMOLED',
    badge: 'Tablet 4:3',
    icon: Tablet,
    defaultOrientation: 'landscape',
    activeClass: 'active-tabs3'
  },
  galaxy_tab_s8: {
    id: 'galaxy_tab_s8',
    name: 'Samsung Galaxy Tab S8 (11")',
    shortName: 'Tab S8 (11")',
    width: 800,
    height: 1280,
    tag: '800 × 1280 px • Tablet Panorámica',
    badge: '16:10',
    icon: Tablet,
    defaultOrientation: 'portrait',
    activeClass: 'active-tabs8'
  },
  pixel10pro: {
    id: 'pixel10pro',
    name: 'Google Pixel 10 Pro',
    shortName: 'Pixel 10 Pro',
    width: 412,
    height: 915,
    tag: '412 × 915 px • Smartphone Flagship',
    badge: 'Móvil Flagship',
    icon: Smartphone,
    defaultOrientation: 'portrait',
    activeClass: 'active-pixel'
  },
  fold_narrow: {
    id: 'fold_narrow',
    name: 'Galaxy Z Fold (Frontal 21:9)',
    shortName: 'Z Fold (344px)',
    width: 344,
    height: 882,
    tag: '344 × 882 px (21:9 Ultra-Estrecho) • Celular Plegable',
    badge: '21:9 Plegable',
    icon: Smartphone,
    defaultOrientation: 'portrait',
    activeClass: 'active-fold'
  },
};

export const DeviceSimulatorBar = ({
  currentDevice = 'responsive',
  onSelectDevice,
  orientation = 'portrait',
  onToggleOrientation,
  scale = 'fit',
  fitScale = 1,
  onCycleScale,
  onMinimize,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const isSimulated = currentDevice !== 'responsive';
  const config = DEVICE_CONFIGS[currentDevice] || DEVICE_CONFIGS.responsive;

  return (
    <header className="device-sim-bar" role="toolbar" aria-label="Barra de Simulación de Dispositivos Físicos">
      <div className="device-sim-bar-inner">
        {/* Barra compacta visible en pantallas < 640px */}
        <div className="device-sim-mobile-header">
          <button
            type="button"
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="device-sim-action-btn"
            style={{ color: '#facc15', fontWeight: 800 }}
          >
            <Sparkles size={14} color="#facc15" />
            <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {config.shortName}
            </span>
            {isMobileExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isSimulated && (
              <button
                type="button"
                onClick={onToggleOrientation}
                title="Girar orientación"
                className="device-sim-action-btn"
                style={{ padding: '6px 8px' }}
              >
                <RotateCw size={14} color="#facc15" />
              </button>
            )}
            <span className="device-sim-status-pill">✓ Test Activo</span>
          </div>
        </div>

        {/* Controles Completos: visibles en pantallas >= 640px o desplegados en móvil */}
        <div className={`device-sim-desktop-controls ${isMobileExpanded ? 'is-expanded' : ''}`} style={{ width: '100%', display: undefined }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
            
            {/* Lado Izquierdo: Insignia + Botones de Dispositivos */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
              <div className="device-sim-title-badge" style={{ display: isMobileExpanded ? 'none' : 'flex' }}>
                <Sparkles size={14} color="#facc15" />
                <span>Simulador de Hardware</span>
              </div>

              <div className="device-sim-btn-group">
                {Object.values(DEVICE_CONFIGS).map((dev) => {
                  const Icon = dev.icon;
                  const isActive = currentDevice === dev.id;
                  return (
                    <button
                      key={dev.id}
                      type="button"
                      onClick={() => onSelectDevice(dev.id)}
                      title={dev.tag}
                      className={`device-sim-btn ${isActive ? dev.activeClass : ''}`}
                    >
                      <Icon size={14} />
                      <span>{dev.shortName}</span>
                      {dev.badge && (
                        <span 
                          className="device-sim-tag"
                          style={{
                            background: isActive ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.08)',
                            color: isActive ? 'inherit' : '#94a3b8'
                          }}
                        >
                          {dev.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lado Derecho: Acciones de Orientación, Escala y Estado */}
            <div className="device-sim-actions">
              {isSimulated && (
                <>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8', display: 'none' }} className="hidden-sm-block">
                    {config.tag} ({orientation === 'portrait' ? 'Vertical' : 'Horizontal'})
                  </span>

                  <button
                    type="button"
                    onClick={onToggleOrientation}
                    title="Girar orientación física (Vertical / Horizontal)"
                    className="device-sim-action-btn"
                  >
                    <RotateCw size={13} color="#facc15" />
                    <span>{orientation === 'portrait' ? 'Girar a Horizontal' : 'Girar a Vertical'}</span>
                  </button>

                  {onCycleScale && (
                    <button
                      type="button"
                      onClick={onCycleScale}
                      title="Cambiar escala (Auto-Ajustar / 100% / 85% / 75%)"
                      className="device-sim-action-btn"
                      style={scale === 'fit' ? { borderColor: '#38bdf8', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)' } : undefined}
                    >
                      <Maximize2 size={13} color="#38bdf8" />
                      <span>
                        {scale === 'fit' 
                          ? `Ajustar (${Math.round(fitScale * 100)}%)` 
                          : (scale === 1 ? '100%' : `${Math.round(scale * 100)}%`)}
                      </span>
                    </button>
                  )}
                </>
              )}

              <span className="device-sim-status-pill">
                ✓ Modo Prueba Activo
              </span>

              {onMinimize && (
                <button
                  type="button"
                  onClick={onMinimize}
                  title="Ocultar barra de simulación"
                  className="device-sim-action-btn"
                  style={{ padding: '6px 8px' }}
                >
                  <EyeOff size={13} />
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </header>
  );
};
