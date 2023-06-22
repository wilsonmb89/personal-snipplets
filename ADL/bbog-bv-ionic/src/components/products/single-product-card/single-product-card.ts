import { Component, Input, EventEmitter, Output } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BdbUtilsProvider } from '../../../providers/bdb-utils/bdb-utils';
import { PCardModel } from '../../../providers/cards-mapper/cards-mapper';
import { BdbConstants } from '../../../app/models/bdb-generics/bdb-constants';

@Component({
  selector: 'single-product-card',
  templateUrl: 'single-product-card.html',
  animations: [
    trigger('upAndDown', [
      state('true', style({
        'height': '80px',
        'min-height': '80px'
      })),
      state('false', style({
      })),
      transition('true => false', [
        animate('200ms')
      ]),
      transition('false => true', [
        animate('200ms')
      ]),
    ]),
    trigger('upAndDownAvailable', [
      state('true', style({
        'height': '136px',
        'min-height': '136px'
      })),
      state('false', style({
      })),
      transition('true => false', [
        animate('200ms')
      ]),
      transition('false => true', [
        animate('200ms')
      ]),
    ]),
    trigger('openClose', [
      state('true', style({
        'display': 'none'
      })),
      state('false', style({
      })),
      transition('true => false', [
        animate('200ms')
      ]),
      transition('false => true', [
        animate('200ms')
      ]),
    ])
  ],
})
export class SingleProductCardComponent {

  @Input() p: PCardModel;
  @Output() onCardClicked = new EventEmitter();
  @Output() onPayClicked = new EventEmitter();
  @Input() privateMode = false;

  constructor(private bdbUtils: BdbUtilsProvider) {
  }

  cardClicked() {
    this.onCardClicked.emit(this.p.product);
  }

  payClicked(e) {
    e.stopPropagation();
    this.onPayClicked.emit(this.p.product);
  }

  public validPayment(p): boolean {
    return p.product.category === BdbConstants.TARJETA_CREDITO_BBOG ||
      p.product.productType === BdbConstants.ATH_CREDISERVICE_ALS_PNATURAL ||
      p.product.productType === BdbConstants.ATH_CREDISERVICE_AP;
  }
}
