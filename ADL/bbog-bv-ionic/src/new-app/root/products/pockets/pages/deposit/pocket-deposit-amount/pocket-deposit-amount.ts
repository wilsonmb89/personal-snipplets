import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationProvider } from '../../../../../../../providers/navigation/navigation';
import { BdbInMemoryProvider } from '../../../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { MinAmmtValidator } from '../../../../../../../validators/minAmmt';
import { Pocket, PocketTransferRq, AccountDetailApi } from '../../../models/pocket';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { ProductDetail } from '../../../../../../../app/models/products/product-model';
import { PocketOpsService } from '../../../services/pocket-ops.service';
import { BdbUtilsProvider } from '../../../../../../../providers/bdb-utils/bdb-utils';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { BdbConstants } from '../../../../../../../app/models/bdb-generics/bdb-constants';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { TrxResultTransferPocketService } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-pockets.service';

@IonicPage()
@Component({
  selector: 'page-pocket-deposit-amount',
  templateUrl: 'pocket-deposit-amount.html',
})
export class PocketDepositAmountPage {

  leftHdrOption = 'Atrás';
  hideLeftOption = false;
  navTitle = 'Alcancías';
  abandonText = 'Cancelar';
  form: FormGroup;
  withDecimal = false;
  customMask = createNumberMask({
    allowDecimal: this.withDecimal,
    decimalSymbol: '.',
    thousandsSeparatorSymbol: ','
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private navigation: NavigationProvider,
    private formBuilder: FormBuilder,
    private events: Events,
    private bdbInMemory: BdbInMemoryProvider,
    private pocketOps: PocketOpsService,
    private loading: LoadingController,
    private bdbUtils: BdbUtilsProvider,
    private txResultService: TrxResultTransferPocketService,
  ) {
    this.form = this.formBuilder.group({
      amount: ['', [Validators.required, MinAmmtValidator.isValid]]
    });
    this.events.publish('srink', true);
  }

  ionViewDidLoad() { }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const pocket: Pocket = this.bdbInMemory.getItemByKey(InMemoryKeys.PocketDeposit);
    const account: ProductDetail = pocket.account;

    const accountDetail = new AccountDetailApi();
    accountDetail.acctId = account.productNumber;
    accountDetail.acctType = this.bdbUtils.mapTypeProduct(account.productType);

    const pocketTransferRq = new PocketTransferRq();
    pocketTransferRq.accountDetail = accountDetail;
    pocketTransferRq.amount = this.form.value.amount;
    pocketTransferRq.pocketId = pocket.pocketId.substr(pocket.pocketId.length - 4);
    pocketTransferRq.transferType = BdbConstants.POCKETS.deposit;
    const loading = this.loading.create();
    loading.present();

    this.pocketOps.transferPocket(pocketTransferRq)
      .subscribe(data => {
        loading.dismiss();
        this.bdbInMemory.clearItem(InMemoryKeys.CustomerPocketList);
        this.buildResultData(pocketTransferRq, pocket, true, '');
      }, ex => {
        loading.dismiss();
        this.buildResultData(pocketTransferRq, pocket, false, '', ex.error ? ex.error : null);
      });
  }

  private buildResultData(
    pocketTransferRq: PocketTransferRq,
    pocket: Pocket,
    isSuccess: boolean,
    approvalId: string = '',
    errorData?: ApiGatewayError
  ): void {
    const state: TransactionResultState = isSuccess ? 'success' : 'error';
    this.txResultService.launchResultTransfer(this.navCtrl, state, ({pocketTransferRq, pocket}), approvalId, errorData);
  }

}
