export class TokenValidationRq {

    constructor(
        public documentType: string,
        public documentNumber: string,
        public otp: string,
        public threatMetrixUuid?: string,
        public ignoreFirstAuthMethod?: boolean
    ) {}
}
