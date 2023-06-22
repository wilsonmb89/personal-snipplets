import {Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {PulseModalControllerProvider} from '../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import {BdbMap} from '../../../../../app/models/bdb-generics/bdb-map';
import {BdbUtilsProvider} from '../../../../../providers/bdb-utils/bdb-utils';
import {BdbConstants} from '../../../../../app/models/bdb-generics/bdb-constants';
import {State} from '@ngrx/store';


@Component({
  selector: 'modal-filter',
  templateUrl: 'modal-filter.html'
})
export class ModalFilterComponent implements OnInit {

  @ViewChild('dropdown') dropdown: ElementRef;
  listSuggestion: any[];
  dateCalendarSelected: Date[] = [];
  suggestionSelected: any = '';
  maxDate: Date;
  minDate: Date;

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
    private bdbUtils: BdbUtilsProvider,
  ) {
  }

  ngOnInit(): void {
    this.listSuggestion = this.getSuggestionList();
    this.maxDate = new Date();
    const nowDate = new Date();
    nowDate.setMonth(nowDate.getMonth() - 24);
    this.minDate = nowDate;
  }

  private validateMaxDate(value: Date[]): Date {
    let maxDate = new Date();
    const tempMaxDate = new Date();
    tempMaxDate.setTime(value[0].getTime());
    tempMaxDate.setMonth(tempMaxDate.getMonth() + 6);
    if (tempMaxDate.getTime() < new Date().getTime()) {
      maxDate = tempMaxDate;
    }
    return maxDate;
  }

  private validateMinDate(value: Date[]): void {
    const temMinDate = new Date();
    const now = new Date();
    temMinDate.setTime(value[0].getTime());
    temMinDate.setMonth(temMinDate.getMonth() - 6);
    now.setMonth(now.getMonth() - 24);
    if (temMinDate.getTime() < now.getTime()) {
      this.minDate = now;
    } else {
      this.minDate = temMinDate;
    }
  }

  private selectRangeDate(value: Date[]): void {
    if (value.length === 1) {
      const el = this.dropdown.nativeElement as HTMLElement;
      el.setAttribute('text', 'Personalizado');
      this.suggestionSelected = BdbConstants.PERSONALIZED;
      this.maxDate = this.validateMaxDate(value);
      this.validateMinDate(value);
    } else {
      this.maxDate = new Date();
    }
    this.dateCalendarSelected = value;

  }


  private getSuggestionList() {
    return [
      {name: 'Último mes', value: BdbConstants.LAST_MONTH},
      {name: 'Última semana', value: BdbConstants.LAST_WEEK},
      {name: 'Ayer', value: BdbConstants.LAST_DAY},
      {name: 'Hoy', value: BdbConstants.TODAY},
      {name: 'Personalizado', value: BdbConstants.PERSONALIZED}
    ];
  }

  private changeDropDown(option: string): void {
    this.suggestionSelected = option;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (option) {
      case BdbConstants.TODAY:
        this.dateCalendarSelected = [today, today];
        break;
      case BdbConstants.LAST_DAY:
        const dt = new Date(today);
        dt.setDate(dt.getDate() - 1);
        this.dateCalendarSelected = [dt, dt];
        break;
      case BdbConstants.LAST_WEEK:
        const dtw = new Date(today);
        dtw.setDate(dtw.getDate() - 7);
        this.dateCalendarSelected = [dtw, today];
        break;
      case BdbConstants.LAST_MONTH:
        const dtl = new Date(today);
        dtl.setDate(dtl.getDate() - 30);
        this.dateCalendarSelected = [dtl, today];
        break;
    }

  }

  private validateDateSelectec(): boolean {
    return !(this.dateCalendarSelected.length > 0);
  }


  async searchDate() {
    if (this.dateCalendarSelected.length === 1) {
      this.dateCalendarSelected.push(this.dateCalendarSelected[0]);
    }
    await this.pulseModalCtrl.dismiss({
      dateCalendarSelected: this.dateCalendarSelected.map(this.bdbUtils.getDateInString),
      suggestionSelected: this.suggestionSelected
    });
  }

  async closeModal() {
    await this.pulseModalCtrl.dismiss();
  }
}
