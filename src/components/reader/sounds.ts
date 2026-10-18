/**
 * Book sounds, synthesised with Web Audio (no audio files to download):
 * a paper rustle for a turning page and a soft board "thump" for the cover.
 */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    ctx = ctx || new Ctx();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function noise(ac: AudioContext, seconds: number, shape: (t: number) => number) {
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * seconds), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * shape(t) * (0.6 + 0.4 * Math.random());
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  return src;
}

/** Paper sliding over paper. */
export function playRustle(volume = 0.16) {
  const ac = audio();
  if (!ac) return;
  const dur = 0.42;
  const src = noise(ac, dur, (t) => Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.6)), 2));
  const band = ac.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.setValueAtTime(1800, ac.currentTime);
  band.frequency.exponentialRampToValueAtTime(4200, ac.currentTime + dur);
  band.Q.value = 0.7;
  const gain = ac.createGain();
  gain.gain.value = volume;
  src.connect(band).connect(gain).connect(ac.destination);
  src.start();
}

/** A hardcover board landing: a muffled low knock with a little cloth noise. */
export function playThump(volume = 0.5) {
  const ac = audio();
  if (!ac) return;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(58, now + 0.18);
  const og = ac.createGain();
  og.gain.setValueAtTime(volume, now);
  og.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  osc.connect(og).connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.3);

  const src = noise(ac, 0.12, (t) => Math.pow(1 - t, 3));
  const low = ac.createBiquadFilter();
  low.type = 'lowpass';
  low.frequency.value = 900;
  const ng = ac.createGain();
  ng.gain.value = volume * 0.5;
  src.connect(low).connect(ng).connect(ac.destination);
  src.start(now);
}
