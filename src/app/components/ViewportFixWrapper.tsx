"use client";

import { useEffect } from "react";

export default function ViewportFixWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const setAppHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--app-height', `${vh * 100}px`);
    };

    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);

    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
    };
  }, []);

  return (
    <div className="full-height flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      {children}
    </div>
  );
}