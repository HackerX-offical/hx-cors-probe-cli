import type { CorsProbe, CorsResult } from '../types.js';
import { classifyCors } from '../analysis/classify-cors.js';
import { buildProbeHeaders } from './build-probe-request.js';

export async function runProbe(
  url: string,
  probe: CorsProbe,
  fetchImpl: typeof fetch = fetch,
): Promise<CorsResult> {
  const headers = buildProbeHeaders(probe);
  const init: RequestInit = {
    method: probe.method,
    headers,
    redirect: 'manual',
    signal: AbortSignal.timeout(20000),
  };
  const res = await fetchImpl(url, init);
  return classifyCors(probe, res.status, res.headers);
}
