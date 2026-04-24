import { useEffect, useRef } from 'react';

interface Drop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
}

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dropsRef = useRef<Drop[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    const colWidth = 16;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * 2;
      canvas.height = h * 2;
      ctx.scale(2, 2);
      initDrops();
    };

    const initDrops = () => {
      const cols = Math.ceil(w / colWidth);
      dropsRef.current = Array.from({ length: cols }, (_, i) => ({
        x: i * colWidth,
        y: Math.random() * h * -2,
        speed: Math.random() * 2 + 1,
        chars: Array.from({ length: Math.floor(Math.random() * 15) + 8 }, () =>
          CHARS[Math.floor(Math.random() * CHARS.length)]
        ),
        length: Math.floor(Math.random() * 15) + 8,
      }));
    };

    resize();

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleLeave);
    window.addEventListener('resize', resize);

    let lastTime = 0;
    const draw = (time: number) => {
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;

      // Fade trail
      ctx.fillStyle = 'rgba(4, 8, 16, 0.12)';
      ctx.fillRect(0, 0, w, h);

      const mouse = mouseRef.current;
      ctx.font = '13px monospace';

      for (const drop of dropsRef.current) {
        // Mouse proximity accelerates nearby columns
        const dx = drop.x - mouse.x;
        const dist = Math.abs(dx);
        const speedMult = dist < 80 ? 2.5 : 1;

        drop.y += drop.speed * speedMult * (dt / 16);

        for (let i = 0; i < drop.chars.length; i++) {
          const charY = drop.y - i * 14;
          if (charY < -20 || charY > h + 20) continue;

          if (i === 0) {
            ctx.fillStyle = '#ffffff';
          } else if (i < 3) {
            ctx.fillStyle = `rgba(0, 255, 200, ${1 - i * 0.15})`;
          } else {
            const alpha = Math.max(0, 1 - (i / drop.chars.length));
            ctx.fillStyle = `rgba(0, 200, 180, ${alpha * 0.7})`;
          }

          // Random char flicker
          if (Math.random() < 0.02) {
            drop.chars[i] = CHARS[Math.floor(Math.random() * CHARS.length)];
          }

          ctx.fillText(drop.chars[i], drop.x, charY);
        }

        // Reset when off screen
        if (drop.y - drop.chars.length * 14 > h) {
          drop.y = Math.random() * -200 - 50;
          drop.speed = Math.random() * 2 + 1;
          drop.chars = Array.from({ length: Math.floor(Math.random() * 15) + 8 }, () =>
            CHARS[Math.floor(Math.random() * CHARS.length)]
          );
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

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
      style={{ background: '#040810' }}
    />
  );
}
