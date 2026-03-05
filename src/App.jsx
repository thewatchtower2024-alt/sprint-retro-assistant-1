import { useState, useCallback } from "react";

const API = "https://api.anthropic.com/v1/messages";
const callClaude = async (system, user, apiKey, maxTokens = 2500) => {
  const r = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens,
      system, messages: [{ role: "user", content: user }] }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.content?.[0]?.text || "";
};
const parseJSON = (t) => {
  try { return JSON.parse(t.replace(/```json|```/g, "").trim()); }
  catch { return null; }
};
const Icon = ({ path, size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);
const IC = {
  rocket:   "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
  zap:      "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  alert:    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  trending: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  users:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  plus:     "M12 5v14 M5 12h14",
  trash:    "M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  loader:   "M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83",
  chart:    "M18 20V10 M12 20V4 M6 20v-6",
  message:  "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  clip:     "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  dl:       "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  plug:     "M7 6V3m10 3V3M7 14a5 5 0 0 0 10 0V6H7v8z",
  flag:     "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
  check:    "M20 6L9 17l-5-5",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0",
  link:     "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  refresh:  "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0a0c10;}
  .app{min-height:100vh;background:#0a0c10;color:#e2e8f0;font-family:'Syne',sans-serif;position:relative;overflow-x:hidden;}
  .app::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 60% 40% at 20% 10%,rgba(245,158,11,0.06) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 80% 80%,rgba(20,184,166,0.06) 0%,transparent 60%);pointer-events:none;z-index:0;}
  .grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(245,158,11,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.04) 1px,transparent 1px);background-size:40px 40px;z-index:0;pointer-events:none;}
  .content{position:relative;z-index:1;}
  .hdr{border-bottom:1px solid rgba(245,158,11,0.2);padding:16px 28px;display:flex;align-items:center;justify-content:space-between;background:rgba(10,12,16,0.85);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;flex-wrap:wrap;gap:12px;}
  .hdr-left{display:flex;align-items:center;gap:14px;}
  .logo{background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:8px;padding:7px 11px;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:#0a0c10;letter-spacing:.1em;}
  .hdr-title{font-size:18px;font-weight:800;color:#fff;}
  .hdr-title span{color:#f59e0b;}
  .hdr-sub{font-family:'Space Mono',monospace;font-size:10px;color:#64748b;margin-top:2px;}
  .sprint-badge{background:rgba(20,184,166,0.1);border:1px solid rgba(20,184,166,0.3);border-radius:6px;padding:5px 12px;font-family:'Space Mono',monospace;font-size:12px;color:#14b8a6;display:flex;align-items:center;gap:8px;}
  .dot{width:6px;height:6px;border-radius:50%;background:#14b8a6;animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .nav{display:flex;gap:2px;padding:16px 28px 0;border-bottom:1px solid rgba(255,255,255,0.06);overflow-x:auto;}
  .tab{padding:9px 18px;border:none;background:transparent;color:#64748b;font-family:'Syne',sans-serif;font-size:13px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;display:flex;align-items:center;gap:7px;white-space:nowrap;}
  .tab:hover{color:#94a3b8;}
  .tab.on{color:#f59e0b;border-bottom-color:#f59e0b;}
  .main{padding:28px;max-width:1400px;margin:0 auto;}
  .card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:22px;margin-bottom:18px;transition:border-color .2s;}
  .card:hover{border-color:rgba(245,158,11,0.15);}
  .card-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;display:flex;align-items:center;gap:8px;margin-bottom:14px;}
  .lbl{font-family:'Space Mono',monospace;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:7px;display:block;}
  textarea,input[type=text],input[type=password]{width:100%;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:11px 14px;color:#e2e8f0;font-family:'Space Mono',monospace;font-size:12px;line-height:1.7;resize:vertical;transition:border-color .2s;outline:none;}
  textarea:focus,input:focus{border-color:rgba(245,158,11,0.4);background:rgba(245,158,11,0.03);}
  textarea::placeholder,input::placeholder{color:#334155;}
  .btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:8px;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;transition:all .2s;white-space:nowrap;}
  .btn-primary{background:linear-gradient(135deg,#f59e0b,#d97706);color:#0a0c10;}
  .btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(245,158,11,.3);}
  .btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none;}
  .btn-ghost{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;}
  .btn-ghost:hover{background:rgba(255,255,255,0.08);color:#e2e8f0;}
  .btn-teal{background:rgba(20,184,166,0.1);border:1px solid rgba(20,184,166,0.3);color:#14b8a6;}
  .btn-red{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);color:#f87171;}
  .btn-sm{padding:5px 10px;font-size:11px;}
  .badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:4px;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;}
  .b-teal{background:rgba(20,184,166,0.15);color:#14b8a6;border:1px solid rgba(20,184,166,0.2);}
  .b-red{background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.2);}
  .b-amber{background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.2);}
  .b-purple{background:rgba(168,85,247,0.15);color:#c084fc;border:1px solid rgba(168,85,247,0.2);}
  .b-blue{background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.2);}
  .b-green{background:rgba(34,197,94,0.15);color:#4ade80;border:1px solid rgba(34,197,94,0.2);}
  .spin{animation:spin 1s linear infinite;}
  .empty{text-align:center;padding:56px 24px;color:#334155;font-family:'Space Mono',monospace;font-size:13px;line-height:1.8;}
  .status-bar{background:rgba(20,184,166,0.05);border:1px solid rgba(20,184,166,0.15);border-radius:8px;padding:10px 16px;font-family:'Space Mono',monospace;font-size:11px;color:#14b8a6;margin-bottom:20px;display:flex;align-items:flex-start;gap:8px;line-height:1.7;}
  .health-green{background:rgba(34,197,94,0.07);border-color:rgba(34,197,94,0.25);color:#4ade80;}
  .health-yellow{background:rgba(245,158,11,0.07);border-color:rgba(245,158,11,0.25);color:#f59e0b;}
  .health-red{background:rgba(239,68,68,0.07);border-color:rgba(239,68,68,0.25);color:#f87171;}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
  .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;}
  .ai-row{padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:13px;color:#cbd5e1;line-height:1.6;display:flex;gap:10px;align-items:flex-start;}
  .ai-row:last-child{border-bottom:none;}
  .bullet-teal{color:#14b8a6;font-size:16px;line-height:1.5;flex-shrink:0;}
  .bullet-red{color:#f87171;font-size:16px;line-height:1.5;flex-shrink:0;}
  .bullet-amber{color:#f59e0b;font-size:16px;line-height:1.5;flex-shrink:0;}
  .bullet-purple{color:#c084fc;font-size:16px;line-height:1.5;flex-shrink:0;}
  .bullet-blue{color:#60a5fa;font-size:16px;line-height:1.5;flex-shrink:0;}
  .divider{display:flex;align-items:center;gap:10px;margin:20px 0 14px;color:#475569;font-family:'Space Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:.1em;}
  .divider::before,.divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.06);}
  .metrics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:20px;}
  .m-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:18px;text-align:center;}
  .m-val{font-size:32px;font-weight:800;color:#f59e0b;line-height:1;margin-bottom:3px;}
  .m-lbl{font-family:'Space Mono',monospace;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.1em;}
  .m-sub{font-size:11px;color:#475569;margin-top:5px;}
  .m-card.c-teal .m-val{color:#14b8a6;}
  .m-card.c-red  .m-val{color:#f87171;}
  .m-card.c-purple .m-val{color:#c084fc;}
  .m-card.c-blue .m-val{color:#60a5fa;}
  .m-card.c-green .m-val{color:#4ade80;}
  .prog{height:5px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;margin-top:7px;}
  .prog-fill{height:100%;border-radius:3px;transition:width .8s ease;}
  @media(max-width:900px){.two-col,.three-col{grid-template-columns:1fr}.main{padding:16px}.hdr{padding:12px 16px}}
`;

// ── Kanban lane config ──────────────────────────────────────────────────────
const LANES = [
  { id:"good",       label:"Good",         emoji:"✅", accent:"#4ade80", cls:"c-green",  badgeCls:"b-green"  },
  { id:"bad",        label:"Bad",          emoji:"❌", accent:"#f87171", cls:"c-red",    badgeCls:"b-red"    },
  { id:"keep",       label:"Keep Doing",   emoji:"🔁", accent:"#60a5fa", cls:"c-blue",   badgeCls:"b-blue"   },
  { id:"change",     label:"Change",       emoji:"🔄", accent:"#c084fc", cls:"c-purple", badgeCls:"b-purple" },
  { id:"actionItems",label:"Action Items", emoji:"🎯", accent:"#f59e0b", cls:"c-amber",  badgeCls:"b-amber"  },
];

// ── Integration stub config ─────────────────────────────────────────────────
// (Config now inlined per-platform inside the integrations tab render)

export default function App() {
  const [tab,          setTab]          = useState("data");
  const [apiKey,       setApiKey]       = useState(import.meta.env.VITE_ANTHROPIC_API_KEY || "");
  const [sprintName,   setSprintName]   = useState("Sprint 42");
  const [notes,        setNotes]        = useState("");
  const [workItems,    setWorkItems]    = useState("");
  const [loading,      setLoading]      = useState(false);
  const [loadStep,     setLoadStep]     = useState("");
  const [result,       setResult]       = useState(null);
  const [cards,        setCards]        = useState({});
  const [ctxInput,     setCtxInput]     = useState({});
  const [authorName,   setAuthorName]   = useState("");
  const [integrations, setIntegrations] = useState({
    ado:  { connected:false, url:"", token:"", org:"",
            testStatus:"idle", testMessage:"", testDetail:"" },
    jira: { connected:false, url:"", token:"", email:"",
            testStatus:"idle", testMessage:"", testDetail:"" },
  });
  const [showIntModal, setShowIntModal] = useState(null);

  // ── Integration helpers ────────────────────────────────────────────────────
  const setIntField = (id, field, val) =>
    setIntegrations(p => ({ ...p, [id]: { ...p[id], [field]: val } }));

  const setTestStatus = (id, status, message="", detail="") =>
    setIntegrations(p => ({ ...p, [id]: { ...p[id], testStatus:status, testMessage:message, testDetail:detail } }));

  const testConnection = async (id) => {
    const cfg = integrations[id];
    setTestStatus(id, "testing", "Contacting server...");
    try {
      if (id === "ado") {
        // ADO: Basic auth = base64(":PAT")
        const b64 = btoa(":" + cfg.token);
        const url = cfg.url.replace(/\/$/, "") + "/_apis/projects?api-version=7.0&$top=1";
        const res = await fetch(url, {
          headers: { "Authorization": "Basic " + b64, "Content-Type": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          const proj = data?.value?.[0]?.name || "your organization";
          setTestStatus(id, "success", `Connected! Found project: ${proj}`);
          setIntField(id, "connected", true);
        } else if (res.status === 401 || res.status === 403) {
          setTestStatus(id, "auth", "Authentication failed — check your PAT and make sure it has Read permissions on Work Items.");
        } else {
          setTestStatus(id, "error", `Server returned ${res.status}. Check your organization URL.`);
        }
      } else if (id === "jira") {
        // Jira Cloud: Basic auth = base64("email:api-token")
        const b64 = btoa(cfg.email + ":" + cfg.token);
        const base = cfg.url.replace(/\/$/, "");
        const res = await fetch(`${base}/rest/api/3/myself`, {
          headers: { "Authorization": "Basic " + b64, "Accept": "application/json" },
        });
        if (res.ok) {
          const data = await res.json();
          const name = data?.displayName || data?.emailAddress || cfg.email;
          setTestStatus(id, "success", `Connected as ${name}!`);
          setIntField(id, "connected", true);
        } else if (res.status === 401 || res.status === 403) {
          setTestStatus(id, "auth", "Authentication failed — check your email and API token.");
        } else {
          setTestStatus(id, "error", `Server returned ${res.status}. Check your Jira URL.`);
        }
      }
    } catch(e) {
      // TypeError: Failed to fetch = CORS block (expected for direct browser → ADO/Jira)
      if (e instanceof TypeError && e.message.includes("fetch")) {
        setTestStatus(id, "cors",
          "CORS blocked — the API rejected the browser request directly.",
          id === "ado"
            ? "This is expected for Azure DevOps. In production, requests route through a backend proxy. Your credentials are saved — use Load Test Data to run a full analysis now."
            : "Jira Cloud blocks direct browser requests. In production, requests route through a backend proxy. Your credentials are saved — use Load Test Data to run a full analysis now."
        );
        // Still mark as saved even if CORS blocks the live test
        setIntField(id, "connected", true);
      } else {
        setTestStatus(id, "error", e.message);
      }
    }
  };

  const disconnectIntegration = (id) => {
    setIntegrations(p => ({ ...p, [id]: {
      ...p[id], connected:false, testStatus:"idle", testMessage:"", testDetail:""
    }}));
  };

  // ── Test data generators ───────────────────────────────────────────────────
  const ADO_TEST_DATA = `PBI #2201: Investment Portfolio Dashboard — Real-Time NAV Display [Closed] Effort: 8pts — Assigned: Sarah Chen | Cycle: 4 days
PBI #2198: Security Master FX Rate Override UI [Closed] Effort: 5pts — Assigned: Mike Torres | Cycle: 3 days
PBI #2187: Market Lens Export to CSV/Excel [Closed] Effort: 8pts — Assigned: Priya Nair | Cycle: 5 days
PBI #2210: Report Builder Custom Date Range Filter [Active] Effort: 13pts — Assigned: Dev Team (carry to next sprint)
PBI #2215: Solovis API Token Refresh Refactor [New] Effort: 21pts — Descoped: dependency on Platform team
Task #2203: Update API docs for NAV endpoint [Closed] Effort: 2pts — Assigned: Sarah Chen
Task #2199: FX field mapping QA validation [Closed] Effort: 3pts — Assigned: Priya Nair | Time in Dev Review: 2 days | Time in QA: 1 day
Bug #2192: Portfolio report null reference on empty fund [Closed] P2 Effort: 3pts — Assigned: Mike Torres | Cycle: 2 days
Bug #2205: Login session timeout too aggressive (15min) [Closed] P1 Effort: 2pts — Assigned: Mike Torres | Cycle: 1 day
Bug #2209: iOS mobile layout broken on iPad landscape [Active] P2 Effort: 5pts — carry to next sprint
Bug #2214: CSV export encoding issue — special chars [New] P3 Effort: 2pts
Iteration: Sprint 44 | Team: Balrog Squad | Planned: 52pts | Completed: 31pts | Carry-over: 21pts
Sprint dates: 2/24/2025 – 3/7/2025 | Team capacity: 80% (1 dev on PTO)`;

  const JIRA_TEST_DATA = `BALROG-441: Investment Portfolio Dashboard — Real-Time NAV Display [Done] Story Points: 8 — Sarah Chen | Cycle time: 4 days
BALROG-438: Security Master FX Rate Override UI [Done] Story Points: 5 — Mike Torres | Cycle time: 3 days
BALROG-427: Market Lens Export to CSV/Excel [Done] Story Points: 8 — Priya Nair | Cycle time: 5 days
BALROG-450: Report Builder Custom Date Range Filter [In Progress] Story Points: 13 — Dev Team (carried to next sprint)
BALROG-455: Solovis API Token Refresh Refactor [To Do] Story Points: 21 — Descoped: blocked by Platform team
BALROG-443: Update API docs for NAV endpoint [Done] Story Points: 2 — Sarah Chen
BALROG-439: FX field mapping QA validation [Done] Story Points: 3 — Priya Nair | Time in Code Review: 2 days | Time in QA: 1 day
BALROG-432: Portfolio report null reference on empty fund [Done] Bug Priority: Medium Story Points: 3 — Mike Torres
BALROG-445: Login session timeout too aggressive (15min) [Done] Bug Priority: High Story Points: 2 — Mike Torres | Cycle: 1 day
BALROG-449: iOS mobile layout broken on iPad landscape [In Progress] Bug Priority: Medium Story Points: 5 — carry to next sprint
BALROG-454: CSV export encoding issue — special chars [To Do] Bug Priority: Low Story Points: 2
Sprint: Sprint 44 | Board: Balrog Squad | Committed: 52pts | Completed: 31pts | Velocity (last 3): 38, 44, 31
Sprint dates: 2/24/2025 – 3/7/2025 | Team capacity: 80% (1 dev on PTO)`;

  const loadTestData = (id) => {
    setSprintName("Sprint 44 — Test Data");
    setNotes(`@sarah: NAV dashboard shipped — clients love the real-time refresh, big win!\n@mike: P1 session timeout bug was painful, hit prod Friday night. Need better UAT coverage.\n@priya: FX override blocked waiting on IT access for 2 days — same blocker as last sprint.\n@dev: Platform team API still not ready, had to descope BALROG-455/PBI #2215 again.\n@team: capacity was rough with Jordan on PTO, affected velocity\nStandup 2/26: Mike still blocked on env access for iOS testing\nStandup 2/28: P1 bug #2205/BALROG-445 fixed and deployed to prod, all clear\nRetro pre-notes: context switching between squads killing our focus time`);
    setWorkItems(id === "ado" ? ADO_TEST_DATA : JIRA_TEST_DATA);
    setTab("data");
  };

  // ── Archive state ──────────────────────────────────────────────────────────
  const [archive,       setArchive]      = useState(() => {
    try { return JSON.parse(localStorage.getItem("retro-archive") || "[]"); }
    catch { return []; }
  });
  const [archiveFilter, setArchiveFilter] = useState("");
  const [archiveSort,   setArchiveSort]   = useState("newest");
  const [confirmDelete, setConfirmDelete] = useState(null); // id to confirm

  const saveToArchive = (snap) => {
    const entry = {
      id:        Date.now().toString(),
      savedAt:   new Date().toISOString(),
      sprintName: snap.sprintName,
      notes:     snap.notes,
      workItems:  snap.workItems,
      result:    snap.result,
      cards:     snap.cards,
    };
    const updated = [entry, ...archive];
    setArchive(updated);
    try { localStorage.setItem("retro-archive", JSON.stringify(updated)); } catch(e) { console.error(e); }
    return entry.id;
  };

  const deleteFromArchive = (id) => {
    const updated = archive.filter(e => e.id !== id);
    setArchive(updated);
    try { localStorage.setItem("retro-archive", JSON.stringify(updated)); } catch(e) { console.error(e); }
    setConfirmDelete(null);
  };

  const loadFromArchive = (entry) => {
    setSprintName(entry.sprintName);
    setNotes(entry.notes);
    setWorkItems(entry.workItems);
    setResult(entry.result);
    setCards(entry.cards);
    setTab("analysis");
  };

  const exportArchive = () => {
    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "retro-archive.json"; a.click();
  };

  const exportSingleSprint = (entry) => {
    const blob = new Blob([JSON.stringify(entry, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `retro-${entry.sprintName.replace(/\s+/g,"-").toLowerCase()}.json`; a.click();
  };

  const importArchive = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        // Accept either single sprint object or array
        const entries = Array.isArray(data) ? data : [data];
        const merged = [...entries.filter(e => e.id && e.sprintName), ...archive];
        // Deduplicate by id
        const deduped = merged.filter((e,i,arr) => arr.findIndex(x => x.id === e.id) === i);
        setArchive(deduped);
        localStorage.setItem("retro-archive", JSON.stringify(deduped));
        alert(`Imported ${entries.length} sprint(s) successfully.`);
      } catch { alert("Invalid archive file — must be a JSON export from this app."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ── AI analysis ────────────────────────────────────────────────────────────
  const analyze = useCallback(async () => {
    if (!notes && !workItems) return;
    if (!apiKey) { alert("Please enter your Anthropic API key first."); return; }
    setLoading(true);
    setResult(null); setCards({});

    setLoadStep("Scanning channel notes for highlights...");
    await new Promise(r => setTimeout(r, 600));
    setLoadStep("Reviewing work items & velocity...");
    await new Promise(r => setTimeout(r, 600));
    setLoadStep("Generating retrospective analysis...");

    const system = `You are an expert Agile coach specializing in Azure DevOps retrospectives.
Analyze sprint data and return ONLY valid JSON — no markdown, no explanation, no preamble.
Use ADO terminology: PBIs (not stories), work items (not tickets), Closed/Active/New/Resolved states, Effort Points (not story points).
Be specific and actionable. Extract real names and item IDs from the data when present.`;

    const prompt = `Analyze this sprint data for ${sprintName} and return a single JSON object with exactly this shape:
{
  "summary": "2-3 sentence executive overview of the sprint",
  "sprintHealth": "green|yellow|red",
  "healthReason": "one sentence explaining the health rating",
  "chatHighlights": {
    "actionItems": ["specific action item extracted from chat (max 6)"],
    "ongoingBlockers": ["blocker that persisted or was mentioned multiple times (max 5)"],
    "discussionTopics": ["topic that came up repeatedly or needs ceremony time (max 5)"],
    "shoutouts": ["positive callout or win mentioned in chat (max 4)"]
  },
  "workItemAnalysis": {
    "plannedPoints": 0,
    "completedPoints": 0,
    "carryOverPoints": 0,
    "commitmentAccuracy": 0,
    "pbisCompleted": 0,
    "pbisActive": 0,
    "bugsCompleted": 0,
    "bugsActive": 0,
    "bugToStoryRatio": "X:Y format",
    "avgCycleTimeDays": "N/A or number",
    "devReviewWaitDays": "N/A — requires ADO integration",
    "qaWaitDays": "N/A — requires ADO integration",
    "carryOverItems": ["item title [ID] reason"]
  },
  "talkingPoints": {
    "good":        [{"id":"g1","text":"...","source":"chat|ado|both"}],
    "bad":         [{"id":"b1","text":"...","source":"chat|ado|both"}],
    "keep":        [{"id":"k1","text":"...","source":"chat|ado|both"}],
    "change":      [{"id":"c1","text":"...","source":"chat|ado|both"}],
    "actionItems": [{"id":"a1","text":"...","owner":"name or TBD","priority":"high|medium|low"}]
  }
}
Rules: 3-5 items per talking point lane. Action items must have a clear owner when inferrable. Flag dev review / QA wait as N/A — requires ADO integration.

CHANNEL NOTES:
${notes || "None provided"}

ADO WORK ITEMS:
${workItems || "None provided"}`;

    try {
      const raw = await callClaude(system, prompt, apiKey, 2500);
      console.log("Claude raw response:", raw);
      const parsed = parseJSON(raw);
      if (parsed) {
        setResult(parsed);
        const shaped = {};
        LANES.forEach(l => {
          shaped[l.id] = (parsed.talkingPoints?.[l.id] || []).map(c => ({ ...c, contexts: [] }));
        });
        setCards(shaped);
        // Auto-save to archive
        saveToArchive({ sprintName, notes, workItems, result: parsed, cards: shaped });
        setTab("analysis");
      } else {
        console.error("JSON parse failed. Raw:", raw);
        alert("Analysis failed — could not parse AI response. Check browser console for details.");
      }
    } catch(e) { console.error("API error:", e); alert("API error: " + e.message); }

    setLoading(false);
    setLoadStep("");
  }, [notes, workItems, sprintName]);

  // ── Card context helpers ───────────────────────────────────────────────────
  const addCtx = (laneId, cardId) => {
    const text = ctxInput[cardId];
    if (!text?.trim()) return;
    setCards(prev => ({
      ...prev,
      [laneId]: prev[laneId].map(c => c.id === cardId
        ? { ...c, contexts: [...c.contexts, { text, author: authorName || "Team Member", ts: new Date().toLocaleTimeString() }] }
        : c)
    }));
    setCtxInput(prev => ({ ...prev, [cardId]: "" }));
  };
  const removeCtx = (laneId, cardId, idx) =>
    setCards(prev => ({
      ...prev,
      [laneId]: prev[laneId].map(c => c.id === cardId
        ? { ...c, contexts: c.contexts.filter((_,i) => i !== idx) }
        : c)
    }));

  // ── Export ─────────────────────────────────────────────────────────────────
  const exportMd = () => {
    if (!result) return;
    const wi = result.workItemAnalysis || {};
    const lines = [
      `# Sprint Retrospective — ${sprintName}`,
      `> ${new Date().toLocaleDateString()} | Health: ${result.sprintHealth?.toUpperCase()}`,
      `\n## Summary\n${result.summary}`,
      `\n## Sprint Metrics`,
      `| Metric | Value |`,`|---|---|`,
      `| Planned Points | ${wi.plannedPoints} |`,
      `| Completed Points | ${wi.completedPoints} |`,
      `| Commitment Accuracy | ${wi.commitmentAccuracy}% |`,
      `| PBIs Closed | ${wi.pbisCompleted} |`,
      `| Bugs Closed | ${wi.bugsCompleted} |`,
      `| Bug:PBI Ratio | ${wi.bugToStoryRatio} |`,
      `\n## Talking Points`,
      ...LANES.map(l => {
        const items = cards[l.id] || [];
        return [`\n### ${l.emoji} ${l.label}`,
          ...items.map(c => [`- ${c.text}`, ...c.contexts.map(x => `  > ${x.author}: ${x.text}`)].join("\n"))
        ].join("\n");
      }),
      `\n## Chat Highlights`,
      `### Action Items`,
      ...(result.chatHighlights?.actionItems || []).map(i => `- ${i}`),
      `### Ongoing Blockers`,
      ...(result.chatHighlights?.ongoingBlockers || []).map(i => `- ${i}`),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines], { type: "text/markdown" }));
    a.download = `retro-${sprintName.replace(/\s+/g,"-").toLowerCase()}.md`;
    a.click();
  };

  // ── Integration modal ──────────────────────────────────────────────────────
  const saveIntegration = (id) => {
    setIntegrations(prev => ({ ...prev, [id]: { ...prev[id], connected: true } }));
    setShowIntModal(null);
  };

  // ── Donut chart ────────────────────────────────────────────────────────────
  const Donut = ({ a, b, labelA, labelB, colorA, colorB }) => {
    const tot = a + b || 1, r = 42, cx = 56, cy = 56, circ = 2 * Math.PI * r;
    const da = circ * (a/tot), db = circ * (b/tot);
    return (
      <div style={{textAlign:"center"}}>
        <svg width="112" height="112">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="11"/>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={colorA} strokeWidth="11"
            strokeDasharray={`${da} ${circ-da}`} strokeDashoffset={circ/4} style={{transition:"stroke-dasharray .8s"}}/>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={colorB} strokeWidth="11"
            strokeDasharray={`${db} ${circ-db}`} strokeDashoffset={circ/4-da} style={{transition:"stroke-dasharray .8s"}}/>
          <text x={cx} y={cy-3} textAnchor="middle" fill="#f59e0b" fontSize="15" fontWeight="800" fontFamily="Space Mono">
            {tot > 0 ? Math.round((a/tot)*100)+"%" : "—"}
          </text>
          <text x={cx} y={cy+13} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="Space Mono">PBIs</text>
        </svg>
        <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:4}}>
          {[{color:colorA,label:labelA},{color:colorB,label:labelB}].map(l => (
            <div key={l.label} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:l.color}}/>
              <span style={{fontSize:11,color:"#64748b",fontFamily:"Space Mono"}}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const tabs = [
    { id:"data",     label:"Sprint Data",     icon:IC.clip    },
    { id:"analysis", label:"AI Analysis",     icon:IC.zap     },
    { id:"talking",  label:"Talking Points",  icon:IC.message },
    { id:"summary",  label:"Sprint Summary",  icon:IC.chart   },
    { id:"archive",  label:"Archive",         icon:IC.star    },
    { id:"connect",  label:"Integrations",    icon:IC.plug    },
  ];
  const totalCards = Object.values(cards).reduce((s,l)=>s+l.length,0);
  const wi = result?.workItemAnalysis || {};
  const ch = result?.chatHighlights   || {};
  const health = result?.sprintHealth || "green";
  const healthCls = {green:"health-green",yellow:"health-yellow",red:"health-red"}[health] || "health-green";

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="grid-bg"/>
        <div className="content">

          {/* ── HEADER ── */}
          <header className="hdr">
            <div className="hdr-left">
              <div className="logo">RETRO</div>
              <div>
                <div className="hdr-title">Sprint <span>Retrospective</span> Assistant</div>
                <div className="hdr-sub">Powered by Claude AI · Azure DevOps Intelligence Layer</div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,background: apiKey ? "rgba(34,197,94,0.06)" : "rgba(245,158,11,0.08)", border: `1px solid ${apiKey ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.3)"}`, borderRadius:8, padding:"4px 10px"}}>
                <span style={{fontSize:10,fontFamily:"Space Mono",color: apiKey ? "#4ade80" : "#f59e0b",whiteSpace:"nowrap"}}>
                  {apiKey ? "🔑 Key set" : "🔑 API Key"}
                </span>
                <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)}
                  style={{width:160,padding:"3px 6px",fontSize:11,fontFamily:"Space Mono",background:"transparent",border:"none",outline:"none",borderBottom:"1px solid rgba(255,255,255,0.1)"}}
                  placeholder="sk-ant-api03-..."/>
              </div>
              <input type="text" value={sprintName} onChange={e=>setSprintName(e.target.value)}
                style={{width:130,padding:"5px 10px",fontSize:12}} placeholder="Sprint name..."/>
              <div className="sprint-badge"><div className="dot"/>{sprintName}</div>
              {result && <button className="btn btn-ghost btn-sm" onClick={exportMd}>
                <Icon path={IC.dl} size={13}/>Export
              </button>}
            </div>
          </header>

          {/* ── NAV ── */}
          <nav className="nav">
            {tabs.map(t => (
              <button key={t.id} className={`tab${tab===t.id?" on":""}`} onClick={()=>setTab(t.id)}>
                <Icon path={t.icon} size={13}/>{t.label}
                {t.id==="talking" && totalCards>0 && (
                  <span style={{background:"rgba(245,158,11,0.2)",color:"#f59e0b",borderRadius:"4px",padding:"1px 6px",fontSize:10}}>{totalCards}</span>
                )}
                {t.id==="archive" && archive.length>0 && (
                  <span style={{background:"rgba(20,184,166,0.2)",color:"#14b8a6",borderRadius:"4px",padding:"1px 6px",fontSize:10}}>{archive.length}</span>
                )}
                {t.id==="connect" && Object.values(integrations).some(i=>i.connected) && (
                  <span className="badge b-teal" style={{fontSize:9,padding:"1px 5px"}}>linked</span>
                )}
              </button>
            ))}
          </nav>

          <main className="main">

            {/* ══════════ DATA TAB ══════════ */}
            {tab==="data" && (
              <>
                {/* API key onboarding banner — shown only when no key is set */}
                {!apiKey && (
                  <div style={{background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:10,padding:"16px 20px",marginBottom:20,display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
                    <span style={{fontSize:22,flexShrink:0}}>🔑</span>
                    <div style={{flex:1,minWidth:200}}>
                      <div style={{fontWeight:700,color:"#f59e0b",marginBottom:4,fontSize:14}}>Anthropic API Key Required</div>
                      <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.7,marginBottom:10}}>
                        Paste your key into the field in the top-right header to enable AI analysis. Keys start with <code style={{fontFamily:"Space Mono",background:"rgba(255,255,255,0.06)",padding:"1px 5px",borderRadius:3}}>sk-ant-</code>
                      </div>
                      <div style={{fontSize:11,color:"#64748b",fontFamily:"Space Mono"}}>
                        Get a key → <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer"
                          style={{color:"#f59e0b",textDecoration:"none"}}>console.anthropic.com/settings/keys</a>
                        &nbsp;·&nbsp; Each user needs their own key &nbsp;·&nbsp; Usage is pay-per-call (~$0.01/analysis)
                      </div>
                    </div>
                  </div>
                )}
                <div className="card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div className="card-title"><Icon path={IC.message} size={13} color="#f59e0b"/>Microsoft Teams Channel Notes</div>
                    <span className="badge b-blue">Teams · Slack · Chat</span>
                  </div>
                  <span className="lbl">Paste messages from your sprint channel, standup threads, and ceremony notes. Claude will extract action items, blockers, and discussion topics.</span>
                  <textarea rows={9} value={notes} onChange={e=>setNotes(e.target.value)}
                    placeholder={"@josh: API integration blocked 2 days — IT access issue still unresolved\n@sarah: Market Lens export shipped! Clients demoed it in UAT\n@mike: need better test coverage, bugs slipping through to QA\n@priya: Platform team dependency on PBI #1889 at risk, no ETA\n@team: velocity felt low this sprint, lots of context switching between squads\nStandup 2/24: Dev still blocked on env access, @josh escalating to IT\nStandup 2/26: P1 bug #1833 fixed by Mike, deployed to prod"}/>
                </div>
                <div className="card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div className="card-title"><Icon path={IC.clip} size={13} color="#f59e0b"/>Azure DevOps Work Items</div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      {integrations.ado.connected
                        ? <span className="badge b-teal"><Icon path={IC.check} size={10}/>ADO Live</span>
                        : <button className="btn btn-ghost btn-sm" onClick={()=>setTab("connect")}>
                            <Icon path={IC.plug} size={12}/>Connect ADO
                          </button>}
                      <span className="badge b-blue">Boards · Iterations</span>
                    </div>
                  </div>
                  <span className="lbl">Paste work items from your ADO sprint board — PBIs, Bugs, Tasks with states and effort points. Include planned vs completed totals for velocity analysis.</span>
                  <textarea rows={9} value={workItems} onChange={e=>setWorkItems(e.target.value)}
                    placeholder={"PBI #1842: Market Lens v2 Export Pipeline [Closed] Effort: 8pts — Sarah\nPBI #1856: Report Builder CSV Export [Closed] Effort: 5pts — Mike\nPBI #1871: Auth Token Refresh Refactor [Active] Effort: 13pts — Dev (carry to Sprint 43)\nTask #1880: Security Master FX Field Mapping [Closed] Effort: 3pts — Priya\nPBI #1889: Portfolio Aggregation API [New] Effort: 21pts — Descoped (Platform dependency)\nBug #1833: Login Session Timeout P1 [Closed] Effort: 3pts — Mike\nBug #1849: Null Ref on Portfolio Report [Closed] Effort: 2pts\nBug #1863: Mobile iOS Layout [Active] Effort: 5pts — carry Sprint 43\nIteration: Sprint 42 | Planned: 46pts | Completed: 31pts | Team: Balrog Squad"}/>
                </div>
                <div style={{background:"rgba(245,158,11,0.04)",border:"1px solid rgba(245,158,11,0.12)",borderRadius:10,padding:"12px 18px",marginBottom:18,fontSize:12,color:"#94a3b8",fontFamily:"Space Mono",lineHeight:1.7}}>
                  <span style={{color:"#f59e0b",fontWeight:700}}>⚡ ADO/Jira Integration (coming soon):</span> Connect your ADO or Jira instance via the Integrations tab to automatically pull PBIs, cycle times, and lane duration data (time in Dev Review / QA). Until then, paste work item data above.
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
                  <button className="btn btn-ghost" onClick={()=>setTab("connect")}>
                    <Icon path={IC.plug} size={13}/>Manage Integrations
                  </button>
                  <button className="btn btn-primary" onClick={analyze}
                    disabled={loading||(!notes&&!workItems)||!apiKey}>
                    {loading
                      ? <><Icon path={IC.loader} size={14} color="#0a0c10" className="spin"/>{loadStep||"Analyzing..."}</>
                      : <><Icon path={IC.zap} size={14} color="#0a0c10"/>Analyze Iteration with AI</>}
                  </button>
                </div>
              </>
            )}

            {/* ══════════ ANALYSIS TAB ══════════ */}
            {tab==="analysis" && (
              !result ? (
                <div className="empty">← Add sprint data and click "Analyze Iteration with AI" to begin</div>
              ) : <>
                {/* Health banner */}
                <div className={`status-bar ${healthCls}`} style={{marginBottom:20}}>
                  <Icon path={IC.star} size={14}/>
                  <div><strong>{sprintName} · {health.toUpperCase()} HEALTH</strong> — {result.healthReason}<br/>{result.summary}</div>
                </div>

                {/* Chat highlights row */}
                <div className="divider">Chat Highlights</div>
                <div className="two-col" style={{marginBottom:18}}>
                  <div className="card">
                    <div className="card-title" style={{color:"#f87171"}}><Icon path={IC.flag} size={13} color="#f87171"/>Ongoing Blockers</div>
                    {(ch.ongoingBlockers||[]).length===0
                      ? <div style={{fontSize:12,color:"#475569",fontFamily:"Space Mono"}}>None detected</div>
                      : (ch.ongoingBlockers||[]).map((b,i)=>(
                          <div className="ai-row" key={i}><span className="bullet-red">▸</span><span>{b}</span></div>
                        ))}
                  </div>
                  <div className="card">
                    <div className="card-title" style={{color:"#f59e0b"}}><Icon path={IC.check} size={13} color="#f59e0b"/>Action Items from Chat</div>
                    {(ch.actionItems||[]).length===0
                      ? <div style={{fontSize:12,color:"#475569",fontFamily:"Space Mono"}}>None detected</div>
                      : (ch.actionItems||[]).map((a,i)=>(
                          <div className="ai-row" key={i}><span className="bullet-amber">▸</span><span>{a}</span></div>
                        ))}
                  </div>
                </div>
                <div className="two-col" style={{marginBottom:18}}>
                  <div className="card">
                    <div className="card-title" style={{color:"#60a5fa"}}><Icon path={IC.message} size={13} color="#60a5fa"/>Discussion Topics for Ceremony</div>
                    {(ch.discussionTopics||[]).length===0
                      ? <div style={{fontSize:12,color:"#475569",fontFamily:"Space Mono"}}>None detected</div>
                      : (ch.discussionTopics||[]).map((t,i)=>(
                          <div className="ai-row" key={i}><span className="bullet-blue">▸</span><span>{t}</span></div>
                        ))}
                  </div>
                  <div className="card">
                    <div className="card-title" style={{color:"#4ade80"}}><Icon path={IC.rocket} size={13} color="#4ade80"/>Shoutouts & Wins</div>
                    {(ch.shoutouts||[]).length===0
                      ? <div style={{fontSize:12,color:"#475569",fontFamily:"Space Mono"}}>None detected</div>
                      : (ch.shoutouts||[]).map((s,i)=>(
                          <div className="ai-row" key={i}><span className="bullet-teal">▸</span><span>{s}</span></div>
                        ))}
                  </div>
                </div>

                {/* Work item analysis */}
                <div className="divider">Work Item Analysis</div>
                <div className="metrics-grid">
                  {[
                    {cls:"",      val:wi.completedPoints||0,  lbl:"Points Completed",    sub:`of ${wi.plannedPoints||0} planned`},
                    {cls:"c-green",val:`${wi.commitmentAccuracy||0}%`,lbl:"Commitment Accuracy",sub:`${wi.carryOverPoints||0} pts carried over`},
                    {cls:"c-teal", val:wi.pbisCompleted||0,   lbl:"PBIs Closed",          sub:`${wi.pbisActive||0} still Active`},
                    {cls:"c-red",  val:wi.bugsCompleted||0,   lbl:"Bugs Closed",          sub:`${wi.bugsActive||0} still open`},
                    {cls:"c-blue", val:wi.bugToStoryRatio||"—",lbl:"Bug : PBI Ratio",     sub:"lower is better"},
                    {cls:"c-purple",val:wi.avgCycleTimeDays||"N/A",lbl:"Avg Cycle Time",  sub:"days to close"},
                  ].map((m,i)=>(
                    <div key={i} className={`m-card ${m.cls}`}>
                      <div className="m-val">{m.val}</div>
                      <div className="m-lbl">{m.lbl}</div>
                      <div className="m-sub">{m.sub}</div>
                    </div>
                  ))}
                </div>
                {/* ADO lane times stub */}
                <div className="card" style={{background:"rgba(0,120,212,0.04)",borderColor:"rgba(0,120,212,0.15)"}}>
                  <div className="card-title" style={{color:"#60a5fa"}}>
                    <Icon path={IC.eye} size={13} color="#60a5fa"/>Lane Duration Analysis
                    <span className="badge b-blue" style={{marginLeft:8}}>Requires ADO Integration</span>
                  </div>
                  <div className="three-col">
                    {[
                      {label:"Avg Time in Dev Review",val:wi.devReviewWaitDays||"—"},
                      {label:"Avg Time in QA / Testing",val:wi.qaWaitDays||"—"},
                      {label:"Avg Time Active → Closed",val:wi.avgCycleTimeDays||"—"},
                    ].map(l=>(
                      <div key={l.label} style={{textAlign:"center",padding:"14px 10px",background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px dashed rgba(255,255,255,0.08)"}}>
                        <div style={{fontSize:22,fontWeight:800,color:"#60a5fa",fontFamily:"Space Mono"}}>{l.val}</div>
                        <div style={{fontSize:10,color:"#64748b",fontFamily:"Space Mono",marginTop:4,textTransform:"uppercase",letterSpacing:".08em"}}>{l.label}</div>
                        <button className="btn btn-ghost btn-sm" style={{marginTop:10,fontSize:10}} onClick={()=>setTab("connect")}>
                          <Icon path={IC.plug} size={10}/>Connect ADO
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:4}}>
                  <button className="btn btn-primary" onClick={()=>setTab("talking")}>
                    <Icon path={IC.message} size={13} color="#0a0c10"/>Open Talking Points Board
                  </button>
                  <button className="btn btn-teal" onClick={()=>setTab("summary")}>
                    <Icon path={IC.chart} size={13}/>Sprint Summary
                  </button>
                </div>
              </>
            )}

            {/* ══════════ TALKING POINTS TAB ══════════ */}
            {tab==="talking" && (
              totalCards===0 ? (
                <div className="empty">← Run analysis first to populate the retrospective board<br/><br/>
                  <button className="btn btn-primary" onClick={()=>setTab("data")}>
                    <Icon path={IC.zap} size={13} color="#0a0c10"/>Go to Sprint Data
                  </button>
                </div>
              ) : <>
                  {/* Author input */}
                  <div className="card" style={{marginBottom:20,padding:"14px 20px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                      <Icon path={IC.users} size={14} color="#f59e0b"/>
                      <span style={{fontSize:13,color:"#94a3b8",fontWeight:600}}>Your name for context notes:</span>
                      <input type="text" value={authorName} onChange={e=>setAuthorName(e.target.value)}
                        placeholder="Enter your name..." style={{width:220,padding:"6px 10px",fontSize:12}}/>
                      <span style={{fontSize:11,color:"#475569",fontFamily:"Space Mono"}}>
                        {totalCards} cards · {Object.values(cards).reduce((s,l)=>s+l.reduce((a,c)=>a+c.contexts.length,0),0)} context notes
                      </span>
                    </div>
                  </div>

                  {/* 5-lane kanban */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,alignItems:"start"}}>
                    {LANES.map(lane => {
                      const laneCards = cards[lane.id] || [];
                      return (
                        <div key={lane.id} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${lane.accent}33`,borderRadius:12,overflow:"hidden"}}>
                          {/* Lane header */}
                          <div style={{padding:"12px 14px",borderBottom:`1px solid ${lane.accent}22`,background:`${lane.accent}0a`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <span style={{fontSize:16}}>{lane.emoji}</span>
                              <span style={{fontSize:12,fontWeight:700,color:lane.accent,letterSpacing:".06em",textTransform:"uppercase"}}>{lane.label}</span>
                            </div>
                            <span style={{background:`${lane.accent}22`,color:lane.accent,borderRadius:4,padding:"1px 7px",fontSize:11,fontFamily:"Space Mono"}}>{laneCards.length}</span>
                          </div>
                          {/* Cards */}
                          <div style={{padding:10,display:"flex",flexDirection:"column",gap:10,minHeight:120}}>
                            {laneCards.length===0 && (
                              <div style={{fontSize:11,color:"#334155",fontFamily:"Space Mono",textAlign:"center",padding:"20px 0"}}>No items</div>
                            )}
                            {laneCards.map(card => (
                              <div key={card.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderLeft:`3px solid ${lane.accent}`,borderRadius:8,padding:"12px"}}>
                                <p style={{fontSize:12,color:"#cbd5e1",lineHeight:1.6,marginBottom:8}}>{card.text}</p>
                                {/* Source badge */}
                                <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
                                  {card.source&&<span className={`badge ${lane.badgeCls}`} style={{fontSize:9}}>{card.source}</span>}
                                  {card.owner&&<span className="badge b-amber" style={{fontSize:9}}>👤 {card.owner}</span>}
                                  {card.priority&&<span className={`badge ${card.priority==="high"?"b-red":card.priority==="medium"?"b-amber":"b-teal"}`} style={{fontSize:9}}>{card.priority}</span>}
                                </div>
                                {/* Context notes */}
                                {card.contexts?.length>0&&(
                                  <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:8,marginBottom:8}}>
                                    {card.contexts.map((ctx,idx)=>(
                                      <div key={idx} style={{background:"rgba(245,158,11,0.05)",border:"1px solid rgba(245,158,11,0.1)",borderRadius:6,padding:"6px 10px",marginBottom:6,display:"flex",justifyContent:"space-between",gap:8}}>
                                        <div>
                                          <div style={{fontFamily:"Space Mono",fontSize:9,color:"#f59e0b",marginBottom:2}}>{ctx.author} · {ctx.ts}</div>
                                          <div style={{fontSize:12,color:"#94a3b8"}}>{ctx.text}</div>
                                        </div>
                                        <button className="btn btn-red btn-sm" style={{padding:"2px 6px",flexShrink:0}} onClick={()=>removeCtx(lane.id,card.id,idx)}>
                                          <Icon path={IC.trash} size={10}/>
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {/* Add context */}
                                <div style={{display:"flex",gap:6}}>
                                  <input type="text" value={ctxInput[card.id]||""} style={{flex:1,padding:"5px 8px",fontSize:11}}
                                    placeholder="Add note..."
                                    onChange={e=>setCtxInput(p=>({...p,[card.id]:e.target.value}))}
                                    onKeyDown={e=>e.key==="Enter"&&addCtx(lane.id,card.id)}/>
                                  <button className="btn btn-ghost btn-sm" onClick={()=>addCtx(lane.id,card.id)}>
                                    <Icon path={IC.plus} size={11}/>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",justifyContent:"center",marginTop:20}}>
                    <button className="btn btn-primary" onClick={exportMd}>
                      <Icon path={IC.dl} size={13} color="#0a0c10"/>Export Full Retrospective
                    </button>
                  </div>
                </>
            )}

            {/* ══════════ SPRINT SUMMARY TAB ══════════ */}
            {tab==="summary" && (
              !result ? (
                <div className="empty">← Run analysis first to generate sprint summary</div>
              ) : <>
                  <div className={`status-bar ${healthCls}`}>
                    <Icon path={IC.zap} size={14}/>
                    <div><strong>{sprintName} — {health.toUpperCase()}</strong> · {result.healthReason}</div>
                  </div>
                  {/* Key metrics */}
                  <div className="metrics-grid">
                    {[
                      {cls:"",       val:wi.completedPoints||0,     lbl:"Points Delivered",    sub:`${wi.plannedPoints||0} planned`,  pct:Math.min(((wi.completedPoints||0)/(wi.plannedPoints||1))*100,100), grad:"linear-gradient(90deg,#f59e0b,#d97706)"},
                      {cls:"c-green",val:`${wi.commitmentAccuracy||0}%`, lbl:"Commitment Accuracy", sub:`${wi.carryOverPoints||0} pts carried over`, pct:wi.commitmentAccuracy||0, grad:"linear-gradient(90deg,#4ade80,#16a34a)"},
                      {cls:"c-teal", val:wi.pbisCompleted||0,        lbl:"PBIs Closed",          sub:`${wi.pbisActive||0} Active`,    pct:Math.min((wi.pbisCompleted||0)*10,100), grad:"linear-gradient(90deg,#14b8a6,#0d9488)"},
                      {cls:"c-red",  val:wi.bugsCompleted||0,        lbl:"Bugs Closed",          sub:`${wi.bugsActive||0} still open`,pct:Math.min((wi.bugsCompleted||0)*12,100), grad:"linear-gradient(90deg,#f87171,#ef4444)"},
                      {cls:"c-purple",val:wi.bugToStoryRatio||"—",   lbl:"Bug : PBI Ratio",      sub:"closed items only",            pct:0,                                        grad:""},
                      {cls:"c-blue", val:wi.avgCycleTimeDays||"N/A", lbl:"Avg Cycle Time",       sub:"days Active → Closed",         pct:0,                                        grad:""},
                    ].map((m,i)=>(
                      <div key={i} className={`m-card ${m.cls}`}>
                        <div className="m-val">{m.val}</div>
                        <div className="m-lbl">{m.lbl}</div>
                        {m.grad && <div className="prog"><div className="prog-fill" style={{width:`${m.pct}%`,background:m.grad}}/></div>}
                        <div className="m-sub">{m.sub}</div>
                      </div>
                    ))}
                  </div>

                  <div className="two-col">
                    {/* Donut + carry-over */}
                    <div className="card" style={{textAlign:"center"}}>
                      <div className="card-title" style={{justifyContent:"center",marginBottom:16}}>
                        <Icon path={IC.chart} size={13} color="#f59e0b"/>Completion Breakdown
                      </div>
                      <Donut a={wi.pbisCompleted||0} b={wi.bugsCompleted||0}
                        labelA={`PBIs (${wi.pbisCompleted||0})`} labelB={`Bugs (${wi.bugsCompleted||0})`}
                        colorA="#3b82f6" colorB="#f87171"/>
                      {(wi.carryOverItems||[]).length>0 && (
                        <div style={{marginTop:16,textAlign:"left"}}>
                          <div style={{fontSize:11,color:"#64748b",fontFamily:"Space Mono",marginBottom:8,textTransform:"uppercase",letterSpacing:".08em"}}>Carry-over Items</div>
                          {wi.carryOverItems.map((item,i)=>(
                            <div key={i} className="ai-row" style={{fontSize:12}}>
                              <span className="bullet-amber">▸</span><span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Sprint health indicators */}
                    <div className="card">
                      <div className="card-title" style={{marginBottom:16}}>
                        <Icon path={IC.trending} size={13} color="#f59e0b"/>Sprint Health Indicators
                      </div>
                      {[
                        {label:"Commitment Accuracy",  val:wi.commitmentAccuracy||0,   color:"#4ade80",  target:85},
                        {label:"PBI Throughput",        val:Math.min((wi.pbisCompleted||0)*10,100), color:"#14b8a6", target:70},
                        {label:"Bug Resolution Rate",   val:wi.bugsCompleted>0?Math.round((wi.bugsCompleted/((wi.bugsCompleted||0)+(wi.bugsActive||0)||1))*100):0, color:"#f87171", target:80},
                      ].map(h=>(
                        <div key={h.label} style={{marginBottom:16}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                            <span style={{fontSize:13,color:"#94a3b8"}}>{h.label}</span>
                            <div style={{display:"flex",gap:8,alignItems:"center"}}>
                              <span style={{fontSize:10,color:"#475569",fontFamily:"Space Mono"}}>target {h.target}%</span>
                              <span style={{fontFamily:"Space Mono",fontSize:12,color:h.color}}>{h.val}%</span>
                            </div>
                          </div>
                          <div className="prog">
                            <div className="prog-fill" style={{width:`${h.val}%`,background:h.color}}/>
                          </div>
                        </div>
                      ))}
                      {/* Lane times */}
                      <div style={{marginTop:18,padding:"12px 14px",background:"rgba(0,120,212,0.05)",border:"1px dashed rgba(0,120,212,0.2)",borderRadius:8}}>
                        <div style={{fontSize:10,color:"#60a5fa",fontFamily:"Space Mono",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Lane Duration Data</div>
                        {[
                          {label:"Dev Review Wait",  val:wi.devReviewWaitDays||"—"},
                          {label:"QA / Testing Wait", val:wi.qaWaitDays||"—"},
                        ].map(l=>(
                          <div key={l.label} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#64748b",marginBottom:6}}>
                            <span>{l.label}</span>
                            <span style={{color:"#60a5fa",fontFamily:"Space Mono"}}>{l.val}
                              {l.val==="—"&&<span style={{fontSize:10,color:"#334155",marginLeft:6}}>needs ADO</span>}
                            </span>
                          </div>
                        ))}
                        <button className="btn btn-ghost btn-sm" style={{marginTop:8,width:"100%",justifyContent:"center"}} onClick={()=>setTab("connect")}>
                          <Icon path={IC.plug} size={11}/>Connect ADO to unlock lane data
                        </button>
                      </div>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"center"}}>
                    <button className="btn btn-primary" onClick={exportMd}>
                      <Icon path={IC.dl} size={13} color="#0a0c10"/>Export Retrospective Report
                    </button>
                  </div>
                </>
            )}

            {/* ══════════ ARCHIVE TAB ══════════ */}
            {tab==="archive" && (
              <>
                {/* Toolbar */}
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:20}}>
                  <input type="text" value={archiveFilter} onChange={e=>setArchiveFilter(e.target.value)}
                    placeholder="Search sprints..." style={{width:220,padding:"7px 12px",fontSize:12}}/>
                  <select value={archiveSort} onChange={e=>setArchiveSort(e.target.value)}
                    style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"7px 12px",color:"#e2e8f0",fontSize:12,fontFamily:"Space Mono",outline:"none"}}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="name">Sprint name A–Z</option>
                    <option value="health">Health status</option>
                  </select>
                  <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                    <label className="btn btn-ghost btn-sm" style={{cursor:"pointer"}}>
                      <Icon path={IC.link} size={12}/>Import
                      <input type="file" accept=".json" onChange={importArchive} style={{display:"none"}}/>
                    </label>
                    {archive.length>0 && (
                      <button className="btn btn-ghost btn-sm" onClick={exportArchive}>
                        <Icon path={IC.dl} size={12}/>Export All
                      </button>
                    )}
                  </div>
                </div>

                {archive.length===0 ? (
                  <div className="empty">
                    No sprints archived yet.<br/><br/>
                    Sprints are automatically saved here after each analysis.<br/>
                    <button className="btn btn-primary" style={{marginTop:16}} onClick={()=>setTab("data")}>
                      <Icon path={IC.zap} size={13} color="#0a0c10"/>Run Your First Analysis
                    </button>
                  </div>
                ) : (() => {
                    const healthOrder = {green:0,yellow:1,red:2};
                    const filtered = archive
                      .filter(e => !archiveFilter || e.sprintName.toLowerCase().includes(archiveFilter.toLowerCase()))
                      .sort((a,b) => {
                        if (archiveSort==="oldest") return new Date(a.savedAt)-new Date(b.savedAt);
                        if (archiveSort==="name")   return a.sprintName.localeCompare(b.sprintName);
                        if (archiveSort==="health")  return (healthOrder[a.result?.sprintHealth]??3)-(healthOrder[b.result?.sprintHealth]??3);
                        return new Date(b.savedAt)-new Date(a.savedAt); // newest
                      });

                    if (filtered.length===0) return (
                      <div className="empty">No sprints match "{archiveFilter}"</div>
                    );

                    return filtered.map(entry => {
                      const wi = entry.result?.workItemAnalysis || {};
                      const health = entry.result?.sprintHealth || "green";
                      const healthColor = {green:"#4ade80",yellow:"#f59e0b",red:"#f87171"}[health] || "#4ade80";
                      const healthCls   = {green:"b-green",yellow:"b-amber",red:"b-red"}[health] || "b-green";
                      const totalCards  = Object.values(entry.cards||{}).reduce((s,l)=>s+l.length,0);
                      const savedDate   = new Date(entry.savedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
                      const savedTime   = new Date(entry.savedAt).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
                      const isActive    = entry.sprintName===sprintName && result;

                      return (
                        <div key={entry.id} className="card" style={{borderColor: isActive ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.08)",marginBottom:14}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                            {/* Left: sprint info */}
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                                <span style={{fontSize:16,fontWeight:800,color:"#fff"}}>{entry.sprintName}</span>
                                <span className={`badge ${healthCls}`}>{health.toUpperCase()}</span>
                                {isActive && <span className="badge b-amber">● Current</span>}
                              </div>
                              <div style={{fontFamily:"Space Mono",fontSize:10,color:"#475569",marginBottom:10}}>
                                Saved {savedDate} at {savedTime}
                              </div>
                              {/* Mini metrics row */}
                              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                                {[
                                  {label:"Points",   val:`${wi.completedPoints||0}/${wi.plannedPoints||0}`},
                                  {label:"Accuracy", val:`${wi.commitmentAccuracy||0}%`},
                                  {label:"PBIs",     val:wi.pbisCompleted||0},
                                  {label:"Bugs",     val:wi.bugsCompleted||0},
                                  {label:"Cards",    val:totalCards},
                                ].map(m=>(
                                  <div key={m.label} style={{textAlign:"center"}}>
                                    <div style={{fontSize:14,fontWeight:800,color:healthColor,fontFamily:"Space Mono"}}>{m.val}</div>
                                    <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:".08em"}}>{m.label}</div>
                                  </div>
                                ))}
                              </div>
                              {entry.result?.summary && (
                                <p style={{fontSize:12,color:"#64748b",marginTop:10,lineHeight:1.6,fontStyle:"italic"}}>
                                  "{entry.result.summary.slice(0,160)}{entry.result.summary.length>160?"...":""}"
                                </p>
                              )}
                            </div>
                            {/* Right: actions */}
                            <div style={{display:"flex",flexDirection:"column",gap:8,flexShrink:0}}>
                              <button className="btn btn-primary btn-sm" onClick={()=>loadFromArchive(entry)}>
                                <Icon path={IC.eye} size={12} color="#0a0c10"/>Load & Review
                              </button>
                              <button className="btn btn-ghost btn-sm" onClick={()=>exportSingleSprint(entry)}>
                                <Icon path={IC.dl} size={12}/>Export JSON
                              </button>
                              {confirmDelete===entry.id ? (
                                <div style={{display:"flex",gap:6}}>
                                  <button className="btn btn-red btn-sm" onClick={()=>deleteFromArchive(entry.id)}>Confirm</button>
                                  <button className="btn btn-ghost btn-sm" onClick={()=>setConfirmDelete(null)}>Cancel</button>
                                </div>
                              ) : (
                                <button className="btn btn-ghost btn-sm" style={{color:"#475569"}} onClick={()=>setConfirmDelete(entry.id)}>
                                  <Icon path={IC.trash} size={12}/>Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()
                }
              </>
            )}

            {/* ══════════ INTEGRATIONS TAB ══════════ */}
            {tab==="connect" && (
              <>
                <div className="card" style={{marginBottom:20,padding:"16px 20px",background:"rgba(245,158,11,0.04)",borderColor:"rgba(245,158,11,0.15)"}}>
                  <div className="card-title" style={{color:"#f59e0b",marginBottom:6}}><Icon path={IC.plug} size={14} color="#f59e0b"/>Platform Integrations</div>
                  <p style={{fontSize:13,color:"#64748b",lineHeight:1.7}}>
                    Connect ADO or Jira to pull live sprint data — PBIs, cycle times, and lane durations. Use <strong style={{color:"#94a3b8"}}>Load Test Data</strong> to run a full analysis with realistic sample data right now, no connection required.
                  </p>
                </div>

                <div className="two-col">
                  {[
                    { id:"ado",  label:"Azure DevOps", color:"#0078d4",
                      urlPlaceholder:"https://dev.azure.com/your-org",
                      tokenLabel:"Personal Access Token (PAT)",
                      tokenPlaceholder:"Paste your ADO PAT here...",
                      tokenHint:"Needs: Work Items (Read), Project (Read)",
                      features:["Auto-pull PBIs, Bugs, Tasks from current iteration","Effort points & state per item","Time in Dev Review lane","Time in QA / Testing lane","Sprint velocity — last 6 iterations"] },
                    { id:"jira", label:"Jira Cloud", color:"#0052cc",
                      urlPlaceholder:"https://your-org.atlassian.net",
                      tokenLabel:"API Token",
                      tokenPlaceholder:"Paste your Jira API token here...",
                      tokenHint:"Generate at: id.atlassian.com/manage-profile/security/api-tokens",
                      features:["Auto-pull Issues, Bugs, Epics from active sprint","Story points & status per issue","Time in Code Review lane","Time in QA / Testing lane","Sprint velocity — last 6 sprints"] },
                  ].map(int => {
                    const cfg = integrations[int.id];
                    const ts  = cfg.testStatus;
                    const statusColor = {idle:"#475569",testing:"#f59e0b",success:"#4ade80",cors:"#60a5fa",auth:"#f87171",error:"#f87171"}[ts]||"#475569";
                    const statusBg    = {idle:"rgba(255,255,255,0.02)",testing:"rgba(245,158,11,0.05)",success:"rgba(34,197,94,0.06)",cors:"rgba(59,130,246,0.06)",auth:"rgba(239,68,68,0.06)",error:"rgba(239,68,68,0.06)"}[ts]||"rgba(255,255,255,0.02)";
                    const statusBorder= {idle:"rgba(255,255,255,0.08)",testing:"rgba(245,158,11,0.2)",success:"rgba(34,197,94,0.25)",cors:"rgba(59,130,246,0.25)",auth:"rgba(239,68,68,0.25)",error:"rgba(239,68,68,0.25)"}[ts]||"rgba(255,255,255,0.08)";

                    return (
                      <div key={int.id} className="card" style={{borderColor: cfg.connected ? `${int.color}55` : "rgba(255,255,255,0.08)"}}>
                        {/* Header */}
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                          <div>
                            <div style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:3}}>{int.label}</div>
                            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                              {cfg.connected && ts==="success" && <span className="badge b-teal"><Icon path={IC.check} size={10}/>Live</span>}
                              {cfg.connected && ts==="cors"    && <span className="badge b-blue"><Icon path={IC.check} size={10}/>Saved</span>}
                              {!cfg.connected && ts==="idle"   && <span className="badge b-amber">Not Connected</span>}
                              {ts==="auth"  && <span className="badge b-red">Auth Failed</span>}
                              {ts==="error" && <span className="badge b-red">Error</span>}
                              {ts==="testing"&& <span className="badge b-amber">Testing...</span>}
                            </div>
                          </div>
                          <div style={{width:36,height:36,borderRadius:8,background:`${int.color}22`,border:`1px solid ${int.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:int.color,fontFamily:"Space Mono",letterSpacing:"-.02em",flexShrink:0}}>
                            {int.id==="ado"?"ADO":"JIRA"}
                          </div>
                        </div>

                        {/* Test status banner */}
                        {ts!=="idle" && (
                          <div style={{background:statusBg,border:`1px solid ${statusBorder}`,borderRadius:8,padding:"10px 14px",marginBottom:14}}>
                            <div style={{fontSize:12,fontWeight:700,color:statusColor,marginBottom:cfg.testDetail?4:0}}>
                              {ts==="testing" && <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Icon path={IC.loader} size={12} color={statusColor} className="spin"/>Testing connection...</span>}
                              {ts!=="testing" && cfg.testMessage}
                            </div>
                            {cfg.testDetail && <div style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{cfg.testDetail}</div>}
                          </div>
                        )}

                        {/* Credentials form — always shown unless live-connected */}
                        {(!cfg.connected || ts==="auth" || ts==="error") && (
                          <div>
                            <div style={{marginBottom:10}}>
                              <span className="lbl">Instance URL</span>
                              <input type="text" value={cfg.url} placeholder={int.urlPlaceholder}
                                onChange={e=>setIntField(int.id,"url",e.target.value)}/>
                            </div>
                            {int.id==="jira" && (
                              <div style={{marginBottom:10}}>
                                <span className="lbl">Atlassian Account Email</span>
                                <input type="text" value={cfg.email||""} placeholder="you@company.com"
                                  onChange={e=>setIntField(int.id,"email",e.target.value)}/>
                              </div>
                            )}
                            <div style={{marginBottom:6}}>
                              <span className="lbl">{int.tokenLabel}</span>
                              <input type="password" value={cfg.token} placeholder={int.tokenPlaceholder}
                                onChange={e=>setIntField(int.id,"token",e.target.value)}/>
                            </div>
                            <div style={{fontSize:10,color:"#475569",fontFamily:"Space Mono",marginBottom:14}}>{int.tokenHint}</div>
                            <button className="btn btn-sm" style={{background:`linear-gradient(135deg,${int.color},${int.color}bb)`,color:"#fff",width:"100%",justifyContent:"center"}}
                              onClick={()=>testConnection(int.id)}
                              disabled={ts==="testing" || !cfg.url || !cfg.token || (int.id==="jira" && !cfg.email)}>
                              {ts==="testing"
                                ? <><Icon path={IC.loader} size={12} color="#fff" className="spin"/>Testing...</>
                                : <><Icon path={IC.plug} size={12} color="#fff"/>Test Connection</>}
                            </button>
                          </div>
                        )}

                        {/* Connected state */}
                        {cfg.connected && ts!=="auth" && ts!=="error" && (
                          <div>
                            <div style={{fontSize:11,color:"#475569",fontFamily:"Space Mono",marginBottom:12,wordBreak:"break-all"}}>{cfg.url}</div>
                            <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:"10px 14px",marginBottom:14}}>
                              <div style={{fontSize:10,color:"#475569",fontFamily:"Space Mono",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Will pull automatically</div>
                              {int.features.map(f=>(
                                <div key={f} style={{display:"flex",gap:8,alignItems:"center",fontSize:12,color:"#64748b",marginBottom:5}}>
                                  <Icon path={IC.check} size={11} color="#4ade80"/>{f}
                                </div>
                              ))}
                            </div>
                            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                              <button className="btn btn-ghost btn-sm" onClick={()=>testConnection(int.id)} disabled={ts==="testing"}>
                                <Icon path={IC.refresh} size={11}/>Re-test
                              </button>
                              <button className="btn btn-red btn-sm" onClick={()=>disconnectIntegration(int.id)}>
                                <Icon path={IC.trash} size={11}/>Disconnect
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Load test data — always available */}
                        <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                          <div style={{fontSize:10,color:"#475569",fontFamily:"Space Mono",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>
                            {int.id==="ado" ? "ADO-formatted" : "Jira-formatted"} · Realistic sample · Balrog Squad
                          </div>
                          <button className="btn btn-ghost btn-sm" style={{width:"100%",justifyContent:"center",borderColor:`${int.color}44`,color:int.id==="ado"?"#60a5fa":"#818cf8"}}
                            onClick={()=>loadTestData(int.id)}>
                            <Icon path={IC.zap} size={12}/>Load Test Data → Run Analysis
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Roadmap */}
                <div className="card" style={{background:"rgba(255,255,255,0.01)",borderColor:"rgba(255,255,255,0.05)"}}>
                  <div className="card-title" style={{marginBottom:10,color:"#334155"}}>
                    <Icon path={IC.eye} size={13} color="#334155"/>Integration Roadmap
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {["GitHub (PR cycle time)","ServiceNow (incident correlation)","Confluence (doc linkage)","Power BI (velocity dashboards)","Slack (channel notes auto-import)"].map(f=>(
                      <span key={f} className="badge" style={{background:"rgba(255,255,255,0.02)",color:"#334155",border:"1px dashed rgba(255,255,255,0.06)",fontSize:11}}>{f}</span>
                    ))}
                  </div>
                </div>
              </>
            )}

          </main>
        </div>
      </div>
    </>
  );
}
