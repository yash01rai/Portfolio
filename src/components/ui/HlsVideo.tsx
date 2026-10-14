import React, { useEffect, useRef, useState } from 'react';
import type Hls from 'hls.js';
import { cn } from '../../lib/utils';
import { useInView } from '../../hooks/useInView';

interface HlsVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  /** Wait until the video is near the viewport before loading any of the stream. */
  lazy?: boolean;
  /**
   * Show the poster first and start the stream only once the browser is idle, so
   * the stream and hls.js don't compete with first paint. Pair with a `poster`
   * that is the video's first frame so the switch is invisible.
   */
  deferUntilIdle?: boolean;
}

export const HlsVideo = React.forwardRef<HTMLVideoElement, HlsVideoProps>(
  ({ src, lazy = false, deferUntilIdle = false, className, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLVideoElement>(null);
    const videoRef = (forwardedRef as React.RefObject<HTMLVideoElement>) || internalRef;
    const inView = useInView(videoRef, '300px', true);
    const [idle, setIdle] = useState(!deferUntilIdle);
    const shouldLoad = (!lazy || inView) && idle;

    useEffect(() => {
      if (idle) return;
      // Safari has no requestIdleCallback; a short timeout is a fine stand-in.
      if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
        return () => window.cancelIdleCallback(id);
      }
      const id = setTimeout(() => setIdle(true), 1200);
      return () => clearTimeout(id);
    }, [idle]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video || !shouldLoad) return;

      let hls: Hls | null = null;
      let cancelled = false;

      const playNatively = () => {
        if (video.canPlayType('application/vnd.apple.mpegurl')) video.src = src;
      };

      // Prefer hls.js wherever Media Source Extensions exist: some Chromium builds
      // answer "maybe" to canPlayType for HLS and then fail to play it, so native
      // playback is only the fallback (older iOS has no MSE at all).
      if ('MediaSource' in window || 'ManagedMediaSource' in window) {
        // hls.js is ~500 KB, so it's split out of the main bundle and fetched on demand.
        import('hls.js').then(({ default: HlsLib }) => {
          if (cancelled) return;
          if (!HlsLib.isSupported()) return playNatively();
          hls = new HlsLib({
            startPosition: -1,
            capLevelToPlayerSize: true,
            // Start on the lowest rendition and step up, instead of pulling a
            // full-size first segment before anything plays.
            startLevel: 0,
          });
          hls.loadSource(src);
          hls.attachMedia(video);
        });
      } else {
        playNatively();
      }

      return () => {
        cancelled = true;
        if (hls) {
          hls.destroy();
        }
      };
    }, [src, videoRef, shouldLoad]);

    return (
      <video
        ref={videoRef}
        className={cn("object-cover", className)}
        autoPlay
        muted
        loop
        playsInline
        {...props}
      />
    );
  }
);

HlsVideo.displayName = "HlsVideo";
