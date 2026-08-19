import confettiLib from 'canvas-confetti';

export function triggerConfetti(options?: confettiLib.Options) {
  try {
    if (typeof confettiLib === 'function') {
      confettiLib(options);
    } else if (confettiLib && typeof (confettiLib as any).default === 'function') {
      (confettiLib as any).default(options);
    }
  } catch (e) {
    console.warn('Confetti effect failed silently:', e);
  }
}
