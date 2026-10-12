export function parseCorsHeaders(headers: Headers) {
  return {
    acao: headers.get('access-control-allow-origin'),
    acac: headers.get('access-control-allow-credentials'),
    acam: headers.get('access-control-allow-methods'),
    acah: headers.get('access-control-allow-headers'),
  };
}
