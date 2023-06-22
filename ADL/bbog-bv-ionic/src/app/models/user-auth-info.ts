export class UserAuthInfo {
  constructor(public documentType: string,
              public documentNumber: string,
              public pin: string,
              public verifyReCaptcha: string,
              public threatMetrixUuid: string,
              public dt: string,
              public dn: string,
              public name?: string
  ) {
  }

}

