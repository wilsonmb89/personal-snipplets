interface TokenState {
  hasTokenBeenSent: boolean;
  isTokenValid: boolean;
  attemps: number;
}

export const initialState: TokenState = {
  isTokenValid: false,
  hasTokenBeenSent: null,
  attemps: 3
};
