import { RootState } from '@store/index';
import { LoginRequest } from './login.entity';

export const getLoginRequest = (state: RootState): LoginRequest => state.loginState;
