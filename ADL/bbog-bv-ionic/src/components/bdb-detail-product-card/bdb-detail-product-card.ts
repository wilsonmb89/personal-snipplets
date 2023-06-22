import { Component, Input } from '@angular/core';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { ProductDetail } from '../../app/models/products/product-model';
import { AccountBalance } from '../../app/models/enrolled-transfer/account-balance';
import { PCardModel } from '../../providers/cards-mapper/cards-mapper';

@Component({
  selector: 'bdb-detail-product-card',
  templateUrl: 'bdb-detail-product-card.html'
})
export class BdbDetailProductCardComponent {

  @Input() item: PCardModel;
  @Input() showButtons: boolean;
  @Input() isSticky: boolean;
  @Input() buttons: Array<any>;
  @Input() showError = false;

  errorMsg = 'No es posible mostrar información adicional en este momento.';

  constructor() { }

}
