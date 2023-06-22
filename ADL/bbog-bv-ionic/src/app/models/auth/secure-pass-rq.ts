export class SecurePassRq {
  constructor(
    public documentType: string,
    public documentNumber: string,
    public pin: string,
    public verifyReCaptcha: string,
    public uuid: string
  ) { }
}

export class DeviceRsa {
  constructor(
    public devicePrint: string,
    public deviceTokenCookie: string) { }
}

export class RsaSecurePassRq {

  constructor(
    public device: DeviceRsa,
    public pinCredentials: SecurePassRq,
    public succesfull: boolean) { }
}

export class CardCredencialRq extends SecurePassRq {
  public debitCardId: string;
}


export class RsaDebitCardRq {

  constructor(
    public device: DeviceRsa,
    public cardCredentials: CardCredencialRq) { }
}
