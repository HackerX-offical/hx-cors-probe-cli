# hx-cors-probe-cli — architecture

## Purpose

Issues HTTP requests with crafted `Origin` headers (and optional preflight) against a
target URL, then classifies CORS response headers into engagement findings. Non-goals:
full browser automation or WAF bypass.

## High-level flow

```mermaid
flowchart LR
  CLI[cli.ts] --> Engine[engine.ts]
  Engine --> Matrix[matrix/build-origin-matrix]
  Matrix --> Run[core/run-probe]
  Run --> Classify[analysis/classify-cors]
  Classify --> Rep[reporters]
```

## Module map

| Path                                 | Responsibility                            |
| ------------------------------------ | ----------------------------------------- |
| `src/cli.ts`                         | `matrix` and `probe` commands, exit codes |
| `src/engine.ts`                      | Public `runFullMatrix` / `runProbe` entry |
| `src/core/run-full-matrix.ts`        | Orchestrate all probes for a URL          |
| `src/core/run-probe.ts`              | Single fetch with probe definition        |
| `src/core/build-probe-request.ts`    | Headers, method, credentials flag         |
| `src/matrix/build-origin-matrix.ts`  | Standard origin test cases                |
| `src/analysis/parse-cors-headers.ts` | Raw headers → ACAO fields                 |
| `src/analysis/classify-cors.ts`      | Rules → `CorsFinding` severities          |
| `src/analysis/summarize-results.ts`  | Critical counts for exit policy           |
| `src/reporters/`                     | JSON and table formatters                 |

## Extension

1. Add a case to `build-origin-matrix.ts` (new origin class or method).
2. Extend `classify-cors.ts` with a rule and matching unit test.
3. Keep live network in `tests/*.integration.test.ts` only.
4. Run `npm test` and `npm run format:check`.

## Testing strategy

- **Unit**: probe builder, classifier, parser, matrix (`*.spec.ts`) — mocked fetch.
- **Integration**: `jest.integration.config.js` — optional live targets documented in
  README.

## Ethics & scope

Authorized engagements only. See [SECURITY.md](./SECURITY.md).
