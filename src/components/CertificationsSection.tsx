"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, ExternalLink } from "lucide-react";

interface Certification {
  title: string;
  issuer: string;
  image: string;
  link: string;
  date: string;
}

export default function CertificationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [certs, setCerts] = useState<Certification[]>([]);

  useEffect(() => {
    fetch("/api/data")
      .then(res => res.json())
      .then(data => {
        if (data.certifications) setCerts(data.certifications);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (certs.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".cert-card", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [certs]);

  if (certs.length === 0) return null;

  return (
    <section id="certifications" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.5em] text-cyan">
            Verified_Credentials
          </h3>
          <h2 className="section-heading">CERTIFICATIONS</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((cert, idx) => (
            <a
              key={idx}
              href={cert.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-card group glass rounded-2xl overflow-hidden border border-white/5 hover:border-cyan/40 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Cert Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent"></div>
                <div className="absolute top-3 right-3 glass flex h-8 w-8 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-3 w-3 text-cyan" />
                </div>
              </div>

              {/* Cert Info */}
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide leading-tight group-hover:text-cyan transition-colors">
                      {cert.title}
                    </h3>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {cert.issuer}
                    </p>
                    {cert.date && (
                      <p className="mt-2 text-[10px] text-slate-600 uppercase tracking-widest">
                        {cert.date}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
