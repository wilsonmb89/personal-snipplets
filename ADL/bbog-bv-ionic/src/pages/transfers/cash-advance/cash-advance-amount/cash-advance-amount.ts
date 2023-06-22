import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { CashAdvanceInfo } from '../../../../app/models/cash-advance/cash-advance-info';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { Events } from 'ionic-angular';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { CatalogsEnum } from '../../../../new-app/core/services-delegate/list-parameters/enums/catalogs-enum';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { map, take } from 'rxjs/operators';

@PageTrack({ title: 'page-cash-advance-amount' })
@IonicPage()
@Component({
  selector: 'page-cash-advance-amount',
  templateUrl: 'cash-advance-amount.html',
})
export class CashAdvanceAmountPage {

  title: string;
  amountForm: FormGroup;
  formSubscription: Subscription;
  navTitle = 'Avances';
  private _funnel = this.funnelKeys.getKeys().cashAdvance;
  abandonText = BdbConstants.ABANDON_TRANS;
  cost$: Observable<string>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private progressBar: ProgressBarProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private navigation: NavigationProvider,
    private events: Events,
    private userFacade: UserFacade
    ) {
    this.title = '¿Cuanto vas a solicitar?';
    this.amountForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.minLength(1)]]
    });
    this.events.publish('srink', true);
  }

  ionViewWillEnter() {
    const cashInfo: CashAdvanceInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CashAdvanceInfo);
    this.getTransactionCost();
    this.setUpProgressBar(cashInfo);
    this.addFormChengeListener();
  }

  setUpProgressBar(cashInfo: CashAdvanceInfo) {
    const franchise = cashInfo.creditCard.franchise;
    this.progressBar.init(
      '',
      BdbConstants.PROGBAR_STEP_1,
      'Tarjeta de Crédito',
      [`${franchise} ${cashInfo.creditCard.productNumber}`],
      { isDone: true, pathLogo: BdbConstants.BBOG_LOGO_WHITE });
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Valor del avance');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Cuenta destino');
  }

  public continue(): void {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.amount);
    const cashInfo: CashAdvanceInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CashAdvanceInfo);
    cashInfo.amount = this.amountForm.value.amount.toString().replace(/\D+/g, '');
    this.bdbInMemory.setItemByKey(InMemoryKeys.CashAdvanceInfo, cashInfo);
    this.navCtrl.push('CashAdvanceTransferPage');
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navigation.abandonTransaction(this.navCtrl);
  }

  private getTransactionCost(): void {
    this.userFacade.getCatalogue(CatalogsEnum.VALOR_TRANSACCIONES);
    this.cost$ = this.userFacade.transactionCostByType$('CASH_ADVANCE');
  }

  private addFormChengeListener(): void {
    this.formSubscription = this.amountForm.valueChanges.subscribe(({ amount }) => {
      this.updateSelectedValue(amount);
    });
  }

  private updateSelectedValue(amtVal: string): void {
    this.cost$.pipe(
      take(1),
      map(catalogueCost => !!catalogueCost ? `Costo: ${catalogueCost}` : '')
    ).subscribe(cost => this.updateProgressBarStep2(
      !!amtVal ?
      [amtVal, cost]
      : []
    ));
  }

  private updateProgressBarStep2(details: Array<string>): void {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, details);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
  }
}
