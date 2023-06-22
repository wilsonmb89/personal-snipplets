import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { MobileSummaryProvider, SummaryHeader, SummaryBody } from '../../../../components/mobile-summary';
import { MaskType } from '../../../../providers/bdb-mask/bdb-mask-type.enum';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { SelectAccountHandlerProvider } from '../../../../providers/select-account-handler/select-account-handler';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { Customer } from '../../../../app/models/bdb-generics/customer';
import { IdType } from '../../../../providers/bdb-utils/id-type.enum';
import { EncryptionIdType } from '../../../../providers/bdb-utils/encryption-id.enum';
import { UserFeatures } from '../../../../new-app/core/services-apis/user-features/models/UserFeatures';
import { DonationsService } from '@app/modules/transfers/services/donations.service';
import { take } from 'rxjs/operators';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { ErrorMapperType } from '../../../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';
import { TrxResultDonationsService } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-donations.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';


@PageTrack({ title: 'page-donation-from-account' })
@IonicPage()
@Component({
  selector: 'page-donation-from-account',
  templateUrl: 'donation-from-account.html',
})
export class DonationFromAccountPage {

  private readonly CONST_MILLION_BANQUET_CODE = '3428';
  private readonly CONST_MAX_AMT_MILLION_BANQUET = 10;

  _funnel: any;
  accounts: Array<ProductDetail>;
  donationInfo: { contraction, recipent, charge, amount };
  items: Array<{ cardTitle, cardLabel, cardValue, isActive, acct }> = [];
  accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct };
  customer: Customer;
  enable = false;
  abandonText = BdbConstants.ABANDON_TRANS;
  subtitle = 'Selecciona la cuenta de origen';
  navTitle = 'Donaciones';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private mobileSummary: MobileSummaryProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private progressBar: ProgressBarProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbMask: BdbMaskProvider,
    private navigation: NavigationProvider,
    public selectAccountHandler: SelectAccountHandlerProvider,
    private bdbUtils: BdbUtilsProvider,
    private loading: LoadingController,
    private donationsService: DonationsService,
    private userFacade: UserFacade,
    private txResultService: TrxResultDonationsService,
  ) {
    this._funnel = this.funnelKeysProvider.getKeys().donations;
    this.donationInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.DonationInfo);
    this.customer = this.bdbUtils.getCustomer(IdType.BUS_BDB, EncryptionIdType.FULL);
  }

  ionViewDidLoad() {
    this.accountsToShow();
  }

  public accountsToShow(): void {
    this.accounts = this.selectAccountHandler.getAccountsAvailable(false);
    this.items = this.selectAccountHandler.getCardsMapping(this.accounts);
    if (!!this.items && this.items.length === 1) {
      this.paymentSelected(this.items[0]);
    }
    const mAccount: ProductDetail = this.selectAccountHandler.setFirstAccountSelection(this.accounts, this._funnel);
    if (mAccount !== null) {
      const acctOriginSelect = this.items.filter((e: { cardTitle, cardLabel, cardValue, isActive, acct: ProductDetail }) => {
        return e.acct.productNumber === mAccount.productNumber;
      });
      if (acctOriginSelect) {
        this.accountSeleted = acctOriginSelect.shift();
      }
    }
  }

  ionViewWillEnter() {
    this.buildUpMobileSummary();
    this.buildProgressBar();
  }

  buildProgressBar() {
    this.progressBar.setLogo('');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Entidad');
    this.progressBar.setContraction(this.donationInfo.contraction);
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [
      this.donationInfo.recipent.name
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);

    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [
      this.bdbMask.maskFormatFactory(this.donationInfo.amount, MaskType.CURRENCY),
      `Costo: ${this.donationInfo.charge}`
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);

  }

  buildUpMobileSummary() {
    const header: SummaryHeader = new SummaryHeader();

    header.title = 'Entidad';
    header.hasContraction = true;
    header.contraction = this.donationInfo.contraction;
    header.details = [this.donationInfo.recipent.name];
    this.mobileSummary.setHeader(header);
    const body: SummaryBody = new SummaryBody();
    body.textDown = 'Valor a donar:';
    body.valueDown = this.bdbMask.maskFormatFactory(this.donationInfo.amount, MaskType.CURRENCY);
    body.textUp = 'Costo de transacción';
    body.valueUp = this.donationInfo.charge;
    this.mobileSummary.setBody(body);
  }

  public onAbandonClicked(): void {
    this.navCtrl.setRoot('NewTransferMenuPage', { 'tab': 'donations' });
  }

  public onBackPressed(): void {
    this.navigation.onBackPressedCustPage(this.navCtrl, 'NewTransferMenuPage', 'donations');
  }

  paymentSelected(item) {
    this.enable = true;
    this.items.forEach((e) => {
      e.isActive = false;
    });
    item.isActive = true;
    this.selectAccountHandler.updateSelectedAccount(item.acct, this._funnel);
    this.accountSeleted = item;
  }

  async submit(): Promise<void> {
    this.enable = false;
    this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.confirmation);

    const donation = { ...this.donationInfo };
    const { recipent } = donation;
    const { acct } = this.accountSeleted;
    const currentDate = new Date();

    const loading = this.loading.create();
    await loading.present();

    this.donationsService.applyDonation(
      donation.amount,
      recipent.id,
      acct.productDetailApi
    ).subscribe((rs) => {
      loading.dismiss();
      this.validateEntityDonation(recipent.id);
      this.buildResultData(
        {
          donationInfo: this.donationInfo,
          accountSeleted: this.accountSeleted
        },
        true,
        rs.approvalId
      );
    }, (err) => {
      loading.dismiss();
      if (err.errorType === ErrorMapperType.Timeout) {
        this.navCtrl.push('OperationInfoPage', {
          data: {
            amount: donation.amount,
            amountText: 'Valor de la donación',
            bodyText: `
              Estamos presentando demoras. <span class="pulse-tp-bo3-comp-b">Si no ves
              reflejada la transacción en los movimientos de tu
              cuenta en las próximas horas</span>, intenta de nuevo.
            `,
            bodyTitle: 'Está tardando más de lo normal',
            buttonText: 'Entendido',
            dateTime: new Date().getTime(),
            image: 'assets/imgs/time-out-page/clock-warning.svg',
            title: 'Transacción en <span class="pulse-tp-hl3-comp-b">proceso</span>',
            buttonAction: () => {
              this.navCtrl.setRoot('DashboardPage');
            }
          }
        });
      } else {
        this.buildResultData(
          {
            donationInfo: this.donationInfo,
            accountSeleted: this.accountSeleted
          },
          false,
          '',
          err.error ? err.error : null
        );
      }
    });
  }

  private validateEntityDonation(enterpriseId: string): void {
    switch (enterpriseId) {
      case this.CONST_MILLION_BANQUET_CODE:
        this.updateBannerMillionBanquetAmt();
        break;
    }
  }

  private updateBannerMillionBanquetAmt(): void {
    this.userFacade.userFeatures$
      .pipe(take(1))
      .subscribe((userFeatures: UserFeatures) => {
        userFeatures.settings.amtMillionBanquetCampaignDash = this.CONST_MAX_AMT_MILLION_BANQUET;
        this.userFacade.updateUserFeaturesData(userFeatures);
      });
  }

  private buildResultData(
    donation: {
      donationInfo: { contraction, recipent, charge, amount },
      accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct }
    },
    isSuccess: boolean,
    approvalId: string = '',
    errorData?: ApiGatewayError
  ): void {
    const state: TransactionResultState = !isSuccess ? 'error' : 'success';
    this.txResultService.launchResultTransfer(this.navCtrl, state, donation, approvalId, errorData);
  }

}
