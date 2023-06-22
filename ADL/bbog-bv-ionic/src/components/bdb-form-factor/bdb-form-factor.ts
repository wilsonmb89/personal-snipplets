import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'bdb-form-factor',
    templateUrl: 'bdb-form-factor.html'
})
export class BdbFormFactorComponent {

    formFactor: FormGroup;
    private _typeFactor = '';

    @Output() onSubmit = new EventEmitter<any>();
    @Output() onResend = new EventEmitter<any>();
    @Input() showResend = false;
    @Input() titleToken;
    @Input() detailToken;
    @Input() showError: boolean;
    @Input() messageError: string;

    @Input()
    set typeFactor(typeFactor) {
        this._typeFactor = typeFactor;
    }


    constructor(private formBuilder: FormBuilder) {
        this.buildForm();
    }

    private buildForm() {
        this.formFactor = this.formBuilder.group(
            {
                token: ['',
                    Validators.compose([Validators.required, Validators.maxLength(6),
                    Validators.minLength(6),
                    Validators.pattern('[0-9]{0,}')])]
            }
        );
    }

    submit() {
        this.onSubmit.emit(this.formFactor.value);
        this.formFactor.reset();
    }

    resendToken() {
        this.onResend.emit({});
    }

}
