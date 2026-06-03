# E2E / integration tests (FA-5)

## Prerequisites

1. Start API: `dotnet run --project ../api/src/FactoryAi.Api`
2. Start web: `npm start` (from `web/`)
3. Install browsers: `npm run e2e:install`

## Run

```bash
E2E_RUN_INTEGRATION=1 npm run e2e
```

Optional env:

| Variable | Default |
|----------|---------|
| `E2E_BASE_URL` | `http://localhost:4200` |
| `E2E_API_URL` | `http://localhost:5000` |

Contract reference: `docs/contracts/workflow-api.contract.json`
