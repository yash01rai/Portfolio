import { useEffect, useRef } from 'react';

export default function GeometricTessellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * 2;
      canvas.height = h * 2;
      ctx.scale(2, 2);
    };

    resize();

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleLeave);
    window.addEventListener('resize', resize);

    const cellSize = 40;

    const drawHex = (cx: number, cy: number, size: number, rotation: number, alpha: number, hue: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotation;
        const x = cx + size * Math.cos(angle);
        const y = cy + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const draw = () => {
      timeRef.current += 0.01;
      const t = timeRef.current;
      const mouse = mouseRef.current;

      ctx.fillStyle = '#06090f';
      ctx.fillRect(0, 0, w, h);

      const rowHeight = cellSize * Math.sqrt(3);
      for (let row = -1; row < h / rowHeight + 2; row++) {
        for (let col = -1; col < w / cellSize + 2; col++) {
          const cx = col * cellSize * 1.5;
          const cy = row * rowHeight + (col % 2 === 0 ? 0 : rowHeight / 2);
          const dx = cx - mouse.x;
          const dy = cy - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseInfluence = Math.max(0, 1 - dist / 150);
          const wavePhase = Math.sin(cx * 0.02 + t * 2) * Math.cos(cy * 0.02 + t * 1.5);
          const baseRotation = t + wavePhase * 0.3 + mouseInfluence * Math.PI * 0.5;
          const hue = (180 + cx * 0.3 + cy * 0.2 + t * 20 + mouseInfluence * 60) % 360;
          const alpha = 0.15 + Math.abs(wavePhase) * 0.25 + mouseInfluence * 0.5;
          const size = (cellSize * 0.4 + Math.abs(wavePhase) * 4) * (1 + mouseInfluence * 0.6);
          drawHex(cx, cy, size, baseRotation, Math.min(alpha, 0.9), hue);
          if (mouseInfluence > 0.2) {
            drawHex(cx, cy, size * 0.5, -baseRotation * 1.5, mouseInfluence * 0.5, (hue + 60) % 360);
          }
        }
      }

      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.15, w / 2, h / 2, w * 0.6);
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(6, 9, 15, 0.6)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#06090f' }}
    />
  );
}
