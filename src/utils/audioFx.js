// High-Fidelity UI Audio Synthesizer (Pure Web Audio API)
// Provides instant, crisp, tactile feedback on user interactions

let audioCtx = null;
const getInitialMuteState = () => {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem('portfolio_sound_enabled');
    return stored === 'true' ? false : true;
  } catch (e) {
    return true;
  }
};

let isMuted = getInitialMuteState();

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Automatically resume AudioContext on first touch / click anywhere on the page
if (typeof window !== 'undefined') {
  const resumeAudio = () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener('click', resumeAudio, { passive: true });
  window.addEventListener('keydown', resumeAudio, { passive: true });
  window.addEventListener('touchstart', resumeAudio, { passive: true });
}

export function setSoundMuted(muted) {
  isMuted = muted;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('portfolio_sound_enabled', muted ? 'false' : 'true');
    } catch (e) {}
  }
  if (!muted) {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => playClickSound()).catch(() => {});
    } else {
      playClickSound();
    }
  }
}

export function isSoundMuted() {
  return isMuted;
}

// 1. Soft Tactile Tick on Hover (Crisp, subtle blip)
export function playHoverSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch (e) {}
}

// 2. Crisp Tactile Click (Mechanical Cyber-Pop)
export function playClickSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.045);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch (e) {}
}

// 3. Pleasant Success / Tour Chime (Melodic E5 -> G#5 -> B5)
export function playSuccessSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const chord = [659.25, 830.61, 987.77]; // E5, G#5, B5 pleasant bright triad
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

      gain.gain.setValueAtTime(0.14, ctx.currentTime + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.07);
      osc.stop(ctx.currentTime + idx * 0.07 + 0.25);
    });
  } catch (e) {}
}
