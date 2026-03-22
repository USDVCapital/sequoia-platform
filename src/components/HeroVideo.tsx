"use client";

import { useRef, useEffect } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Programmatically play the video on mount — required for client-side
    // navigation since browsers only honor autoPlay on initial page load.
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay blocked — silently ignore
      });
    }
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/seq-hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src="/seq-hero-forest-web.mp4" type="video/mp4" />
      </video>
      <div aria-hidden="true" className="absolute inset-0 bg-black/65" />
    </>
  );
}
