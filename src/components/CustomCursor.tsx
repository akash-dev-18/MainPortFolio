"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    const onMouseMove = (e: MouseEvent) => {
      // Hardware-level instant tracking for main cursor bypassing GSAP entirely
      if (cursor) {
        cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
      }
      
      // Follower has a slight spring delay with GSAP
      if (follower) {
        gsap.to(follower, { 
          x: e.clientX, 
          y: e.clientY, 
          duration: 0.1, // Even faster follower
          ease: "power2.out" 
        });
      }
    };

    // Hover effects on clickable items
    const onMouseEnter = () => {
      gsap.to(cursor, { scale: 3, backgroundColor: "rgba(16, 185, 129, 0.3)", duration: 0.2 });
      gsap.to(follower, { scale: 1.5, borderColor: "rgba(16, 185, 129, 0.8)", duration: 0.2 });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, { scale: 1, backgroundColor: "#10b981", duration: 0.2 });
      gsap.to(follower, { scale: 1, borderColor: "rgba(16, 185, 129, 0.3)", duration: 0.2 });
    };

    document.addEventListener("mousemove", onMouseMove);

    // Apply hover listeners to links and buttons
    const interactiveElements = document.querySelectorAll("a, button, .project-card, .skill-pill");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-2 w-2 rounded-full bg-cyan shadow-[0_0_15px_#10b981] transition-none hidden md:block"
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={followerRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/30 hidden md:block"
      />
    </>
  );
}
