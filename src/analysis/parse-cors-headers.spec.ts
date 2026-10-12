import { parseCorsHeaders } from './parse-cors-headers.js';

describe('parseCorsHeaders', () => {
  it('reads acao', () => {
    expect(parseCorsHeaders(new Headers({ 'access-control-allow-origin': '*' })).acao).toBe('*');
  });
});
