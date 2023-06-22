import { RootState } from '..';
import { AuthState } from './auth.entity';

export const authStateSelector = (state: RootState): AuthState => state.authState;
