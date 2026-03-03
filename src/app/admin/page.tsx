"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Unlock, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [data, setData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (auth) {
      fetch("/api/data")
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error("Failed to load data", err));
    }
  }, [auth]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "akash.45") {
      setAuth(true);
      setError("");
      
      // Fetch Inbox Messages
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "akash.45", action: "get" })
      })
      .then(res => res.json())
      .then(data => {
        if (data.messages) setMessages(data.messages);
      })
      .catch(console.error);

    } else {
      setError("INVALID ADMINISTRATOR CREDENTIALS");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "delete", id })
      });
      const resData = await res.json();
      if (resData.success) {
        setMessages(resData.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, data })
      });
      if (!res.ok) throw new Error("Save failed");
      alert("System Data Overwritten Successfully!");
    } catch (err) {
      alert("Failed to save data. Check console.");
      console.error(err);
    }
    setLoading(false);
  };

  if (!auth) {
    return (
      <main className="min-h-screen bg-obsidian flex items-center justify-center p-6 text-white font-mono">
        <div className="w-full max-w-md glass neo-border p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan to-purple"></div>
          <h1 className="text-3xl font-bold mb-2 tracking-tighter">SECURE_LOGIN</h1>
          <p className="text-xs text-slate-400 mb-8 uppercase tracking-widest">Administrator Access Required</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 outline-none focus:border-cyan text-xl"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold tracking-widest animate-pulse">{error}</p>}
            
            <button type="submit" className="w-full bg-cyan text-black font-bold py-4 uppercase tracking-widest hover:bg-white transition-colors flex justify-center items-center gap-2">
              <Unlock className="w-4 h-4" /> Authenticate
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (!data) return <div className="min-h-screen bg-obsidian flex items-center justify-center text-cyan"><div className="animate-spin w-8 h-8 border-4 border-cyan rounded-full border-t-transparent"></div></div>;

  return (
    <main className="min-h-screen bg-obsidian text-white font-mono pb-32">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-cyan">ADMIN_OVERRIDE</h1>
          <p className="text-[10px] uppercase text-slate-400">Editing Live Data</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setAuth(false)} className="text-slate-400 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest">
            <LogOut className="w-4 h-4" /> Exit
          </button>
          <button onClick={handleSave} disabled={loading} className="bg-cyan text-black px-6 py-2 font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-colors disabled:opacity-50">
            {loading ? "SAVING..." : <><Save className="w-4 h-4" /> DEPLOY TO PROD</>}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 mt-8 space-y-16">
        
        {/* INBOX SECTION */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-6 w-1 bg-yellow-500"></div>
            <h2 className="text-2xl font-bold tracking-widest uppercase text-yellow-500">Comm_Link / Inbox</h2>
          </div>
          <div className="grid gap-4">
            {messages.length === 0 ? (
              <div className="p-8 glass neo-border text-center text-slate-500 uppercase tracking-widest text-xs font-bold">
                No transmissions received.
              </div>
            ) : (
              messages.map((msg: any) => (
                <div key={msg.id} className="p-6 glass neo-border rounded-xl relative group">
                  <button 
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="absolute top-6 right-6 text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
                    <div>
                      <h3 className="text-sm font-bold text-yellow-500">{msg.name}</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{msg.email}</p>
                    </div>
                    <div className="ml-auto text-[10px] text-slate-500 mr-8">
                      {new Date(msg.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded text-sm text-slate-300 font-mono whitespace-pre-wrap">
                    {msg.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Settings Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="h-6 w-1 bg-cyan"></div>
              <h2 className="text-2xl font-bold tracking-widest uppercase">Global Parameters</h2>
            </div>
            <label className="bg-cyan/20 text-cyan px-4 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-cyan hover:text-black transition-colors border border-cyan/50 rounded flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              Upload Resume PDF
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("resume", file);
                  formData.append("password", password);
                  
                  try {
                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                    const result = await res.json();
                    if (result.success) {
                      setData({...data, settings: {...data.settings, resumeUrl: result.url}});
                      alert("Resume uploaded successfully! The URL field below has updated. Click 'DEPLOY TO PROD' to save the new link.");
                    } else {
                      alert(result.error || "Upload failed");
                    }
                  } catch(err) {
                    alert("Network error");
                  }
                }} 
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 glass neo-border rounded-xl">
            {Object.keys(data.settings).map(key => (
              <div key={key}>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{key}</label>
                <input 
                  type="text"
                  value={data.settings[key]}
                  onChange={e => setData({...data, settings: {...data.settings, [key]: e.target.value}})}
                  className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-cyan text-sm"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Theme Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-6 w-1 bg-rose-500"></div>
            <h2 className="text-2xl font-bold tracking-widest uppercase">System Theme</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 glass neo-border rounded-xl">
            {Object.keys(data.theme || {}).map(key => (
              <div key={key}>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{key}</label>
                <input 
                  type="text"
                  value={data.theme[key]}
                  onChange={e => setData({...data, theme: {...data.theme, [key]: e.target.value}})}
                  className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-rose-500 text-sm"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Hero Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-6 w-1 bg-blue-500"></div>
            <h2 className="text-2xl font-bold tracking-widest uppercase">Hero Display</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 p-8 glass neo-border rounded-xl">
            {Object.keys(data.hero || {}).filter(k => k !== 'heading1' && k !== 'heading2').map(key => (
              <div key={key}>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{key}</label>
                {key === 'typewriterText' ? (
                  <textarea 
                    value={data.hero[key]}
                    rows={3}
                    onChange={e => setData({...data, hero: {...data.hero, [key]: e.target.value}})}
                    className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-blue-500 text-sm"
                  />
                ) : (
                  <input 
                    type="text"
                    value={data.hero[key]}
                    onChange={e => setData({...data, hero: {...data.hero, [key]: e.target.value}})}
                    className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-blue-500 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-6 w-1 bg-amber-500"></div>
            <h2 className="text-2xl font-bold tracking-widest uppercase">Identity Bio</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 glass neo-border rounded-xl">
            {Object.keys(data.about || {}).map(key => (
              <div key={key} className={key.startsWith('paragraph') ? 'md:col-span-2' : ''}>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{key}</label>
                {key.startsWith('paragraph') ? (
                  <textarea 
                    value={data.about[key]}
                    rows={4}
                    onChange={e => setData({...data, about: {...data.about, [key]: e.target.value}})}
                    className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-amber-500 text-sm"
                  />
                ) : (
                  <input 
                    type={key.startsWith('stat') && !key.includes('Label') ? 'number' : 'text'}
                    value={data.about[key]}
                    onChange={e => setData({...data, about: {...data.about, [key]: e.target.value}})}
                    className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-amber-500 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-center gap-4">
              <div className="h-6 w-1 bg-purple"></div>
              <h2 className="text-2xl font-bold tracking-widest uppercase">Tech Stack Nodes</h2>
            </div>
            <button 
              onClick={() => setData({...data, skills: [...data.skills, { name: "NEW SKILL", color: 16777215, size: 0.5, desc: "...", image: "/logos_transparent/linux2.png" }]})}
              className="flex items-center gap-2 text-xs font-bold text-purple hover:text-white uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" /> Add Node
            </button>
          </div>

          <div className="grid gap-4">
            {data.skills.map((skill: any, idx: number) => (
              <div key={idx} className="glass p-6 rounded-xl border border-white/5 flex flex-col md:flex-row gap-6 relative group">
                <button 
                  onClick={() => setData({...data, skills: data.skills.filter((_:any, i:number) => i !== idx)})}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex-1 space-y-4">
                  <div>
                     <label className="block text-[10px] text-slate-500 mb-1">NODE_NAME</label>
                     <input value={skill.name} onChange={e => {
                         const newSkills = [...data.skills]; newSkills[idx].name = e.target.value; setData({...data, skills: newSkills});
                     }} className="w-full bg-transparent border-b border-white/20 pb-1 outline-none text-lg font-bold text-purple focus:border-purple" />
                  </div>
                  <div>
                     <label className="block text-[10px] text-slate-500 mb-1">NODE_DESC</label>
                     <input value={skill.desc} onChange={e => {
                         const newSkills = [...data.skills]; newSkills[idx].desc = e.target.value; setData({...data, skills: newSkills});
                     }} className="w-full bg-transparent border-b border-white/20 pb-1 outline-none text-sm focus:border-purple text-slate-300" />
                  </div>
                  <div>
                     <label className="block text-[10px] text-slate-500 mb-1">3D_LOGO_URL</label>
                     <input value={skill.image || ""} onChange={e => {
                         const newSkills = [...data.skills]; newSkills[idx].image = e.target.value; setData({...data, skills: newSkills});
                     }} className="w-full bg-transparent border-b border-white/20 pb-1 outline-none text-xs focus:border-purple text-slate-400" />
                  </div>
                </div>
                <div className="w-32 space-y-4">
                  <div>
                     <label className="block text-[10px] text-slate-500 mb-1">HEX COLOR(INT)</label>
                     <input type="number" value={skill.color} onChange={e => {
                         const newSkills = [...data.skills]; newSkills[idx].color = parseInt(e.target.value); setData({...data, skills: newSkills});
                     }} className="w-full bg-transparent border-b border-white/20 pb-1 outline-none text-xs text-gray-400" />
                  </div>
                  <div>
                     <label className="block text-[10px] text-slate-500 mb-1">SIZE_SCALE</label>
                     <input type="number" step="0.1" value={skill.size} onChange={e => {
                         const newSkills = [...data.skills]; newSkills[idx].size = parseFloat(e.target.value); setData({...data, skills: newSkills});
                     }} className="w-full bg-transparent border-b border-white/20 pb-1 outline-none text-xs text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-center gap-4">
              <div className="h-6 w-1 bg-emerald-500"></div>
              <h2 className="text-2xl font-bold tracking-widest uppercase">Project Artifacts</h2>
            </div>
            <button 
              onClick={() => setData({...data, projects: [...data.projects, { title: "New Project", type: "APP", desc: "...", tags: ["React"], image: "", colorClass: "text-white", btnClass: "bg-white text-black", borderHoverClass: "hover:border-white", githubLink: "", demoLink: "" }]})}
              className="flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-white uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" /> Add Artifact
            </button>
          </div>

          <div className="grid gap-6">
            {data.projects.map((project: any, idx: number) => (
              <div key={idx} className="glass p-8 rounded-xl border border-emerald-500/20 relative group">
                <button 
                  onClick={() => setData({...data, projects: data.projects.filter((_:any, i:number) => i !== idx)})}
                  className="absolute top-6 right-6 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2">PROJECT TITLE</label>
                    <input value={project.title} onChange={e => {
                        const newP = [...data.projects]; newP[idx].title = e.target.value; setData({...data, projects: newP});
                    }} className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-emerald-500 font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2">TYPE TAG (e.g. BACKEND_SEC)</label>
                    <input value={project.type} onChange={e => {
                        const newP = [...data.projects]; newP[idx].type = e.target.value; setData({...data, projects: newP});
                    }} className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-emerald-500 text-sm" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-slate-500 mb-2">DESCRIPTION</label>
                  <textarea value={project.desc} rows={3} onChange={e => {
                      const newP = [...data.projects]; newP[idx].desc = e.target.value; setData({...data, projects: newP});
                  }} className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-emerald-500 text-sm text-slate-300" />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2">IMAGE URL</label>
                    <input value={project.image} onChange={e => {
                        const newP = [...data.projects]; newP[idx].image = e.target.value; setData({...data, projects: newP});
                    }} className="w-full bg-white/5 border border-white/10 p-2 outline-none focus:border-emerald-500 text-xs text-slate-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2">GITHUB REPO</label>
                    <input value={project.githubLink} onChange={e => {
                        const newP = [...data.projects]; newP[idx].githubLink = e.target.value; setData({...data, projects: newP});
                    }} className="w-full bg-white/5 border border-white/10 p-2 outline-none focus:border-emerald-500 text-xs text-slate-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2">LIVE DEMO</label>
                    <input value={project.demoLink} onChange={e => {
                        const newP = [...data.projects]; newP[idx].demoLink = e.target.value; setData({...data, projects: newP});
                    }} className="w-full bg-white/5 border border-white/10 p-2 outline-none focus:border-emerald-500 text-xs text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-2">TAGS (COMMA SEPARATED)</label>
                  <input value={project.tags.join(", ")} onChange={e => {
                      const newP = [...data.projects]; newP[idx].tags = e.target.value.split(",").map(s => s.trim()); setData({...data, projects: newP});
                  }} className="w-full bg-white/5 border-l-4 border-emerald-500/50 p-3 outline-none text-xs font-bold text-emerald-400" />
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-center gap-4">
              <div className="h-6 w-1 bg-sky-500"></div>
              <h2 className="text-2xl font-bold tracking-widest uppercase">Certifications</h2>
            </div>
            <button 
              onClick={() => setData({...data, certifications: [...(data.certifications || []), { title: "New Certification", issuer: "Issuer", image: "", link: "", date: "2025" }]})}
              className="flex items-center gap-2 text-xs font-bold text-sky-500 hover:text-white uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" /> Add Cert
            </button>
          </div>

          <div className="grid gap-6">
            {(data.certifications || []).map((cert: any, idx: number) => (
              <div key={idx} className="glass p-6 rounded-xl border border-sky-500/20 relative group">
                <button 
                  onClick={() => setData({...data, certifications: data.certifications.filter((_:any, i:number) => i !== idx)})}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2">CERT TITLE</label>
                    <input value={cert.title} onChange={e => {
                        const newC = [...data.certifications]; newC[idx].title = e.target.value; setData({...data, certifications: newC});
                    }} className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-sky-500 font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2">ISSUER</label>
                    <input value={cert.issuer} onChange={e => {
                        const newC = [...data.certifications]; newC[idx].issuer = e.target.value; setData({...data, certifications: newC});
                    }} className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-sky-500 text-sm" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2">IMAGE URL</label>
                    <input value={cert.image} onChange={e => {
                        const newC = [...data.certifications]; newC[idx].image = e.target.value; setData({...data, certifications: newC});
                    }} className="w-full bg-white/5 border border-white/10 p-2 outline-none focus:border-sky-500 text-xs text-slate-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2">VERIFY LINK</label>
                    <input value={cert.link} onChange={e => {
                        const newC = [...data.certifications]; newC[idx].link = e.target.value; setData({...data, certifications: newC});
                    }} className="w-full bg-white/5 border border-white/10 p-2 outline-none focus:border-sky-500 text-xs text-slate-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-2">DATE / YEAR</label>
                    <input value={cert.date} onChange={e => {
                        const newC = [...data.certifications]; newC[idx].date = e.target.value; setData({...data, certifications: newC});
                    }} className="w-full bg-white/5 border border-white/10 p-2 outline-none focus:border-sky-500 text-xs text-slate-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
