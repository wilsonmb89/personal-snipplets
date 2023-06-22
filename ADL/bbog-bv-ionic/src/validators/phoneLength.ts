import { FormControl } from '@angular/forms';

export class PhoneLengthValidator {
  static isValid(control: FormControl) {
    if (control.value !== undefined) {
      if (control.value.toString().length === 10) {
        return null;
      }
    }
    return { invalid: true };
  }
}
