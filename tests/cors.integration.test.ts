import { runProbe } from '../src/engine.js';

describe('live CORS', () => {
  it('probes example.com without crash', async () => {
    const r = await runProbe('https://example.com/', {
      name: 'live',
      origin: 'https://evil.example',
      method: 'GET',
      useCredentials: false,
    });
    expect(r.status).toBeGreaterThan(0);
  });
});
