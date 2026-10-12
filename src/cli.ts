#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { runFullMatrix, runProbe } from './engine.js';
import { countCritical } from './analysis/summarize-results.js';
import { resultsToJson } from './reporters/json.js';
import { formatProbeHeader } from './reporters/table.js';

const program = new Command();
program.name('hx-cors').description('Advanced CORS misconfiguration probe matrix').version('1.0.0');

program
  .command('matrix')
  .description('Run full origin / preflight probe matrix against a URL')
  .argument('<url>', 'endpoint URL (include path if API)')
  .option('--json', 'JSON output')
  .action(async (url: string, opts: { json?: boolean }) => {
    const results = await runFullMatrix(url);
    if (opts.json) {
      console.log(resultsToJson(results));
      return;
    }
    for (const r of results) {
      console.log(formatProbeHeader(r));
      console.log(`  HTTP ${r.status} ACAO=${r.acao ?? '-'} ACAC=${r.acac ?? '-'}`);
      for (const f of r.findings) {
        const c =
          f.severity === 'critical' ? chalk.red : f.severity === 'high' ? chalk.yellow : chalk.dim;
        console.log(`  ${c(`[${f.severity}] ${f.message}`)}`);
      }
    }
    process.exit(countCritical(results) > 0 ? 2 : 0);
  });

program
  .command('probe')
  .description('Single custom origin probe')
  .argument('<url>')
  .requiredOption('-o, --origin <origin>', 'Origin header value')
  .option('--cred', 'Send credentialed-style Cookie header')
  .action(async (url: string, opts: { origin: string; cred?: boolean }) => {
    const r = await runProbe(url, {
      name: 'custom',
      origin: opts.origin,
      method: 'GET',
      useCredentials: Boolean(opts.cred),
    });
    console.log(resultsToJson([r]));
    process.exit(r.findings.some((f) => f.severity === 'critical') ? 2 : 0);
  });

program.parse();
