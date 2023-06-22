export interface AuthState {
  accessToken: string;
  tokenBank: string;
  fullName: string;
  identificationNumber: string;
  identificationType: string;
  telephone: string;
  email: string;
  sessionId: string;
  hasActiveToken: boolean;
  tokenVersion: string;
  cdtOwner: string;
  traceability: string;
}

export const initialState: AuthState = {
  accessToken: null,
  tokenBank: null,
  fullName: null,
  identificationNumber: null,
  identificationType: null,
  telephone: null,
  email: null,
  sessionId: null,
  hasActiveToken: null,
  tokenVersion: null,
  cdtOwner: null,
  traceability: null
};
