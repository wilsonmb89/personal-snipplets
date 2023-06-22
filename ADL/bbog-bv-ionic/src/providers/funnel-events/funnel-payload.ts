
export interface FunnelPayload {
  journey: string;
  step: string;
  httpStatus?: string;
  exitCode?: string;
  description?: string;
}
