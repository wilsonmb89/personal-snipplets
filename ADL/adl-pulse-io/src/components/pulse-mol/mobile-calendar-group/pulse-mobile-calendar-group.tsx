import { Component, h, Element, Host, Prop, Event, EventEmitter, State, Listen, Watch } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { Color } from '../../../interface';
import { createColorClasses } from '../../../utils/themes';

@Component({
  tag: 'pulse-mobile-calendar-group',
  styleUrl: 'pulse-mobile-calendar-group.scss',
  shadow: true
})
export class PulseMobileCalendarGroup {

  private readonly MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  private limitDetected: boolean = false;
  private toggleScrollEvent: boolean = true;
  private mobilecalendarref: HTMLElement;
  private mobilecalendarheaderref: HTMLElement;
  private timer: ReturnType<typeof setTimeout>;

  @Element() hostElement: HTMLStencilElement;

  @State() stateValue!: Array<Date>;
  @State() currentDateMonth: Date = new Date();
  @State() currentDateUpdate: CalendarDate;
  @State() monthsToShow: CalendarDate[] = [];
  @State() monthsToRender: CalendarDate[] = [];
  @State() showMonthsOptionList: boolean = false;
  @State() showOverlay: boolean = false;

  @Prop() color: Color = 'primary';
  @Prop() height: string = '50rem';
  @Prop() monthsrenderrange: number = 2;
  @Prop() value?: Array<Date> = [];
  @Prop() range?: boolean = false;
  @Prop() mindate?: Date;
  @Prop() maxdate?: Date;

  @Event() confirmSelection: EventEmitter<Array<Date>>;

  constructor() { }

  componentWillLoad(): void {
    this.monthsrenderrange = (this.monthsrenderrange < 2) ? 2 : this.monthsrenderrange;
    this.validateInitiaData();
    this.validateRangeDates();
    this.monthsToShow = this.getMonthsCalendarDate(this.mindate, this.maxdate);
    this.monthsToRender = this.getAvaliableMonthsToRender();
  }

  componentDidLoad(): void {
    this.setScrollEvents();
    this.scrollToMonth();
  }

  componentDidUpdate(): void {
    if (!!this.currentDateUpdate) {
      this.toggleScrollEvent = false;
      this.scrollToMonth(this.currentDateUpdate, true);
      this.currentDateUpdate = null;
    }
  }

  @Watch("value")
  watchValueDateChange() {
    this.validateInitiaData();
    this.validateRangeDates();
    this.setCurrentScrollMonth();
  }

  @Listen('valueChange')
  onMenuValueChange(ev: CustomEvent) {
    const dateValue = ev.detail.detail.split('-');
    const dateToGo = new Date(dateValue[1], dateValue[0], 1);
    this.refreshRenderedMonths(dateToGo);
    this.showMonthsOptionList = false;
    this.showOverlay = false;
    this.currentDateUpdate = { month: dateToGo.getMonth(), year: dateToGo.getFullYear() };
  }
  
  private refreshRenderedMonths(dateToGo: Date): void {
    let startDate: Date;
    let auxDate: Date;
    let endDate: Date;
    let setInTop = true;
    if (this.currentDateMonth.getTime() > dateToGo.getTime()) {
      const calendarDate = this.monthsToRender[0];
      auxDate = new Date(dateToGo.getTime());
      auxDate.setMonth(auxDate.getMonth() - 1);
      startDate = auxDate;
      endDate = new Date(calendarDate.year, calendarDate.month, 1);
      endDate.setMonth(endDate.getMonth() - 1);
    } else {
      const calendarDate = this.monthsToRender[this.monthsToRender.length - 1];
      startDate = new Date(calendarDate.year, calendarDate.month, 1);
      startDate.setMonth(startDate.getMonth() + 1);
      auxDate = new Date(dateToGo.getTime());
      auxDate.setMonth(auxDate.getMonth() + 1);
      endDate = auxDate;
      setInTop = false;
    }
    const newElements = this.getMonthsCalendarDate(startDate, endDate);
    this.addRenderCalendarElements(setInTop, newElements);
  }

  private setCurrentScrollMonth(): void {
    if (!!this.value && this.value.length > 0) {
      const dateToScroll: CalendarDate = {
        month: this.value[0].getMonth(),
        year: this.value[0].getFullYear()
      };
      if (this.value[0].getMonth() !== this.currentDateMonth.getMonth()) {
        this.scrollToMonth(dateToScroll, true);
      }
    } else {
      this.scrollToMonth();
    }
  }

  private validateInitiaData(): void {
    if (!!this.value && this.value.length > 0) {
      if ((this.range && this.value.length === 2) || (!this.range && this.value.length === 1)) {
        this.stateValue = this.copyValueDateArray(this.value);
      }
    }
  }

  private scrollToMonth(date?: CalendarDate, animated: boolean = false): void {
    if (!!this.mobilecalendarheaderref && !!this.mobilecalendarref) {
      if (!date) {
        const newDate = new Date();
        date = { month: newDate.getMonth(), year: newDate.getFullYear() };
      }
      const refToScroll: HTMLElement = this.mobilecalendarref.querySelector(`#pmc-${date.month}-${date.year}`);
      if (refToScroll) {
        const headerClientHeight = this.mobilecalendarheaderref.clientHeight;
        const scrollTop = refToScroll.offsetTop - headerClientHeight;
        this.mobilecalendarref.style.scrollBehavior = animated ? 'smooth' : 'auto';
        this.mobilecalendarref.scrollTop = scrollTop;
      }
    }
  }

  private validateRangeDates(): void {
    const auxStartDate = new Date();
    this.mindate = !!this.mindate ? this.mindate : new Date(auxStartDate.setMonth(auxStartDate.getMonth() - 24));
    this.mindate.setHours(0, 0, 0, 0);
    const auxEndDate = new Date();
    this.maxdate = !!this.maxdate ? this.maxdate : new Date(auxEndDate.setMonth(auxEndDate.getMonth() + 24));
    this.maxdate.setHours(0, 0, 0, 0);
  }

  private getMonthsCalendarDate(minDate: Date, maxDate: Date): CalendarDate[] {
    const startYear = minDate.getFullYear()
    const startMonth = minDate.getMonth();
    const endYear = maxDate.getFullYear();
    const endMonth = maxDate.getMonth();
    const dates: CalendarDate[] = [];
    for (let year = startYear; year <= endYear; year++) {
      let month = year === startYear ? startMonth : 0;
      const monthLimit = year === endYear ? endMonth : 11;
      for (; month <= monthLimit; month++) {
        dates.push({ month, year });
      }
    }
    return dates;
  }

  private getAvaliableMonthsToRender(): CalendarDate[] {
    let months: CalendarDate[] = [];
    if (!!this.currentDateMonth
        && !!this.monthsToShow) {
      const calIndexFinded = this.monthsToShow.findIndex(
        cal => cal.month === this.currentDateMonth.getMonth() 
          && cal.year === this.currentDateMonth.getFullYear()
      );
      if (calIndexFinded !== -1) {
        for (let x = (this.monthsrenderrange * -1); x < (this.monthsrenderrange + 1); x++) {
          const calendarDate = this.monthsToShow[calIndexFinded + x];
          if (!!calendarDate) {
            const calendarDateDate = new Date(calendarDate.year, calendarDate.month, 1);
            const isAvaliableElement =
              (calendarDateDate.getTime() >= this.mindate.getTime() && calendarDateDate.getTime() <= this.maxdate.getTime()) ||
              (calendarDateDate.getMonth() === this.mindate.getMonth() && calendarDateDate.getFullYear() === this.mindate.getFullYear()) ||
              (calendarDateDate.getMonth() === this.maxdate.getMonth() && calendarDateDate.getFullYear() === this.maxdate.getFullYear());
            if (!!calendarDate && isAvaliableElement) {
              months.push(calendarDate);
            }
          }
        }
        months = this.checkRenderMonths(months);
      }
    }
    return months;
  }

  private checkRenderMonths(months: CalendarDate[] = []): CalendarDate[] {
    if (months.length > 0) {
      const firstMonth = months[0];
      const lastMonth = months[months.length - 1];
      if (this.currentDateMonth.getMonth() === firstMonth.month && this.currentDateMonth.getFullYear() === firstMonth.year) {
        const initAuxDate = new Date(this.currentDateMonth.getTime());
        initAuxDate.setHours(0, 0, 0, 0);
        initAuxDate.setMonth(initAuxDate.getMonth() - 1);
        months.unshift({ month: initAuxDate.getMonth(), year: initAuxDate.getFullYear() });
      }
      if (this.currentDateMonth.getMonth() === lastMonth.month && this.currentDateMonth.getFullYear() === lastMonth.year) {
        const initAuxDate = new Date(this.currentDateMonth.getTime());
        initAuxDate.setHours(0, 0, 0, 0);
        initAuxDate.setMonth(initAuxDate.getMonth() + 1);
        months.push({ month: initAuxDate.getMonth(), year: initAuxDate.getFullYear() });
      }
    }
    return months;
  }

  private dateSelected(eventDateSelected: CustomEvent<Date>): void {
    const dateSelected: Date = eventDateSelected.detail;
    if (this.range) {
      this.stateValue = !!this.stateValue ? this.stateValue : [];
      const valueLength = this.stateValue.length;
      if (valueLength === 2) {
        this.stateValue = [];
      }
      this.stateValue.push(dateSelected);
      this.stateValue = this.copyValueDateArray(this.stateValue);
    } else {
      this.stateValue = [dateSelected];
    }
    this.validateDates();
  }

  private validateDates(): void {
    this.value = this.copyValueDateArray(this.stateValue);
    this.confirmSelection.emit(this.stateValue);
  }

  private copyValueDateArray(originArray: Array<Date>): Array<Date> {
    const result = new Array<Date>();
    originArray.forEach(date => {
      result.push(new Date(date.getTime()));
    });
    return result.sort((a, b) => a.getTime() - b.getTime());
  }

  private setScrollEvents(): void {
    this.mobilecalendarref.addEventListener('scroll', () => {
      this.detectCurrMonth();
      if (this.toggleScrollEvent) {
        this.detectCalendarLimits();
        this.fixScrollTop();
      } else {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.toggleScrollEvent = true;
        }, 200);
      }
    });
  }

  private detectCalendarLimits(): void {
    const topLimit = 200;
    const bottomLimit = (this.mobilecalendarref.scrollHeight - this.mobilecalendarref.offsetHeight) - 200;
    if (!this.limitDetected) {
      if (this.mobilecalendarref.scrollTop < topLimit) {
        this.renderMonths(true);
      } else if (this.mobilecalendarref.scrollTop > bottomLimit) {
        this.renderMonths(false);
      }
    }
  }

  private renderMonths(renderTop: boolean): void {
    this.limitDetected = true;
    let startDate: Date;
    let endDate: Date;
    if (renderTop) {
      const calendarDate = this.monthsToRender[0];
      startDate = new Date(calendarDate.year, calendarDate.month, 1);
      if (this.mindate.getTime() < startDate.getTime()) {
        startDate.setMonth(startDate.getMonth() - 1);
        endDate = new Date(calendarDate.year, calendarDate.month, 1);
        endDate.setMonth(endDate.getMonth() - 1);
        const newElements = this.getMonthsCalendarDate(startDate, endDate);
        this.addRenderCalendarElements(true, newElements);
      }
    } else {
      const calendarDate = this.monthsToRender[this.monthsToRender.length - 1];
      endDate = new Date(calendarDate.year, calendarDate.month, 1);
      if (this.maxdate.getTime() > endDate.getTime()) {
        endDate.setMonth(endDate.getMonth() + 1);
        startDate = new Date(calendarDate.year, calendarDate.month, 1);
        startDate.setMonth(startDate.getMonth() + 1);
        const newElements = this.getMonthsCalendarDate(startDate, endDate);
        this.addRenderCalendarElements(false, newElements);
      }
    }
    this.limitDetected = false;
  }

  private addRenderCalendarElements(addInTop: boolean, newElements: CalendarDate[]): void {
    const auxRenderCalendar = [...this.monthsToRender];
    if (addInTop) {
      newElements.reverse().forEach(calendar => {
        const calFinded = !!auxRenderCalendar.find(cal =>
          cal.year === calendar.year && cal.month === calendar.month
        );
        if (!calFinded) {
          auxRenderCalendar.unshift(calendar);
        }
      });
    } else {
      newElements.forEach(calendar => {
        const calFinded = !!auxRenderCalendar.find(cal =>
          cal.year === calendar.year && cal.month === calendar.month
        );
        if (!calFinded) {
          auxRenderCalendar.push(calendar);
        }
      });
    }
    this.monthsToRender = [...auxRenderCalendar];
  }

  private fixScrollTop(): void {
    if (this.currentDateMonth.getTime() >= this.mindate.getTime()
        && this.mobilecalendarref.scrollTop === 0) {
      this.mobilecalendarref.scrollTop = 50;
    }
  }

  private detectCurrMonth(): void {
    const calendarElement = this.mobilecalendarref;
    const monthsElements = calendarElement.querySelectorAll('.pulse-mobile-calendar');
    if (!!monthsElements && monthsElements.length > 0) {
      const offsetTopRef = (monthsElements[0] as HTMLElement).offsetTop + calendarElement.scrollTop;
      const activeMonth = Array.from(monthsElements).find((monthRef: HTMLElement) => {
        const boundingClientRect = monthRef.getBoundingClientRect()
        if (offsetTopRef >= monthRef.offsetTop && offsetTopRef <= (monthRef.offsetTop + boundingClientRect.height)) {
          return monthRef;
        }
      });
      if (!!activeMonth) {
        this.changeCurrentMonthHeader(activeMonth.id);
      }
    }
  }

  private toggleLoading(): void {
    this.showMonthsOptionList = !this.showMonthsOptionList;
    this.showOverlay = !this.showOverlay;
  }

  private changeCurrentMonthHeader(monthId: string): void {
    const dateValue = monthId.split('-');
    const month = +dateValue[1];
    const year = +dateValue[2];
    if (!!this.currentDateMonth
        && !(this.currentDateMonth.getMonth() === month && this.currentDateMonth.getFullYear() === year)) {
      this.currentDateMonth = new Date(year, month, 1);
    }
  }

  public renderMonthsOptionList() {
    return (
      <div class={{
        ['pulse-mobile-calendar-group-main__header--select-month__month-list-menu']: true,
        ['active']: this.showMonthsOptionList
      }}>
        {this.arrow_down()}
        <div class={{
          "pulse-mobile-calendar-group-main__header--select-month__month-list-menu--menu": true,
          ...createColorClasses('white', '700')
        }}
          onClick={() => this.toggleLoading()}>
          <pulse-option-menu height="21.4rem" show={this.showMonthsOptionList}>
            {this.monthsToShow.map(
              date =>
                <pulse-option key={`${this.MONTHS[date.month]} ${date.year}`} value={`${date.month}-${date.year}`}>
                  {`${this.MONTHS[date.month]} ${date.year}`}
                </pulse-option>
            )}
          </pulse-option-menu>
        </div>
      </div>
    );
  }

  public arrow_down() {
    return (
      <div class="pulse-mobile-calendar-group-main__header--select-month__month-list-menu--arrow-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none" fill-rule="evenodd">
            <path d="M24 24L0 24 0 0 24 0z" opacity=".87" />
            <path fill="#333333" d="M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z" />
          </g>
        </svg>
      </div>
    );
  }

  render() {
    return (
      <Host>
        <div class={{
          'pulse-mobile-calendar-group-main': true,
          ...createColorClasses(this.color, '700', false)
        }}>
          <div class="pulse-mobile-calendar-group-main__header"
              ref={el => this.mobilecalendarheaderref = el as HTMLElement}>
            <div class="pulse-mobile-calendar-group-main__header--select-month pulse-tp-hl4-comp-b"
              onClick={() => this.toggleLoading()}>
              {this.MONTHS[this.currentDateMonth.getMonth()]}&nbsp;
              <span class="pulse-mobile-calendar-group-main__header--year">{this.currentDateMonth.getFullYear()}&nbsp;</span>
              {this.renderMonthsOptionList()}
            </div>
          </div>
          <div class="pulse-mobile-calendar-group-main__body">
            <div onClick={() => this.toggleLoading()}
            class={{
              'pulse-mobile-calendar-group-main__body--overlay': true,
              'hidden': (!this.showOverlay)
            }}></div>
            <div class="pulse-mobile-calendar-group-main__body__mobile-calendar"
              style={{ maxHeight: this.height }}
              ref={el => this.mobilecalendarref = el as HTMLElement}>
              {this.monthsToRender.map((calendarDate: CalendarDate) =>
                <pulse-mobile-calendar
                  class="pulse-mobile-calendar"
                  key={`${calendarDate.month}-${calendarDate.year}`}
                  id={`pmc-${calendarDate.month}-${calendarDate.year}`}
                  showmonthtitle={false}
                  color={this.color}
                  currentDate={new Date(calendarDate.year, calendarDate.month, 1)}
                  mindate={this.mindate}
                  maxdate={this.maxdate}
                  selecteddays={this.stateValue}
                  onDateSelected={(dateEv) => this.dateSelected(dateEv)}>
                </pulse-mobile-calendar>
              )}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

interface CalendarDate {
  month: number;
  year: number;
}
