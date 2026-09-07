"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IOS_PREVIEW_POSTER_SRC, IOS_PREVIEW_VIDEO_SRC } from "@/lib/site";

export function AppPreviewVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      if (motion.matches) {
        video.pause();
        setPaused(true);
        return;
      }
      void video.play().then(() => setPaused(false)).catch(() => setPaused(true));
    };

    syncMotion();
    motion.addEventListener("change", syncMotion);
    return () => motion.removeEventListener("change", syncMotion);
  }, []);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().then(() => setPaused(false)).catch(() => setPaused(true));
    } else {
      video.pause();
      setPaused(true);
    }
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px]">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <video
          ref={videoRef}
          className="aspect-[9/16] h-auto w-full"
          poster={IOS_PREVIEW_POSTER_SRC}
          src={IOS_PREVIEW_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Occudule iOS app preview"
        />
        <button
          type="button"
          onClick={togglePlayback}
          className="absolute right-3 top-3 inline-flex rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={paused ? "Play app preview" : "Pause app preview"}
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}
