import { loginApi } from './login.api';
import { LoginConfig, LoginCredentials, LoginOptions, LoginRequest, LoginSuccess } from './login.model';
import { rsaFunc } from '../utils/rsa.js';
import axios from 'axios';
import { createInterceptors } from '../interceptors';
import { MPFingerprint } from '../utils/fontsfp';

export const loginSetup = (
  config: LoginConfig
): { login: (credentials: LoginCredentials, options?: LoginOptions | undefined) => Promise<LoginSuccess> } => {
  return {
    login: login.bind(null, config)
  };
};

export const login = async (
  config: LoginConfig,
  credentials: LoginCredentials,
  options?: LoginOptions
): Promise<LoginSuccess> => {
  const fp = await MPFingerprint.getData();
  const request: LoginRequest = {
    customer: {
      identificationType: credentials.identificationType,
      identificationNumber: credentials.identificationNumber,
      remoteAddress: '127.0.0.1',
      channel: 'PB'
    },
    password: credentials.password,
    recaptchaToken: options?.recaptchaToken || null,
    deviceFingerprint: rsaFunc(),
    tokenCookie: options?.tokenCookie || null,
    mobileToken: options?.mobileToken || null,
    numberCard: credentials.numberCard || null,
    authenticationExtraInfo: { fraudDetectorFingerPrint: fp } || null
  };

  const axiosADLInstance = axios.create({ baseURL: config.host });
  const interceptors = await createInterceptors(config.encryptBody, axiosADLInstance);

  try {
    return await loginApi(request, axiosADLInstance);
  } finally {
    interceptors.destroy();
  }
};
