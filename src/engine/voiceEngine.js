/**
 * Motor de Voz y Narración en Español Latino de Ajedrez Junvill (Web Speech API)
 * Proporciona narración oral dinámica de lecciones, pistas y consejos de los tutores.
 */

class VoiceEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.enabled = true;
    this.currentVoice = null;
    this.voicesLoaded = false;
    this.volume = 0.9;
    this.rate = 1.0;

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Priorizar voces en Español Latinoamericano (México, Colombia, Argentina, EE.UU., 419)
    const latamVoices = voices.filter(v => 
      v.lang.startsWith('es-MX') || 
      v.lang.startsWith('es-CO') || 
      v.lang.startsWith('es-US') || 
      v.lang.startsWith('es-AR') || 
      v.lang.startsWith('es-419') ||
      v.lang.includes('Latin')
    );

    const generalSpanishVoices = voices.filter(v => v.lang.startsWith('es'));

    if (latamVoices.length > 0) {
      this.currentVoice = latamVoices[0];
    } else if (generalSpanishVoices.length > 0) {
      this.currentVoice = generalSpanishVoices[0];
    } else {
      this.currentVoice = voices[0];
    }

    this.voicesLoaded = true;
  }

  // Modula el tono y velocidad según la personalidad del tutor activo
  getCoachVoiceParams(coachId = 'coach_aurelio') {
    switch (coachId) {
      case 'coach_aurelio': // Senior sabio (grave y pausado)
        return { pitch: 0.85, rate: 0.95 };
      case 'coach_beatriz': // Gran Maestra senior (clara y firme)
        return { pitch: 1.05, rate: 1.0 };
      case 'coach_mateo': // Joven táctico (enérgico y rápido)
        return { pitch: 1.2, rate: 1.1 };
      case 'coach_valeria': // Joven estratega (amigable y didáctica)
        return { pitch: 1.25, rate: 1.05 };
      case 'coach_ada': // IA Cuántica (precisa y ágil)
        return { pitch: 0.95, rate: 1.15 };
      case 'coach_junvill_king': // Rey de cuento (majestuoso y cálido)
        return { pitch: 0.8, rate: 0.9 };
      default:
        return { pitch: 1.0, rate: 1.0 };
    }
  }

  speak(text, coachId = 'coach_aurelio') {
    if (!this.synth || !this.enabled || !text) return;

    try {
      this.synth.cancel(); // Detener cualquier locución previa

      // Limpieza de caracteres de formato y emojis para una lectura limpia
      const cleanText = text
        .replace(/⭐/g, 'estrellas')
        .replace(/💎/g, 'gemas')
        .replace(/🏆/g, 'trofeo')
        .replace(/♟️|👑|🔥|⚡|👏|🤝|🧠|🛡️|🎉/g, '')
        .replace(/([A-H])([1-8])/gi, '$1 $2') // ej: e4 -> e 4
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const params = this.getCoachVoiceParams(coachId);

      if (this.currentVoice) {
        utterance.voice = this.currentVoice;
      }
      utterance.lang = this.currentVoice?.lang || 'es-MX';
      utterance.pitch = params.pitch;
      utterance.rate = params.rate * this.rate;
      utterance.volume = this.volume;

      this.synth.speak(utterance);
    } catch (e) {
      console.warn("SpeechSynthesis error:", e);
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  toggle(enabled) {
    this.enabled = (enabled !== undefined) ? enabled : !this.enabled;
    if (!this.enabled) {
      this.stop();
    }
    return this.enabled;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  setRate(r) {
    this.rate = Math.max(0.5, Math.min(1.5, r));
  }

  isSupported() {
    return !!this.synth;
  }
}

export const voiceEngine = new VoiceEngine();
