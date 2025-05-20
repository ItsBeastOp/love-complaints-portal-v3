declare module 'canvas-confetti' {
  export function create(confettiContainer?: any): any;
  export function confetti(options?: any): void;
  const confettiDefault: {
    create: typeof create;
    confetti: typeof confetti;
  };
  export default confettiDefault;
}
