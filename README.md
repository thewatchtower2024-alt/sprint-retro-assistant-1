# Sprint Retrospective Assistant

> AI-powered retrospective facilitation for Agile teams — built on Claude AI with Azure DevOps and Jira integration.

**🚀 Live App:** https://thewatchtower2024-alt.github.io/sprint-retro-assistant-1/

---

## What It Does

Running a sprint retrospective takes real facilitation skill. This tool handles the analysis work so you can focus on the conversation.

Paste in your Teams/Slack channel notes and ADO or Jira work items, click **Analyze Iteration with AI**, and get:

- **Chat highlights** — action items, ongoing blockers, discussion topics, and shoutouts surfaced automatically from your sprint channel
- **Work item analysis** — velocity, PBI/Bug ratio, commitment accuracy, cycle time, and carry-over items
- **5-lane retrospective board** — AI-generated talking points organized into Good / Bad / Keep / Change / Action Items, with team context notes per card
- **Sprint health rating** — Green / Yellow / Red with a one-sentence explanation
- **Sprint archive** — every analysis auto-saved locally; browse, reload, and export past sprints
- **ADO & Jira integration stubs** — connection test flow with real API validation, plus realistic formatted test data to run a full analysis without a live connection

---

## Screenshots

| Sprint Data | AI Analysis |
|---|---|
| Paste channel notes + work items | Blockers, action items, discussion topics |

| Talking Points Board | Sprint Summary |
|---|---|
| 5-lane kanban with team context notes | Velocity, health indicators, donut chart |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite |
| AI | Anthropic Claude API (`claude-sonnet-4`) |
| Styling | Custom CSS (Space Mono + Syne fonts) |
| Hosting | GitHub Pages via GitHub Actions |
| Storage | localStorage (sprint archive) |

---

## Quick Start

```bash
git clone https://github.com/thewatchtower2024-alt/sprint-retro-assistant-1.git
cd sprint-retro-assistant-1
npm install
```

Create a `.env` file in the root:

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get a key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) — usage runs ~$0.01 per analysis.

```bash
npm run dev
# Opens at http://localhost:3000/sprint-retro-assistant-1/
```

---

## How to Use

### 1. Sprint Data Tab
Paste two things:
- **Channel notes** — copy/paste from your Teams or Slack sprint channel, standups, or ceremony threads
- **Work items** — paste from your ADO sprint board or Jira backlog

**ADO format:**
```
PBI #2201: Portfolio Dashboard NAV Display [Closed] Effort: 8pts — Sarah
Bug #2205: Login Session Timeout P1 [Closed] Effort: 2pts — Mike
Iteration: Sprint 44 | Planned: 52pts | Completed: 31pts | Team: Balrog Squad
```

**Jira format:**
```
BALROG-441: Portfolio Dashboard NAV Display [Done] Story Points: 8 — Sarah
BALROG-445: Login Session Timeout [Done] Bug Priority: High SP: 2 — Mike
Sprint: Sprint 44 | Committed: 52pts | Completed: 31pts
```

No live integration yet? Hit **Load Test Data** in the Integrations tab to run a full analysis with realistic sample data.

### 2. AI Analysis Tab
Claude returns:
- Ongoing blockers from chat
- Action items called out by the team
- Discussion topics worth ceremony time
- Shoutouts and wins
- Work item metrics (velocity, accuracy, PBI/bug counts)

### 3. Talking Points Board
Five lanes: ✅ Good · ❌ Bad · 🔁 Keep Doing · 🔄 Change · 🎯 Action Items

Add team context notes to any card during the retro ceremony. Notes are attributed by name and timestamped.

### 4. Sprint Summary Tab
Velocity metrics, health indicators with target thresholds, PBI vs Bug donut chart, and carry-over item list.

### 5. Archive Tab
Every analysis auto-saves. Browse past sprints, filter by name, sort by date or health status. Load any sprint back into the app for review, or export as JSON to share.

---

## Integrations

### Azure DevOps
- URL: `https://dev.azure.com/your-org`
- Auth: Personal Access Token (needs Work Items: Read, Project: Read)
- Connection test validates against `/_apis/projects`

### Jira Cloud
- URL: `https://your-org.atlassian.net`
- Auth: Atlassian account email + API token
- Generate token at [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
- Connection test validates against `/rest/api/3/myself`

> **Note:** Direct browser → ADO/Jira calls are blocked by CORS in most configurations. Connection tests validate credentials; in a production deployment, API calls route through a backend proxy. The test data generators let you run full analyses without a live connection today.

---

## Deployment

Every push to `main` auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`.

To deploy your own fork:
1. Fork the repo
2. Go to **Settings → Pages** → Source: GitHub Actions
3. Push to `main` — the workflow handles the rest

---

## Roadmap

- [ ] Backend proxy for live ADO/Jira data pull (removes CORS limitation)
- [ ] Real-time lane duration data (time in Dev Review, QA)
- [ ] Velocity trend chart (last 6 sprints)
- [ ] GitHub PR cycle time integration
- [ ] Slack channel notes auto-import
- [ ] Confluence doc linkage
- [ ] Power BI velocity dashboard export

---

## Background

Built as a side project to solve a real problem: retros that spend the first 20 minutes figuring out what happened instead of talking about how to improve. The AI handles the archaeology; the team handles the conversation.

The stack intentionally stays simple — React, no backend, deploys anywhere. The goal is a tool any Scrum team can fork, configure with their own API key, and run in an afternoon.

---

## License

MIT
