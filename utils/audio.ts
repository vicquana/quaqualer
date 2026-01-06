
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Scratch Sound: Sandpaper-on-wood style textured noise
export const playScratchSound = () => {
  const ctx = initAudio();
  const bufferSize = ctx.sampleRate * 0.14; // 140ms textured burst
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const highPass = ctx.createBiquadFilter();
  highPass.type = 'highpass';
  highPass.frequency.setValueAtTime(120, ctx.currentTime);
  highPass.Q.setValueAtTime(0.5, ctx.currentTime);

  const bandPass = ctx.createBiquadFilter();
  bandPass.type = 'bandpass';
  bandPass.frequency.setValueAtTime(650, ctx.currentTime);
  bandPass.Q.setValueAtTime(0.8, ctx.currentTime);

  const lowPass = ctx.createBiquadFilter();
  lowPass.type = 'lowpass';
  lowPass.frequency.setValueAtTime(1800, ctx.currentTime);
  lowPass.Q.setValueAtTime(0.7, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.07, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

  noise.connect(highPass);
  highPass.connect(bandPass);
  bandPass.connect(lowPass);
  lowPass.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
};

// Reveal Sound: A bright chime
export const playRevealSound = () => {
  const ctx = initAudio();
  const now = ctx.currentTime;
  
  const playNote = (freq: number, startTime: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + 0.3);
  };

  playNote(523.25, now); // C5
  playNote(659.25, now + 0.05); // E5
  playNote(783.99, now + 0.1); // G5
  playNote(1046.50, now + 0.15); // C6
};

// Win Sound: Celebratory Fanfare
export const playWinSound = () => {
  const ctx = initAudio();
  const now = ctx.currentTime;

  const fanfare = (freq: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
    gain.gain.linearRampToValueAtTime(0.3, startTime + duration - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  // Simple "Ta-da!" pattern
  fanfare(392.00, now, 0.1); // G4
  fanfare(392.00, now + 0.15, 0.1); // G4
  fanfare(523.25, now + 0.3, 0.6); // C5
  fanfare(659.25, now + 0.3, 0.6); // E5
  fanfare(783.99, now + 0.3, 0.6); // G5
};
