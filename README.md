# Sprint Retrospective Assistant — Azure DevOps Edition
> Powered by Claude AI · Built by Balrog Squad

**Live App:** https://thewatchtower2024-alt.github.io/sprint-retro-assistant/

## Quick Start (Local Dev)
```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

## How to Use
| Tab | Purpose |
|-----|---------|
| **Sprint Data** | Paste Teams channel exports + ADO work items |
| **AI Analysis** | Claude surfaces wins, blockers, improvements |
| **Talking Points** | Add team context to each discussion point |
| **Sprint Summary** | Velocity, PBI/Bug ratio, health indicators |

## ADO Work Item Format
```
PBI #1842: Market Lens Export [Closed] Effort: 8pts — Assigned: Sarah
Bug #1833: Login Timeout P1 [Closed] Effort: 3pts — Assigned: Mike
Task #1880: Security Master Mapping [Closed] Effort: 3pts
Iteration: Sprint 42 | Planned: 46pts | Completed: 31pts | Team: Balrog Squad
```

## Deploy
Every push to `main` auto-deploys via GitHub Actions → GitHub Pages.
