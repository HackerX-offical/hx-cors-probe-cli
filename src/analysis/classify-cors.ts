import type { CorsProbe, CorsResult } from '../types.js';
import { parseCorsHeaders } from './parse-cors-headers.js';

export function classifyCors(probe: CorsProbe, status: number, headers: Headers): CorsResult {
  const { acao, acac, acam, acah } = parseCorsHeaders(headers);
  const findings: CorsResult['findings'] = [];

  if (acao === '*') {
    findings.push({
      severity: probe.useCredentials ? 'critical' : 'medium',
      id: 'wildcard-acao',
      message: probe.useCredentials
        ? 'Wildcard ACAO with credentialed probe'
        : 'Access-Control-Allow-Origin: *',
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
      message: 'null Origin allowed',
    });
  }

  if (acac?.toLowerCase() === 'true' && acao && acao !== 'null') {
    if (acao === '*' || probe.origin?.includes('evil')) {
      findings.push({
        severity: 'critical',
        id: 'creds-with-reflect',
        message: 'ACAC true with reflected or wildcard ACAO',
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
