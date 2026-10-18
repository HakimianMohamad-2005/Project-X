/** True when the browser can create a WebGL context (kept apart so it doesn't pull in three.js). */
export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    // Release the probe context straight away; browsers cap how many can be alive.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}
