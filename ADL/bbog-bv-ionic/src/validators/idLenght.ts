import { FormControl } from '@angular/forms';

export class IdLengthValidator {
    static isValid(control: FormControl): any {
        if (control.value.length < 5) {
            return{
                'El número de cedula debe tener entre 5 y 10 digitos' : true
            };
        }
        return null;
    }
}
