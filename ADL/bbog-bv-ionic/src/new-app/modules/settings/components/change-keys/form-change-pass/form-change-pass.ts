import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@app/shared/validators/custom-validators';
import { FormChangePass } from '../../../../../../new-app/modules/settings/models/change-keys.model';

@Component({
    selector: 'form-change-pass',
    templateUrl: 'form-change-pass.html'
})
export class FormChangePassComponent implements OnInit {

    formChangePass: FormGroup;
    @Output() onSubmit: EventEmitter<FormChangePass> = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {

        this.formChangePass = this.formBuilder.group({
            oldPassword: ['', [Validators.required]],
            newPassword: [null, Validators.compose([Validators.required])],
            confirmPassword: [null, Validators.compose([Validators.required])]
        }, {
            validator: CustomValidators.passwordMatchValidator
        });
    }

    inputPassHandle(ev: CustomEvent): void {
        const pulseInput = ev.target as any;
        pulseInput.type = pulseInput.type === 'text' ? 'password' : 'text';
        pulseInput.icon = pulseInput.type === 'text' ? 'view-1' : 'view-off';
    }

    onChangePass(): void {
        this.onSubmit.emit(this.formChangePass.value);
    }

}
