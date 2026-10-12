import type { CorsResult } from '../types.js';

export function countCritical(results: CorsResult[]): number {
  return results.reduce(
    (n, r) => n + r.findings.filter((f) => f.severity === 'critical' || f.severity === 'high').length,
    0,
  );
}
