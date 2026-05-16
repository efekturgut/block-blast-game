let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
};

const playTone = (frequency, duration, type = "sine", volume = 0.08) => {
  const ctx = getAudioContext();

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
};

export const playPlaceSound = () => {
  playTone(440, 0.08, "square", 0.05);
};

export const playClearSound = () => {
  playTone(660, 0.1, "triangle", 0.07);

  setTimeout(() => {
    playTone(880, 0.12, "triangle", 0.07);
  }, 90);
};

export const playFullClearSound = () => {
  playTone(523, 0.1, "sine", 0.08);

  setTimeout(() => {
    playTone(659, 0.1, "sine", 0.08);
  }, 100);

  setTimeout(() => {
    playTone(784, 0.14, "sine", 0.09);
  }, 200);
};

export const playGameOverSound = () => {
  playTone(330, 0.15, "sawtooth", 0.06);

  setTimeout(() => {
    playTone(220, 0.18, "sawtooth", 0.06);
  }, 140);

  setTimeout(() => {
    playTone(150, 0.25, "sawtooth", 0.05);
  }, 300);
};