"use client";

import { useEffect } from "react";

export default function ViewportFixWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);

    return () => window.removeEventListener("resize", setAppHeight);
  }, []);

  return <div className="full-height bg-gray-100">{children}</div>;
}