import { runProbe } from './run-probe.js';

describe('runProbe', () => {
  it('uses mock fetch', async () => {
    const fetchImpl = async () =>
      new Response('', { status: 200, headers: { 'access-control-allow-origin': '*' } });
    const r = await runProbe('https://x', {
      name: 't',
      origin: 'https://o',
      method: 'GET',
      useCredentials: false,
    }, fetchImpl as typeof fetch);
    expect(r.findings.length).toBeGreaterThan(0);
  });
});
