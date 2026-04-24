import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { cn } from '../../lib/utils';

interface HlsVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export const HlsVideo = React.forwardRef<HTMLVideoElement, HlsVideoProps>(
  ({ src, className, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLVideoElement>(null);
    const videoRef = (forwardedRef as React.RefObject<HTMLVideoElement>) || internalRef;

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      let hls: Hls | null = null;

      if (Hls.isSupported()) {
        hls = new Hls({
          startPosition: -1,
          capLevelToPlayerSize: true,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for native HLS support (Safari)
        video.src = src;
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }, [src, videoRef]);

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
