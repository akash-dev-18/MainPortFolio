"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed left-0 top-0 z-[100] w-full transition-all duration-500 ${
          scrolled ? "glass border-b border-white/10 py-4" : "py-8"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <a href="#" className="group flex items-center gap-3 text-sm font-bold tracking-[0.5em]">
            <div className="h-2 w-2 bg-cyan shadow-[0_0_10px_#10b981] transition-transform duration-700 group-hover:rotate-180 group-hover:scale-150 relative">
                <span className="absolute w-full h-full bg-cyan blur-sm"></span>
            </div>
            <span>SECURE_CORE // V2.0</span>
          </a>

          <div className="hidden items-center gap-10 text-xs font-bold uppercase tracking-[0.2em] md:flex">
            <a href="#about" className="transition-colors hover:text-cyan">
              Profile
            </a>
            <a href="#skills" className="transition-colors hover:text-cyan">
              Stack
            </a>
            <a href="#projects" className="transition-colors hover:text-cyan">
              Work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/20 px-5 py-2 transition-all hover:bg-white hover:text-black"
            >
              Connect
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[150] flex flex-col items-center justify-center gap-8 bg-obsidian text-3xl font-bold transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute right-8 top-8 text-white"
        >
          <X className="h-8 w-8" />
        </button>
        <a href="#about" onClick={() => setMenuOpen(false)} className="hover:text-cyan transition-colors">
          PROFILE
        </a>
        <a href="#skills" onClick={() => setMenuOpen(false)} className="hover:text-cyan transition-colors">
          STACK
        </a>
        <a href="#projects" onClick={() => setMenuOpen(false)} className="hover:text-cyan transition-colors">
          WORK
        </a>
        <a href="#contact" onClick={() => setMenuOpen(false)} className="text-cyan">
          CONNECT
        </a>
      </div>
    </>
  );
}
