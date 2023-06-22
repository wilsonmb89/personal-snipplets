export class GetOtpReq {
  refType: string;
  name: string;
  operator: string;
  operationType: string;
}

export class ValidateOtpReq {
  refType: string;
  otpValue: string;
  operator: string;
  operationType: string;
}

export enum OtpRefType {
  REGISTRO = '01'
}

export enum OtpName {
  REGISTRO_PB = 'REG',
  LOGIN_PB = 'LOGIN'
}
