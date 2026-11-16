/**
 * Web Audio API Sound Effects for GIAP TRACE
 * Generates crisp, realistic sound cues without relying on external MP3 files.
 */

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playTrumpetSalute = () => {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Bugle call notes: G3, C4, E4, G4
  const notes = [
    { freq: 392.00, start: 0, dur: 0.18 },
    { freq: 523.25, start: 0.2, dur: 0.18 },
    { freq: 659.25, start: 0.4, dur: 0.18 },
    { freq: 783.99, start: 0.6, dur: 0.45 },
  ];

  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(n.freq, now + n.start);

    gain.gain.setValueAtTime(0, now + n.start);
    gain.gain.linearRampToValueAtTime(0.18, now + n.start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + n.start);
    osc.stop(now + n.start + n.dur);
  });
};

export const playRadarPing = () => {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.35);
};

export const playSuccessChime = () => {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.08);

    gain.gain.setValueAtTime(0.15, now + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.3);
  });
};

export const playCabinetClick = () => {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
};

export const playVictoryFanfare = () => {
  playTrumpetSalute();
};

export const playTelegraphBeep = () => {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  [0, 0.07, 0.14, 0.23, 0.35].forEach((delay, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now + delay); // A5 Morse tone

    const dur = idx === 3 ? 0.09 : 0.04;
    gain.gain.setValueAtTime(0.08, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + dur);
  });
};

export const playRadioStatic = () => {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const bufferSize = ctx.sampleRate * 0.12; // 120ms burst
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.05;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 2.5;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  } catch {
    // Ignore audio context errors
  }
};

export const playGiaiMaTransitionSound = () => {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // 1. Whoosh: Bandpass noise sweep
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.45);
    filter.Q.value = 3.0;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.15);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.45);

    // 2. Mechanical Click at t + 0.28s
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(120, now + 0.28);
    clickOsc.frequency.exponentialRampToValueAtTime(2400, now + 0.29);
    clickGain.gain.setValueAtTime(0.2, now + 0.28);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.33);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now + 0.28);
    clickOsc.stop(now + 0.33);

    // 3. Subtle Metallic Resonance (Dual chime) at t + 0.30s
    [1046.5, 1567.98].forEach((freq, idx) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq, now + 0.3);

      const amp = idx === 0 ? 0.08 : 0.04;
      chimeGain.gain.setValueAtTime(0.001, now + 0.3);
      chimeGain.gain.linearRampToValueAtTime(amp, now + 0.31);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 0.3);
      chimeOsc.stop(now + 0.85);
    });
  } catch {
    // Ignore audio error
  }
};

/**
 * Hiệu ứng âm thanh Lật giấy cổ / Mở hồ sơ tư liệu (Crisp paper rustle / turn)
 * Tạo bằng White noise lọc qua Highpass & Bandpass kết hợp tiếng cọ xát nhẹ tự nhiên
 */
export const playPaperTurn = () => {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = 0.22; // 220ms paper flip
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Pink-ish noise with high frequency emphasis for paper crispness
      data[i] = (Math.random() * 2 - 1) * (0.8 + 0.2 * Math.sin(i / 10));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter 1: Bandpass simulating paper texture
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration);
    filter.Q.value = 1.8;

    // Filter 2: Highpass to eliminate low thud
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(500, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.04, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(highpass);
    highpass.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);

    // Subtle paper slide tone
    const slideOsc = ctx.createOscillator();
    const slideGain = ctx.createGain();
    slideOsc.type = 'sine';
    slideOsc.frequency.setValueAtTime(440, now);
    slideOsc.frequency.exponentialRampToValueAtTime(220, now + 0.15);
    slideGain.gain.setValueAtTime(0.02, now);
    slideGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    slideOsc.connect(slideGain);
    slideGain.connect(ctx.destination);
    slideOsc.start(now);
    slideOsc.stop(now + 0.15);
  } catch {
    // Ignore audio errors
  }
};

/**
 * Hiệu ứng Đóng dấu lịch sử (Historic Document Rubber/Wax Stamp)
 * Thể hiện tiếng dập dấu dứt khoát: tiếng va chạm gỗ/cao su chắc nịch + âm vang mực ngấm hồ sơ
 */
export const playHistoricalStamp = () => {
  if (isAudioMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // 1. Solid thump (tiếng dập con dấu vào giấy hồ sơ)
    const thumpOsc = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thumpOsc.type = 'triangle';
    thumpOsc.frequency.setValueAtTime(160, now);
    thumpOsc.frequency.exponentialRampToValueAtTime(45, now + 0.07);

    thumpGain.gain.setValueAtTime(0.28, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    thumpOsc.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thumpOsc.start(now);
    thumpOsc.stop(now + 0.09);

    // 2. Crisp wooden stamp impact (va chạm mặt dấu)
    const impactDuration = 0.06;
    const bufferSize = Math.floor(ctx.sampleRate * impactDuration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1400, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(300, now + impactDuration);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.22, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + impactDuration);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + impactDuration);

    // 3. Subtle ink squish / seal release (âm nén mực hồ sơ)
    const inkOsc = ctx.createOscillator();
    const inkGain = ctx.createGain();
    inkOsc.type = 'sine';
    inkOsc.frequency.setValueAtTime(320, now + 0.02);
    inkOsc.frequency.exponentialRampToValueAtTime(120, now + 0.1);
    inkGain.gain.setValueAtTime(0.001, now);
    inkGain.gain.setValueAtTime(0.06, now + 0.02);
    inkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    inkOsc.connect(inkGain);
    inkGain.connect(ctx.destination);
    inkOsc.start(now + 0.02);
    inkOsc.stop(now + 0.14);
  } catch {
    // Ignore audio errors
  }
};

export const toggleMute = () => {
  isAudioMuted = !isAudioMuted;
  return isAudioMuted;
};

export const getIsMuted = () => isAudioMuted;
