"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, ExternalLink } from "lucide-react";

interface Certification {
  title: string;
  issuer: string;
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

        <div className="grid gap-4 sm:grid-cols-2">
          {certs.map((cert, idx) => (
            <div
              key={idx}
              className="cert-card rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-cyan/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan/10 border border-cyan/20">
                  <Award className="h-5 w-5 text-cyan" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold uppercase tracking-wide leading-tight text-white truncate">
                    {cert.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {cert.issuer}
                    </span>
                    {cert.date && (
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                        • {cert.date}
                      </span>
                    )}
                  </div>
                </div>
                {cert.link && cert.link !== "#" && (
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-cyan hover:text-white transition-colors">
                    Verify <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
