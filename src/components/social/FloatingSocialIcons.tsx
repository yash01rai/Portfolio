import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ICON_POSITIONS,
  TIER_MOUSE_SHIFT,
  type IconConfig,
  type Depth,
} from './socialIconPositions';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  containerRef: RefObject<HTMLElement | null>;
}

const X_PATH =
  'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z';
const LINKEDIN_PATH =
  'M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z';

const DEPTH_OPACITY: Record<Depth, string> = {
  0: 'opacity-[0.07]',
  1: 'opacity-[0.10]',
  2: 'opacity-[0.14]',
};

const DEPTH_BLUR: Record<Depth, string> = {
  0: 'blur-[1.5px]',
  1: 'blur-[0.5px]',
  2: '',
};

// Subliminal breath — tiny amplitude, long duration. Barely perceptible; just
// keeps icons from looking dead when scroll is paused.
const BREATH_PARAMS = [
  { duration:  9.2, delay: 0.0, amplitude: 3   },
  { duration: 11.0, delay: 1.4, amplitude: 2   },
  { duration:  8.4, delay: 2.6, amplitude: 4   },
  { duration: 10.5, delay: 0.7, amplitude: 3   },
  { duration:  9.8, delay: 3.0, amplitude: 2.5 },
  { duration: 11.6, delay: 1.7, amplitude: 3   },
  { duration:  8.8, delay: 3.9, amplitude: 4   },
  { duration: 10.2, delay: 2.1, amplitude: 2   },
  { duration:  9.4, delay: 1.0, amplitude: 3   },
  { duration: 11.2, delay: 3.4, amplitude: 2.5 },
  { duration:  8.6, delay: 1.6, amplitude: 4   },
  { duration: 10.8, delay: 2.7, amplitude: 3   },
];

function GlyphSvg({ icon }: { icon: IconConfig }) {
  const path = icon.platform === 'x' ? X_PATH : LINKEDIN_PATH;
  return (
    <svg
      viewBox="0 0 24 24"
      width={icon.size}
      height={icon.size}
      className={`text-white ${DEPTH_OPACITY[icon.depth]} ${DEPTH_BLUR[icon.depth]}`}
      aria-hidden
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}

export function FloatingSocialIcons({ containerRef }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Three nested layers per icon to isolate each transform type:
  // scrollDiv → mouseDiv → breathDiv → svg
  const scrollDivRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const breathDivRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const section = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set(wrapper, { opacity: 0.8 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. PRIMARY — per-icon scroll-driven drift (x, y, rotate, scale)
      //    scrub: 1 adds a 1-second lag → scrolling feels weighted and premium
      ICON_POSITIONS.forEach((icon) => {
        const el = scrollDivRefs.current.get(icon.id);
        if (!el) return;
        gsap.fromTo(
          el,
          { x: 0, y: 0, rotate: icon.rotateFrom, scale: 1 },
          {
            x: icon.driftX,
            y: icon.driftY,
            rotate: icon.rotateTo,
            scale: icon.scaleTo,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        );
      });

      // 2. SUBLIMINAL — continuous breath on inner divs (y only, doesn't
      //    conflict with scrollDiv's y because they're separate DOM nodes)
      ICON_POSITIONS.forEach((icon, i) => {
        const el = breathDivRefs.current.get(icon.id);
        if (!el) return;
        const { duration, delay, amplitude } = BREATH_PARAMS[i % BREATH_PARAMS.length];
        gsap.fromTo(
          el,
          { y: -amplitude },
          { y: amplitude, duration, delay, ease: 'sine.inOut', repeat: -1, yoyo: true },
        );
      });

      // 3. Wrapper fade-in — fires as section top enters from below
      gsap.fromTo(
        wrapper,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 95%',
            end: 'top 70%',
            scrub: true,
          },
        },
      );

      // 4. Wrapper fade-out — fires only when section bottom is nearly off-screen
      //    start: 'bottom 30%' = section bottom is 30% from viewport top (section ~70% gone)
      //    end: 'bottom -5%'  = section fully past, with tiny overshoot
      gsap.to(wrapper, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'bottom 30%',
          end: 'bottom -5%',
          scrub: true,
        },
      });

      // 5. Mouse parallax — desktop only
      //    CSS variables on the middle "mouse" div so GSAP transforms on
      //    scrollDiv and breathDiv remain independent
      const mq = window.matchMedia('(min-width: 768px)');
      if (mq.matches) {
        let mx = 0, my = 0, targetX = 0, targetY = 0, rafId = 0;

        const mouseDivs = wrapper.querySelectorAll<HTMLDivElement>('[data-mouse-icon-id]');

        const onMove = (e: MouseEvent) => {
          const rect = section.getBoundingClientRect();
          targetX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          targetY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        };

        const tick = () => {
          mx += (targetX - mx) * 0.06;
          my += (targetY - my) * 0.06;
          mouseDivs.forEach((el) => {
            const id = el.dataset.mouseIconId!;
            const icon = ICON_POSITIONS.find((i) => i.id === id);
            if (!icon) return;
            const shift = TIER_MOUSE_SHIFT[icon.depth];
            el.style.setProperty('--mx', `${mx * shift}px`);
            el.style.setProperty('--my', `${my * shift}px`);
          });
          rafId = requestAnimationFrame(tick);
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        rafId = requestAnimationFrame(tick);

        return () => {
          window.removeEventListener('mousemove', onMove);
          cancelAnimationFrame(rafId);
        };
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [containerRef]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: 0 }}
    >
      {ICON_POSITIONS.map((icon) => (
        // Layer 1 — scrollDiv: GSAP writes x, y, rotate, scale here on scroll
        <div
          key={icon.id}
          ref={(el) => {
            if (el) scrollDivRefs.current.set(icon.id, el);
            else scrollDivRefs.current.delete(icon.id);
          }}
          className="absolute will-change-transform"
          style={{ left: `${icon.xPct}%`, top: `${icon.yPct}%` }}
        >
          {/* Layer 2 — mouseDiv: CSS translate via --mx/--my vars (no GSAP here) */}
          <div
            data-mouse-icon-id={icon.id}
            style={{ transform: 'translate(var(--mx, 0px), var(--my, 0px))' }}
          >
            {/* Layer 3 — breathDiv: GSAP writes y (continuous bob) here */}
            <div
              ref={(el) => {
                if (el) breathDivRefs.current.set(icon.id, el);
                else breathDivRefs.current.delete(icon.id);
              }}
            >
              <GlyphSvg icon={icon} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
