/**
 * Motor de Audio Sintetizado con Web Audio API para Ajedrez Junvill
 * Sonidos nítidos de madera, capturas, jaques, fanfarrias y alertas pedagógicas.
 */

class ChessAudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Sonido suave de movimiento de pieza de madera
  playMove() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Sonido de captura (golpe de madera con resonancia)
  playCapture() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Impacto principal
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(60, now + 0.12);
    
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.13);

    // Chasquido de contacto
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(600, now);
    osc2.frequency.exponentialRampToValueAtTime(100, now + 0.05);
    
    gain2.gain.setValueAtTime(0.2, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.06);
  }

  // Sonido de jaque (doble tono de alerta distinguida)
  playCheck() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [587.33, 880]; // D5, A5
    
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + (i * 0.09);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  // Sonido de victoria / lección completada (acorde brillante arpegiado)
  playVictory() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Acorde Mayor: C5, E5, G5, C6
    const chord = [523.25, 659.25, 783.99, 1046.50];
    
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + (idx * 0.08);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.28, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  // Sonido de pista / sugerencia pedagógica (campanilla mágica)
  playHint() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [784, 1174.66]; // G5, D6
    
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + (i * 0.07);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // Alerta de advertencia / peligro
  playWarning() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.2);
    
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.22);
  }
}

export const audioManager = new ChessAudioManager();
