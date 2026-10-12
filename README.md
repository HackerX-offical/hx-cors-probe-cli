# hx-cors-probe-cli

**CORS misconfiguration matrix** — reflection, null origin, credentialed wildcards, and
preflight oracles for authorized API assessments.

## Why this exists

Browser-side bugs often come down to `Access-Control-Allow-Origin` mistakes. Manual Burp
Repeater tabs miss combinations. This CLI fires a structured origin matrix against one
URL and classifies findings by severity for reporting and CI gates.

## Features

- Full `matrix` command with multiple synthetic origins and methods
- Single `probe` with custom `-o` origin and optional credentialed cookie header
- Parses ACAO / ACAC / ACAM headers into structured findings
- Exit code `2` when any **critical** finding is present

## Install

```bash
git clone https://github.com/HackerX-offical/hx-cors-probe-cli.git
cd hx-cors-probe-cli
npm install
npm run build
npm link   # optional: global hx-cors
```

## Quick start

```bash
hx-cors matrix https://api.target.example/v1/user
hx-cors probe https://api.target.example/v1/user -o https://evil.example --cred
hx-cors matrix https://api.target.example --json
```

## Output

| Mode     | Description                                                |
| -------- | ---------------------------------------------------------- |
| Default  | Per-probe block: status, ACAO/ACAC, colored severity lines |
| `--json` | Array of probe results with `findings[]`                   |
| Exit `2` | At least one critical CORS misconfiguration                |

## Develop

```bash
npm run format
npm run build
npm test
npm run test:integration   # optional live URL probes
npm run format:check
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for module layout and extension points.

## Ethics

Use only on systems and content you are **authorized** to test. See
[SECURITY.md](./SECURITY.md).

## License

Licensed under the [HackerX License](./LICENSE). Redistributions must retain copyright,
license text, and [NOTICE](./NOTICE) attribution per the license terms.
