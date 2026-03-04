import { useState, useCallback } from "react";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

const callClaude = async (systemPrompt, userPrompt) => {
  const response = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "";
};

const parseJSON = (text) => {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch { return null; }
};

const Icon = ({ path, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const icons = {
  rocket:    "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
  zap:       "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  alert:     "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  trending:  "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  users:     "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  plus:      "M12 5v14 M5 12h14",
  trash:     "M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  loader:    "M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83",
  chart:     "M18 20V10 M12 20V4 M6 20v-6",
  message:   "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  clipboard: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z",
  star:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  download:  "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0c10; }
  .retro-app { min-height:100vh; background:#0a0c10; color:#e2e8f0; font-family:'Syne',sans-serif; position:relative; overflow-x:hidden; }
  .retro-app::before { content:''; position:fixed; inset:0; background:radial-gradient(ellipse 60% 40% at 20% 10%,rgba(245,158,11,0.06) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 80% 80%,rgba(20,184,166,0.06) 0%,transparent 60%); pointer-events:none; z-index:0; }
  .grid-bg { position:fixed; inset:0; background-image:linear-gradient(rgba(245,158,11,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.04) 1px,transparent 1px); background-size:40px 40px; z-index:0; pointer-events:none; }
  .content { position:relative; z-index:1; }
  .header { border-bottom:1px solid rgba(245,158,11,0.2); padding:20px 32px; display:flex; align-items:center; justify-content:space-between; background:rgba(10,12,16,0.8); backdrop-filter:blur(12px); position:sticky; top:0; z-index:100; }
  .header-left { display:flex; align-items:center; gap:16px; }
  .logo-badge { background:linear-gradient(135deg,#f59e0b,#d97706); border-radius:8px; padding:8px 12px; font-family:'Space Mono',monospace; font-size:11px; font-weight:700; color:#0a0c10; letter-spacing:0.1em; }
  .header-title { font-size:20px; font-weight:800; color:#fff; }
  .header-title span { color:#f59e0b; }
  .header-sub { font-family:'Space Mono',monospace; font-size:11px; color:#64748b; margin-top:2px; }
  .sprint-badge { background:rgba(20,184,166,0.1); border:1px solid rgba(20,184,166,0.3); border-radius:6px; padding:6px 14px; font-family:'Space Mono',monospace; font-size:12px; color:#14b8a6; display:flex; align-items:center; gap:8px; }
  .dot { width:6px; height:6px; border-radius:50%; background:#14b8a6; animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .nav { display:flex; gap:4px; padding:20px 32px 0; border-bottom:1px solid rgba(255,255,255,0.06); overflow-x:auto; }
  .nav-tab { padding:10px 20px; border:none; background:transparent; color:#64748b; font-family:'Syne',sans-serif; font-size:13px; font-weight:600; cursor:pointer; border-bottom:2px solid transparent; transition:all 0.2s; display:flex; align-items:center; gap:8px; white-space:nowrap; }
  .nav-tab:hover { color:#94a3b8; }
  .nav-tab.active { color:#f59e0b; border-bottom-color:#f59e0b; }
  .main { padding:32px; max-width:1200px; margin:0 auto; }
  .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:24px; margin-bottom:20px; transition:border-color 0.2s; }
  .card:hover { border-color:rgba(245,158,11,0.2); }
  .card-title { font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#94a3b8; display:flex; align-items:center; gap:8px; }
  .lbl { font-family:'Space Mono',monospace; font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:8px; display:block; }
  textarea,input { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:12px 16px; color:#e2e8f0; font-family:'Space Mono',monospace; font-size:12px; line-height:1.7; resize:vertical; transition:border-color 0.2s; outline:none; }
  textarea:focus,input:focus { border-color:rgba(245,158,11,0.4); background:rgba(245,158,11,0.03); }
  textarea::placeholder,input::placeholder { color:#334155; }
  .btn { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; border-radius:8px; border:none; cursor:pointer; font-family:'Syne',sans-serif; font-size:13px; font-weight:700; transition:all 0.2s; white-space:nowrap; }
  .btn-primary { background:linear-gradient(135deg,#f59e0b,#d97706); color:#0a0c10; }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 4px 20px rgba(245,158,11,0.3); }
  .btn-primary:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
  .btn-ghost { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#94a3b8; }
  .btn-ghost:hover { background:rgba(255,255,255,0.08); color:#e2e8f0; }
  .btn-danger { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2); color:#f87171; }
  .btn-teal { background:rgba(20,184,166,0.1); border:1px solid rgba(20,184,166,0.3); color:#14b8a6; }
  .btn-teal:hover { background:rgba(20,184,166,0.2); }
  .tag { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:4px; font-family:'Space Mono',monospace; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; }
  .tag-win     { background:rgba(20,184,166,0.15); color:#14b8a6; border:1px solid rgba(20,184,166,0.2); }
  .tag-blocker { background:rgba(239,68,68,0.15);  color:#f87171; border:1px solid rgba(239,68,68,0.2); }
  .tag-improve { background:rgba(168,85,247,0.15); color:#c084fc; border:1px solid rgba(168,85,247,0.2); }
  .tag-story   { background:rgba(59,130,246,0.15);  color:#60a5fa; border:1px solid rgba(59,130,246,0.2); }
  .tp-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-left:3px solid #f59e0b; border-radius:8px; padding:16px 20px; margin-bottom:12px; transition:all 0.2s; }
  .tp-card.blocker { border-left-color:#f87171; }
  .tp-card.improve { border-left-color:#c084fc; }
  .tp-card.win     { border-left-color:#14b8a6; }
  .tp-text { font-size:14px; color:#cbd5e1; line-height:1.6; margin-bottom:10px; }
  .ctx-section { margin-top:12px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.06); }
  .ctx-item { background:rgba(245,158,11,0.05); border:1px solid rgba(245,158,11,0.1); border-radius:6px; padding:8px 12px; margin-bottom:8px; font-size:13px; color:#94a3b8; display:flex; justify-content:space-between; align-items:flex-start; gap:12px; }
  .ctx-author { font-family:'Space Mono',monospace; font-size:10px; color:#f59e0b; margin-bottom:4px; }
  .metrics-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px; }
  .metric-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:20px; text-align:center; transition:all 0.2s; }
  .metric-card:hover { border-color:rgba(245,158,11,0.3); transform:translateY(-2px); }
  .metric-value { font-size:36px; font-weight:800; color:#f59e0b; line-height:1; margin-bottom:4px; }
  .metric-label { font-family:'Space Mono',monospace; font-size:10px; color:#64748b; text-transform:uppercase; letter-spacing:0.1em; }
  .metric-sub   { font-size:12px; color:#475569; margin-top:6px; }
  .metric-card.teal   .metric-value { color:#14b8a6; }
  .metric-card.purple .metric-value { color:#c084fc; }
  .metric-card.red    .metric-value { color:#f87171; }
  .prog-bar  { height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden; margin-top:8px; }
  .prog-fill { height:100%; border-radius:3px; transition:width 0.8s ease; }
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  @media(max-width:768px){.two-col{grid-template-columns:1fr}.main{padding:20px 16px}.header{padding:16px}}
  .ai-item { padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:14px; color:#cbd5e1; line-height:1.6; display:flex; gap:12px; align-items:flex-start; }
  .ai-item:last-child { border-bottom:none; }
  .ai-bullet       { color:#f59e0b; font-size:18px; line-height:1.4; flex-shrink:0; }
  .ai-bullet.teal  { color:#14b8a6; }
  .ai-bullet.red   { color:#f87171; }
  .ai-bullet.purple{ color:#c084fc; }
  .loading-icon { animation:spin 1s linear infinite; }
  .empty { text-align:center; padding:48px 24px; color:#334155; font-family:'Space Mono',monospace; font-size:13px; }
  .divider { display:flex; align-items:center; gap:12px; margin:24px 0 16px; color:#475569; font-family:'Space Mono',monospace; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; }
  .divider::before,.divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.06); }
  .status-bar { background:rgba(20,184,166,0.05); border:1px solid rgba(20,184,166,0.15); border-radius:8px; padding:10px 16px; font-family:'Space Mono',monospace; font-size:11px; color:#14b8a6; margin-bottom:20px; display:flex; align-items:center; gap:8px; line-height:1.6; }
`;

export default function SprintRetroAssistant() {
  const [activeTab,    setActiveTab]    = useState("data");
  const [sprintName,   setSprintName]   = useState("Sprint 42");
  const [channelNotes, setChannelNotes] = useState("");
  const [ticketData,   setTicketData]   = useState("");
  const [loading,      setLoading]      = useState({});
  const [analysis,     setAnalysis]     = useState(null);
  const [talkingPoints,setTalkingPoints]= useState([]);
  const [metrics,      setMetrics]      = useState(null);
  const [ctxInputs,    setCtxInputs]    = useState({});
  const [authorName,   setAuthorName]   = useState("");
  const [summary,      setSummary]      = useState("");

  const setLoad = (k, v) => setLoading(l => ({ ...l, [k]: v }));

  const analyzeData = useCallback(async () => {
    if (!channelNotes && !ticketData) return;
    setLoad("analyze", true);
    setAnalysis(null); setTalkingPoints([]); setMetrics(null); setSummary("");
    const system = `You are an expert Agile coach specializing in Azure DevOps. Understand PBIs, Bugs, Tasks and ADO states (New/Active/Resolved/Closed). Return ONLY valid JSON, no markdown.`;
    const prompt = `Analyze Azure DevOps sprint data for ${sprintName}. Return JSON:
{"wins":["..."],"blockers":["..."],"improvements":["..."],
 "talkingPoints":[{"id":1,"category":"win|blocker|improvement","point":"...","priority":"high|medium|low"}],
 "metrics":{"velocity":0,"storiesCompleted":0,"bugsCompleted":0,"storiesInProgress":0,"bugsInProgress":0,"plannedPoints":0,"completedPoints":0},
 "summary":"2-3 sentences"}
Use ADO terms: PBIs not stories, work items not tickets, Closed/Active/New states. 3-5 per category, 6-8 talking points.
TEAMS NOTES:\n${channelNotes||"None"}\nADO WORK ITEMS:\n${ticketData||"None"}`;
    try {
      const raw = await callClaude(system, prompt);
      const p = parseJSON(raw);
      if (p) {
        setAnalysis({ wins: p.wins, blockers: p.blockers, improvements: p.improvements });
        setTalkingPoints(p.talkingPoints.map(tp => ({ ...tp, contexts: [] })));
        setMetrics(p.metrics); setSummary(p.summary); setActiveTab("analysis");
      }
    } catch(e) { console.error(e); }
    setLoad("analyze", false);
  }, [channelNotes, ticketData, sprintName]);

  const addCtx = (id) => {
    const text = ctxInputs[id];
    if (!text?.trim()) return;
    setTalkingPoints(prev => prev.map(tp =>
      tp.id === id ? { ...tp, contexts:[...tp.contexts,{text,author:authorName||"Team Member",ts:new Date().toLocaleTimeString()}] } : tp
    ));
    setCtxInputs(prev => ({ ...prev, [id]: "" }));
  };
  const removeCtx = (id, idx) =>
    setTalkingPoints(prev => prev.map(tp =>
      tp.id === id ? { ...tp, contexts: tp.contexts.filter((_,i)=>i!==idx) } : tp
    ));

  const exportRetro = () => {
    const md = [
      `# Sprint Retrospective — ${sprintName}`,
      `Source: Azure DevOps | ${new Date().toLocaleDateString()}`,
      `\n## Summary\n${summary}`,
      `\n## Metrics`,
      metrics?`- Velocity: ${metrics.velocity}pts | PBIs Closed: ${metrics.storiesCompleted} | Bugs Closed: ${metrics.bugsCompleted}`:"",
      `\n## Talking Points`,
      ...talkingPoints.map(tp=>[`### [${tp.category.toUpperCase()}] ${tp.point}`,...tp.contexts.map(c=>`> ${c.author}: ${c.text}`),""].join("\n")),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([md],{type:"text/markdown"}));
    a.download = `retro-${sprintName.replace(/\s+/g,"-")}.md`; a.click();
  };

  const DonutChart = ({ stories, bugs }) => {
    const tot=stories+bugs||1, r=44, cx=60, cy=60, c=2*Math.PI*r;
    const sd=c*(stories/tot), bd=c*(bugs/tot);
    return (
      <svg width="120" height="120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3b82f6" strokeWidth="12"
          strokeDasharray={`${sd} ${c-sd}`} strokeDashoffset={c/4}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f87171" strokeWidth="12"
          strokeDasharray={`${bd} ${c-bd}`} strokeDashoffset={c/4-sd}/>
        <text x={cx} y={cy-4}  textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="800" fontFamily="Space Mono">
          {Math.round((stories/tot)*100)}%
        </text>
        <text x={cx} y={cy+14} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="Space Mono">PBIs</text>
      </svg>
    );
  };

  const tabs=[
    {id:"data",    label:"Sprint Data",    icon:icons.clipboard},
    {id:"analysis",label:"AI Analysis",    icon:icons.zap},
    {id:"talking", label:"Talking Points", icon:icons.message},
    {id:"summary", label:"Sprint Summary", icon:icons.chart},
  ];
  const catCls=(cat)=>({win:"win",blocker:"blocker",improvement:"improve"}[cat]||"win");
  const priCls=(p)=>p==="high"?"blocker":p==="medium"?"story":"improve";

  return (
    <>
      <style>{css}</style>
      <div className="retro-app">
        <div className="grid-bg"/>
        <div className="content">

          {/* ── Header ── */}
          <header className="header">
            <div className="header-left">
              <div className="logo-badge">RETRO</div>
              <div>
                <div className="header-title">Sprint <span>Retrospective</span> Assistant</div>
                <div className="header-sub">Powered by Claude AI · Azure DevOps Intelligence Layer</div>
              </div>
            </div>
            <div style={{display:"flex",gap:"12px",alignItems:"center",flexWrap:"wrap"}}>
              <input value={sprintName} onChange={e=>setSprintName(e.target.value)}
                style={{width:140,padding:"6px 12px",fontSize:13}} placeholder="Sprint name..."/>
              <div className="sprint-badge"><div className="dot"/>{sprintName}</div>
              {analysis && (
                <button className="btn btn-ghost" onClick={exportRetro}>
                  <Icon path={icons.download} size={14}/>Export
                </button>
              )}
            </div>
          </header>

          {/* ── Nav ── */}
          <nav className="nav">
            {tabs.map(t=>(
              <button key={t.id} className={`nav-tab${activeTab===t.id?" active":""}`} onClick={()=>setActiveTab(t.id)}>
                <Icon path={t.icon} size={14}/>{t.label}
                {t.id==="talking"&&talkingPoints.length>0&&(
                  <span style={{background:"rgba(245,158,11,0.2)",color:"#f59e0b",borderRadius:"4px",padding:"1px 6px",fontSize:10}}>
                    {talkingPoints.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <main className="main">

            {/* ── DATA TAB ── */}
            {activeTab==="data"&&(
              <>
                <div className="card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div className="card-title"><Icon path={icons.message} size={14} color="#f59e0b"/>Channel Notes</div>
                    <span className="tag tag-story">Teams / Channels</span>
                  </div>
                  <span className="lbl">Paste messages from your Microsoft Teams sprint channel, standup threads, or ceremony notes</span>
                  <textarea rows={8} value={channelNotes} onChange={e=>setChannelNotes(e.target.value)}
                    placeholder={"@josh: API integration blocked 2 days — IT access issue\n@sarah: Market Lens export shipped! Clients are happy\n@mike: need better test coverage, bugs slipping to UAT\n@priya: Platform team API delay — PBI #1889 at risk\n@team: velocity felt low, lots of context switching"}/>
                </div>
                <div className="card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div className="card-title"><Icon path={icons.clipboard} size={14} color="#f59e0b"/>Azure DevOps Work Items</div>
                    <span className="tag tag-story">ADO · Boards · Iterations</span>
                  </div>
                  <span className="lbl">Paste work items from your ADO sprint board — PBIs, Bugs, Tasks with states and effort points</span>
                  <textarea rows={8} value={ticketData} onChange={e=>setTicketData(e.target.value)}
                    placeholder={"PBI #1842: Market Lens v2 Export Pipeline [Closed] Effort: 8pts — Assigned: Sarah\nPBI #1856: Report Builder CSV Export [Closed] Effort: 5pts — Assigned: Mike\nPBI #1871: Auth Token Refresh Refactor [Active] Effort: 13pts — Assigned: Dev\nTask #1880: Security Master FX Field Mapping [Closed] Effort: 3pts — Assigned: Priya\nBug #1833: Login Session Timeout P1 [Closed] Effort: 3pts — Assigned: Mike\nBug #1849: Null Ref Portfolio Report [Closed] Effort: 2pts\nBug #1863: Mobile Layout iOS [Active] Effort: 5pts\nIteration: Sprint 42 | Planned: 46pts | Completed: 31pts | Team: Balrog Squad"}/>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                  <button className="btn btn-primary" onClick={analyzeData}
                    disabled={loading.analyze||(!channelNotes&&!ticketData)}>
                    {loading.analyze
                      ? <><Icon path={icons.loader} size={15} color="#0a0c10" className="loading-icon"/>Analyzing...</>
                      : <><Icon path={icons.zap} size={15} color="#0a0c10"/>Analyze Iteration with AI</>}
                  </button>
                </div>
              </>
            )}

            {/* ── ANALYSIS TAB ── */}
            {activeTab==="analysis"&&(
              !analysis
                ? <div className="empty">← Add sprint data and run analysis first</div>
                : <>
                    {summary&&<div className="status-bar"><Icon path={icons.star} size={14}/>{summary}</div>}
                    <div className="two-col">
                      <div className="card">
                        <div className="card-title" style={{marginBottom:16,color:"#14b8a6"}}>
                          <Icon path={icons.rocket} size={14} color="#14b8a6"/>Sprint Wins
                        </div>
                        {analysis.wins.map((w,i)=>(
                          <div className="ai-item" key={i}><span className="ai-bullet teal">▸</span><span>{w}</span></div>
                        ))}
                      </div>
                      <div className="card">
                        <div className="card-title" style={{marginBottom:16,color:"#f87171"}}>
                          <Icon path={icons.alert} size={14} color="#f87171"/>Blockers
                        </div>
                        {analysis.blockers.map((b,i)=>(
                          <div className="ai-item" key={i}><span className="ai-bullet red">▸</span><span>{b}</span></div>
                        ))}
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-title" style={{marginBottom:16,color:"#c084fc"}}>
                        <Icon path={icons.trending} size={14} color="#c084fc"/>Areas for Improvement
                      </div>
                      {analysis.improvements.map((imp,i)=>(
                        <div className="ai-item" key={i}><span className="ai-bullet purple">▸</span><span>{imp}</span></div>
                      ))}
                    </div>
                    <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
                      <button className="btn btn-primary" onClick={()=>setActiveTab("talking")}>
                        <Icon path={icons.message} size={14} color="#0a0c10"/>View Talking Points
                      </button>
                      <button className="btn btn-teal" onClick={()=>setActiveTab("summary")}>
                        <Icon path={icons.chart} size={14}/>Sprint Summary
                      </button>
                    </div>
                  </>
            )}

            {/* ── TALKING POINTS TAB ── */}
            {activeTab==="talking"&&(
              talkingPoints.length===0
                ? <div className="empty">← Run analysis first to generate talking points</div>
                : <>
                    <div className="card" style={{marginBottom:24}}>
                      <div className="card-title" style={{marginBottom:12}}>
                        <Icon path={icons.users} size={14} color="#f59e0b"/>Your Name (for context attribution)
                      </div>
                      <input value={authorName} onChange={e=>setAuthorName(e.target.value)}
                        placeholder="Enter your name or handle..." style={{maxWidth:300}}/>
                    </div>
                    {["win","blocker","improvement"].map(cat=>{
                      const pts=talkingPoints.filter(tp=>tp.category===cat);
                      if(!pts.length) return null;
                      const lbl={win:"Wins",blocker:"Blockers",improvement:"Improvements"};
                      return (
                        <div key={cat}>
                          <div className="divider">{lbl[cat]}</div>
                          {pts.map(tp=>(
                            <div key={tp.id} className={`tp-card ${catCls(tp.category)}`}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                                <span className={`tag tag-${catCls(tp.category)}`}>{tp.category}</span>
                                <span className={`tag tag-${priCls(tp.priority)}`}>{tp.priority}</span>
                              </div>
                              <p className="tp-text">{tp.point}</p>
                              {tp.contexts.length>0&&(
                                <div className="ctx-section">
                                  {tp.contexts.map((ctx,idx)=>(
                                    <div className="ctx-item" key={idx}>
                                      <div>
                                        <div className="ctx-author">{ctx.author} · {ctx.ts}</div>
                                        <div style={{fontSize:13}}>{ctx.text}</div>
                                      </div>
                                      <button className="btn btn-danger"
                                        style={{padding:"4px 8px"}} onClick={()=>removeCtx(tp.id,idx)}>
                                        <Icon path={icons.trash} size={12}/>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div style={{display:"flex",gap:8,marginTop:12}}>
                                <input value={ctxInputs[tp.id]||""} style={{flex:1,padding:"8px 12px"}}
                                  onChange={e=>setCtxInputs(prev=>({...prev,[tp.id]:e.target.value}))}
                                  onKeyDown={e=>e.key==="Enter"&&addCtx(tp.id)}
                                  placeholder="Add team context, notes, or action items..."/>
                                <button className="btn btn-ghost" onClick={()=>addCtx(tp.id)}>
                                  <Icon path={icons.plus} size={14}/>Add
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </>
            )}

            {/* ── SUMMARY TAB ── */}
            {activeTab==="summary"&&(
              !metrics
                ? <div className="empty">← Run analysis first to generate sprint summary</div>
                : <>
                    {summary&&<div className="status-bar"><Icon path={icons.zap} size={14}/>{summary}</div>}
                    <div className="metrics-grid" style={{marginBottom:24}}>
                      {[
                        {cls:"",val:metrics.velocity,label:"Effort Points Velocity",
                         pct:Math.min(Math.round((metrics.completedPoints/metrics.plannedPoints)*100),100),
                         grad:"linear-gradient(90deg,#f59e0b,#d97706)",sub:`${metrics.completedPoints}/${metrics.plannedPoints} pts completed`},
                        {cls:"teal",val:metrics.storiesCompleted,label:"PBIs Closed",
                         pct:Math.min(metrics.storiesCompleted*10,100),
                         grad:"linear-gradient(90deg,#14b8a6,#0d9488)",sub:`${metrics.storiesInProgress} still Active`},
                        {cls:"red",val:metrics.bugsCompleted,label:"Bugs Closed",
                         pct:Math.min(metrics.bugsCompleted*12,100),
                         grad:"linear-gradient(90deg,#f87171,#ef4444)",sub:`${metrics.bugsInProgress} still open`},
                        {cls:"purple",
                         val:metrics.storiesCompleted+metrics.bugsCompleted>0
                           ? `${Math.round((metrics.storiesCompleted/(metrics.storiesCompleted+metrics.bugsCompleted))*100)}%`:"—",
                         label:"PBI vs Bug Ratio",
                         pct:metrics.storiesCompleted+metrics.bugsCompleted>0
                           ? Math.round((metrics.storiesCompleted/(metrics.storiesCompleted+metrics.bugsCompleted))*100):0,
                         grad:"linear-gradient(90deg,#a855f7,#7c3aed)",sub:"Feature focus indicator"},
                      ].map((m,i)=>(
                        <div key={i} className={`metric-card ${m.cls}`}>
                          <div className="metric-value">{m.val}</div>
                          <div className="metric-label">{m.label}</div>
                          <div className="prog-bar"><div className="prog-fill" style={{width:`${m.pct}%`,background:m.grad}}/></div>
                          <div className="metric-sub">{m.sub}</div>
                        </div>
                      ))}
                    </div>
                    <div className="two-col">
                      <div className="card" style={{textAlign:"center"}}>
                        <div className="card-title" style={{justifyContent:"center",marginBottom:20}}>
                          <Icon path={icons.chart} size={14} color="#f59e0b"/>Completion Breakdown
                        </div>
                        <DonutChart stories={metrics.storiesCompleted} bugs={metrics.bugsCompleted}/>
                        <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:8}}>
                          {[{color:"#3b82f6",label:`PBIs (${metrics.storiesCompleted})`},{color:"#f87171",label:`Bugs (${metrics.bugsCompleted})`}].map(l=>(
                            <div key={l.label} style={{display:"flex",alignItems:"center",gap:6}}>
                              <div style={{width:10,height:10,borderRadius:"50%",background:l.color}}/>
                              <span style={{fontSize:12,color:"#64748b",fontFamily:"Space Mono"}}>{l.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-title" style={{marginBottom:16}}>
                          <Icon path={icons.trending} size={14} color="#f59e0b"/>Sprint Health Indicators
                        </div>
                        {[
                          {label:"Iteration Commitment Accuracy",val:Math.round((metrics.completedPoints/metrics.plannedPoints)*100),color:"#f59e0b"},
                          {label:"PBI Throughput",val:Math.min(metrics.storiesCompleted*10,100),color:"#14b8a6"},
                          {label:"Bug Resolution Rate",val:metrics.bugsCompleted>0?Math.round((metrics.bugsCompleted/(metrics.bugsCompleted+metrics.bugsInProgress))*100):0,color:"#f87171"},
                        ].map(h=>(
                          <div key={h.label} style={{marginBottom:16}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                              <span style={{fontSize:13,color:"#94a3b8"}}>{h.label}</span>
                              <span style={{fontFamily:"Space Mono",fontSize:12,color:h.color}}>{h.val}%</span>
                            </div>
                            <div className="prog-bar"><div className="prog-fill" style={{width:`${h.val}%`,background:h.color}}/></div>
                          </div>
                        ))}
                        <div style={{marginTop:20,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                          {[
                            {label:"Talking Points Generated",val:talkingPoints.length,color:"#f59e0b"},
                            {label:"Team Context Added",val:talkingPoints.reduce((a,tp)=>a+tp.contexts.length,0),color:"#14b8a6"},
                          ].map(s=>(
                            <div key={s.label} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#64748b",marginBottom:8}}>
                              <span>{s.label}</span>
                              <span style={{color:s.color,fontFamily:"Space Mono"}}>{s.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"center"}}>
                      <button className="btn btn-primary" onClick={exportRetro}>
                        <Icon path={icons.download} size={14} color="#0a0c10"/>Export Retrospective Report
                      </button>
                    </div>
                  </>
            )}

          </main>
        </div>
      </div>
    </>
  );
}
