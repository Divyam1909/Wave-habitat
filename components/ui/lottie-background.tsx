"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function LottieBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-slate-900"></div>
      <DotLottieReact
        src="/animations/dashboard-bg.lottie" // Your Lottie file path
        loop
        autoplay
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.3, // Adjust opacity to make it a subtle background
        }}
      />
    </div>
  );
}