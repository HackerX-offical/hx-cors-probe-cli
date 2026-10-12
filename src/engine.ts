export type CorsSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface CorsProbe {
  name: string;
  origin: string | null;
  method: string;
  useCredentials: boolean;
}

export interface CorsResult {
  probe: CorsProbe;
  status: number;
  acao: string | null;
  acac: string | null;
  acam: string | null;
  acah: string | null;
  findings: Array<{ severity: CorsSeverity; id: string; message: string }>;
}

export function buildOriginMatrix(targetUrl: string): CorsProbe[] {
  const u = new URL(targetUrl);
  const host = u.hostname;
  const probes: CorsProbe[] = [
    { name: 'reflect-evil', origin: 'https://evil-correlation.example', method: 'GET', useCredentials: false },
    { name: 'null-origin', origin: 'null', method: 'GET', useCredentials: false },
    { name: 'target-origin', origin: u.origin, method: 'GET', useCredentials: true },
    { name: 'subdomain-prefix', origin: `https://evil${host}`, method: 'GET', useCredentials: false },
    { name: 'http-downgrade', origin: `http://${host}`, method: 'GET', useCredentials: false },
    { name: 'suffix-dot', origin: `https://${host}.evil.example`, method: 'GET', useCredentials: false },
    { name: 'preflight-post', origin: 'https://evil-correlation.example', method: 'OPTIONS', useCredentials: true },
  ];
  return probes;
}

function parseCorsHeaders(headers: Headers) {
  return {
    acao: headers.get('access-control-allow-origin'),
    acac: headers.get('access-control-allow-credentials'),
    acam: headers.get('access-control-allow-methods'),
    acah: headers.get('access-control-allow-headers'),
  };
}

export function classifyCors(
  probe: CorsProbe,
  status: number,
  headers: Headers,
): CorsResult {
  const { acao, acac, acam, acah } = parseCorsHeaders(headers);
  const findings: CorsResult['findings'] = [];

  if (acao === '*') {
    findings.push({
      severity: probe.useCredentials ? 'critical' : 'medium',
      id: 'wildcard-acao',
      message:
        probe.useCredentials
          ? 'Wildcard ACAO with credentialed probe — browsers block, but misconfigs often leak via exceptions'
          : 'Access-Control-Allow-Origin: * — any site can read responses (no credentials)',
    });
  }

  if (probe.origin && acao === probe.origin) {
    findings.push({
      severity: probe.origin.includes('evil') ? 'critical' : 'high',
      id: 'reflected-origin',
      message: `Server reflects attacker Origin: ${probe.origin}`,
    });
  }

  if (probe.origin === 'null' && acao === 'null') {
    findings.push({
      severity: 'high',
      id: 'null-origin-allowed',
      message: 'null Origin allowed — sandboxed iframe / PDF context attacks',
    });
  }

  if (acac?.toLowerCase() === 'true' && acao && acao !== 'null') {
    if (acao === '*' || probe.origin?.includes('evil')) {
      findings.push({
        severity: 'critical',
        id: 'creds-with-reflect',
        message: 'ACAC true with reflected or wildcard ACAO — session theft class',
      });
    }
  }

  if (probe.method === 'OPTIONS' && status >= 200 && status < 300 && acam) {
    findings.push({
      severity: 'info',
      id: 'preflight-ok',
      message: `Preflight answered: methods=${acam}`,
    });
  }

  return { probe, status, acao, acac, acam, acah, findings };
}

export async function runProbe(
  url: string,
  probe: CorsProbe,
  fetchImpl: typeof fetch = fetch,
): Promise<CorsResult> {
  const headers: Record<string, string> = {
    'User-Agent': 'hx-cors-probe-cli/1.0 (+authorized assessment)',
  };
  if (probe.origin !== null) headers.Origin = probe.origin;
  if (probe.useCredentials) headers.Cookie = 'hx_cors_probe=1';

  const init: RequestInit = {
    method: probe.method,
    headers,
    redirect: 'manual',
    signal: AbortSignal.timeout(20000),
  };
  if (probe.method === 'OPTIONS') {
    headers['Access-Control-Request-Method'] = 'POST';
    headers['Access-Control-Request-Headers'] = 'X-Hx-Cors-Probe';
  }

  const res = await fetchImpl(url, init);
  return classifyCors(probe, res.status, res.headers);
}

export async function runFullMatrix(url: string): Promise<CorsResult[]> {
  const probes = buildOriginMatrix(url);
  const results: CorsResult[] = [];
  for (const p of probes) {
    try {
      results.push(await runProbe(url, p));
    } catch (err) {
      results.push({
        probe: p,
        status: 0,
        acao: null,
        acac: null,
        acam: null,
        acah: null,
        findings: [
          {
            severity: 'info',
            id: 'probe-error',
            message: err instanceof Error ? err.message : String(err),
          },
        ],
      });
    }
  }
  return results;
}
