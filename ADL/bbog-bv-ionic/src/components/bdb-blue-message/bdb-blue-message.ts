import { Component, Input } from '@angular/core';
import { IonicPage } from 'ionic-angular';

/**
 * Generated class for the BdbBlueMessageComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bdb-blue-message',
  templateUrl: 'bdb-blue-message.html'
})
export class BdbBlueMessageComponent {

  @Input() icon: string;
  @Input() message: string;

  constructor() {
  }

}
