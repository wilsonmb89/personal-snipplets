import { ButtonRs } from './modal-rs/button-rs';

export class ErrorDTO {

    constructor(public title: string,
        public msgType: string,
        public message: string,
        public button: ButtonRs) {}
}
