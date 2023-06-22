import { Component } from '@angular/core';

/**
 * Generated class for the SecondMethodComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'second-method',
  templateUrl: 'second-method.html'
})
export class SecondMethodComponent {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }

}
