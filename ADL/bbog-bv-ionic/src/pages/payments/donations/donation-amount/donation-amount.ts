import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { MobileSummaryProvider, SummaryHeader } from '../../../../components/mobile-summary';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { MinAmmtValidator } from '../../../../validators/minAmmt';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { Subscription } from 'rxjs/Subscription';

@PageTrack({ title: 'page-donations-amount' })
@IonicPage()
@Component({
    selector: 'page-donations-amount',
    templateUrl: 'donation-amount.html'
})
export class DonationAmountPage {

    formDonationAmt: FormGroup;
    formSubscription: Subscription;
    private _funnel;
    donationInfo;
    abandonText = BdbConstants.ABANDON_TRANS;
    navTitle = 'Donaciones';

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private navigation: NavigationProvider,
        private bdbInMemory: BdbInMemoryProvider,
        private mobileSummary: MobileSummaryProvider,
        private funnelKeysProvider: FunnelKeysProvider,
        private funnelEventsProvider: FunnelEventsProvider,
        private progressBar: ProgressBarProvider,
        private formBuilder: FormBuilder,


    ) {
        this._funnel = this.funnelKeysProvider.getKeys().donations;
        this.donationInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.DonationInfo);
        this.buildFormDonationSel();
    }

    ionViewWillEnter(): void {
        this.buildUpMobileSummary();
        this.buildProgressBar();
        this.addFormChengeListener();
    }


    ionViewDidLoad() {
    }

    ionViewWillLeave(): void {
        if (!!this.formSubscription) {
          this.formSubscription.unsubscribe();
        }
      }

    private buildFormDonationSel() {
        this.formDonationAmt = this.formBuilder.group(
            {
                amount: ['', [Validators.required, MinAmmtValidator.isValid]],
            }
        );
    }

    buildProgressBar() {
        this.progressBar.setLogo('');
        this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Entidad');
        this.progressBar.setContraction(this.donationInfo.contraction);
        this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [
            this.donationInfo.recipent.name
        ]);
        this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);

    }


    buildUpMobileSummary() {
        const header: SummaryHeader = new SummaryHeader();
        header.title = 'Entidad';
        header.hasContraction = true;
        header.contraction = this.donationInfo.contraction;
        header.details = [this.donationInfo.recipent.name];
        this.mobileSummary.setHeader(header);
    }


    public onAbandonClicked(): void {
        this.navCtrl.setRoot('NewTransferMenuPage', { 'tab': 'donations' });
    }

    public onBackPressed(): void {
        this.navigation.onBackPressedCustPage(this.navCtrl, 'NewTransferMenuPage', 'donations');
    }

    submit() {
        this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.confirmation);
        this.gotoSelectAct(this.formDonationAmt.value);
    }

    gotoSelectAct(data) {
        this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.option);
        const donationInfo = {
            recipent: this.donationInfo.recipent,
            amount: `${data.amount}`.replace(/\D+/g, ''),
            charge: '0',
            contraction: this.donationInfo.contraction
        };

        this.bdbInMemory.setItemByKey(InMemoryKeys.DonationInfo, donationInfo);
        this.navCtrl.push('DonationFromAccountPage', {}, {
            animate: true,
            direction: 'forward'
        });
    }

    private addFormChengeListener(): void {
        this.formSubscription = this.formDonationAmt.valueChanges.subscribe(({ amount }) => {
            this.updateSelectedValue(amount);
        });
    }

    private updateSelectedValue(amtVal: string): void {
        this.updateProgressBarStep2(
            !!amtVal ?
                [amtVal, `Costo: ${BdbConstants.TRANSACTION_COST.NO_COST}`]
                : []
        );
    }

    updateProgressBarStep2(details: Array<string>) {
        this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, details);
        this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
    }

}
