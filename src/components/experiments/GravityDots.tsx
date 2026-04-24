import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
}

export default function GravityDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dotsRef = useRef<Dot[]>([]);
  const rafRef = useRef<number>(0);

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

    const initDots = () => {
      const count = Math.min(60, Math.floor((w * h) / 5000));
      dotsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.3,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        radius: Math.random() * 3 + 2,
        hue: Math.random() * 60 + 170,
      }));
    };

    resize();
    initDots();

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleLeave);
    window.addEventListener('resize', () => { resize(); initDots(); });

    const gravity = 0.15;
    const bounce = 0.7;
    const friction = 0.995;

    const draw = () => {
      ctx.fillStyle = 'rgba(6, 10, 20, 0.15)';
      ctx.fillRect(0, 0, w, h);

      const mouse = mouseRef.current;

      for (const dot of dotsRef.current) {
        // Gravity
        dot.vy += gravity;

        // Mouse gravity well
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 5) {
          const force = 3 / dist;
          dot.vx += (dx / dist) * force;
          dot.vy += (dy / dist) * force;
        }

        dot.vx *= friction;
        dot.vy *= friction;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Floor bounce
        if (dot.y + dot.radius > h) {
          dot.y = h - dot.radius;
          dot.vy *= -bounce;
          dot.vx *= 0.98;
        }

        // Wall bounces
        if (dot.x - dot.radius < 0) {
          dot.x = dot.radius;
          dot.vx *= -bounce;
        }
        if (dot.x + dot.radius > w) {
          dot.x = w - dot.radius;
          dot.vx *= -bounce;
        }

        // Ceiling
        if (dot.y - dot.radius < 0) {
          dot.y = dot.radius;
          dot.vy *= -bounce;
        }

        // Draw with glow
        const speed = Math.sqrt(dot.vx * dot.vx + dot.vy * dot.vy);
        const glowSize = Math.min(speed * 2, 15);

        const glow = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.radius + glowSize);
        glow.addColorStop(0, `hsla(${dot.hue}, 80%, 70%, 0.9)`);
        glow.addColorStop(0.4, `hsla(${dot.hue}, 70%, 55%, 0.4)`);
        glow.addColorStop(1, `hsla(${dot.hue}, 60%, 40%, 0)`);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius + glowSize, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${dot.hue}, 80%, 75%, 1)`;
        ctx.fill();
      }

      // Mouse gravity indicator
      if (mouse.x > 0 && mouse.x < w && mouse.y > 0 && mouse.y < h) {
        const indicator = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 60);
        indicator.addColorStop(0, 'rgba(100, 200, 255, 0.08)');
        indicator.addColorStop(1, 'transparent');
        ctx.fillStyle = indicator;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
        ctx.fill();
      }

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
      style={{ background: '#060a14' }}
    />
  );
}
