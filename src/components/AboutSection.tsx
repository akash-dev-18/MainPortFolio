"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Download } from "lucide-react";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const typeWriterRef = useRef<HTMLParagraphElement>(null);
  
  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat2Ref = useRef<HTMLSpanElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/data")
      .then(res => res.json())
      .then(resData => {
        if (resData.about) setData(resData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!data) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Profile Card Entrance
      gsap.from(cardRef.current, {
        rotationY: -90,
        opacity: 0,
        x: -100,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%"
        }
      });

      // Text Reveal
      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          y: 30,
          opacity: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%"
          }
        });
      }

      // Stats Counter Animation
      const animateStat = (ref: React.RefObject<HTMLSpanElement | null>, targetValue: number) => {
        if (!ref.current) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: targetValue,
          duration: 2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%"
          },
          onUpdate: () => {
            if (ref.current) ref.current.innerText = Math.floor(obj.val).toString();
          }
        });
      };

      animateStat(stat1Ref, data.about.stat1); 
      animateStat(stat2Ref, data.about.stat2); 
      animateStat(stat3Ref, data.about.stat3); 
      
    }, sectionRef);

    // 3D Card Tilt Effect on Mouse Move
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      
      // Only animate if in view roughly
      const rect = cardRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        gsap.to(cardRef.current, {
          rotationY: xAxis,
          rotationX: -yAxis,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = () => {
      if (!cardRef.current) return;
      gsap.to(cardRef.current, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    if(cardRef.current) {
        cardRef.current.addEventListener("mouseleave", handleMouseLeave);
    }
    
    // Typewriter Effect
    let i = 0;
    let typeWriterTimeout: NodeJS.Timeout;
    
    if (typeWriterRef.current && data.hero?.typewriterText) {
      typeWriterRef.current.innerHTML = "";
      const text = data.hero.typewriterText;
      
      const typeWriter = () => {
        if (i < text.length && typeWriterRef.current) {
          typeWriterRef.current.innerHTML += text.charAt(i);
          i++;
          typeWriterTimeout = setTimeout(typeWriter, 40);
        }
      };
      // Delay typewriter slightly so the card animation can play first
      setTimeout(typeWriter, 1000);
    }

    return () => {
      ctx.revert();
      if (typeWriterTimeout) clearTimeout(typeWriterTimeout);
      window.removeEventListener("mousemove", handleMouseMove);
      if(cardRef.current) {
          cardRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [data]);

  if (!data) return <div className="min-h-screen bg-obsidian"></div>;

  return (
    <section id="about" ref={sectionRef} className="relative flex min-h-screen items-center overflow-hidden py-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          
          {/* Left: Profile 3D Card */}
          <div className="profile-container group lg:col-span-5">
            <div 
              ref={cardRef} 
              className="profile-card-inner glass relative flex min-h-[500px] flex-col justify-end overflow-hidden rounded-3xl p-1"
            >
              <div className="scanline-overlay"></div>
              
              {/* Card Content */}
              <div className="relative z-10 flex h-full flex-col justify-between bg-obsidian/40 p-10">
                <div className="flex items-start justify-between">
                  <div className="neo-border glass flex h-16 w-16 items-center justify-center rounded-xl">
                    <ShieldCheck className="h-8 w-8 text-cyan animate-pulse-slow" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Security Level</p>
                    <p className="font-bold text-cyan">{data.about.clearanceLevel}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-bold leading-none tracking-tighter uppercase relative z-20">
                    {data.hero.heading1}<br/><span className="text-slate-500">{data.hero.heading2}</span>
                  </h2>
                  <p 
                    ref={typeWriterRef} 
                    className="min-h-[3em] text-sm font-light leading-relaxed text-slate-400 relative z-20"
                  ></p>

                  <div className="flex flex-wrap gap-3 mt-4 relative z-20">
                    <a href="#projects" className="group flex items-center gap-2 bg-cyan px-4 py-3 text-[10px] font-bold tracking-widest text-black transition-all hover:bg-white uppercase">
                      {data.hero.button1Text} 
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 transition-transform group-hover:translate-x-1">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </a>
                    <a href="#contact" className="glass border border-white/10 px-4 py-3 text-[10px] font-bold tracking-widest transition-all hover:border-cyan uppercase">
                      {data.hero.button2Text}
                    </a>
                  </div>

                  <div className="h-[1px] w-full bg-gradient-to-r from-cyan to-transparent opacity-30 mt-4 relative z-20"></div>
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Specialization</span>
                      <span className="text-xs font-bold uppercase">{data.about.specialization}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-4">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Location</span>
                      <span className="text-xs font-bold uppercase">{data.about.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/5 blur-[80px]"></div>
            </div>
          </div>

          {/* Right: Bio and Stats */}
          <div className="space-y-12 lg:col-span-7" ref={contentRef}>
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.5em] text-cyan">Identity_Sequence</h3>
              <h2 className="mb-8 text-5xl font-bold tracking-tighter md:text-7xl uppercase">
                {data.about.title}<br/><span className="font-light italic">{data.about.subtitle}</span>
              </h2>
              
              <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-slate-400">
                <p>{data.about.paragraph1}</p>
                <p>{data.about.paragraph2}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-end gap-1">
                  <span ref={stat1Ref} className="text-glow-cyan text-5xl font-bold tracking-tighter text-white">0</span>
                  <span className="mb-1 text-xl font-bold text-cyan">+</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{data.about.stat1Label}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-end gap-1">
                  <span ref={stat2Ref} className="text-glow-purple text-5xl font-bold tracking-tighter text-white">0</span>
                  <span className="mb-1 text-xl font-bold text-purple">+</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{data.about.stat2Label}</p>
              </div>

              <div className="col-span-2 space-y-2 md:col-span-1">
                <div className="flex items-end gap-1">
                  <span ref={stat3Ref} className="text-5xl font-bold tracking-tighter text-white">0</span>
                  <span className="mb-1 text-xl font-bold text-slate-500">+</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{data.about.stat3Label}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-6 pt-4">
              <a href="/AkashResume.pdf" target="_blank" className="glass group flex items-center gap-3 px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white hover:text-black">
                Download_Resume <Download className="h-3 w-3 transition-transform group-hover:translate-y-1" />
              </a>
              <a href="#certifications" className="border border-cyan/20 px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-cyan transition-all hover:bg-cyan/10">
                View_Certifications
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
