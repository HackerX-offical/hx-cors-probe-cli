import type { CorsResult } from '../types.js';

export function resultsToJson(results: CorsResult[]): string {
  return JSON.stringify(results, null, 2);
}
