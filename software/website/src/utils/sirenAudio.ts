// Web Audio API dual-tone siren synthesizer for emergency sound simulation
class SirenAudioEngine {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public play() {
    if (this.isPlaying) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime); // Low, comfortable volume
      this.gainNode.connect(this.ctx.destination);

      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(650, this.ctx.currentTime);
      this.osc1.connect(this.gainNode);
      this.osc1.start();

      let high = false;
      this.intervalId = window.setInterval(() => {
        if (!this.osc1 || !this.ctx) return;
        const targetFreq = high ? 920 : 650;
        this.osc1.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.15);
        high = !high;
      }, 400);

      this.isPlaying = true;
    } catch (e) {
      console.warn('AudioContext prevented or failed:', e);
    }
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.osc1) {
      try {
        this.osc1.stop();
        this.osc1.disconnect();
      } catch {}
      this.osc1 = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {}
      this.gainNode = null;
    }
    this.isPlaying = false;
  }
}

export const sirenAudio = new SirenAudioEngine();
