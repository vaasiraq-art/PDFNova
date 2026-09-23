// Paper flip sound generator using Web Audio API
class PageFlipSound {
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
        return null;
      }
    }
    return this.audioContext;
  }

  playFlipSound(direction: 'next' | 'prev' = 'next', enabled: boolean = false) {
    if (!enabled) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Create noise buffer for paper texture
    const bufferSize = ctx.sampleRate * 0.15; // 150ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate filtered noise (paper sound)
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      // Envelope: quick attack, medium decay
      const envelope = Math.exp(-t * 8) * (1 - Math.exp(-t * 50));
      // Mix of noise frequencies
      data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Bandpass filter for paper-like sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = direction === 'next' ? 3000 : 2500;
    filter.Q.value = 1.5;

    // High pass to remove low rumble
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 500;

    // Volume
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.15;

    // Connect nodes
    source.connect(filter);
    filter.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Play with slight pitch variation
    source.playbackRate.value = direction === 'next' ? 1.0 : 0.9;
    source.start(now);
    source.stop(now + 0.15);

    // Add a subtle "thump" for the page hitting
    setTimeout(() => {
      this.playThump(ctx);
    }, 100);
  }

  private playThump(ctx: AudioContext) {
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const pageFlipSound = new PageFlipSound();
