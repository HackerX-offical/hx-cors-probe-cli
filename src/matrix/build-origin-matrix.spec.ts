import { buildOriginMatrix } from './build-origin-matrix.js';

describe('buildOriginMatrix', () => {
  it('includes probes', () => {
    expect(buildOriginMatrix('https://api.example.com/x').length).toBeGreaterThan(3);
  });
});
