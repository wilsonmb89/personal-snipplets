import { LoginOptionsEnum } from '../../new-app/modules/login/components/login-form/login-form';

export class LoginData {
  identificationType: string;
  identificationNumber: number;
  password: string;
  lastDigitDebitCard?: number;
  type?: LoginOptionsEnum;
  tokenMFA?: string;
  tokenRecaptcha?: string;
}
