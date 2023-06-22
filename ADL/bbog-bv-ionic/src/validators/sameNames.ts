import {AbstractControl, ValidatorFn} from '@angular/forms';

  export function isValidName( currentPocketName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value !== currentPocketName) {
        return null;
      }
      return {invalid: true};
    };
  }

