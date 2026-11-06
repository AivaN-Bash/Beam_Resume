export const KEYS = Array.from({ length: 64 }, (_, index) => String.fromCharCode(0xe000 + index));

export const clamp = (value, minimum = 0, maximum = 1) => Math.max(minimum, Math.min(maximum, value));
export const lerp = (from, to, amount) => from + (to - from) * amount;

export function rng(seed = 0) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function randomAt(x, y, seed) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return value - Math.floor(value);
}

export function noise2(x, y, seed = 0) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const u = x - x0;
  const v = y - y0;
  const sx = u * u * (3 - 2 * u);
  const sy = v * v * (3 - 2 * v);
  const top = lerp(randomAt(x0, y0, seed), randomAt(x0 + 1, y0, seed), sx);
  const bottom = lerp(randomAt(x0, y0 + 1, seed), randomAt(x0 + 1, y0 + 1, seed), sx);
  return lerp(top, bottom, sy);
}

export function fbm(x, y, octaves = 3, seed = 0) {
  let value = 0;
  let amplitude = 0.5;
  let totalAmplitude = 0;
  let frequency = 1;
  for (let octave = 0; octave < octaves; octave += 1) {
    value += noise2(x * frequency, y * frequency, seed + octave * 17) * amplitude;
    totalAmplitude += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value / totalAmplitude;
}
