import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'credit-card-component',
  templateUrl: 'credit-card.html'
})
export class CreditCardComponent implements OnInit, OnChanges {

  @ViewChild('cardNumber') div: ElementRef;
  @Input() category: string;
  @Input() fullFields: boolean;
  @Input() isRotated: boolean;
  @Input() cardNumber: string;
  @Input() customerName = '';
  @Input() goodThruDate = '';
  @Input() cvv = '';
  @Input() cardType: string;
  @Input() smallCard = true;

  private rotate = '';
  private categoryColor = '--classic';
  private cardLogo = 'assets/imgs/visa-white-logo.svg';
  private lastDigits = [];

  constructor() { }

  ngOnInit(): void {
    this.getCardData();
  }

  ngOnChanges(): void {
    this.getCardData();
  }

  private getCardData(): void {
    this.categoryColor = `--${this.category}`;
    this.rotate = this.isRotated ? '--rotate' : '';
    this.cardLogo = this.cardType === 'mastercard' ? 'assets/imgs/mastercard-logo.svg' : 'assets/imgs/visa-white-logo.svg';
    this.lastDigits = this.fullFields
      ? this.cardNumber.replace(/ /gi, '').substr(0, 16).split('')
      : this.cardNumber.replace(/ /gi, '').substr(0, 8).split('');
  }
}
