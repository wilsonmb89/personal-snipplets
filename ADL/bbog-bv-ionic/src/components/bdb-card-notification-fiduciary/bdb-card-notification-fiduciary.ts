import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CardNotification } from '../../app/models/card-notification';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { ImagesUrlFiduciary } from '../../app/models/fiducia/images-url.enum';
import { ENV } from '@app/env';
import { TransactionsProvider } from '../../providers/transactions/transactions';

@Component({
  selector: 'bdb-card-notification-fiduciary',
  templateUrl: 'bdb-card-notification-fiduciary.html'
})
export class BdbCardNotificationFiduciaryComponent {

  @Input() cardNotification: CardNotification;
  @Output() clickCard = new EventEmitter();
  @Output() clickClose = new EventEmitter();

  textFiduciary: any;

  principalImg = ENV.FIDUCIARY_API_ASSETS + ImagesUrlFiduciary.FIRST_INVESTMENT_ICON;
  secondText: any = '';
  firstText: any = '';

  constructor(
    private bdbInMemory: BdbInMemoryProvider,
    private transactionProvider: TransactionsProvider,

  ) {
    this.transactionProvider.getTextFiduciary()
      .subscribe((resp: any) => {
          this.textFiduciary = resp;
          this.secondText =  resp.firstInvestmentNotificationCard.secondText + '<img src="assets/imgs/round-chevron-left-24-px-white.svg">';
          this.firstText = resp.firstInvestmentNotificationCard.firstText;
      });
  }

  executeEmit() {
    this.clickCard.emit();
  }

  close() {
    this.clickClose.emit();
  }
}
