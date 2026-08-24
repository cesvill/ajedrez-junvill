import React from 'react';
import { RotateCcw, AlertTriangle, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.href = '/?view=inicio';
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          minHeight: '260px',
          padding: '24px',
          background: '#0a0f1d',
          border: '2px solid #ef4444',
          borderRadius: '16px',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '14px',
          margin: '20px auto',
          maxWidth: '600px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.6)'
        }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '50%'
          }}>
            <AlertTriangle size={36} />
          </div>

          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#fca5a5' }}>
            Se detectó una interrupción visual
          </h3>

          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, maxWidth: '440px' }}>
            {this.props.componentName ? `Ocurrió un evento en ${this.props.componentName}. ` : ''}
            No te preocupes, tus datos y progreso están a salvo. Puedes reanudar inmediatamente.
          </p>

          {this.state.error && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.72rem',
              color: '#fca5a5',
              fontFamily: 'monospace',
              maxWidth: '90%',
              wordBreak: 'break-word',
              textAlign: 'left'
            }}>
              {this.state.error.message || String(this.state.error)}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn-gold"
              onClick={this.handleReset}
              style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: '900', gap: '6px' }}
            >
              <RotateCcw size={16} />
              <span>Reanudar Vista / Reintentar</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => { window.location.href = '/?view=inicio'; }}
              style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: '800', gap: '6px' }}
            >
              <Home size={16} />
              <span>Ir al Inicio</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
