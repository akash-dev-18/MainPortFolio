"use client";

import { useState, useEffect } from "react";
import { Mail, Linkedin, Github, CheckCircle } from "lucide-react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [settings, setSettings] = useState({
    email: "akashl.dev2.ak@gmail.com",
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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (res.status === 429) {
        alert("⚠️ RATE LIMIT: Too many transmissions. Please wait 5 minutes before trying again.");
      } else if (data.success) {
        setSent(true);
      } else {
        alert(data.error || "Transmission failed. Please try again.");
      }
    } catch (err) {
      alert("Network Error");
    }
    setLoading(false);
  };

  return (
    <section id="contact" className="relative bg-obsidian py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid gap-20 lg:grid-cols-2">
          <div>
            <h2 className="section-heading mb-8">INITIALIZE_TALK</h2>
            <p className="mb-12 text-lg text-slate-400">
              Interested in working together or just want to talk shop about security and architecture?
            </p>
            
            <div className="space-y-8">
              <div className="group flex items-center gap-6">
                <div className="glass flex h-14 w-14 items-center justify-center rounded-full transition-all group-hover:bg-cyan group-hover:text-black">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email</p>
                  <p className="text-lg font-bold">{settings.email}</p>
                </div>
              </div>
              
              <div className="group flex items-center gap-6">
                <div className="glass flex h-14 w-14 items-center justify-center rounded-full transition-all group-hover:bg-purple group-hover:text-white">
                  <Linkedin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Professional</p>
                  <a href={settings.linkedin} className="text-xl font-bold hover:text-purple transition-colors">LinkedIn</a>
                </div>
              </div>

              <div className="group flex items-center gap-6">
                <div className="glass flex h-14 w-14 items-center justify-center rounded-full transition-all group-hover:bg-emerald-500 group-hover:text-white">
                  <Github className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Code Artifacts</p>
                  <a href={settings.github} className="text-xl font-bold hover:text-emerald-500 transition-colors">GitHub</a>
                </div>
              </div>
            </div>
          </div>

          <div className="neo-border glass rounded-2xl p-10">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Identify Yourself</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-4 font-mono text-white outline-none transition-all focus:border-cyan placeholder:text-white/20"
                    placeholder="NAME / ALIAS"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">Return Path</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-4 font-mono text-white outline-none transition-all focus:border-cyan placeholder:text-white/20"
                    placeholder="EMAIL@HOST.COM"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-500">The Payload</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-4 font-mono text-white outline-none transition-all focus:border-cyan placeholder:text-white/20"
                    placeholder="MESSAGE..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white py-5 font-bold uppercase tracking-widest text-black transition-all hover:bg-cyan disabled:opacity-50"
                >
                  {loading ? "TRANSMITTING..." : "TRANSMIT DATA"}
                </button>
              </form>
            ) : (
              <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                <CheckCircle className="mx-auto mb-6 h-20 w-20 text-cyan animate-pulse-slow" />
                <h3 className="mb-2 text-2xl font-bold">DATA RECEIVED</h3>
                <p className="text-slate-400">Response protocol initiated. Stand by.</p>
                <p className="text-xs text-emerald-500 mt-3 animate-pulse">📧 A confirmation email has been sent to your inbox.</p>
                <button
                  onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
                  className="mt-8 text-xs uppercase tracking-widest underline transition-colors hover:text-cyan"
                >
                  New Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
