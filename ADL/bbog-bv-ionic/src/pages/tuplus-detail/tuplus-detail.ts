import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Content, IonicPage, NavController, NavParams } from 'ionic-angular';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { NavigationProvider } from '../../providers/navigation/navigation';
import { SessionProvider } from '../../providers/authenticator/session';
import { FilterDateParams, TuPlusDetail, TuPlusOpsProvider, TuPlusTransaction } from '../../providers/tu-plus-ops';
import { ColumnOptionsDynamic, ExpandableData } from '../../app/models/column-options-dynamic';
import { TableConfigProvider } from '../../providers/table-config/table-config';
import { TransactionsDate } from '../../app/models/transactions/transactions-date';
import { Transaction } from '../../app/models/transactions/transactions-model';
import { Amount } from '../../app/models/amount';
import { BdbCardDetailModel } from '../../components/core/molecules/bdb-card-detail';
import * as iconsInline from '../../providers/bdb-products/icons-products.json';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { LoyaltyDelegateService } from '@app/delegate/products-delegate/loyalty-delegate.service';
import { DatePipe } from '@angular/common';
import {TagData} from '../detail-and-txhistory/detail-and-txhistory';

@IonicPage()
@Component({
  selector: 'page-tuplus-detail',
  templateUrl: 'tuplus-detail.html',
})
export class TuplusDetailPage implements OnInit {

  @ViewChild('header') hh: ElementRef;
  @ViewChild('master') hm: ElementRef;
  @ViewChild('txtable') ht: ElementRef;
  @ViewChild('fixi') hi: ElementRef;
  @ViewChild(Content) contentMain: Content;


  divHeight = 0;
  isShrinkCard: false;

  cardData: Observable<BdbCardDetailModel>;
  updateLayout = false;
  dataSource: TuPlusDetail[] = [];
  tuPlusDetailMobile: TransactionsDate[] = [];

  showDetail: string;
  columns: ColumnOptionsDynamic[] = [];
  expandData: ExpandableData[] = [];

  showLoaderDetail = false;
  FORMAT_DATE_TRANSACTIONS = 'yyyy-MM-dd';
  title = 'Tus movimientos';
  description = 'Estás viendo los movimientos de:';
  tagdata: TagData[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private navigation: NavigationProvider,
    private tuPlusOps: TuPlusOpsProvider,
    private tableConfig: TableConfigProvider,
    private loyaltyDelegateService: LoyaltyDelegateService,
    private dateFormat: DatePipe
  ) { }

  ngOnInit(): void {
    this.getTuPlusPoints();
    this.tagdata = [{text: 'Ultimo mes', value: 'DATE'}];
  }

  ionViewDidLoad() {
    this.columns = this.tableConfig.getTransactionTableType().tuPlus.columns;
    this.expandData = this.tableConfig.getTransactionTableType().tuPlus.expandableData;
    this.initSearchDetail();
  }

  public getTuPlusPoints() {
    this.cardData = this.getDetailTuPlus();
  }

  private getDetailTuPlus(): Observable<BdbCardDetailModel> {
    this.showLoaderDetail = true;
    return this.tuPlusOps.getPoints().pipe(
      map(value => {
        return this.mapAccountDetail(value);
      }),
      tap(x => {
        this.showLoaderDetail = false;
      }),
      catchError((err) => {
        this.showLoaderDetail = false;
        return Observable.throw(err);
      })
    );
  }

  private mapAccountDetail(tuPlusData: any): BdbCardDetailModel {

    const title = 'Puntos TuPlus';
    const subtitle = 'Todos los bancos AVAL';

    if (!!tuPlusData) {
      return {
        cardHeader: {
          title,
          subtitle
        },
        firstColData: {
          key: 'Puntos disponibles',
          value: tuPlusData.totalPoints
        },
        dataToShow: [{
          key: 'Banco de Bogota',
          value: this.getBankPoints(tuPlusData.partners, 'Banco de Bogota')
        },
        {
          key: 'Banco de Occidente',
          value: this.getBankPoints(tuPlusData.partners, 'Banco de Occidente')
        },
        {
          key: 'Banco Popular',
          value: this.getBankPoints(tuPlusData.partners, 'Banco Popular')
        },
        {
          key: 'Banco AV Villas',
          value: this.getBankPoints(tuPlusData.partners, 'Banco AV Villas')
        }],
        cardOptions: {
          showError: false,
          columns: 2,
          color: 'olive',
          backgroundImg: 'assets/imgs/card-detail-imgs/tuplus-detail.svg',
          msgError: 'Hubo un error al cargar los detalles'
        },
        logo: '',
        cardButton: [{
          icon: iconsInline['redeem'],
          text: 'Redimir',
          id: 'Redeem',
          action: (id) => {
            window.open('https://www.tuplus.com.co/wps/portal/portal-lealtad/web/inicio', '_blank');
          }
        }]
      };
    } else {
      return {
        cardHeader: {
          title,
          subtitle
        },
        firstColData: {
          key: '',
          value: ''
        },
        dataToShow: [],
        cardOptions: {
          showError: true,
          columns: 3,
          color: 'olive',
          backgroundImg: '',
          msgError: 'Hubo un error al cargar los detalles'
        },
        logo: '',
        cardButton: []
      };
    }
  }

  getBankPoints(partners, bankName) {
    const partner = partners.filter(e => e.name === bankName);
    return partner.length > 0 ? partner[0].points : 0;
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onLogout() {
    this.navCtrl.push('authentication/logout');
  }

  initSearchDetail() {
    this.showDetail = 'L';
    const initDate = new Date();
    initDate.setDate(initDate.getDate() - 30);
    const filterDateParams = new FilterDateParams();
    filterDateParams.endDate = this.dateFormat.transform(new Date(), this.FORMAT_DATE_TRANSACTIONS);
    filterDateParams.startDate = this.dateFormat.transform(initDate, this.FORMAT_DATE_TRANSACTIONS);
    this.loadDetail(filterDateParams);
  }

  private loadDetail(rangeDate: FilterDateParams): void {
    this.loyaltyDelegateService
      .getTransactionsLoyaltyProgram(rangeDate)
      .subscribe((transactions) => {
        this.dataSource = transactions;
        this.showDetail = transactions.length > 0 ? 'M' : 'V';
        this.buildDataMovil(transactions);
      }, _ => {
        this.showDetail = 'E';
      });
  }

  buildDataMovil(data: any[]) {
    data.forEach((d: TuPlusDetail) => {
      const tpTemp = this.tuPlusDetailMobile.filter(tp => tp.date === d.date);
      if (tpTemp.length > 0) {
        const tr = new Transaction(d.date, d.establishment, new Amount(+d.accumulatedPoints, true), this.tableConfig.getIconBank(d.bank));
        tpTemp[0].transactions.push(tr);
      } else {
        const transactionsDate = new TransactionsDate(d.date, []);
        const tr = new Transaction(d.date, d.establishment, new Amount(+d.accumulatedPoints, true), this.tableConfig.getIconBank(d.bank));
        transactionsDate.transactions.push(tr);
        this.tuPlusDetailMobile.push(transactionsDate);
      }
    });
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

}
