import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { ProgressBarProvider } from '../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { AccessDetailProvider } from '../../providers/access-detail/access-detail';

@Component({
  selector: 'payment-navigation-header',
  templateUrl: 'payment-navigation-header.html'
})
export class PaymentNavigationHeaderComponent {

  @Input() text = BdbConstants.ABANDON_TRANS;
  @Output() onBackPressed: EventEmitter<any> = new EventEmitter();
  @Output() onAbandonClicked: EventEmitter<any> = new EventEmitter();

  constructor(
    private appCtrl: App,
    public navCtrl: NavController,
    private progressBar: ProgressBarProvider,
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private accessDetail: AccessDetailProvider
  ) { }

  backPressed() {
    this.onBackPressed.emit();
    const origin = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.PaymentOrigin);

    if (origin !== 'recharge' && origin !== 'limits') {
      this.progressBar.resetObject();
    } else if (origin === 'limits') {
      this.progressBar.resetObjectTwoSteps();
      this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Producto');
      this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Topes');
    }
    if (this.accessDetail.isOriginSelected() && origin !== 'recharge') {
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }
  }

  abandonClicked() {
    this.onAbandonClicked.emit();
  }
}
