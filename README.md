# Factory AI Web (Angular 20)

Frontend for the RL AI Software Factory dashboard.

**GitHub:** [RL-AI-Software-Factory/factory-dashboard-web](https://github.com/RL-AI-Software-Factory/factory-dashboard-web)

This folder is typically cloned as `factory-ai-web` beside the orchestrator repo.

```bash
npm install
npm start          # http://localhost:4200
npm test
npm run e2e      # requires E2E_RUN_INTEGRATION=1 + API running
```

API contract: `docs/contracts/workflow-api.contract.json` (aligned with `factory-dashboard-api` FA-5 workflow endpoints).

Cursor agent prompts: `.cursor/prompts/`
