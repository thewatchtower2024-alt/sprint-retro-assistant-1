export default function SprintRetroAssistant() {
  const [activeTab, setActiveTab] = useState("data");
  const [sprintName, setSprintName] = useState("Sprint 42");
  const [channelNotes, setChannelNotes] = useState("");
  const [ticketData, setTicketData] = useState("");
  const [loading, setLoading] = useState({});
  const [analysis, setAnalysis] = useState(null);
  const [talkingPoints, setTalkingPoints] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [contextInputs, setContextInputs] = useState({});
  const [authorName, setAuthorName] = useState("");
  const [summary, setSummary] = useState("");

  const setLoad = (key, val) => setLoading(l => ({ ...l, [key]: val }));

  const analyzeData = useCallback(async () => {
    if (!channelNotes && !ticketData) return;
    setLoad("analyze", true);
    setAnalysis(null); setTalkingPoints([]); setMetrics(null); setSummary("");

    const system = `You are an expert Agile coach and Scrum Master specializing in Azure DevOps (ADO). You understand ADO work item types (PBIs, Bugs, Tasks, Features), iteration planning, effort points, and sprint board states (New, Active, Resolved, Closed). Analyze sprint data and return ONLY valid JSON, no markdown, no explanation.`;

    const prompt = `Analyze this Azure DevOps sprint data for ${sprintName} and return JSON:
{
  "wins": ["string",...],
  "blockers": ["string",...],
  "improvements": ["string",...],
  "talkingPoints": [{ "id": 1, "category": "win|blocker|improvement", "point": "string", "priority": "high|medium|low" },...],
  "metrics": { "velocity": number, "storiesCompleted": number, "bugsCompleted": number, "storiesInProgress": number, "bugsInProgress": number, "plannedPoints": number, "completedPoints": number },
  "summary": "2-3 sentence executive summary of the iteration"
}
Use ADO terminology: PBIs, work items, iterations, Closed/Active/New states. 3-5 items per category. 6-8 talking points.

TEAMS CHANNEL NOTES:
${channelNotes || "None provided"}

AZURE DEVOPS WORK ITEMS:
${ticketData || "None provided"}`;

    try {
      const raw = await callClaude(system, prompt);
      const parsed = parseJSON(raw);
      if (parsed) {
        setAnalysis({ wins: parsed.wins, blockers: parsed.blockers, improvements: parsed.improvements });
        setTalkingPoints(parsed.talkingPoints.map(tp => ({ ...tp, contexts: [] })));
        setMetrics(parsed.metrics);
        setSummary(parsed.summary);
        setActiveTab("analysis");
      }
    } catch (e) { console.error(e); }
    setLoad("analyze", false);
  }, [channelNotes, ticketData, sprintName]);

  const addContext = (tpId) => {
    const text = contextInputs[tpId];
    if (!text?.trim()) return;
    setTalkingPoints(prev => prev.map(tp =>
      tp.id === tpId ? { ...tp, contexts: [...tp.contexts, { text, author: authorName || "Team Member", ts: new Date().toLocaleTimeString() }] } : tp
    ));
    setContextInputs(prev => ({ ...prev, [tpId]: "" }));
  };

  const removeContext = (tpId, idx) => {
    setTalkingPoints(prev => prev.map(tp =>
      tp.id === tpId ? { ...tp, contexts: tp.contexts.filter((_, i) => i !== idx) } : tp
    ));
  };

  const exportRetro = () => {
    const lines = [
      `# Sprint Retrospective — ${sprintName}`,
      `Source: Azure DevOps | Generated: ${new Date().toLocaleDateString()}`,
      "", `## Iteration Summary`, summary, "",
      `## Iteration Metrics`,
      metrics ? `- Velocity: ${metrics.velocity} pts | PBIs Closed: ${metrics.storiesCompleted} | Bugs Closed: ${metrics.bugsCompleted}` : "",
      "", `## Talking Points`,
      ...talkingPoints.map(tp => [`### [${tp.category.toUpperCase()}] ${tp.point}`, ...tp.contexts.map(c => `  > ${c.author}: ${c.text}`), ""].join("\n")),
    ].join("\n");
    const blob = new Blob([lines], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `retro-${sprintName.replace(/\s+/g, "-")}.md`; a.click();
  };

  const DonutChart = ({ stories, bugs }) => {
    const total = stories + bugs || 1;
    const r = 44, cx = 60, cy = 60, circ = 2 * Math.PI * r;
    const storyDash = circ * (stories / total);
    const bugDash = circ * (bugs / total);
    return (
      <svg width="120" height="120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3b82f6" strokeWidth="12"
          strokeDasharray={`${storyDash} ${circ - storyDash}`} strokeDashoffset={circ / 4} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f87171" strokeWidth="12"
          strokeDasharray={`${bugDash} ${circ - bugDash}`} strokeDashoffset={circ / 4 - storyDash} />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="800" fontFamily="Space Mono">
          {Math.round((stories / total) * 100)}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="Space Mono">PBIs</text>
      </svg>
    );
  };

  const catColor = (cat) => ({ win: "win", blocker: "blocker", improvement: "improve" }[cat] || "win");
  const tabs = [
    { id: "data", label: "Sprint Data", icon: icons.clipboard },
    { id: "analysis", label: "AI Analysis", icon: icons.zap },
    { id: "talking", label: "Talking Points", icon: icons.message },
    { id: "summary", label: "Sprint Summary", icon: icons.chart },
  ];
