// Full Code for: app/(auth)/layout.tsx

import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Define your basePath here so you can easily change it in one place
  const basePath = '/wave';

  return (
    <main className="relative flex justify-center md:justify-end items-center h-screen p-4 md:p-12 lg:p-20 overflow-hidden bg-transparent">
      
      {/* Video Background Container */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          {/* --- CRITICAL FIX --- */}
          {/* We now manually prepend the basePath to the video source URL */}
          <source src={`${basePath}/videos/login-bg.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* The page content (your card) will be rendered here */}
      {children}
    </main>
  );
}