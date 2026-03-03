"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const h = document.documentElement;
      const b = document.body;
      const percent = ((h.scrollTop || b.scrollTop) / ((h.scrollHeight || b.scrollHeight) - h.clientHeight)) * 100;
      setProgress(percent);
    };

    window.addEventListener("scroll", updateScroll);
    updateScroll(); // init
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-[110] h-[2px] bg-cyan transition-all duration-100"
      style={{ width: `${progress}%` }}
    />
  );
}
