import { Component, Input } from '@angular/core';
import { PCardModel } from '../../providers/cards-mapper/cards-mapper';

@Component({
  selector: 'bdb-account-detail',
  templateUrl: 'bdb-account-detail.html'
})
export class BdbAccountDetailComponent {

  @Input() item: PCardModel;
  @Input() showError = false;
  error = 'Hubo un error al consultar los detalles.';

  constructor() { }

}
