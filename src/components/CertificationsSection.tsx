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

  // No GSAP animation — cards render immediately and visibly

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
            <div
              key={idx}
              className="cert-card rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-cyan/40 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Cert Image */}
              <div className="relative h-44 overflow-hidden bg-obsidian">
                {cert.image ? (
                  <img
                    src={cert.image}
                    alt={cert.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Award className="h-16 w-16 text-cyan/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
              </div>

              {/* Cert Info */}
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide leading-tight text-white">
                      {cert.title}
                    </h3>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {cert.issuer}
                    </p>
                    {cert.date && (
                      <p className="mt-2 text-[10px] text-slate-500 uppercase tracking-widest">
                        {cert.date}
                      </p>
                    )}
                    {cert.link && cert.link !== "#" && (
                      <a href={cert.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-cyan hover:text-white transition-colors">
                        Verify <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
