# hx-cors-probe-cli

**CORS attack-surface mapper** for authorized API assessments. Runs a matrix of real browser semantics: reflected origins, `null`, subdomain tricks, HTTP downgrade siblings, and **credentialed** `OPTIONS` preflights.

## Real-world value

| Finding class | Operator impact |
|---------------|-----------------|
| Reflected `Access-Control-Allow-Origin` | Cross-origin data theft from victim browsers |
| `null` origin allowed | Sandboxed document / legacy Flash-style chains |
| `ACAC: true` + reflection | Session cookie readable from attacker origin |
| Wildcard + creds probe | Surfaces broken middleware stacks |

```bash
hx-cors matrix https://api.target.com/v1/user
hx-cors probe https://api.target.com -o https://attacker.test --cred
```

Pair with `hx-scope` before any probe. MIT — HackerX Official.
