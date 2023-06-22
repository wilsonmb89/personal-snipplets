export class TokenValidationRs {

    constructor(
        public accessToken: string,
        public dateTime: string,
        public isBlocked: boolean,
        public isValid: boolean,
        public method: string,
        public safeInfo: string,
        public name: string,
        public authCode: string
    ) {}
}
