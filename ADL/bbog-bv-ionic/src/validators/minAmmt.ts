import { FormControl } from '@angular/forms';

export class MinAmmtValidator {
  static isValid(control: FormControl): any {
    if (control.value !== '' && control.value !== undefined) {
      const ammt: number = +control.value.toString().replace(/\D+/g, '');
      if (ammt > 0) {
        return null;
      }
    }
    return {invalid: true};
  }
}

export class NonZeroAmtValidator {
  static isValid(control: FormControl): any {
    if (control.value !== '' && control.value !== undefined) {
      let [intPart, decimalPart] = `${control.value}`.split('.');
      intPart = intPart.replace(/\D+/g, '');
      decimalPart = !!decimalPart ? `.${decimalPart.replace(/\D+/g, '')}` : '';
      const ammt = +(intPart.replace(/^0+/, '').concat(decimalPart));
      if (ammt >= 0.1) {
        return null;
      }
    }
    return { invalid: true };
  }
}
