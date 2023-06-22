import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { Transaction } from '../../app/models/transactions/transactions-model';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ColumnOptionsDynamic, ExpandableData } from '../../app/models/column-options-dynamic';
import { TagData } from '../../pages/detail-and-txhistory/detail-and-txhistory';
import {BdbConstants} from '../../app/models/bdb-generics/bdb-constants';


@Component({
  selector: 'tx-history-web',
  templateUrl: 'tx-history-web.html',
  animations: [
    trigger('showFilter', [
      state('true', style({
        opacity: 0,
        display: 'none',
        height: '0rem'
      })),
      state('false', style({
        opacity: 1,
        height: '13rem'

      })),
      transition('* => *', [
        animate('0.3s')
      ])
    ]),
    trigger('expandRow', [
      transition(':enter', [
        style({ height: '0', opacity: 1 }),
        animate(200)
      ]),
      transition(':leave', [
        animate(200, style({ height: '0px', opacity: 0 }))
      ])
    ])
  ]
})
export class TxHistoryWebComponent implements OnInit {

  @ViewChild('searchFilter') searchFilter: any;
  @ViewChild('searchFilterMobile') searchFilterMobile: any;

  _isShowFilter = false;
  colorCal = 'white';
  indxExpanded = -1;

  @Input() tagdata: TagData[] = [];
  @Input() transactionsLoaded: Transaction[] = [];
  @Input() showTransactionsLoader = false;
  @Input() showTransactionsError = false;
  @Input() error: string;
  @Input() optionDownloadCsv = false;
  @Input() optionPrint = false;
  @Input() optionFilter = false;
  @Output() selectClicked = new EventEmitter();
  @Output() dataRangeClicked = new EventEmitter();
  @Output() downloadCsv = new EventEmitter<any>();
  @Output() printAction = new EventEmitter();

  @Input() columns: ColumnOptionsDynamic[] = [];
  @Input() expandableData: ExpandableData[] = [];
  @Input() isExpandable = false;

  @Input() dataSource: any[] = [];
  @Input() quickSelect = true;
  @Input() datePicker = true;
  @Input() minDate: Date;

  @Input() hideSearch  = false;
  @Input() title = '';
  @Input() description = 'Estás viendo el histórico de';


  @Output() eventBtn1 = new EventEmitter();
  @Input() validateDateMobile: any = (i: any, data: any, dataSource: any) => false;

  constructor() { }

  ngOnInit() {
  this.tagdata = [{text: BdbConstants.LAST_MONTH_TAG, value: 'DATE'}];
    if (!this.minDate) {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() - 6);
      this.minDate = currentDate;
    }
  }

  onSelectClicked(option) {
    this.selectClicked.emit(option);
  }

  onDataRangeClicked(date: Array<BdbMap>) {
    this.dataRangeClicked.emit(date);
  }

  onDownloadCsv(myEvent) {
    this.downloadCsv.emit(myEvent);
  }

  get onHideSearch(): boolean {
    return this.hideSearch;
  }

  onShowFilter() {
    this._isShowFilter = !this._isShowFilter;
    this.colorCal = this._isShowFilter ? 'bdb-bg' : 'white';
  }

  onPrint() {

  }

  _eventBtn1(e: any) {
    this.eventBtn1.emit(e);
  }

  _validateDateMobile(i: any, data: any, dataSource: any) {
    return this.validateDateMobile(i, data, dataSource);
  }

  exdpandData(i) {
    this.indxExpanded = (i === this.indxExpanded) ? -1 : i;
  }
}
