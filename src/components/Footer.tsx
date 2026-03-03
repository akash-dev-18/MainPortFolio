"use client";

import { useState, useEffect } from "react";
import { Github, Twitter, Shield, Linkedin } from "lucide-react";

export default function Footer() {
  const [settings, setSettings] = useState({
    name: "AKASH KUMAR",
    linkedin: "#",
    github: "#"
  });

  useEffect(() => {
    fetch("/api/data")
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="border-t border-white/5 bg-obsidian py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div className="text-[10px] font-bold tracking-[0.4em] opacity-40">
          © 2024 {settings.name} // ALL RIGHTS RESERVED
        </div>
        <div className="flex gap-8">
          <a href={settings.github} className="transition-colors hover:text-cyan">
            <Github className="h-5 w-5" />
          </a>
          <a href={settings.linkedin} className="transition-colors hover:text-cyan">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href="#" className="transition-colors hover:text-cyan">
            <Shield className="h-5 w-5" />
          </a>
        </div>
        <div className="animate-pulse text-[10px] font-bold tracking-[0.4em] text-cyan">
          ENCRYPTED_CONNECTION
        </div>
      </div>
    </footer>
  );
}
