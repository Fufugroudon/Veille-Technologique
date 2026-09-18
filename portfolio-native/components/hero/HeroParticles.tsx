// PLATFORM DECISION: native fallback. The particle field is purely
// decorative and depends on the Canvas 2D API, which has no built-in RN
// equivalent. Per the confirmed approach, native renders nothing here
// rather than pulling in a canvas library for a decorative-only effect —
// see HeroParticles.web.tsx for the real (web) implementation.
export function HeroParticles() {
  return null;
}
