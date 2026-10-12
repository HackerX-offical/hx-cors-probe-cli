import { buildProbeHeaders } from './build-probe-request.js';

describe('buildProbeHeaders', () => {
  it('sets Origin', () => {
    const h = buildProbeHeaders({
      name: 'a',
      origin: 'https://o',
      method: 'GET',
      useCredentials: false,
    });
    expect(h.Origin).toBe('https://o');
  });
});
