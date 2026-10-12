import { countCritical } from './summarize-results.js';

describe('countCritical', () => {
  it('counts high findings', () => {
    expect(
      countCritical([
        {
          probe: { name: 'a', origin: 'o', method: 'GET', useCredentials: false },
          status: 200,
          acao: null,
          acac: null,
          acam: null,
          acah: null,
          findings: [{ severity: 'high', id: 'x', message: 'm' }],
        },
      ]),
    ).toBe(1);
  });
});
