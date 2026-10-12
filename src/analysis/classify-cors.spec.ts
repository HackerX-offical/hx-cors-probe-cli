import { classifyCors } from './classify-cors.js';

describe('classifyCors', () => {
  it('flags reflected evil origin', () => {
    const h = new Headers({ 'access-control-allow-origin': 'https://evil-correlation.example' });
    const r = classifyCors(
      {
        name: 't',
        origin: 'https://evil-correlation.example',
        method: 'GET',
        useCredentials: false,
      },
      200,
      h,
    );
    expect(r.findings.some((f) => f.id === 'reflected-origin')).toBe(true);
  });
});
