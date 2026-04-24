import { useEffect, useRef } from 'react';

export default function WaveInterference() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
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
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    const handleLeave = () => {
      mouseRef.current = { x: 0.5, y: 0.5 };
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleLeave);
    window.addEventListener('resize', resize);

    const waves = [
      { freq: 0.02, amp: 30, speed: 0.015, color: [0, 200, 180] as number[] },
      { freq: 0.025, amp: 25, speed: 0.02, color: [80, 140, 255] as number[] },
      { freq: 0.018, amp: 35, speed: 0.012, color: [160, 100, 255] as number[] },
      { freq: 0.03, amp: 20, speed: 0.025, color: [0, 255, 200] as number[] },
      { freq: 0.015, amp: 40, speed: 0.01, color: [100, 180, 255] as number[] },
    ];

    const draw = () => {
      timeRef.current += 1;
      const t = timeRef.current;
      const mouse = mouseRef.current;

      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, w, h);

      const ampMult = 0.3 + mouse.y * 1.4;
      const phaseMult = mouse.x * 4;

      for (const wave of waves) {
        ctx.beginPath();
        ctx.moveTo(0, h / 2);

        for (let x = 0; x <= w; x += 2) {
          let y = h / 2;
          y += Math.sin(x * wave.freq + t * wave.speed + phaseMult) * wave.amp * ampMult;
          y += Math.sin(x * wave.freq * 1.5 + t * wave.speed * 0.7) * wave.amp * 0.3 * ampMult;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, h / 2 - 60, 0, h);
        const [r, g, b] = wave.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.15)`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.05)`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Stroke the wave line
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          let y = h / 2;
          y += Math.sin(x * wave.freq + t * wave.speed + phaseMult) * wave.amp * ampMult;
          y += Math.sin(x * wave.freq * 1.5 + t * wave.speed * 0.7) * wave.amp * 0.3 * ampMult;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${wave.color[0]}, ${wave.color[1]}, ${wave.color[2]}, 0.5)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Center glow
      const glow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.4);
      glow.addColorStop(0, 'rgba(100, 200, 255, 0.03)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
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
      style={{ background: '#060a14' }}
    />
  );
}
