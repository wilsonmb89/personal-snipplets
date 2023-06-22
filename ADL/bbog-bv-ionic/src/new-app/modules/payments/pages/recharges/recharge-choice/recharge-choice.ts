import { Component, ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { take } from 'rxjs/operators';

import { RechargeRepoService } from '@app/modules/payments/services/recharge-repo.service';
import { RechargeItem } from '@app/modules/payments/models/recharges.model';
import { FunnelKeysProvider } from '../../../../../../providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from '../../../../../../providers/funnel-events/funnel-events';
import { RechargeInfo } from '../../../../../../app/models/recharges/recharge-info';
import { BdbConstants } from '../../../../../../app/models/bdb-generics/bdb-constants';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { InMemoryKeys } from '../../../../../../providers/storage/in-memory.keys';
import { TokenOtpProvider } from '../../../../../../providers/token-otp/token-otp/token-otp';
import { ProgressBarProvider } from '../../../../../../providers/progress-bar/progress-bar';
import { MobileSummaryProvider } from '../../../../../../components/mobile-summary';
import { AccessDetailProvider } from '../../../../../../providers/access-detail/access-detail';
import { BdbMap } from '../../../../../../app/models/bdb-generics/bdb-map';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';

@IonicPage({
  name: 'recharge%choice',
  segment: 'recharge-choice'
})
@Component({
  selector: 'recharge-choice-page',
  templateUrl: './recharge-choice.html'
})
export class RechargeChoicePage implements OnInit {

  rechargeItems: RechargeItem[] = [];
  tollItems: RechargeItem[] = [];
  showFacilpassPanel = false;

  private _recharges = this.funnelKeysProvider.getKeys().recharges;

  constructor(
    private navCtrl: NavController,
    private rechargeRepoService: RechargeRepoService,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private bdbStorageService: BdbStorageService,
    private tokenOtp: TokenOtpProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private progressBar: ProgressBarProvider,
    private accessDetail: AccessDetailProvider,
    private mobileSummary: MobileSummaryProvider,
    private userFacade: UserFacade,
  ) {}

  ngOnInit(): void {
    this.rechargeItems = this.rechargeRepoService.getItems().filter(item =>
      item.type === 'phone'
    );
    this.tollItems = this.rechargeRepoService.getItems().filter(item =>
      item.type === 'facilpass'
    );
    this.userFacade.userFeatures$.pipe(take(1)).subscribe(userFeatures => {
      this.showFacilpassPanel = userFeatures.toggle.allowedServices.facilpass;
    });
  }

  public itemSelected(item: RechargeItem): void {
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => this.validateItemSelected(item),
      'recharges'
    );
  }

  private validateItemSelected(item: RechargeItem): void {
    switch (item.type) {
      case 'phone':
        this.phoneRechargeFlow(item);
        break;
      case 'facilpass':
        this.navCtrl.push('facilpass%set%nure');
        break;
      default:
        throw new Error('Not supported type');
    }
  }

  private phoneRechargeFlow(item: RechargeItem): void {
    const carrier: BdbMap = {
      key: item.key,
      value: item.value,
      cod: item.code,
      src: item.src
    };
    this.saveRechargeData(carrier);
    this.setUpProgressBars();
    this.navCtrl.push('recharge%phone%input');
  }

  private setUpProgressBars(): void {
    this.progressBar.resetObject();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Operador');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Número celular');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Valor de la recarga');
    this.progressBar.addStep(BdbConstants.PROGBAR_STEP_4, 'Cuenta de origen');
    if (this.accessDetail.isOriginSelected()) {
      this.accessDetail.updateProgressBarDoneRecharge(this.accessDetail.getOriginSelected());
    }
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);
  }

  private saveRechargeData(carrier: BdbMap): void {
    this.funnelEventsProvider.callFunnel(this._recharges, this._recharges.steps.operator);
    const rechargeInfo: RechargeInfo = new RechargeInfo();
    rechargeInfo.carrier = carrier;
    rechargeInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    this.bdbStorageService.setItemByKey(InMemoryKeys.RechargeInfo, rechargeInfo);
  }
}
