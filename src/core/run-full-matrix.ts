import { buildOriginMatrix } from '../matrix/build-origin-matrix.js';
import type { CorsResult } from '../types.js';
import { runProbe } from './run-probe.js';

export async function runFullMatrix(url: string, fetchImpl?: typeof fetch): Promise<CorsResult[]> {
  const probes = buildOriginMatrix(url);
  const results: CorsResult[] = [];
  for (const p of probes) {
    try {
      results.push(await runProbe(url, p, fetchImpl));
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
