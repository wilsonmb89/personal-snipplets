import { PageData } from '@secure-key/constants/secure-key-constants';

export interface Customer {
  identificationType: string;
  identificationNumber: string;
  remoteAddress: string;
  channel: string;
  terminalId: string;
}

export interface RegisterBasicData {
  isCustomer: boolean;
  hasSecureKey: boolean;
  hasProducts: boolean;
  name: string;
  phone: string;
  email: string;
}

export interface CustomerState {
  customer: Customer;
  flowData: PageData;
  registerBasicData: RegisterBasicData;
}

export const initialState: CustomerState = {
  customer: {
    identificationType: '',
    identificationNumber: '',
    remoteAddress: '',
    channel: '',
    terminalId: ''
  },
  flowData: {
    flow: '',
    title: '',
    clientValidation: '',
    userValidationPath: '',
    getOtpPath: '',
    otpValidationPath: '',
    productValidationPath: '',
    createKeyPath: ''
  },
  registerBasicData: {
    isCustomer: false,
    hasSecureKey: false,
    hasProducts: false,
    name: '',
    phone: '',
    email: ''
  }
};
