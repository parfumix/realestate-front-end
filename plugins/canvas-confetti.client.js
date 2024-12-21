// plugins/canvas-confetti.client.js
import confetti from 'canvas-confetti';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      confetti,
    },
  };
});
