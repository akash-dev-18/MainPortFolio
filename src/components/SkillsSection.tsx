"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SkillData {
  name: string;
  color: number;
  size: number;
  desc: string;
  image: string;
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSkill, setActiveSkill] = useState<SkillData | null>(null);
  const [skillsList, setSkillsList] = useState<SkillData[]>([]);

  // Fetch data
  useEffect(() => {
    fetch("/api/data")
      .then(res => res.json())
      .then(data => {
        if (data.skills) {
          setSkillsList(data.skills);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (skillsList.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(".skills-heading", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%"
        }
      });

      // Floating animation for logos
      const logos = gsap.utils.toArray(".skill-logo-anim");
      logos.forEach((logo: any, i) => {
        gsap.to(logo, {
          y: "random(-15, 15)",
          x: "random(-15, 15)",
          rotation: "random(-5, 5)",
          duration: "random(3, 5)",
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.1,
        });
      });
      
    }, sectionRef);

    return () => ctx.revert();
  }, [skillsList]);

  return (
    <section id="skills" ref={sectionRef} className="relative flex min-h-[120vh] flex-col pt-20">
      
      {/* Sticky Content */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Header Overlay */}
        <div className="absolute left-0 top-32 z-10 w-full pointer-events-none">
          <div className="mx-auto max-w-7xl px-6">
            <div className="skills-heading flex flex-col items-start gap-4">
              <div className="flex items-center gap-4">
                <span className="h-[1px] w-12 bg-cyan"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan">Tech Neural Network</span>
              </div>
              <h1 className="section-heading">
                TECH<br />
                <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">ECOSYSTEM</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Background Gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-obsidian via-electric/10 to-obsidian pointer-events-none" />

        {/* Floating Logos Container */}
        <div ref={containerRef} className="relative z-10 w-full max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-8 md:gap-14 pt-32 px-6">
          {skillsList.map((skill, idx) => (
            <div 
              key={idx}
              className="skill-logo-anim relative group cursor-pointer"
              onMouseEnter={() => setActiveSkill(skill)}
              onMouseLeave={() => setActiveSkill(null)}
            >
              {/* Glow Behind Logo */}
              <div 
                className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" 
                style={{ backgroundColor: `#${skill.color.toString(16).padStart(6, '0')}` }}
              ></div>
              
              {/* Logo Image */}
              <div className="relative z-10 glass neo-border p-4 md:p-6 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2"
                   style={{ borderColor: activeSkill?.name === skill.name ? `#${skill.color.toString(16).padStart(6, '0')}88` : '' }}
              >
                <img 
                  src={skill.image || "/logos_transparent/linux.png"} 
                  alt={skill.name} 
                  loading="lazy"
                  decoding="async"
                  className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Side Information Panel (Left) */}
        <div className="absolute bottom-12 left-6 z-20 hidden max-w-xs xl:block pointer-events-none">
          <div className="glass rounded-lg border-l-4 border-cyan p-6">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">System Instruction</p>
            <p className="mb-6 text-xs leading-relaxed text-slate-300">
              Hover over the responsive skill nodes to visualize proficiency metrics and integration layers. Fully dynamic and loaded securely from external origins.
            </p>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-cyan">98%</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Stability Rate</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-purple">5.0</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Architecture Tier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Tooltip Panel (Center/Bottom) */}
        <div
          className={`absolute bottom-12 left-1/2 z-30 w-full max-w-lg -translate-x-1/2 px-6 transition-all duration-300 pointer-events-none ${
            activeSkill ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="glass group relative overflow-hidden rounded-2xl border border-cyan/30 p-8 text-center"
               style={{ 
                 borderColor: activeSkill ? `#${activeSkill.color.toString(16).padStart(6, '0')}40` : ''
               }}
          >
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-cyan to-transparent"
                 style={{ backgroundImage: activeSkill ? `linear-gradient(to right, transparent, #${activeSkill.color.toString(16).padStart(6, '0')}, transparent)` : '' }}
            ></div>
            
            <h3 className="mb-3 text-4xl font-bold tracking-tighter text-cyan transition-colors duration-300"
                style={{ color: activeSkill ? `#${activeSkill.color.toString(16).padStart(6, '0')}` : '' }}
            >
              {activeSkill ? activeSkill.name : "SELECT"}
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              {activeSkill ? activeSkill.desc : ""}
            </p>
            
            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 w-8 ${
                    i <= 4 ? "bg-cyan shadow-[0_0_10px_#10b981]" : "bg-white/10"
                  } transition-all duration-300`}
                  style={i <= 4 && activeSkill ? { backgroundColor: `#${activeSkill.color.toString(16).padStart(6, '0')}`, boxShadow: `0 0 10px #${activeSkill.color.toString(16).padStart(6, '0')}80` } : {}}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Stats Counter */}
        <div className="pointer-events-none absolute right-12 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-12 text-right xl:flex">
          <div className="group">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Total Assets</p>
            <p className="text-4xl font-bold text-white transition-colors">1.2K</p>
          </div>
          <div className="group">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Nodes Active</p>
            <p className="text-4xl font-bold text-gray-300 transition-colors">{skillsList.length}</p>
          </div>
          <div className="group">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Security Index</p>
            <p className="text-4xl font-bold text-gray-300 transition-colors">A+</p>
          </div>
        </div>

      </div>
      
      {/* Skill Details Grid (Appears during normal scroll) */}
      <div className="relative z-10 w-full bg-obsidian py-32 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {skillsList.map((skill, idx) => (
              <div key={skill.name} className="glass group relative overflow-hidden p-8 transition-all hover:bg-white/5">
                <div 
                    className="absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl transition-all opacity-10 group-hover:opacity-30"
                    style={{ backgroundColor: `#${skill.color.toString(16).padStart(6, '0')}` }}
                ></div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 glass neo-border flex items-center justify-center rounded-xl p-2 transition-transform group-hover:scale-110">
                    <img src={skill.image || "/logos_transparent/linux.png"} alt={skill.name} loading="lazy" decoding="async" className="max-w-full max-h-full object-contain" />
                  </div>
                  <span className="block text-[10px] font-bold tracking-widest text-slate-600">
                    {`0${idx + 1}`}
                  </span>
                </div>

                <h4 className="mb-2 text-xl font-bold transition-colors group-hover:text-cyan" style={{ color: `#${skill.color.toString(16).padStart(6, '0')}` }}>
                    {skill.name}
                </h4>
                <p className="text-xs leading-relaxed text-slate-400">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
