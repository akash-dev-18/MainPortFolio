"use client";

import { useState, useEffect } from "react";
import { Github, ArrowRight, ArrowDownRight } from "lucide-react";

interface ProjectData {
  title: string;
  type: string;
  desc: string;
  tags: string[];

  colorClass: string;
  btnClass: string;
  borderHoverClass: string;
  githubLink: string;
  demoLink: string;
}

export default function ProjectsSection() {
  const [active, setActive] = useState<number | null>(null);
  const [projectsList, setProjectsList] = useState<ProjectData[]>([]);

  useEffect(() => {
    fetch("/api/data")
      .then(res => res.json())
      .then(data => {
        if (data.projects) {
          setProjectsList(data.projects);
        }
      })
      .catch(console.error);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (active !== index) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = x - xc;
    const dy = y - yc;
    card.style.transform = `scale(1.02) rotateY(${dx / 20}deg) rotateX(${-dy / 20}deg)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setActive(null);
    e.currentTarget.style.transform = "scale(1) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <section id="projects" className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20">
          <h2 className="section-heading mb-4 text-right">PROJECTS</h2>
          <div className="ml-auto h-1 w-24 bg-cyan"></div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {projectsList.map((project, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setActive(idx)}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={handleMouseLeave}
              className="project-card group relative rounded-2xl p-1 transition-all duration-500 glass"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="overflow-hidden rounded-2xl bg-obsidian flex flex-row items-stretch">
                {/* Left accent strip + badge */}
                <div className="flex flex-col items-center justify-center gap-3 px-5 py-6 border-r border-white/5">
                  <span className="glass rounded px-3 py-1 text-[10px] font-bold tracking-tighter whitespace-nowrap">
                    PROJECT_0{idx + 1}
                  </span>
                  <span className={`text-[10px] font-bold ${project.colorClass}`}>[{project.type}]</span>
                </div>
                {/* Content */}
                <div className="flex flex-1 flex-col p-5 gap-3">
                  <h3 className="text-lg lg:text-xl font-bold leading-tight">
                    {project.title.toUpperCase()}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400 line-clamp-2">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-auto pt-1">
                    <a href={project.demoLink} className={`flex justify-center items-center flex-1 ${project.btnClass} py-2 text-center text-[10px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-white rounded`}>
                      Launch Demo
                    </a>
                    <a href={project.githubLink} className={`glass flex h-9 w-9 shrink-0 items-center justify-center border-white/10 transition-colors rounded ${project.borderHoverClass}`}>
                      <Github className="h-4 w-4" />
                    </a>
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
