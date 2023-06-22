import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { BillCovenant } from '../../../../app/models/bills/bill-covenant';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { filter } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { BdbNormalizeDiacriticDirective } from '../../../../directives/bdb-normalize-diacritic/bdb-normalize-diacritic';

@PageTrack({title: 'page-subscribe-bill-id'})
@IonicPage()
@Component({
  selector: 'page-subscribe-bill-id',
  templateUrl: 'subscribe-bill-id.html',
})
export class SubscribeBillIdPage {

  title: string;
  billIdForm: FormGroup;
  billCovenant: BillCovenant;
  abandonText = BdbConstants.ABANDON_PAY;
  navTitle = 'Inscripción de servicios';
  keyEventSubscription: Subscription;
  showBillImg: false;
  $showImgBillContainer: Observable<boolean>;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private navigation: NavigationProvider
  ) {
    this.billCovenant = this.bdbInMemory.getItemByKey(InMemoryKeys.BillCovenant);
    this.title = 'Ingresa el número del recibo';
    this.billIdForm = this.formBuilder.group({
      billId: ['', [Validators.required]]
    });

    this.$showImgBillContainer = !!this.billCovenant.image ?
      from(fetch(this.billCovenant.image, {mode: 'no-cors'}).then(value => true).catch(reason => false))
      : of(false);

  }

  ionViewWillEnter(): void {
    this.setKeyEventSubs();

  }

  ionViewWillLeave(): void {
    if (!!this.keyEventSubscription) {
      this.keyEventSubscription.unsubscribe();
    }
  }


  triggerBillAlias() {
    this.billCovenant.productId = this.billIdForm.get('billId').value;
    this.bdbInMemory.setItemByKey(InMemoryKeys.BillCovenant, this.billCovenant);
    this.navCtrl.push('SubscribeBillAliasPage');
  }

  onBackPressed() {
    this.navigation.onBackPressedCustPage(this.navCtrl, 'suscribe%bill%name');
  }

  onAbandonClicked() {
    this.navCtrl.setRoot('PaymentsMainPage', {
      tab: 'bills'
    }, {
      animate: true,
      animation: 'ios-transition',
      direction: 'forward'
    });
  }

  private setKeyEventSubs(): void {
    this.keyEventSubscription = fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        filter(keyEvent => keyEvent.code === 'Enter')
      ).subscribe(key => {
        if (!this.billIdForm.controls.billId.invalid) {
          this.triggerBillAlias();
        }
      });
  }

  public toggleBillImg(ev): void {
    this.showBillImg = ev.detail;
  }


  public onTextChange(event): void {
    event.target.value = BdbNormalizeDiacriticDirective.normalizeDiacriticText(event.target.value);
    this.billIdForm.controls['billId'].setValue(event.target.value);
  }

}
