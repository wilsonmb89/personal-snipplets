export interface InterceptorRequest {
  encryptionData: {
    publicKey: string;
    diffTime: number;
  };
  request?: {
    body: Record<string, string>;
    headers: Record<string, string>;
  };
}

export interface InterceptorResponse {
  headers: Record<string, string>;
  body: Record<string, string> | string;
  decryptBody: (cypherResponse: string) => Record<string, unknown> | null;
}
