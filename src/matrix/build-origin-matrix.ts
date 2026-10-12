import type { CorsProbe } from '../types.js';

export function buildOriginMatrix(targetUrl: string): CorsProbe[] {
  const u = new URL(targetUrl);
  const host = u.hostname;
  return [
    { name: 'reflect-evil', origin: 'https://evil-correlation.example', method: 'GET', useCredentials: false },
    { name: 'null-origin', origin: 'null', method: 'GET', useCredentials: false },
    { name: 'target-origin', origin: u.origin, method: 'GET', useCredentials: true },
    { name: 'subdomain-prefix', origin: `https://evil${host}`, method: 'GET', useCredentials: false },
    { name: 'http-downgrade', origin: `http://${host}`, method: 'GET', useCredentials: false },
    { name: 'suffix-dot', origin: `https://${host}.evil.example`, method: 'GET', useCredentials: false },
    { name: 'preflight-post', origin: 'https://evil-correlation.example', method: 'OPTIONS', useCredentials: true },
  ];
}
