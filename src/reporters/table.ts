import chalk from 'chalk';
import type { CorsResult } from '../types.js';

export function formatProbeHeader(r: CorsResult): string {
  return chalk.bold(
    `[${r.probe.name}] ${r.probe.method} Origin=${r.probe.origin ?? '(none)'}`,
  );
}
