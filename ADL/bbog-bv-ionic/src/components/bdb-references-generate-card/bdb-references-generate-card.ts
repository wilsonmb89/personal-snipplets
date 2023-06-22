import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BdbItemCardModel} from '../bdb-item-card-v2/bdb-item-card-v2';

/**
 * Generated class for the BdbReferencesGenerateCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bdb-references-generate-card',
  templateUrl: 'bdb-references-generate-card.html'
})
export class BdbReferencesGenerateCardComponent {

  @Input() parentForm: FormGroup;
  @Input() item: BdbItemCardModel;

  constructor() {


  }

}
