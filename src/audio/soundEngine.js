// Procedural Web Audio Engine & Synthwave Music Generator for Crystal Collector 2.0

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxVolume = 0.5;
    this.musicVolume = 0.25;
    this.soundEnabled = true;
    this.musicEnabled = true;

    // Music generation state
    this.bgmTimer = null;
    this.step = 0;
    this.isFever = false;
    this.bpm = 124;

    // Chord progressions (MIDI note numbers)
    // Am, F, C, G
    this.chords = [
      { root: 33, notes: [45, 48, 52, 57] }, // A1 root, A2 C3 E3 A3
      { root: 29, notes: [41, 45, 48, 53] }, // F1 root, F2 A2 C3 F3
      { root: 36, notes: [48, 52, 55, 60] }, // C2 root, C3 E3 G3 C4
      { root: 31, notes: [43, 47, 50, 55] }  // G1 root, G2 B2 D3 G3
    ];
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

  setSettings(soundEnabled, musicEnabled, sfxVol, musicVol) {
    this.soundEnabled = soundEnabled;
    this.musicEnabled = musicEnabled;
    this.sfxVolume = Math.max(0, Math.min(1, sfxVol));
    this.musicVolume = Math.max(0, Math.min(1, musicVol));

    if (!this.musicEnabled && this.bgmTimer) {
      this.stopBGM();
    } else if (this.musicEnabled && !this.bgmTimer) {
      this.startBGM();
    }
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // --- Sound Effects ---

  playCollect(combo = 1) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 700 + Math.min(600, (combo - 1) * 75);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.12);

    gain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  playCoin() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [1046.5, 1318.5].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.12);
    });
  }

  playJump() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.15);

    gain.gain.setValueAtTime(0.2 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  playDoubleJump() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.18);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.18);
  }

  playJumpPad() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.3);

    gain.gain.setValueAtTime(0.35 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  playHurt() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.linearRampToValueAtTime(50, t + 0.25);

    gain.gain.setValueAtTime(0.4 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  playPowerup(type) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const freqs = type === 'fever' ? [523.2, 659.2, 783.9, 1046.5] : [440, 554.3, 659.2];

    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = t + i * 0.08;

      osc.type = type === 'shield' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, start);

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + 0.25);
    });
  }

  playBossShockwave() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.4);

    gain.gain.setValueAtTime(0.45 * this.sfxVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.4);
  }

  // --- Procedural Synthwave BGM Loop ---

  startBGM() {
    if (this.bgmTimer) return;
    this.init();
    if (!this.ctx) return;

    const intervalMs = (60 / (this.bpm * 4)) * 1000; // 16th notes
    this.bgmTimer = setInterval(() => this.tickBGM(), intervalMs);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  setFever(feverActive) {
    this.isFever = feverActive;
  }

  tickBGM() {
    if (!this.musicEnabled || !this.ctx) return;

    const t = this.ctx.currentTime;
    const chordIdx = Math.floor(this.step / 16) % this.chords.length;
    const chord = this.chords[chordIdx];
    const stepInBar = this.step % 16;

    // Bass line on 8th notes (steps 0, 2, 4, 6, 8, 10, 12, 14)
    if (stepInBar % 2 === 0) {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();

      bassOsc.type = this.isFever ? 'sawtooth' : 'triangle';
      const rootMidi = chord.root + (stepInBar === 14 ? 7 : 0);
      bassOsc.frequency.setValueAtTime(this.midiToFreq(rootMidi), t);

      const vol = (this.isFever ? 0.2 : 0.15) * this.musicVolume;
      bassGain.gain.setValueAtTime(vol, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);

      bassOsc.start(t);
      bassOsc.stop(t + 0.18);
    }

    // Arpeggiated synth melody (every 16th note)
    const arpNotes = chord.notes;
    const arpNote = arpNotes[stepInBar % arpNotes.length] + (this.isFever ? 12 : 0);

    const leadOsc = this.ctx.createOscillator();
    const leadGain = this.ctx.createGain();

    leadOsc.type = 'sine';
    leadOsc.frequency.setValueAtTime(this.midiToFreq(arpNote), t);

    const leadVol = (this.isFever ? 0.12 : 0.08) * this.musicVolume;
    leadGain.gain.setValueAtTime(leadVol, t);
    leadGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    leadOsc.connect(leadGain);
    leadGain.connect(this.ctx.destination);

    leadOsc.start(t);
    leadOsc.stop(t + 0.1);

    this.step = (this.step + 1) % 64;
  }
}

export const soundEngine = new SoundEngine();
