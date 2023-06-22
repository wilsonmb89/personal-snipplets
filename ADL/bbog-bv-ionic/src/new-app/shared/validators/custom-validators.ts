import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {

    static passwordMatchValidator(control: AbstractControl) {
        const newPassword: string = control.get('newPassword').value; // get password from our password form control
        const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
        if (control.get('confirmPassword').hasError('NoPassswordMatch')) {
            delete control.get('confirmPassword').errors['NoPassswordMatch'];
            control.get('confirmPassword').updateValueAndValidity();
        }
        // compare is the password math
        if (!!newPassword && !!confirmPassword && newPassword !== confirmPassword) {
            // if they don't match, set an error in our confirmPassword form control
            control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
        }
    }

    static emailValidator(control: AbstractControl): ValidationErrors {
        if (!!control.value) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const valResult = re.test(control.value);
            if (!valResult) {
                return { InvalidEmail: true };
            }
            return null;
        }
    }
}
