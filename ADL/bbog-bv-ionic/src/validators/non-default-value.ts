import { Validators, FormControl } from '@angular/forms';

export class NonDefaultValue extends Validators {
    static checkValue(control: FormControl) {
        if (control.value && control.value !== 'def') {
            return null;
        } else {
            return control;
        }
    }
}
