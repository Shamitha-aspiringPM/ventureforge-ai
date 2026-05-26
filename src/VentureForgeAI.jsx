import React, { useState, useEffect, useContext, createContext } from "react";

// ─── MIXPANEL ─────────────────────────────────────────────────────────────────
const MIXPANEL_TOKEN = "d11bda2fc264179fb581b934e011933c";

// Load Mixpanel SDK and init
(function() {
  if (window.mixpanel) return;
  const s = document.createElement("script");
  s.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
  s.onload = () => window.mixpanel.init(MIXPANEL_TOKEN, { persistence:"localStorage" });
  document.head.appendChild(s);
})();

// Safe track wrapper — works even if SDK hasn't loaded yet
const track = (event, props={}) => {
  try {
    if (window.mixpanel && window.mixpanel.track) {
      window.mixpanel.track(event, props);
    }
  } catch(e) {}
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #080B10; --surface: #0E1219; --surface2: #141923;
      --border: rgba(255,255,255,0.07);
      --accent: #00FFB2; --accent2: #FF4D6D; --accent3: #6C63FF;
      --text: #E8EDF5; --muted: #6B7A8D;
      --font-head: 'Syne', sans-serif; --font-mono: 'Space Mono', monospace;
    }
    body { background: var(--bg); color: var(--text); font-family: var(--font-head); }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin   { to { transform: rotate(360deg); } }
    @keyframes pulse  { 0%{box-shadow:0 0 0 0 rgba(0,255,178,0.4)} 70%{box-shadow:0 0 0 10px rgba(0,255,178,0)} 100%{box-shadow:0 0 0 0 rgba(0,255,178,0)} }
    .fade-up   { animation: fadeUp 0.35s ease both; }
    .fade-up-1 { animation: fadeUp 0.35s 0.07s ease both; }
    .fade-up-2 { animation: fadeUp 0.35s 0.14s ease both; }
    .fade-up-3 { animation: fadeUp 0.35s 0.21s ease both; }
    .grid-bg {
      background-image: linear-gradient(rgba(0,255,178,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,178,0.03) 1px,transparent 1px);
      background-size: 40px 40px;
    }
    button:focus { outline: none; }
  `}</style>
);

// ─── APP CONTEXT — single source of truth ────────────────────────────────────
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
const Card = ({ children, style={}, className="" }) => (
  <div className={className} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:16, padding:24, ...style }}>{children}</div>
);

const Btn = ({ children, onClick, variant="primary", disabled=false, style={} }) => {
  const variants = {
    primary: { background:"var(--accent)",   color:"#000", fontWeight:700, border:"none" },
    ghost:   { background:"transparent",     color:"var(--accent)", border:"1px solid var(--accent)" },
    danger:  { background:"var(--accent2)",  color:"#fff", fontWeight:700, border:"none" },
    muted:   { background:"var(--surface2)", color:"var(--text)", border:"1px solid var(--border)" },
    purple:  { background:"var(--accent3)",  color:"#fff", fontWeight:700, border:"none" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...variants[variant], padding:"10px 20px", borderRadius:8,
      fontFamily:"var(--font-head)", fontSize:14,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transition:"opacity 0.2s,transform 0.1s",
      display:"inline-flex", alignItems:"center", gap:8,
      ...style
    }}>{children}</button>
  );
};

const Field = ({ label, value, onChange, placeholder, rows }) => (
  <div style={{ marginBottom:14 }}>
    {label && <div style={{ fontSize:10, color:"var(--muted)", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:5 }}>{label}</div>}
    {rows
      ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
          style={{ width:"100%", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"9px 12px", color:"var(--text)", fontFamily:"var(--font-head)", fontSize:14, resize:"vertical", outline:"none" }}
          onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"} />
      : <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={{ width:"100%", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"9px 12px", color:"var(--text)", fontFamily:"var(--font-head)", fontSize:14, outline:"none" }}
          onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"} />
    }
  </div>
);

const Dropdown = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom:14 }}>
    {label && <div style={{ fontSize:10, color:"var(--muted)", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:5 }}>{label}</div>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:"100%", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"9px 12px", color:"var(--text)", fontFamily:"var(--font-head)", fontSize:14, outline:"none", cursor:"pointer" }}>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const Badge = ({ children, color="accent" }) => {
  const c = { accent:"var(--accent)", danger:"var(--accent2)", purple:"var(--accent3)" };
  return <span style={{ background:c[color]+"18", color:c[color], border:`1px solid ${c[color]}28`, borderRadius:6, padding:"3px 9px", fontSize:11, fontFamily:"var(--font-mono)" }}>{children}</span>;
};

const Bar = ({ label, score, max=10 }) => (
  <div style={{ marginBottom:11 }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:13 }}>
      <span>{label}</span>
      <span style={{ color:"var(--accent)", fontFamily:"var(--font-mono)" }}>{score}/{max}</span>
    </div>
    <div style={{ height:5, background:"var(--surface2)", borderRadius:3, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${(score/max)*100}%`, background:"linear-gradient(90deg,var(--accent3),var(--accent))", borderRadius:3, transition:"width 0.9s ease" }} />
    </div>
  </div>
);

const Spinner = () => (
  <span style={{ width:18, height:18, border:"2px solid rgba(0,255,178,0.2)", borderTop:"2px solid var(--accent)", borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block", flexShrink:0 }} />
);

const LoadingSteps = ({ steps }) => {
  const [i, setI] = useState(0);
  useEffect(()=>{
    if (i >= steps.length-1) return;
    const t = setTimeout(()=>setI(s=>s+1), 950);
    return ()=>clearTimeout(t);
  }, [i, steps.length]);
  return (
    <Card style={{ padding:28, display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}><Spinner /></div>
      {steps.map((s,idx)=>(
        <div key={idx} style={{ display:"flex", gap:9, alignItems:"center", fontSize:13, transition:"color 0.3s",
          color: idx<i ? "var(--accent)" : idx===i ? "var(--text)" : "var(--muted)" }}>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:10, width:10 }}>{idx<i?"✓":idx===i?"→":"○"}</span>{s}
        </div>
      ))}
    </Card>
  );
};

// ─── API ─────────────────────────────────────────────────────────────────────
async function ai(prompt, maxTokens=1024) {
  try {
    const res = await fetch("/api/claude", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: maxTokens,
        system: "Reply ONLY with valid JSON. No markdown, no explanation.",
        messages: [{ role:"user", content: prompt }]
      })
    });
    const data = await res.json();
    if (data.error) return { _error: data.error.message || "API error" };
    const raw = (data.content||[]).map(c=>c.text||"").join("").trim();
    const stripped = raw.replace(/^```json\s*/i,"").replace(/^```\s*/,"").replace(/\s*```$/,"").trim();
    const start = stripped.indexOf("{");
    const end   = stripped.lastIndexOf("}");
    if (start === -1 || end === -1) return { _error: "No JSON found in response" };
    const clean = stripped.slice(start, end + 1);
    return JSON.parse(clean);
  } catch(e) {
    return { _error: e.message };
  }
}

// ─── PIPELINE CONFIG ─────────────────────────────────────────────────────────
const STEPS = [
  { id:"generator",   icon:"⚡", label:"Idea"        },
  { id:"validation",  icon:"📊", label:"Validate"    },
  { id:"competitors", icon:"🔬", label:"Competitors" },
  { id:"mvp",         icon:"🗺️", label:"MVP"         },
  { id:"bizmodel",    icon:"💰", label:"Biz Model"   },
  { id:"roast",       icon:"🔥", label:"Roast"       },
];

// ─── PIPELINE BAR ─────────────────────────────────────────────────────────────
const PipelineBar = () => {
  const { tab, setTab, idea, done } = useApp();
  return (
    <div style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)", padding:"11px 24px", display:"flex", alignItems:"center", gap:0, overflowX:"auto", flexShrink:0 }}>
      {STEPS.map((s,i)=>{
        const isDone    = done.includes(s.id);
        const isActive  = tab === s.id;
        const isLocked  = !idea && s.id !== "generator";
        return (
          <div key={s.id} style={{ display:"flex", alignItems:"center" }}>
            <button onClick={()=>!isLocked && setTab(s.id)} style={{
              display:"flex", alignItems:"center", gap:6, padding:"6px 13px", borderRadius:8,
              border: isActive ? "1px solid var(--accent)" : isDone ? "1px solid rgba(0,255,178,0.25)" : "1px solid var(--border)",
              background: isActive ? "rgba(0,255,178,0.11)" : isDone ? "rgba(0,255,178,0.04)" : "transparent",
              color: isActive ? "var(--accent)" : isDone ? "rgba(0,255,178,0.8)" : isLocked ? "var(--muted)" : "var(--text)",
              fontFamily:"var(--font-head)", fontSize:13, cursor: isLocked ? "not-allowed" : "pointer",
              opacity: isLocked ? 0.4 : 1, whiteSpace:"nowrap", transition:"all 0.15s"
            }}>
              <span>{s.icon}</span>{s.label}{isDone && <span style={{ fontSize:9, color:"var(--accent)", fontFamily:"var(--font-mono)" }}>✓</span>}
            </button>
            {i < STEPS.length-1 && <div style={{ width:20, height:1, background: isDone ? "rgba(0,255,178,0.25)" : "var(--border)", flexShrink:0 }} />}
          </div>
        );
      })}
      <span style={{ marginLeft:"auto", paddingLeft:16, fontSize:11, fontFamily:"var(--font-mono)", color:"var(--muted)", flexShrink:0 }}>{done.length}/{STEPS.length}</span>
    </div>
  );
};

// ─── ACTIVE IDEA BANNER ───────────────────────────────────────────────────────
const IdeaBanner = () => {
  const { idea, clearIdea, setTab } = useApp();
  if (!idea) return null;
  return (
    <div style={{ background:"rgba(0,255,178,0.06)", border:"1px solid rgba(0,255,178,0.18)", borderRadius:11, padding:"12px 16px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:10, fontFamily:"var(--font-mono)", color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Active</span>
        <span style={{ fontWeight:700, fontSize:14 }}>{idea.ideaTitle}</span>
        <Badge color="accent">{idea.industry||"Startup"}</Badge>
      </div>
      <div style={{ display:"flex", gap:7 }}>
        <Btn variant="ghost" onClick={()=>setTab("generator")} style={{ padding:"4px 12px", fontSize:12 }}>✏ Change</Btn>
        <Btn variant="muted" onClick={clearIdea} style={{ padding:"4px 12px", fontSize:12 }}>✕ Clear</Btn>
      </div>
    </div>
  );
};

// ─── NEXT STEP NUDGE ──────────────────────────────────────────────────────────
const Nudge = ({ current }) => {
  const { idea, setTab } = useApp();
  const idx  = STEPS.findIndex(s=>s.id===current);
  const next = STEPS[idx+1];
  if (!next || !idea) return null;
  return (
    <div style={{ marginTop:24, padding:"14px 20px", background:"rgba(108,99,255,0.08)", border:"1px solid rgba(108,99,255,0.2)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
      <div>
        <div style={{ fontSize:10, color:"var(--accent3)", fontFamily:"var(--font-mono)", marginBottom:3 }}>NEXT STEP</div>
        <div style={{ fontWeight:700, fontSize:14 }}>{next.icon} {next.label} — continue with <span style={{ color:"var(--accent)" }}>{idea.ideaTitle}</span></div>
      </div>
      <Btn variant="purple" onClick={()=>setTab(next.id)} style={{ padding:"8px 16px", fontSize:13 }}>Continue → {next.label}</Btn>
    </div>
  );
};

// ─── LANDING ──────────────────────────────────────────────────────────────────
const Landing = ({ onEnter }) => {
  useEffect(() => { track("Landing Page Viewed"); }, []);
  return (
  <div className="grid-bg" style={{ minHeight:"100vh", padding:"0 20px" }}>
    <nav style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 0", maxWidth:1100, margin:"0 auto" }}>
      <div style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:19 }}>
        <span style={{ color:"var(--accent)" }}>Venture</span>Forge<span style={{ color:"var(--accent)", fontSize:9, verticalAlign:"super", marginLeft:2 }}>AI</span>
      </div>
      <Btn variant="ghost" onClick={onEnter}>Launch App →</Btn>
    </nav>
    <div style={{ maxWidth:1100, margin:"0 auto", paddingTop:64, paddingBottom:80, textAlign:"center" }}>
      <div className="fade-up" style={{ marginBottom:12 }}><Badge color="accent">Linked Startup Strategy Pipeline</Badge></div>
      <h1 className="fade-up-1" style={{ fontWeight:800, fontSize:"clamp(36px,7vw,74px)", lineHeight:1.06, letterSpacing:"-0.03em", marginBottom:18 }}>
        From Raw Idea<br /><span style={{ color:"var(--accent)" }}>to Full Strategy</span><br />in One Flow.
      </h1>
      <p className="fade-up-2" style={{ fontSize:17, color:"var(--muted)", maxWidth:480, margin:"0 auto 32px", lineHeight:1.7 }}>
        One idea. Six AI-powered steps. All linked, all in one workspace.
      </p>
      <Btn onClick={onEnter} style={{ padding:"13px 30px", fontSize:16, animation:"pulse 2s infinite" }}>Start the Pipeline →</Btn>
      <div style={{ marginTop:50, display:"flex", alignItems:"center", justifyContent:"center", flexWrap:"wrap" }}>
        {STEPS.map((s,i)=>(
          <div key={s.id} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ padding:"9px 15px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:8, fontSize:13, display:"flex", alignItems:"center", gap:6 }}>{s.icon} {s.label}</div>
            {i<STEPS.length-1 && <div style={{ width:16, height:1, background:"var(--border)" }} />}
          </div>
        ))}
      </div>
      <div style={{ marginTop:48, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:14 }}>
        {[
          {icon:"⚡",t:"Idea Generator",    d:"From inputs to a structured startup concept"},
          {icon:"📊",t:"Market Validation", d:"AI-scored feasibility across 5 dimensions"},
          {icon:"🔬",t:"Competitors",       d:"Map your landscape, find differentiation"},
          {icon:"🗺️",t:"MVP Planner",       d:"Prioritised roadmap and sprint plan"},
          {icon:"💰",t:"Biz Models",        d:"Monetisation strategies matched to your idea"},
          {icon:"🔥",t:"Roast Mode",        d:"Brutal AI critique to stress-test your concept"},
        ].map((f,i)=>(
          <Card key={i} className={`fade-up-${(i%3)+1}`} style={{ textAlign:"left" }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{f.icon}</div>
            <div style={{ fontWeight:700, marginBottom:4 }}>{f.t}</div>
            <div style={{ fontSize:13, color:"var(--muted)", lineHeight:1.6 }}>{f.d}</div>
          </Card>
        ))}
      </div>
    </div>
  </div>
);
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const { tab, setTab, saved } = useApp();
  const general = [
    { id:"dashboard", icon:"⬡", label:"Dashboard" },
    { id:"workspace", icon:"💾", label:`Workspace (${saved.length})` },
  ];
  const NavBtn = ({ id, icon, label }) => (
    <button onClick={()=>setTab(id)} style={{
      display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 10px",
      borderRadius:8, background: tab===id ? "rgba(0,255,178,0.1)" : "transparent",
      border: tab===id ? "1px solid rgba(0,255,178,0.2)" : "1px solid transparent",
      color: tab===id ? "var(--accent)" : "var(--muted)",
      fontFamily:"var(--font-head)", fontSize:13, cursor:"pointer", transition:"all 0.15s", marginBottom:3, textAlign:"left"
    }}><span style={{ fontSize:14 }}>{icon}</span>{label}</button>
  );
  return (
    <aside style={{ width:192, minHeight:"100vh", background:"var(--surface)", borderRight:"1px solid var(--border)", padding:"20px 10px", display:"flex", flexDirection:"column", flexShrink:0 }}>
      <div style={{ fontWeight:800, fontSize:15, padding:"0 10px 20px", letterSpacing:"-0.02em" }}>
        <span style={{ color:"var(--accent)" }}>Venture</span>Forge<span style={{ color:"var(--accent)", fontSize:9, verticalAlign:"super" }}>AI</span>
      </div>
      {general.map(n=><NavBtn key={n.id} {...n} />)}
      <div style={{ margin:"12px 0 7px", fontSize:10, color:"var(--muted)", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:"0.08em", padding:"0 10px" }}>Pipeline</div>
      {STEPS.map(n=><NavBtn key={n.id} {...n} />)}
      <div style={{ marginTop:"auto", padding:"12px 10px", fontSize:10, color:"var(--muted)", fontFamily:"var(--font-mono)", borderTop:"1px solid var(--border)", lineHeight:1.8 }}>
        VentureForge AI<br /><span style={{ color:"var(--accent)" }}>v3.0</span>
      </div>
    </aside>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { idea, saved, done, setTab, loadIdea } = useApp();
  return (
    <div style={{ padding:30 }}>
      <h2 style={{ fontWeight:800, fontSize:26, marginBottom:5, letterSpacing:"-0.02em" }}>Dashboard</h2>
      <p style={{ color:"var(--muted)", marginBottom:24 }}>Your startup strategy command center.</p>
      {idea ? (
        <Card style={{ marginBottom:20, background:"rgba(0,255,178,0.05)", border:"1px solid rgba(0,255,178,0.2)" }}>
          <div style={{ fontSize:10, color:"var(--accent)", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Active Pipeline Idea</div>
          <h3 style={{ fontWeight:800, fontSize:18, marginBottom:3 }}>{idea.ideaTitle}</h3>
          <p style={{ fontSize:13, color:"var(--muted)", marginBottom:14 }}>{idea.tagline}</p>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
            {STEPS.map(s=>(
              <span key={s.id} style={{ padding:"3px 10px", borderRadius:6, fontSize:11, fontFamily:"var(--font-mono)", background: done.includes(s.id)?"rgba(0,255,178,0.1)":"var(--surface2)", color: done.includes(s.id)?"var(--accent)":"var(--muted)", border: done.includes(s.id)?"1px solid rgba(0,255,178,0.2)":"1px solid var(--border)" }}>
                {done.includes(s.id)?"✓ ":""}{s.label}
              </span>
            ))}
          </div>
          <Btn onClick={()=>setTab("generator")} style={{ fontSize:13, padding:"8px 16px" }}>Continue Pipeline →</Btn>
        </Card>
      ) : (
        <Card style={{ marginBottom:20, border:"2px dashed var(--border)", textAlign:"center", padding:40 }}>
          <div style={{ fontSize:32, marginBottom:10 }}>⚡</div>
          <p style={{ color:"var(--muted)", marginBottom:14 }}>No active idea. Start the pipeline to begin.</p>
          <Btn onClick={()=>setTab("generator")}>Start Pipeline →</Btn>
        </Card>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:20 }}>
        {[
          { label:"Ideas Saved",    val:saved.length,           color:"var(--accent)" },
          { label:"Steps Complete", val:`${done.length}/${STEPS.length}`, color:"var(--accent3)" },
          { label:"Roasts Survived",val:done.includes("roast")?1:0, color:"var(--accent2)" },
        ].map((s,i)=>(
          <Card key={i}>
            <div style={{ fontSize:26, fontWeight:800, color:s.color, fontFamily:"var(--font-mono)" }}>{s.val}</div>
            <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>{s.label}</div>
          </Card>
        ))}
      </div>
      {saved.length > 0 && (
        <Card>
          <h3 style={{ fontWeight:700, marginBottom:12, fontSize:15 }}>💾 Saved Ideas</h3>
          {saved.map((s,i)=>(
            <div key={i} style={{ padding:"9px 12px", background:"var(--surface2)", borderRadius:8, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{s.ideaTitle}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{s.industry}</div>
              </div>
              <Btn variant="ghost" onClick={()=>loadIdea(s)} style={{ padding:"4px 11px", fontSize:12 }}>Load →</Btn>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

// ─── IDEA GENERATOR ───────────────────────────────────────────────────────────
const IdeaGenerator = () => {
  const { idea, setIdea, markDone, setTab, saveIdea, saved, loadIdea } = useApp();
  const [form, setForm] = useState({ industry:"HealthTech", problem:"", audience:"", style:"B2B SaaS", region:"Global" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(idea || null);
  const [showPicker, setShowPicker] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult(null);
    const res = await ai(
      `Generate a startup idea. Industry:${form.industry} Problem:${form.problem||"market gap"} Audience:${form.audience||"SMBs"} Style:${form.style} Region:${form.region}. ` +
      `Return ONLY JSON with these exact keys: {"ideaTitle":"","tagline":"","problemStatement":"","solutionSummary":"","usp":"","potentialUsers":["","",""],"revenueHint":"","techStack":["","",""],"founderFit":""}`,
      1024
    );
    if (res._error) { setLoading(false); return; }
    const enriched = { ...res, industry:form.industry, audience:form.audience };
    setResult(enriched);
    setIdea(enriched);
    markDone("generator");
    track("Idea Generated", { industry:form.industry, style:form.style, region:form.region });
    setLoading(false);
  };

  const handleLoad = (savedIdea) => {
    setResult(savedIdea);
    setIdea(savedIdea);
    markDone("generator");
    setShowPicker(false);
  };

  return (
    <div style={{ padding:30 }}>
      {showPicker && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={()=>setShowPicker(false)}>
          <Card style={{ width:"100%", maxWidth:480, maxHeight:"80vh", overflowY:"auto" }} className="fade-up" onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h3 style={{ fontWeight:800, fontSize:17 }}>Load a Saved Idea</h3>
              <button onClick={()=>setShowPicker(false)} style={{ background:"none", border:"none", color:"var(--muted)", cursor:"pointer", fontSize:20 }}>×</button>
            </div>
            {saved.length === 0
              ? <p style={{ color:"var(--muted)", fontSize:13 }}>No saved ideas yet.</p>
              : saved.map((s,i)=>(
                <button key={i} onClick={()=>handleLoad(s)} style={{ display:"block", width:"100%", textAlign:"left", padding:"11px 14px", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:9, cursor:"pointer", color:"var(--text)", fontFamily:"var(--font-head)", marginBottom:7, transition:"border-color 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                  <div style={{ fontWeight:700, marginBottom:2 }}>{s.ideaTitle}</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>{s.industry} · {s.tagline}</div>
                </button>
              ))
            }
          </Card>
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontWeight:800, fontSize:26, letterSpacing:"-0.02em" }}>⚡ Idea Generator</h2>
          <p style={{ color:"var(--muted)", marginTop:3 }}>Generate a concept or load a saved idea to begin.</p>
        </div>
        {saved.length > 0 && <Btn variant="muted" onClick={()=>setShowPicker(true)} style={{ fontSize:13 }}>💾 Load Saved Idea</Btn>}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, maxWidth:880, marginTop:20 }}>
        <Card>
          <h3 style={{ fontWeight:700, marginBottom:14 }}>Configure</h3>
          <Dropdown label="Industry" value={form.industry} onChange={v=>setForm({...form,industry:v})} options={["HealthTech","FinTech","EdTech","ClimaTech","PropTech","LegalTech","AgriTech","RetailTech","HRTech","Cybersecurity","Web3","Consumer App","B2B SaaS"]} />
          <Field label="Problem Area (optional)" value={form.problem} onChange={v=>setForm({...form,problem:v})} placeholder="e.g. Employee burnout" />
          <Field label="Target Audience" value={form.audience} onChange={v=>setForm({...form,audience:v})} placeholder="e.g. Remote-first startups" />
          <Dropdown label="Startup Style" value={form.style} onChange={v=>setForm({...form,style:v})} options={["B2B SaaS","Consumer App","Marketplace","API Platform","Hardware+Software","Community-led"]} />
          <Dropdown label="Market Region" value={form.region} onChange={v=>setForm({...form,region:v})} options={["Global","North America","Europe","Southeast Asia","India","Africa","Latin America"]} />
          <Btn onClick={generate} disabled={loading} style={{ width:"100%", justifyContent:"center", marginTop:6 }}>
            {loading ? <><Spinner /> Generating...</> : "⚡ Generate Idea"}
          </Btn>
        </Card>

        {loading
          ? <LoadingSteps steps={["Parsing inputs","Scanning market","Generating concept","Crafting USP","Finalising..."]} />
          : result && !result._error
            ? (
              <div className="fade-up">
                <Card>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <Badge color="accent">ACTIVE IDEA</Badge>
                    <Btn variant="ghost" onClick={()=>saveIdea(result)} style={{ padding:"4px 11px", fontSize:12 }}>Save 💾</Btn>
                  </div>
                  <h3 style={{ fontWeight:800, fontSize:18, marginBottom:3 }}>{result.ideaTitle}</h3>
                  <p style={{ color:"var(--accent)", fontSize:13, marginBottom:12, fontStyle:"italic" }}>{result.tagline}</p>
                  {[["Problem",result.problemStatement,"var(--text)"],["Solution",result.solutionSummary,"var(--text)"],["USP",result.usp,"var(--accent3)"]].map(([l,v,c])=>(
                    <div key={l} style={{ marginBottom:8 }}>
                      <div style={{ fontSize:9, color:"var(--muted)", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:3 }}>{l}</div>
                      <p style={{ fontSize:13, lineHeight:1.65, color:c }}>{v}</p>
                    </div>
                  ))}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:10, paddingTop:10, borderTop:"1px solid var(--border)" }}>
                    {result.potentialUsers?.map(u=><Badge key={u} color="purple">{u}</Badge>)}
                    {result.techStack?.map(t=><Badge key={t} color="accent">{t}</Badge>)}
                  </div>
                </Card>
              </div>
            )
            : (
              <Card style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:240, border:"2px dashed var(--border)" }}>
                <div style={{ textAlign:"center", color:"var(--muted)" }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>⚡</div>
                  <p style={{ fontSize:13 }}>Your idea will appear here</p>
                </div>
              </Card>
            )
        }
      </div>
      {result && !result._error && <Nudge current="generator" />}
    </div>
  );
};

// ─── GENERIC PIPELINE TAB ─────────────────────────────────────────────────────
// All pipeline tabs (Validation, Competitors, MVP, BizModel, Roast) follow the same pattern:
// 1. Read idea from context
// 2. Build prompt using idea
// 3. Show result
// This eliminates all prop-drilling bugs entirely.

const PipelineTab = ({ stepId, title, btnLabel, loadingSteps, prompt, renderResult, maxTokens=1024 }) => {
  const { idea, markDone } = useApp();
  const [manual, setManual]   = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  const getText = () => {
    if (idea) return `${idea.ideaTitle}: ${(idea.solutionSummary||"").slice(0,120)}`;
    return manual;
  };

  const canRun = () => {
    if (loading) return false;
    if (idea) return true;
    return manual.trim().length > 0;
  };

  const run = async () => {
    if (!canRun()) return;
    const t = getText();
    setLoading(true);
    setResult(null);
    track("Pipeline Step Started", { step: stepId, ideaTitle: idea?.ideaTitle || "manual" });
    const res = await ai(prompt(t), maxTokens);
    setResult(res);
    if (!res._error) {
      markDone(stepId);
      track("Pipeline Step Completed", { step: stepId, ideaTitle: idea?.ideaTitle || "manual" });
    } else {
      track("Pipeline Step Failed", { step: stepId, error: res._error });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding:30 }}>
      <h2 style={{ fontWeight:800, fontSize:26, marginBottom:5, letterSpacing:"-0.02em" }}>{title}</h2>
      <IdeaBanner />
      {!idea && (
        <Card style={{ marginBottom:16 }}>
          <Field label="Describe your startup idea" value={manual} onChange={setManual} placeholder="Paste or type your concept here..." rows={3} />
        </Card>
      )}
      <Btn onClick={run} disabled={!canRun()} style={{ marginBottom:20 }}>
        {loading ? <><Spinner /> Working...</> : btnLabel}
      </Btn>
      {loading && <LoadingSteps steps={loadingSteps} />}
      {result && result._error && (
        <Card style={{ border:"1px solid var(--accent2)", background:"rgba(255,77,109,0.05)" }}>
          <p style={{ color:"var(--accent2)", fontSize:13 }}>⚠ Error: {result._error}. Please try again.</p>
        </Card>
      )}
      {result && !result._error && (
        <div className="fade-up">
          {renderResult(result)}
          <Nudge current={stepId} />
        </div>
      )}
    </div>
  );
};

// ─── VALIDATION TAB ───────────────────────────────────────────────────────────
const Validation = () => {
  const vc = { STRONG:"var(--accent)", MODERATE:"#FFBD2E", WEAK:"var(--accent2)" };
  return (
    <PipelineTab
      stepId="validation"
      maxTokens={1024}
      title="📊 Market Validation"
      btnLabel="📊 Run Validation"
      loadingSteps={["Analysing market demand","Scoring competition","Checking scalability","Evaluating monetization","Writing verdict..."]}
      prompt={t=>`Validate this startup: "${t}". Return ONLY JSON: {"overallScore":7,"marketDemand":7,"competitionIntensity":6,"scalability":8,"monetizationPotential":7,"innovationScore":7,"verdict":"STRONG","summary":"2 sentence summary","topStrengths":["strength1","strength2"],"topRisks":["risk1","risk2"],"recommendation":"one sentence"}`}
      renderResult={r=>(
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div style={{ fontFamily:"var(--font-mono)", fontSize:32, fontWeight:700, color:"var(--accent)" }}>{r.overallScore}<span style={{ fontSize:12, color:"var(--muted)" }}>/10</span></div>
            <span style={{ background:(vc[r.verdict]||"var(--accent)")+"20", color:vc[r.verdict]||"var(--accent)", border:`1px solid ${vc[r.verdict]||"var(--accent)"}40`, padding:"5px 14px", borderRadius:8, fontSize:14, fontWeight:700 }}>{r.verdict}</span>
          </div>
          <Bar label="Market Demand"          score={r.marketDemand} />
          <Bar label="Competition Intensity"  score={r.competitionIntensity} />
          <Bar label="Scalability"            score={r.scalability} />
          <Bar label="Monetization Potential" score={r.monetizationPotential} />
          <Bar label="Innovation Score"       score={r.innovationScore} />
          <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.7, marginTop:13, paddingTop:13, borderTop:"1px solid var(--border)" }}>{r.summary}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:12 }}>
            <div style={{ background:"rgba(0,255,178,0.05)", borderRadius:8, padding:11 }}>
              <div style={{ fontSize:9, color:"var(--accent)", fontFamily:"var(--font-mono)", marginBottom:6 }}>STRENGTHS</div>
              {r.topStrengths?.map(s=><div key={s} style={{ fontSize:12, marginBottom:4 }}>✓ {s}</div>)}
            </div>
            <div style={{ background:"rgba(255,77,109,0.05)", borderRadius:8, padding:11 }}>
              <div style={{ fontSize:9, color:"var(--accent2)", fontFamily:"var(--font-mono)", marginBottom:6 }}>RISKS</div>
              {r.topRisks?.map(s=><div key={s} style={{ fontSize:12, marginBottom:4 }}>⚠ {s}</div>)}
            </div>
          </div>
          <div style={{ marginTop:11, padding:11, background:"rgba(108,99,255,0.08)", borderRadius:8, fontSize:13, color:"var(--accent3)", fontStyle:"italic" }}>💡 {r.recommendation}</div>
        </Card>
      )}
    />
  );
};

// ─── COMPETITORS TAB ──────────────────────────────────────────────────────────
const Competitors = () => (
  <PipelineTab
    stepId="competitors"
    maxTokens={1024}
    title="🔬 Competitor Analysis"
    btnLabel="🔬 Analyze Landscape"
    loadingSteps={["Identifying direct competitors","Mapping indirect players","Finding market gaps","Building moat analysis..."]}
    prompt={t=>`For startup: "${t}" return ONLY this JSON filled in: {"directCompetitors":[{"name":"","description":"","strengths":"","weakness":""},{"name":"","description":"","strengths":"","weakness":""},{"name":"","description":"","strengths":"","weakness":""}],"indirectCompetitors":[{"name":"","description":""},{"name":"","description":""}],"marketGaps":["","",""],"differentiationAngles":["","",""],"competitiveMoat":""}`}
    renderResult={r=>(
      <>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
          <Card>
            <h3 style={{ fontWeight:700, marginBottom:12, color:"var(--accent2)" }}>🎯 Direct Competitors</h3>
            {r.directCompetitors?.map((c,i)=>(
              <div key={i} style={{ padding:11, background:"var(--surface2)", borderRadius:8, marginBottom:8 }}>
                <div style={{ fontWeight:700, marginBottom:3 }}>{c.name}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:6, lineHeight:1.5 }}>{c.description}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
                  <div style={{ fontSize:11, color:"var(--accent)" }}>✓ {c.strengths}</div>
                  <div style={{ fontSize:11, color:"var(--accent2)" }}>✗ {c.weakness}</div>
                </div>
              </div>
            ))}
          </Card>
          <div>
            <Card style={{ marginBottom:14 }}>
              <h3 style={{ fontWeight:700, marginBottom:11, color:"var(--muted)" }}>Indirect Competitors</h3>
              {r.indirectCompetitors?.map((c,i)=>(
                <div key={i} style={{ padding:9, background:"var(--surface2)", borderRadius:8, marginBottom:7 }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{c.name}</div>
                  <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{c.description}</div>
                </div>
              ))}
            </Card>
            <Card style={{ background:"rgba(0,255,178,0.04)", border:"1px solid rgba(0,255,178,0.15)" }}>
              <h3 style={{ fontWeight:700, marginBottom:8, color:"var(--accent)" }}>Your Moat</h3>
              <p style={{ fontSize:13, lineHeight:1.7 }}>{r.competitiveMoat}</p>
            </Card>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <Card>
            <h3 style={{ fontWeight:700, marginBottom:9 }}>🕳️ Market Gaps</h3>
            {r.marketGaps?.map((g,i)=>(
              <div key={i} style={{ display:"flex", gap:8, marginBottom:7, fontSize:13 }}>
                <span style={{ color:"var(--accent)", fontFamily:"var(--font-mono)", fontSize:11 }}>0{i+1}</span><span>{g}</span>
              </div>
            ))}
          </Card>
          <Card>
            <h3 style={{ fontWeight:700, marginBottom:9 }}>🎯 Differentiation Angles</h3>
            {r.differentiationAngles?.map((d,i)=>(
              <div key={i} style={{ display:"flex", gap:8, marginBottom:7, fontSize:13 }}>
                <span style={{ color:"var(--accent3)", fontFamily:"var(--font-mono)" }}>→</span><span>{d}</span>
              </div>
            ))}
          </Card>
        </div>
      </>
    )}
  />
);

// ─── MVP TAB ──────────────────────────────────────────────────────────────────
const MVPPlanner = () => {
  const ec = { Low:"var(--accent)", Medium:"#FFBD2E", High:"var(--accent2)" };
  return (
    <PipelineTab
      stepId="mvp"
      maxTokens={1024}
      title="🗺️ MVP Planner"
      btnLabel="🗺️ Generate MVP Plan"
      loadingSteps={["Defining MVP scope","Prioritising features","Planning sprint roadmap","Selecting tech stack..."]}
      prompt={t=>`MVP plan for: "${t}". Return ONLY this JSON filled in: {"mvpGoal":"","mustHaveFeatures":[{"feature":"","why":"","effort":"Low"},{"feature":"","why":"","effort":"Medium"},{"feature":"","why":"","effort":"High"},{"feature":"","why":"","effort":"Low"}],"niceToHaveFeatures":["","",""],"roadmap":[{"sprint":"Sprint 1 (Week 1-2)","focus":"","deliverables":["",""]},{"sprint":"Sprint 2 (Week 3-4)","focus":"","deliverables":["",""]},{"sprint":"Sprint 3 (Week 5-6)","focus":"","deliverables":["",""]}],"techRecommendations":["","",""],"successMetric":""}`}
      renderResult={r=>(
        <>
          <Card style={{ marginBottom:14, background:"rgba(0,255,178,0.04)", border:"1px solid rgba(0,255,178,0.15)" }}>
            <div style={{ fontSize:9, color:"var(--accent)", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:4 }}>MVP Goal</div>
            <p style={{ fontSize:14, fontWeight:600 }}>{r.mvpGoal}</p>
          </Card>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <Card>
              <h3 style={{ fontWeight:700, marginBottom:12 }}>✅ Must-Have Features</h3>
              {r.mustHaveFeatures?.map((f,i)=>(
                <div key={i} style={{ padding:9, background:"var(--surface2)", borderRadius:8, marginBottom:7 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                    <span style={{ fontWeight:600, fontSize:13 }}>{f.feature}</span>
                    <span style={{ fontSize:10, color:ec[f.effort], fontFamily:"var(--font-mono)" }}>{f.effort}</span>
                  </div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>{f.why}</div>
                </div>
              ))}
            </Card>
            <div>
              <Card style={{ marginBottom:12 }}>
                <h3 style={{ fontWeight:700, marginBottom:8 }}>⭐ Nice-to-Have</h3>
                {r.niceToHaveFeatures?.map((f,i)=><div key={i} style={{ fontSize:13, color:"var(--muted)", marginBottom:5, paddingLeft:8, borderLeft:"2px solid var(--border)" }}>{f}</div>)}
              </Card>
              <Card>
                <h3 style={{ fontWeight:700, marginBottom:8 }}>🛠️ Tech Stack</h3>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>{r.techRecommendations?.map(t=><Badge key={t} color="accent">{t}</Badge>)}</div>
                <div style={{ marginTop:9, fontSize:12, color:"var(--accent3)", fontStyle:"italic" }}>🎯 {r.successMetric}</div>
              </Card>
            </div>
          </div>
          <Card>
            <h3 style={{ fontWeight:700, marginBottom:13 }}>📅 Sprint Roadmap</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:11 }}>
              {r.roadmap?.map((s,i)=>(
                <div key={i} style={{ padding:12, background:"var(--surface2)", borderRadius:8, borderTop:`3px solid ${["var(--accent)","var(--accent3)","var(--accent2)"][i]}` }}>
                  <div style={{ fontSize:10, fontFamily:"var(--font-mono)", color:["var(--accent)","var(--accent3)","var(--accent2)"][i], marginBottom:4 }}>{s.sprint}</div>
                  <div style={{ fontWeight:600, fontSize:13, marginBottom:5 }}>{s.focus}</div>
                  {s.deliverables?.map(d=><div key={d} style={{ fontSize:11, color:"var(--muted)", marginBottom:2 }}>→ {d}</div>)}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    />
  );
};

// ─── BIZ MODEL TAB ────────────────────────────────────────────────────────────
const BizModel = () => (
  <PipelineTab
    stepId="bizmodel"
    maxTokens={1024}
    title="💰 Business Model"
    btnLabel="💰 Generate Business Models"
    loadingSteps={["Evaluating revenue models","Calculating unit economics","Mapping GTM strategy","Finalising..."]}
    prompt={t=>`Business model for: "${t}". Return ONLY this JSON filled in: {"recommended":{"model":"","why":"","pricing":"","arr_potential":""},"alternatives":[{"model":"","description":"","bestFor":""},{"model":"","description":"","bestFor":""}],"unitEconomics":{"cac":"","ltv":"","paybackPeriod":"","grossMargin":""},"gtmStrategy":"","keyMetrics":["","",""]}`}
    renderResult={r=>(
      <>
        <Card style={{ marginBottom:14, border:"1px solid rgba(0,255,178,0.3)", background:"rgba(0,255,178,0.04)" }}>
          <Badge color="accent">RECOMMENDED MODEL</Badge>
          <h3 style={{ fontWeight:800, fontSize:18, marginTop:8, marginBottom:4 }}>{r.recommended?.model}</h3>
          <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.7, marginBottom:10 }}>{r.recommended?.why}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
            <div style={{ padding:9, background:"var(--surface2)", borderRadius:8 }}>
              <div style={{ fontSize:9, color:"var(--muted)", fontFamily:"var(--font-mono)", marginBottom:3 }}>PRICING</div>
              <div style={{ fontWeight:600, fontSize:13 }}>{r.recommended?.pricing}</div>
            </div>
            <div style={{ padding:9, background:"var(--surface2)", borderRadius:8 }}>
              <div style={{ fontSize:9, color:"var(--muted)", fontFamily:"var(--font-mono)", marginBottom:3 }}>ARR POTENTIAL</div>
              <div style={{ fontWeight:600, fontSize:13, color:"var(--accent)" }}>{r.recommended?.arr_potential}</div>
            </div>
          </div>
        </Card>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          <Card>
            <h3 style={{ fontWeight:700, marginBottom:12 }}>Alternative Models</h3>
            {r.alternatives?.map((a,i)=>(
              <div key={i} style={{ padding:10, background:"var(--surface2)", borderRadius:8, marginBottom:7 }}>
                <div style={{ fontWeight:700, marginBottom:3, color:"var(--accent3)" }}>{a.model}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:4 }}>{a.description}</div>
                <div style={{ fontSize:11 }}>Best for: <span style={{ color:"var(--text)" }}>{a.bestFor}</span></div>
              </div>
            ))}
          </Card>
          <div>
            <Card style={{ marginBottom:12 }}>
              <h3 style={{ fontWeight:700, marginBottom:12 }}>Unit Economics</h3>
              {Object.entries(r.unitEconomics||{}).map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid var(--border)", fontSize:13 }}>
                  <span style={{ color:"var(--muted)", textTransform:"uppercase", fontSize:10, fontFamily:"var(--font-mono)" }}>{k}</span>
                  <span style={{ fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <h3 style={{ fontWeight:700, marginBottom:8 }}>Key Metrics</h3>
              {r.keyMetrics?.map((m,i)=><div key={i} style={{ fontSize:13, marginBottom:5 }}>📈 {m}</div>)}
            </Card>
          </div>
        </div>
        <Card style={{ background:"rgba(108,99,255,0.06)", border:"1px solid rgba(108,99,255,0.2)" }}>
          <h3 style={{ fontWeight:700, marginBottom:6, color:"var(--accent3)" }}>🚀 GTM Strategy</h3>
          <p style={{ fontSize:13, lineHeight:1.7 }}>{r.gtmStrategy}</p>
        </Card>
      </>
    )}
  />
);

// ─── ROAST TAB ────────────────────────────────────────────────────────────────
const RoastMode = () => {
  const { setTab } = useApp();
  return (
    <PipelineTab
      stepId="roast"
      maxTokens={1024}
      title="🔥 Roast Mode"
      btnLabel="🔥 Roast My Idea"
      loadingSteps={["Loading truth cannon 🔥","Finding fatal weaknesses","Checking market reality","Calculating survival odds..."]}
      prompt={t=>`Roast this startup brutally but constructively: "${t}". Return ONLY this JSON filled in: {"roastSummary":"","deathBlows":[{"issue":"","why_fatal":""},{"issue":"","why_fatal":""},{"issue":"","why_fatal":""}],"marketReality":"","competitionCheck":"","survivalOdds":50,"pivotSuggestions":["",""],"oneRedeeming":""}`}
      renderResult={r=>(
        <>
          <Card style={{ marginBottom:14, border:"1px solid rgba(255,77,109,0.3)", background:"rgba(255,77,109,0.04)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <Badge color="danger">SURVIVAL ODDS</Badge>
              <div style={{ fontFamily:"var(--font-mono)", fontSize:30, fontWeight:700, color: r.survivalOdds>50?"var(--accent)":"var(--accent2)" }}>
                {r.survivalOdds}<span style={{ fontSize:12 }}>%</span>
              </div>
            </div>
            <p style={{ fontSize:14, lineHeight:1.7 }}>{r.roastSummary}</p>
          </Card>
          <Card style={{ marginBottom:14 }}>
            <h3 style={{ fontWeight:700, marginBottom:12, color:"var(--accent2)" }}>💀 Fatal Weaknesses</h3>
            {r.deathBlows?.map((d,i)=>(
              <div key={i} style={{ padding:11, background:"rgba(255,77,109,0.06)", border:"1px solid rgba(255,77,109,0.15)", borderRadius:8, marginBottom:8 }}>
                <div style={{ fontWeight:700, marginBottom:4, color:"var(--accent2)" }}>#{i+1} {d.issue}</div>
                <div style={{ fontSize:12, color:"var(--muted)", lineHeight:1.5 }}>{d.why_fatal}</div>
              </div>
            ))}
          </Card>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <Card><h3 style={{ fontWeight:700, marginBottom:8 }}>📉 Market Reality</h3><p style={{ fontSize:13, lineHeight:1.7, color:"var(--muted)" }}>{r.marketReality}</p></Card>
            <Card><h3 style={{ fontWeight:700, marginBottom:8 }}>⚔️ Competition</h3><p style={{ fontSize:13, lineHeight:1.7, color:"var(--muted)" }}>{r.competitionCheck}</p></Card>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:24 }}>
            <Card>
              <h3 style={{ fontWeight:700, marginBottom:9, color:"var(--accent3)" }}>🔄 Pivot Suggestions</h3>
              {r.pivotSuggestions?.map((p,i)=><div key={i} style={{ fontSize:13, marginBottom:6, padding:"7px 10px", background:"var(--surface2)", borderRadius:6 }}>→ {p}</div>)}
            </Card>
            <Card style={{ background:"rgba(0,255,178,0.04)", border:"1px solid rgba(0,255,178,0.15)" }}>
              <h3 style={{ fontWeight:700, marginBottom:9, color:"var(--accent)" }}>☀️ One Redeeming Quality</h3>
              <p style={{ fontSize:13, lineHeight:1.7 }}>{r.oneRedeeming}</p>
            </Card>
          </div>
          <div style={{ padding:"20px 24px", background:"linear-gradient(135deg,rgba(0,255,178,0.07),rgba(108,99,255,0.07))", border:"1px solid rgba(0,255,178,0.2)", borderRadius:12, textAlign:"center" }}>
            <div style={{ fontSize:26, marginBottom:7 }}>🎉</div>
            <div style={{ fontWeight:800, fontSize:17, marginBottom:5 }}>Pipeline Complete!</div>
            <p style={{ fontSize:13, color:"var(--muted)", marginBottom:14 }}>You've run the full VentureForge pipeline.</p>
            <div style={{ display:"flex", gap:9, justifyContent:"center", flexWrap:"wrap" }}>
              <Btn onClick={()=>setTab("generator")} style={{ fontSize:13, padding:"8px 16px" }}>⚡ Try Another Idea</Btn>
              <Btn variant="ghost" onClick={()=>setTab("workspace")} style={{ fontSize:13, padding:"8px 16px" }}>💾 View Workspace</Btn>
            </div>
          </div>
        </>
      )}
    />
  );
};

// ─── WORKSPACE ────────────────────────────────────────────────────────────────
const Workspace = () => {
  const { saved, deleteSaved, loadIdea } = useApp();
  return (
    <div style={{ padding:30 }}>
      <h2 style={{ fontWeight:800, fontSize:26, marginBottom:5, letterSpacing:"-0.02em" }}>💾 Workspace</h2>
      <p style={{ color:"var(--muted)", marginBottom:24 }}>Load any saved idea into the pipeline.</p>
      {saved.length === 0
        ? <Card style={{ textAlign:"center", padding:52, border:"2px dashed var(--border)" }}>
            <div style={{ fontSize:36, marginBottom:10 }}>💾</div>
            <p style={{ color:"var(--muted)" }}>No saved ideas yet. Generate an idea and click Save.</p>
          </Card>
        : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:14 }}>
            {saved.map((s,i)=>(
              <Card key={i} className="fade-up">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <Badge color={["accent","purple","danger"][i%3]}>{s.industry||"Startup"}</Badge>
                  <button onClick={()=>deleteSaved(i)} style={{ background:"none", border:"none", color:"var(--muted)", cursor:"pointer", fontSize:16 }}>×</button>
                </div>
                <h3 style={{ fontWeight:800, fontSize:15, marginBottom:3 }}>{s.ideaTitle||"Untitled"}</h3>
                <p style={{ fontSize:12, color:"var(--muted)", lineHeight:1.6, marginBottom:12 }}>{s.tagline}</p>
                <Btn onClick={()=>loadIdea(s)} style={{ width:"100%", justifyContent:"center", fontSize:13, padding:"8px" }}>Load into Pipeline →</Btn>
              </Card>
            ))}
          </div>
      }
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function VentureForgeAI() {
  const [page, setPage] = useState("landing");
  const [tab,  setTab]  = useState("generator");
  const setTabTracked = (newTab) => {
    track("Tab Switched", { from: tab, to: newTab });
    setTab(newTab);
  };

  // ── Global state — single source of truth ──
  const [idea, setIdeaState] = useState(null);
  const [done, setDone]      = useState([]);
  const [saved, setSaved]    = useState([]);

  const setIdea = (i) => setIdeaState(i);
  const markDone = (step) => setDone(prev => prev.includes(step) ? prev : [...prev, step]);
  const saveIdea = (i) => { setSaved(prev => [...prev, i]); track("Idea Saved", { ideaTitle: i.ideaTitle, industry: i.industry }); };
  const deleteSaved = (idx) => setSaved(prev => prev.filter((_,j)=>j!==idx));
  const clearIdea = () => { setIdeaState(null); setDone([]); setTab("generator"); track("Pipeline Cleared"); };
  const loadIdea  = (i) => { setIdeaState(i); setDone(["generator"]); setTab("validation"); track("Idea Loaded From Workspace", { ideaTitle: i.ideaTitle }); };

  const ctx = { tab, setTab: setTabTracked, idea, setIdea, done, markDone, saved, saveIdea, deleteSaved, clearIdea, loadIdea };

  if (page === "landing") return <><FontLoader /><Landing onEnter={()=>{ track("App Entered"); setPage("app"); }} /></>;

  const isPipeline = STEPS.some(s=>s.id===tab);

  const renderTab = () => {
    switch(tab) {
      case "dashboard":   return <Dashboard />;
      case "generator":   return <IdeaGenerator />;
      case "validation":  return <Validation />;
      case "competitors": return <Competitors />;
      case "mvp":         return <MVPPlanner />;
      case "bizmodel":    return <BizModel />;
      case "roast":       return <RoastMode />;
      case "workspace":   return <Workspace />;
      default:            return <Dashboard />;
    }
  };

  return (
    <AppCtx.Provider value={ctx}>
      <FontLoader />
      <div style={{ display:"flex", minHeight:"100vh" }}>
        <Sidebar />
        <main style={{ flex:1, overflowY:"auto", background:"var(--bg)", display:"flex", flexDirection:"column" }} className="grid-bg">
          {isPipeline && <PipelineBar />}
          {renderTab()}
        </main>
      </div>
    </AppCtx.Provider>
  );
}
