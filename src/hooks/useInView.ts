import { useEffect, useState, type RefObject } from 'react';

/**
 * True while `ref` is within `rootMargin` of the viewport. Used to keep
 * off-screen animation loops and media from running.
 */
export function useInView(ref: RefObject<Element | null>, rootMargin = '200px', once = false) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, once]);

  return inView;
}
