export type CorsSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface CorsProbe {
  name: string;
  origin: string | null;
  method: string;
  useCredentials: boolean;
}

export interface CorsFinding {
  severity: CorsSeverity;
  id: string;
  message: string;
}

export interface CorsResult {
  probe: CorsProbe;
  status: number;
  acao: string | null;
  acac: string | null;
  acam: string | null;
  acah: string | null;
  findings: CorsFinding[];
}
