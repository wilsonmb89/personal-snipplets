import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';

export enum QuickSelectSearchFilter {
  LAST_DAY = 'ld',
  LAST_MONTH = 'lm',
  LAST_WEEK = 'lw',
  TODAY = 't'
}

@Component({
  selector: 'bdb-search-filter',
  templateUrl: 'bdb-search-filter.html'
})
export class BdbSearchFilterComponent implements OnInit {

  @Input() minDate: Date = new Date(2000, 0, 1);
  @Input() maxDate: Date = new Date();
  @Input() quickSelect = false;
  @Input() datePicker = false;
  @Output() onSelectClicked: EventEmitter<string> = new EventEmitter();
  @Output() onDataRangeClicked: EventEmitter<Array<BdbMap>> = new EventEmitter();

  title = 'Buscar por fecha';
  msgButton = 'Buscar';
  valueDatePicker = [];

  disabledQuickSelect = false;
  disabledDatePicker = true;
  disabledButtonSearch = true;

  options: Array<BdbMap> = [{
    key: QuickSelectSearchFilter.LAST_WEEK,
    value: 'Última semana'
  }, {
    key: QuickSelectSearchFilter.LAST_MONTH,
    value: 'Último mes'
  }, {
    key: QuickSelectSearchFilter.LAST_DAY,
    value: 'Último día'
  }, {
    key: QuickSelectSearchFilter.TODAY,
    value: 'Hoy'
  }];

  constructor() { }

  ngOnInit() {
    this.disabledDatePicker = !this.quickSelect && this.datePicker ? false : true;
  }

  datePickerChange(value: Array<Date>) {
    this.disabledButtonSearch = !(value.length === 2);
    this.valueDatePicker = value;
  }

  startDateMobileChange(value: { day: number, month: number, year: number }) {

    const date = new Date(value.year, value.month - 1, value.day);

    if (this.valueDatePicker.length === 0) {
      this.valueDatePicker.push(date);
    } else {
      this.valueDatePicker[0] = date;
    }
  }

  endDateMobileChange(value: { day: number, month: number, year: number }) {

    const date = new Date(value.year, value.month - 1, value.day);

    if (this.valueDatePicker.length === 1) {
      this.valueDatePicker.push(date);
    } else if (this.valueDatePicker.length === 2) {
      this.valueDatePicker[1] = date;
    }

    this.disabledButtonSearch = !(this.valueDatePicker.length === 2);
  }

  quickSelectChanged(value: any) {
    if (+value !== 0) {
      this.onSelectClicked.emit(value);
    }
  }

  filterTypeChanged(type: string) {

    this.disabledQuickSelect = !(type === 'quick-select');
    this.disabledDatePicker = !(type === 'date-picker');

    if (type === 'quick-select') {
      this.valueDatePicker = [];
      this.disabledButtonSearch = true;
    }
  }

  dateFormat(date: Date): string {

    const leadingZeroes = (num: number): string => {
      return num < 10 ? `0${num}` : num.toString();
    };

    return `${date.getFullYear()}-${leadingZeroes(date.getMonth() + 1)}-${leadingZeroes(date.getDate())}`;
  }

  search() {

    let startDt: string, endDt: string;

    if (this.valueDatePicker.length === 2) {
      startDt = this.dateFormat(this.valueDatePicker[0]);
      endDt = this.dateFormat(this.valueDatePicker[1]);
    } else {
      startDt = this.dateFormat(this.valueDatePicker[0]);
      endDt = this.dateFormat(this.valueDatePicker[1]);
    }

    const data: Array<BdbMap> = [
      { key: 'startDt', value: startDt },
      { key: 'endDt', value: endDt },
    ];

    this.onDataRangeClicked.emit(data);
  }

  refreshDate() {
    this.valueDatePicker = [];
    this.disabledButtonSearch = true;
  }

}
