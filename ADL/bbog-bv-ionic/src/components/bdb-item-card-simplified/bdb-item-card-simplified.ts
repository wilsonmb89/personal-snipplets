import {Component, Input} from '@angular/core';
import {BdbItemCardModel} from '../../components/bdb-item-card-v2/bdb-item-card-v2';

@Component({
  selector: 'bdb-item-card-simplified',
  templateUrl: 'bdb-item-card-simplified.html'
})
export class BdbItemCardSimplifiedComponent {

  @Input() item: BdbItemCardModel;

  constructor() {
  }

}
