import type { CorsProbe } from '../types.js';

export function buildProbeHeaders(probe: CorsProbe): Record<string, string> {
  const headers: Record<string, string> = {
    'User-Agent': 'hx-cors-probe-cli/1.0 (+authorized assessment)',
  };
  if (probe.origin !== null) headers.Origin = probe.origin;
  if (probe.useCredentials) headers.Cookie = 'hx_cors_probe=1';
  if (probe.method === 'OPTIONS') {
    headers['Access-Control-Request-Method'] = 'POST';
    headers['Access-Control-Request-Headers'] = 'X-Hx-Cors-Probe';
  }
  return headers;
}
