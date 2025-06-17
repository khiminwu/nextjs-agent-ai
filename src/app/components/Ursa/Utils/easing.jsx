export function easeInCubic(t) {
    return t * t * t;
  }

export function easeOutCubic(t) {
return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t) {
return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutExpo(t) {
return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}