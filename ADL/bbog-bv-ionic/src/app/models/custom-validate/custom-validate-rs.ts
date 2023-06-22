export class   CustomValidateRs {
    constructor(
        public customerEnabled?: boolean,
        public message?: string,
        public code?: number,
        public errorId?: string
    ) { }
}
