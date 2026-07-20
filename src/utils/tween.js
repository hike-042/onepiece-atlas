export const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

/** Runs onUpdate(progress) from 0..1 over `duration` ms via requestAnimationFrame.
 *  Returns a cancel function. Resolves instantly to onUpdate(1) when the user
 *  prefers reduced motion, so every call site gets that guard for free. */
export function tween(duration, onUpdate, easing = t => t){
  if (prefersReducedMotion()){
    onUpdate(1);
    return () => {};
  }
  const start = performance.now();
  let cancelled = false;
  function step(now){
    if (cancelled) return;
    const t = Math.min(1, (now - start) / duration);
    onUpdate(easing(t));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
  return () => { cancelled = true; };
}
