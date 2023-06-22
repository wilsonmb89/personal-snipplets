import {Component, Input} from '@angular/core';
import {Pocket} from '../../new-app/root/products/pockets/models/pocket';

@Component({
  selector: 'pocket-card',
  templateUrl: 'pocket-card.html'
})
export class PocketCardComponent {

  @Input() pocket: Pocket;
  @Input() loading: boolean;


}
