"use client";

import { useEffect } from "react";

export default function ViewportFixWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const setAppHeight = () => {
    //   const vh = window.innerHeight * 0.01;
    //   document.documentElement.style.setProperty('--app-height', `${vh * 100}px`);

      const vh = (window.visualViewport?.height || window.innerHeight) * 0.01;
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
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
    <div className="h-[calc(var(--app-height,1vh)_*100)] flex justify-center">
      {children}
    </div>
  );
}