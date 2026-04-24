import { useEffect, useRef } from 'react';

interface Blob {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  hue: number;
  hueSpeed: number;
}

export default function FluidGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const blobsRef = useRef<Blob[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
    };

    const initBlobs = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      blobsRef.current = Array.from({ length: 5 }, (_, i) => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        radius: Math.random() * 80 + 60,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        hue: (i * 60 + 180) % 360,
        hueSpeed: (Math.random() - 0.5) * 0.5,
      }));
    };

    resize();
    initBlobs();

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleLeave);
    window.addEventListener('resize', () => { resize(); initBlobs(); });

    const draw = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.fillStyle = '#080c18';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      const mouse = mouseRef.current;

      for (const blob of blobsRef.current) {
        // Mouse repulsion
        const dx = blob.x - mouse.x;
        const dy = blob.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 1) {
          blob.vx += (dx / dist) * 0.15;
          blob.vy += (dy / dist) * 0.15;
        }

        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.vx *= 0.995;
        blob.vy *= 0.995;
        blob.hue = (blob.hue + blob.hueSpeed) % 360;

        // Bounce off edges
        if (blob.x < -blob.radius) blob.vx = Math.abs(blob.vx) * 0.8 + 0.2;
        if (blob.x > w + blob.radius) blob.vx = -Math.abs(blob.vx) * 0.8 - 0.2;
        if (blob.y < -blob.radius) blob.vy = Math.abs(blob.vy) * 0.8 + 0.2;
        if (blob.y > h + blob.radius) blob.vy = -Math.abs(blob.vy) * 0.8 - 0.2;

        // Keep minimum velocity
        const speed = Math.sqrt(blob.vx * blob.vx + blob.vy * blob.vy);
        if (speed < 0.3) {
          blob.vx += (Math.random() - 0.5) * 0.5;
          blob.vy += (Math.random() - 0.5) * 0.5;
        }

        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        const h1 = blob.hue < 0 ? blob.hue + 360 : blob.hue;
        gradient.addColorStop(0, `hsla(${h1}, 80%, 60%, 0.6)`);
        gradient.addColorStop(0.5, `hsla(${(h1 + 30) % 360}, 70%, 45%, 0.3)`);
        gradient.addColorStop(1, `hsla(${(h1 + 60) % 360}, 60%, 30%, 0)`);

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#080c18' }}
    />
  );
}
