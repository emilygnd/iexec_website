// Animated wavy green mesh background — approximates a flowing silk/wave look.
(() => {
  const canvas = document.getElementById('wave');
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  let t = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Wave field: many horizontal lines deformed by layered sines, with a
  // brightness mask that concentrates the glow on the right side.
  const LINES = 110;
  const STEP_X = 6;

  function drawFrame() {
    ctx.clearRect(0, 0, w, h);

    // Base black with subtle green haze on right
    const grad = ctx.createRadialGradient(w * 0.78, h * 0.5, 0, w * 0.78, h * 0.5, Math.max(w, h) * 0.75);
    grad.addColorStop(0, 'rgba(40, 90, 55, 0.55)');
    grad.addColorStop(0.4, 'rgba(15, 45, 25, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < LINES; i++) {
      const ly = (i / LINES) * h;
      ctx.beginPath();

      for (let x = 0; x <= w; x += STEP_X) {
        // Three-octave sine for an organic feel
        const nx = x / w;
        const ny = i / LINES;
        const wave =
          Math.sin(nx * 6 + t * 0.6 + ny * 4) * 38 +
          Math.sin(nx * 13 - t * 0.9 + ny * 9) * 18 +
          Math.sin(nx * 22 + t * 1.2 + i * 0.3) * 9;

        // Vertical compression toward center creates the silk fold look
        const fold = Math.sin(nx * Math.PI * 1.2 + t * 0.3) * 60;
        const y = ly + wave + fold * (0.5 - Math.abs(ny - 0.5));

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Brightness: stronger on the right, fading out left
      const horizFade = Math.pow(Math.max(0, (i / LINES)), 0.3);
      const colMask = (x => x)(0); // placeholder
      const alpha = 0.12 + 0.18 * horizFade;

      // Per-line color shift
      const greenTint = 140 + Math.sin(i * 0.2 + t * 0.5) * 40;
      ctx.strokeStyle = `rgba(${30 + greenTint * 0.2}, ${greenTint + 60}, ${60 + greenTint * 0.3}, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Right-side glow overlay to brighten the mesh on that side
    const glow = ctx.createLinearGradient(0, 0, w, 0);
    glow.addColorStop(0, 'rgba(0,0,0,0)');
    glow.addColorStop(0.55, 'rgba(0,0,0,0)');
    glow.addColorStop(1, 'rgba(120, 255, 160, 0.08)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    t += 0.008;
    requestAnimationFrame(drawFrame);
  }

  drawFrame();
})();
