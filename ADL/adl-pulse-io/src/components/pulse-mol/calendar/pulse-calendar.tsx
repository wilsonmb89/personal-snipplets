import { Component, h, State, Element, Host, Prop, Event, EventEmitter, Listen, Watch } from '@stencil/core';
import { Color } from '../../../interface';
import { createColorClasses } from '../../../utils/themes';

@Component({
    tag: 'pulse-calendar',
    styleUrl: 'pulse-calendar.scss',
    scoped: true
})
export class PulseCalendar {

    private LABEL_DAY = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];
    private MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    private elementsHover: Array<HTMLElement> = [];
    private elFirstValue: HTMLElement;
    private currentDateMonth: Date;

    @Element() el!: HTMLElement;
    @State() weeksForShow: Array<Array<Date>>;
    @State() showMonthsOptionList: boolean = false;
    @State() monthsOptionList: CalendarDate[] = [];
    @Event() calendarChange: EventEmitter<Array<Date>>;
    @Prop() color: Color = 'primary';
    @Prop() range?: boolean = false;
    @Prop() maxDate?: Date;
    @Prop() minDate?: Date;
    @Prop() value?: Array<Date> = [];

    @Listen('valueChange')
    onMenuValueChange(ev: CustomEvent) {
        const dateValue = ev.detail.detail.split('-');
        this.setCurrentDate(dateValue[0], dateValue[1]);
        this.validateRangeDates();
        this.monthsOptionList = this.getAvaliableMonthsOptionList();
        this.showMonthsOptionList = false;
    }

    @Watch('value')
    onCalendarValueChange(): void {
        if (!!this.value && this.value.length > 0) {
            const startDate = this.value[0];
            this.setCurrentDate(startDate.getMonth(), startDate.getFullYear());
        }
    }

    componentWillLoad() {
        this.validateRangeDates();
        this.monthsOptionList = this.getAvaliableMonthsOptionList();
        this.currentDateMonth = Array.isArray(this.value) && this.isValidDate(this.value[0]) ? new Date(this.value[0]) : new Date();
        this.weeksForShow = this.getWeeksForMonth(this.currentDateMonth.getMonth(), this.currentDateMonth.getFullYear());
    }

    private setCurrentDate(month: number, year: number) {
        this.currentDateMonth.setMonth(month);
        this.currentDateMonth.setFullYear(year);
        this.weeksForShow = this.getWeeksForMonth(this.currentDateMonth.getMonth(), this.currentDateMonth.getFullYear());
    }

    addStyleHover(newElement: HTMLElement, oldElement: HTMLElement, sibling: string, size: number) {

        if (this.elementsHover.length < size - 1) {

            if (!!newElement) {

                const isEmpty = Array(newElement.classList).map(e => e.value).filter((e: string) => e.includes('day-empty')).length > 0;
                if (!isEmpty) {
                    this.elementsHover.push(newElement);
                    newElement.classList.add('day-hover');
                    this.addStyleHover(
                        sibling === 'previous' ?
                            newElement.previousElementSibling as HTMLElement :
                            newElement.nextElementSibling as HTMLElement,
                        newElement,
                        sibling,
                        size
                    );
                }

            } else if (!!oldElement.parentElement) {

                if (sibling === 'previous' && !!oldElement.parentElement.previousElementSibling) {

                    this.addStyleHover(
                        oldElement.parentElement.previousElementSibling.lastElementChild as HTMLElement,
                        null,
                        sibling,
                        size
                    );

                } else if (sibling === 'next' && !!oldElement.parentElement.nextElementSibling) {

                    this.addStyleHover(
                        oldElement.parentElement.nextElementSibling.firstElementChild as HTMLElement,
                        null,
                        sibling,
                        size
                    );
                }
            }
        }
    }

    mouseOverDay(ev: MouseEvent, day: Date) {

        if (!!day && this.range && this.value.length === 1) {

            const elMouseOver: HTMLElement = ev.srcElement as HTMLElement;

            if (day.getTime() < this.value[0].getTime()) {

                elMouseOver.classList.add('range-direction-right');
                this.elFirstValue.classList.add('range-direction-left');

                this.addStyleHover(
                    elMouseOver.nextElementSibling as HTMLElement,
                    elMouseOver,
                    'next',
                    (this.value[0].getTime() - day.getTime()) / (1000 * 3600 * 24)
                );

            } else if (day.getTime() > this.value[0].getTime()) {

                elMouseOver.classList.add('range-direction-left');
                this.elFirstValue.classList.add('range-direction-right');

                this.addStyleHover(
                    elMouseOver.previousElementSibling as HTMLElement,
                    elMouseOver,
                    'previous',
                    (day.getTime() - this.value[0].getTime()) / (1000 * 3600 * 24)
                );
            }
        }
    }

    mouseOutDay(ev: MouseEvent, day: Date) {

        if (!!day && this.range && this.value.length === 1) {

            const elMouseOut: HTMLElement = ev.srcElement as HTMLElement;

            if (!!elMouseOut) {
                elMouseOut.classList.remove('range-direction-right');
                elMouseOut.classList.remove('range-direction-left');
            }

            if (!!this.elFirstValue) {
                this.elFirstValue.classList.remove('range-direction-right');
                this.elFirstValue.classList.remove('range-direction-left');
            }

            this.elementsHover.forEach((e: HTMLElement) => {
                e.classList.remove('day-hover');
            });

            this.elementsHover = [];
        }
    }

    refFirstValue(ev: HTMLDivElement, day: Date) {
        if (this.value.length === 1 && this.value[0].getTime() === day.getTime()) {
            this.elFirstValue = ev;
        }
    }

    isValidDate(d: any) {
        return d instanceof Date && !isNaN(+d);
    }

    getWeeksForMonth(month: number, year: number): Array<Array<Date>> {

        const initialDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const dayInFirstWeek = initialDay.getDay() === 0 ? 7 : initialDay.getDay();
        const weeks: Array<Array<Date>> = [];
        let counter = 1;

        do {
            const newWeek: Array<Date> = [];
            for (let j = 1; j <= 7; j++) {
                if ((weeks.length === 0 && j < dayInFirstWeek) || (counter > lastDay.getDate())) {
                    newWeek.push(null);
                } else {
                    newWeek.push(new Date(year, month, counter));
                    counter++;
                }
            }
            weeks.push(newWeek);
        } while (counter <= lastDay.getDate());

        return weeks;
    }

    changeMonth(num: number) {
        this.currentDateMonth.setMonth(this.currentDateMonth.getMonth() + num);
        this.weeksForShow = this.getWeeksForMonth(this.currentDateMonth.getMonth(), this.currentDateMonth.getFullYear());
        this.monthsOptionList = this.getAvaliableMonthsOptionList();
    }

    isPreviousMonthDisabled(minDate: Date, currentDateMonth: Date): boolean {
        if (!minDate) {
            return !!minDate;
        }
        return (minDate.getMonth() >= currentDateMonth.getMonth() && minDate.getFullYear() === currentDateMonth.getFullYear()) ||
            minDate.getFullYear() > currentDateMonth.getFullYear();
    }

    isNextMonthDisabled(maxDate: Date, currentDateMonth: Date): boolean {
        if (!maxDate) {
            return !!maxDate;
        }
        return (maxDate.getMonth() <= currentDateMonth.getMonth() && maxDate.getFullYear() === currentDateMonth.getFullYear()) ||
            maxDate.getFullYear() < currentDateMonth.getFullYear();
    }

    selectedDay(ev: MouseEvent, selectDay: Date) {
        let _value = [...this.value];

        if (this.range && _value.length === 1) {

            if (selectDay < _value[0]) {
                _value.unshift(selectDay);
            } else {
                _value.push(selectDay);
            }

        } else {
            this.elFirstValue = ev.srcElement as HTMLElement;
            _value = [selectDay];
        }

        this.value = _value;
        this.calendarChange.emit(_value);
    }

    arrow() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" fill-rule="evenodd">
                    <path d="M0 0L24 0 24 24 0 24z" />
                    <path fill="#FFF" d="M14.71 6.71c-.39-.39-1.02-.39-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L10.83 12l3.88-3.88c.39-.39.38-1.03 0-1.41z" />
                </g>
            </svg>
        )
    }

    arrow_down() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" fill-rule="evenodd">
                    <path d="M24 24L0 24 0 0 24 0z" opacity=".87" />
                    <path fill="#FFF" d="M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z" />
                </g>
            </svg>
        )
    }

    renderMonthsOptionList() {
        return (
            <div class={{
                ['calendar-container__switch-header--select-month__month-list-menu']: true,
                ['active']: this.showMonthsOptionList

            }}
            >
                {this.arrow_down()}
                <div class={{
                    "calendar-container__switch-header--select-month__month-list-menu--menu": true,
                    ...createColorClasses('white', '700')
                }}
                    onClick={() => this.showMonthsOptionList = !this.showMonthsOptionList}>
                    <pulse-option-menu height="21.4rem" show={this.showMonthsOptionList}>
                        {this.monthsOptionList.map(
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

    private validateRangeDates(): void {
        const auxStartDate = new Date();
        this.minDate = !!this.minDate ? this.minDate : new Date(auxStartDate.setMonth(auxStartDate.getMonth() - 24));
        this.minDate.setHours(0, 0, 0, 0);
        this.maxDate = !!this.maxDate ? this.maxDate : new Date();
        this.maxDate.setHours(0, 0, 0, 0);
    }

    getAvaliableMonthsOptionList(): CalendarDate[] {
        const startYear = this.minDate.getFullYear()
        const startMonth = this.minDate.getMonth();
        const endYear = this.maxDate.getFullYear();
        const endMonth = this.maxDate.getMonth();
        let dates: CalendarDate[] = [];
        for (let year = startYear; year <= endYear; year++) {
        let month = year === startYear ? startMonth : 0;
        const monthLimit = year === endYear ? endMonth : 11;
            for (; month <= monthLimit; month++) {
                dates.push({ month, year });
            }
        }
        const auxDate = new Date();
        let filterDate: CalendarDate = { month: auxDate.getMonth(), year: auxDate.getFullYear() };
        if (!!this.currentDateMonth) {
            filterDate = { month: this.currentDateMonth.getMonth(), year: this.currentDateMonth.getFullYear() };
        }
        dates = dates.filter(date => !(date.month === filterDate.month && date.year === filterDate.year));
        return dates.reverse();
    }


    render() {

        const lastDay = new Date(this.currentDateMonth.getFullYear(), this.currentDateMonth.getMonth() + 1, 0);

        return (
            <Host class="pulse-calendar">
                <pulse-card color={this.color}>
                    <div class="calendar-container">
                        <div class="calendar-container__switch-header">
                            <div class={
                                {
                                    'calendar-container__switch-header--previous': true,
                                    'disabled': this.isPreviousMonthDisabled(this.minDate, this.currentDateMonth)
                                }
                            } onClick={() => this.isPreviousMonthDisabled(this.minDate, this.currentDateMonth) ? null : this.changeMonth(-1)}
                            >
                                {this.arrow()}
                            </div>
                            <div class="calendar-container__switch-header--select-month pulse-tp-hl4-comp-b"
                                onClick={() => this.showMonthsOptionList = !this.showMonthsOptionList}>
                                {this.MONTHS[this.currentDateMonth.getMonth()]}&nbsp;
                                <span class="calendar-container__switch-header--year">{this.currentDateMonth.getFullYear()}&nbsp;</span>
                                {this.renderMonthsOptionList()}
                            </div>
                            <div class={
                                {
                                    'calendar-container__switch-header--next': true,
                                    'disabled': this.isNextMonthDisabled(this.maxDate, this.currentDateMonth)
                                }
                            } onClick={() => this.isNextMonthDisabled(this.maxDate, this.currentDateMonth) ? null : this.changeMonth(1)}
                            >
                                {this.arrow()}
                            </div>
                        </div>
                        <div class="calendar-container__days-header">
                            {this.LABEL_DAY.map((day: string) =>
                                <div class="calendar-container__days-header--day-label pulse-tp-hl6-comp-b">{day}</div>
                            )}
                        </div>
                        <div class="calendar-container__month">
                            {this.showMonthsOptionList && <div class="calendar-container__month--overlay"></div>}
                            <div class="calendar-container-weeks">
                                {this.weeksForShow.map((week: []) =>
                                    <div class="calendar-container-weeks__week">
                                        {week.map((day: Date, indexWeek: number) => {
                                            if (!!day && ((!!this.minDate && day.getTime() < this.minDate.getTime()) || (!!this.maxDate && day.getTime() > this.maxDate.getTime()))) {
                                                return (
                                                    <div class="calendar-container-weeks__week--day-disabled pulse-tp-hl5-comp-m pulse-color-gradient">{day.getDate()}</div>
                                                )
                                            } else if (!!day) {
                                                return (
                                                    <div
                                                        class={
                                                            {
                                                                'calendar-container-weeks__week--day': this.value.filter(e => e.getTime() === day.getTime()).length === 0,
                                                                'pulse-tp-hl5-comp-m': this.value.filter(e => e.getTime() === day.getTime()).length === 0,
                                                                'calendar-container-weeks__week--day-selected': this.value.filter(e => e.getTime() === day.getTime()).length > 0,
                                                                'pulse-tp-hl5-comp-b': this.value.filter(e => e.getTime() === day.getTime()).length > 0,
                                                                'day-hover': this.range && this.value.length === 2 && day.getTime() > this.value[0].getTime() && day.getTime() < this.value[1].getTime(),
                                                                'day-hover-first': day.getDate() === 1 || indexWeek === 0,
                                                                'day-hover-last': day.getDate() === lastDay.getDate() || indexWeek === 6,
                                                                'range-direction-left': this.range && this.value.length === 2 && day.getTime() === this.value[1].getTime(),
                                                                'range-direction-right': this.range && this.value.length === 2 && day.getTime() === this.value[0].getTime()
                                                            }
                                                        }
                                                        onClick={(ev) => this.selectedDay(ev, day)}
                                                        onMouseOver={(ev) => this.mouseOverDay(ev, day)}
                                                        onMouseOut={(ev) => this.mouseOutDay(ev, day)}
                                                        ref={(ev) => this.refFirstValue(ev, day)}
                                                    >
                                                        {!!day ? day.getDate() : ''}
                                                    </div>
                                                )
                                            } {
                                                return (
                                                    <div class="calendar-container-weeks__week--day-empty"></div>
                                                )
                                            }
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </pulse-card>
            </Host>
        )
    }

}

interface CalendarDate {
    month: number;
    year: number;
}
