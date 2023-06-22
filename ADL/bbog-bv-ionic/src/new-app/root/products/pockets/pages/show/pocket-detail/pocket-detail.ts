import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';
import { NavigationProvider } from '../../../../../../../providers/navigation/navigation';
import { BdbInMemoryProvider } from '../../../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { PocketOpsService } from '../../../services/pocket-ops.service';
import { TransactionsDate } from '../../../../../../../app/models/transactions/transactions-date';
import { ColumnOptionsDynamic, ExpandableData } from '../../../../../../../app/models/column-options-dynamic';
import { TableConfigProvider } from '../../../../../../../providers/table-config/table-config';
import { ColorVariant } from '../../../../../../../app/enums';
import * as iconsInline from '../../../../../../../providers/bdb-products/icons-products.json';
import { PocketMovementRq } from '../../../models/pocket';
import { BdbPocketCardDetailModel } from '../../../../../../../components/core/molecules/bdb-pocket-card-detail';
import { BdbMaskProvider, MaskType } from '../../../../../../../providers/bdb-mask';

@IonicPage()
@Component({
  selector: 'page-pocket-detail',
  templateUrl: 'pocket-detail.html',
})
export class PocketDetailPage implements OnInit {

  @ViewChild('header') hh: ElementRef;
  @ViewChild('master') hm: ElementRef;
  @ViewChild('txtable') ht: ElementRef;
  @ViewChild('fixi') hi: ElementRef;
  @ViewChild(Content) contentMain: Content;

  navTitle = 'Alcancías';

  divHeight = 0;
  isShrinkCard: false;

  cardData = {};
  pocketDetail: any[] = [];
  pocketDetailMobile: TransactionsDate[] = [];

  showDetail: string;
  columns: ColumnOptionsDynamic[] = [];
  expandData: ExpandableData[] = [];

  showLoaderDetail = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private navigation: NavigationProvider,
    private pocketOps: PocketOpsService,
    private tableConfig: TableConfigProvider,
    public events: Events,
    public bdbMask: BdbMaskProvider
  ) { }

  ngOnInit() {
    this.updatePocketData();
  }

  ionViewDidLoad() {
    this.events.publish('srink', true);
    this.columns = this.tableConfig.getPocketHistory().columns;
    this.expandData = this.tableConfig.getPocketHistory().expandable;
    this.initSearchDetail();
  }

  ionViewWillEnter() {
    this.updatePocketData();
  }

  private updatePocketData(): void {
    const pocketData = this.bdbInMemory.getItemByKey(InMemoryKeys.PocketData);
    this.cardData = this.mapAccountDetail(pocketData);
  }

  mapAccountDetail(pocketData: any): BdbPocketCardDetailModel {
    if (!!pocketData) {
      return {
        pocketBalance: pocketData.pocketBalance,
        pocketGoal: pocketData.pocketGoal,
        pocketName: pocketData.pocketName,
        pocketId: pocketData.pocketId,
        cardOptions: {
          showError: false,
          columns: 2,
          color: 'primary',
          colorVariant: ColorVariant.BASE,
          backgroundImg: 'assets/imgs/card-detail-imgs/bbog-shape.svg',
          msgError: 'Hubo un error al cargar los detalles'
        },
        logo: 'assets/imgs/card-detail-imgs/bbog-shape.svg',
        cardButton: [{
          icon: iconsInline['transfer'],
          text: 'Depositar',
          id: 'Redeem',
          action: (id) => this.depositPocket()
        },
        {
          icon: iconsInline['payBill'],
          text: 'Retirar',
          id: 'Redeem',
          action: (id) => this.withdrawPocket()
        },
        {
          icon: iconsInline['manage'],
          text: 'Administrar',
          id: 'Redeem',
          action: (id) => this.managePocket()
        }]
      };
    } else {
      return {
        pocketBalance: 0,
        pocketGoal: 0,
        pocketName: '',
        pocketId: '',
        cardOptions: {
          showError: true,
          columns: 2,
          color: 'primary',
          colorVariant: ColorVariant.BASE,
          backgroundImg: '',
          msgError: 'Hubo un error al cargar los detalles'
        },
        logo: '',
        cardButton: []
      };
    }
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onLogout() {
    this.navCtrl.push('authentication/logout');
  }

  initSearchDetail() {
    this.showDetail = 'L';
    this.loadDetail();
  }

  loadDetail() {
    const pocketData = this.bdbInMemory.getItemByKey(InMemoryKeys.PocketData);
    this.pocketDetail = [];

    const pocketMovementRq = new PocketMovementRq();
    pocketMovementRq.pocketId = pocketData.pocketId.substr(pocketData.pocketId.length - 4);
    pocketMovementRq.accountDetail =  {
      acctId: pocketData.account.productNumber,
      acctType: pocketData.account.productType
    },

    this.pocketOps.getMovements(pocketMovementRq).subscribe(
      (data) => {
        if (!!data) {
          data.map((t) => {
            t.symbol = t.transactionType === 'C' ? '+' : '-';
            t.date = this.bdbMask.maskFormatFactory(t.date, MaskType.DATE);
            if (!t.amount.amount) {
              t.amount = {
                amount: t.amount,
                positive: t.transactionType === 'C' ? true : false
              };
            }
          });

          this.pocketDetail = data;

          this.showDetail = 'M';
        } else {
          data.movementsDetailRs = [];
          this.showDetail = 'V';
        }
      },
      (error) => {
        this.showDetail = 'E';
      }
    );
  }

  validateDateMobile() {
    return (i: any, data: any, dataSource: any) => {
      if (i === 0 || i > 0 && data.date !== dataSource[i - 1].date) {
        return data.date;
      }
      return false;
    };
  }

  cardShrinkChange(e) {
    this.isShrinkCard = e;
    if (this.isShrinkCard) {
      const contentHeight = (204 + this.hm.nativeElement.offsetHeight + this.ht.nativeElement.offsetHeight);
      if (contentHeight <= window.innerHeight) {
        this.divHeight = (window.innerHeight - contentHeight);
      }
    }
  }

  depositPocket() {
    const pocketData = this.bdbInMemory.getItemByKey(InMemoryKeys.PocketData);
    this.bdbInMemory.setItemByKey(InMemoryKeys.PocketDeposit, pocketData);
    this.navCtrl.push('PocketDepositAmountPage');
  }

  withdrawPocket() {
    const pocketData = this.bdbInMemory.getItemByKey(InMemoryKeys.PocketData);
    this.bdbInMemory.setItemByKey(InMemoryKeys.PocketWithdraw, pocketData);
    this.navCtrl.push('PocketWithdrawAmountPage');
  }

  managePocket() {
    this.navCtrl.push('PocketManagePage');
  }
}
