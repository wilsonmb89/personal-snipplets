import { Component, h, Element, Listen, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { Color } from '../../../interface';

@Component({
	tag: 'pulse-mobile-date-picker',
	styleUrl: 'pulse-mobile-date-picker.scss',
	shadow: true
})

export class PulseMobileDatePicker {

	private readonly MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
	private readonly MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
	private mobilecalendarref: HTMLElement;
	private formcontrolsref: HTMLElement;
	private limitDetected: boolean = false;
	private toggleScrollEvent: boolean = true;
	private timer: ReturnType<typeof setTimeout>;

	@Element() hostElement: HTMLStencilElement;

	@State() value!: Array<Date>;
	@State() monthsToShow: CalendarDate[] = [];
	@State() monthsToRender: CalendarDate[] = [];
	@State() isValidDates: boolean = false;
	@State() showMonthsOptionList: boolean = false;
	@State() currentDateMonth: CalendarDate;
	@State() minDateState: Date;
	@State() maxDateState: Date;

	@Prop() color: Color = 'primary';
	@Prop() monthsrenderrange: number = 2;
	@Prop() startlabel?: string = '';
	@Prop() endlabel?: string = '';
	@Prop() range?: boolean = false;
	@Prop() mindate?: Date;
	@Prop() maxdate?: Date;

	@Event() goBack: EventEmitter;
	@Event() confirmSelection: EventEmitter<Array<Date>>;

	@Listen('resize', { target: 'window' })
	handleScroll() {
		this.reCalculateSize();
	}

	@Watch('mindate')
	watchMindate() {
		this.validateCalendarDates();
	}

	@Watch('maxdate')
	watchMaxdate() {
		this.validateCalendarDates();
	}

	componentWillLoad(): void {
		this.monthsrenderrange = (this.monthsrenderrange < 2) ? 2 : this.monthsrenderrange;
		this.validateCalendarDates();
	}

	componentDidLoad(): void {
		this.setScrollEvents();
		this.reCalculateSize();
		this.scrollToMonth();
	}

	componentDidUpdate(): void {
		if (!!this.currentDateMonth) {
			this.toggleScrollEvent = false;
			this.scrollToMonth(true, this.currentDateMonth);
			this.currentDateMonth = null;
		}
	}

	private validateCalendarDates(): void {
		this.validateRangeDates();
		this.monthsToShow = this.getMonthsCalendarDate(this.minDateState, this.maxDateState);
		this.monthsToRender = this.getAvaliableMonthsToRender();
	}

	private setScrollEvents(): void {
    this.mobilecalendarref.addEventListener('scroll', () => {
      if (this.toggleScrollEvent) {
        this.detectCalendarLimits();
        this.fixScrollTop();
      } else {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.toggleScrollEvent = true;
        }, 300);
      }
    });
  }

	private getAvaliableMonthsToRender(): CalendarDate[] {
		let months: CalendarDate[] = [];
		if (!!this.monthsToShow) {
			const currentDateMonth = new Date();
			const calIndexFinded = this.monthsToShow.findIndex(
				cal => cal.month === currentDateMonth.getMonth()
					&& cal.year === currentDateMonth.getFullYear()
			);
			if (calIndexFinded !== -1) {
				for (let x = (this.monthsrenderrange * -1); x < (this.monthsrenderrange + 1); x++) {
					const calendarDate = this.monthsToShow[calIndexFinded + x];
					if (!!calendarDate) {
						const calendarDateDate = new Date(calendarDate.year, calendarDate.month, 1);
						const isAvaliableElement =
              (calendarDateDate.getTime() >= this.minDateState.getTime() && calendarDateDate.getTime() <= this.maxDateState.getTime()) ||
              (calendarDateDate.getMonth() === this.minDateState.getMonth() && calendarDateDate.getFullYear() === this.minDateState.getFullYear()) ||
              (calendarDateDate.getMonth() === this.maxDateState.getMonth() && calendarDateDate.getFullYear() === this.maxDateState.getFullYear());
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
			const currentMonth = this.getScrollCurrMonth();
			if (!!currentMonth) {
				const currentDateMonth = new Date(currentMonth.year, currentMonth.month, 1);
				if (currentDateMonth.getMonth() === firstMonth.month && currentDateMonth.getFullYear() === firstMonth.year) {
					const initAuxDate = new Date(currentDateMonth.getTime());
					initAuxDate.setHours(0, 0, 0, 0);
					initAuxDate.setMonth(initAuxDate.getMonth() - 1);
					months.unshift({ month: initAuxDate.getMonth(), year: initAuxDate.getFullYear() });
				}
				if (currentDateMonth.getMonth() === lastMonth.month && currentDateMonth.getFullYear() === lastMonth.year) {
					const initAuxDate = new Date(currentDateMonth.getTime());
					initAuxDate.setHours(0, 0, 0, 0);
					initAuxDate.setMonth(initAuxDate.getMonth() + 1);
					months.push({ month: initAuxDate.getMonth(), year: initAuxDate.getFullYear() });
				}
			}
    }
    return months;
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
			if (this.minDateState.getTime() < startDate.getTime()) {
				startDate.setMonth(startDate.getMonth() - 1);
				endDate = new Date(calendarDate.year, calendarDate.month, 1);
				endDate.setMonth(endDate.getMonth() - 1);
				const newElements = this.getMonthsCalendarDate(startDate, endDate);
				this.addRenderCalendarElements(true, newElements);
			}
		} else {
			const calendarDate = this.monthsToRender[this.monthsToRender.length - 1];
			endDate = new Date(calendarDate.year, calendarDate.month, 1);
			if (this.maxDateState.getTime() > endDate.getTime()) {
				endDate.setMonth(endDate.getMonth() + 1);
				startDate = new Date(calendarDate.year, calendarDate.month, 1);
				startDate.setMonth(startDate.getMonth() + 1);
				const newElements = this.getMonthsCalendarDate(startDate, endDate);
				this.addRenderCalendarElements(false, newElements);
			}
		}
		this.limitDetected = false;
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
		const currentMonth = this.getScrollCurrMonth();
		if (!!currentMonth) {
			const currentDateMonth = new Date(currentMonth.year, currentMonth.month, 1);
			if (this.mobilecalendarref.scrollTop === 0
						&& currentDateMonth.getTime() >= this.minDateState.getTime()) {
				this.mobilecalendarref.scrollTop = 3;
			}
		}
	}

	private getScrollCurrMonth(): CalendarDate {
    const calendarElement = this.mobilecalendarref;
    const monthsElements = !!calendarElement ? calendarElement.querySelectorAll('.pulse-mobile-calendar') : null;
    if (!!monthsElements && monthsElements.length > 0) {
      const offsetTopRef = (monthsElements[0] as HTMLElement).offsetTop + calendarElement.scrollTop + 50;
      const activeMonth = Array.from(monthsElements).find((monthRef: HTMLElement) => {
        const boundingClientRect = monthRef.getBoundingClientRect()
        if (offsetTopRef >= monthRef.offsetTop && offsetTopRef <= (monthRef.offsetTop + boundingClientRect.height)) {
          return monthRef;
        }
      });
      if (!!activeMonth) {
				const activeMonthData = activeMonth.id.split('-');
        return {
					month: +activeMonthData[1],
					year: +activeMonthData[2]
				};
      }
    }
		return null;
  }

	private refreshRenderedMonths(dateToGo: Date): void {
    let startDate: Date;
		let auxDate: Date;
    let endDate: Date;
    let setInTop = true;
		const currentMonth = this.getScrollCurrMonth();
		if (!!currentMonth) {
			const currentDateMonth = new Date(currentMonth.year, currentMonth.month, 1);
			if (currentDateMonth.getTime() > dateToGo.getTime()) {
				const calendarDate = this.monthsToRender[0];
				auxDate = new Date(dateToGo.getTime());
      	auxDate.setMonth(auxDate.getMonth() - 1)
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
  }

	private reCalculateSize() {
		const container: HTMLElement = this.hostElement.shadowRoot.querySelector(`.pulse-mobile-date-picker-main`);
		const header: HTMLElement = this.hostElement.shadowRoot.querySelector(`.pulse-mobile-date-picker-main__header`);
		const body: HTMLElement = this.hostElement.shadowRoot.querySelector(`.pulse-mobile-date-picker-main__body`);
		const footer: HTMLElement = this.hostElement.shadowRoot.querySelector(`.pulse-mobile-date-picker-main__footer`);

		if (container.scrollHeight >= window.innerHeight) {
			body.style.maxHeight = `${window.innerHeight - header.clientHeight - footer.clientHeight}px`;
			body.style.overflow = 'scroll';
		} else {
			const containerDiff = window.innerHeight - container.scrollHeight;
			body.style.height = `${body.scrollHeight + containerDiff}px`;
			body.style.maxHeight = null;
			body.style.overflow = 'auto';
		}
	}

	private scrollToMonth(animated = false, date?: CalendarDate): void {
		if (!!this.mobilecalendarref) {
			if (!date) {
				const newDate = new Date();
				date = { month: newDate.getMonth(), year: newDate.getFullYear() };
			}
			const refToScroll = this.mobilecalendarref.querySelector(`#pmc-${date.month}-${date.year}`);
			if (!!refToScroll) {
				refToScroll.scrollIntoView({
					block: 'center',
					behavior: animated ? 'smooth' : 'auto'
				});
			}
		}
	}

	private onInputClick(ev: MouseEvent) {
		this.showMonthsOptionList = !this.showMonthsOptionList;
		ev.stopPropagation();
	}

	private onBackHeaderClick(ev: MouseEvent) {
		ev.preventDefault();
		this.goBack.emit();
	}

	private onConfirmClick(ev: MouseEvent) {
		ev.preventDefault();
		this.confirmSelection.emit(this.value);
	}

	private dateSelected(eventDateSelected: CustomEvent<Date>): void {
		const dateSelected: Date = eventDateSelected.detail;
		if (this.range) {
			this.value = !!this.value ? this.value : [];
			const valueLength = this.value.length;
			if (valueLength === 2) {
				this.value = [];
			}
			this.value.push(dateSelected);
			this.value = this.copyValueDateArray();
		} else {
			this.value = [dateSelected];
		}
		this.validateDates();
	}

	private validateDates(): void {
		if (this.range && this.value.length === 2) {
			this.isValidDates = true;
		} else if (!this.range && this.value.length === 1) {
			this.isValidDates = true;
		} else {
			this.isValidDates = false;
		}
	}

	private copyValueDateArray(): Array<Date> {
		const result = new Array<Date>();
		this.value.forEach(date => {
			result.push(new Date(date.getTime()));
		});
		return result.sort((a, b) => a.getTime() - b.getTime());
	}

	private validateRangeDates(): void {
		const auxStartDate = new Date();
		this.minDateState = !!this.mindate ? new Date(this.mindate.getTime()) : new Date(auxStartDate.setMonth(auxStartDate.getMonth() - 24));
		this.minDateState.setHours(0, 0, 0, 0);
		const auxEndDate = new Date();
		this.maxDateState = !!this.maxdate ? new Date(this.maxdate.getTime()) : new Date(auxEndDate.setMonth(auxEndDate.getMonth() + 24));
		this.maxDateState.setHours(0, 0, 0, 0);
	}

	private goSelectedMonth(ev: Event): void {
		const eventValue = (ev.target as HTMLInputElement).value;
		const dateValue = eventValue.split('-');
		const dateToGo = new Date(+dateValue[1], +dateValue[0], 1);
		this.refreshRenderedMonths(dateToGo);
		this.showMonthsOptionList = false;
		const selectRef = this.formcontrolsref.querySelectorAll('select');
		selectRef.forEach((sel: HTMLSelectElement) => sel.value = eventValue);
		this.currentDateMonth = {
			month: dateToGo.getMonth(),
			year: dateToGo.getFullYear()
		}
	}

	private formControl(label: string, name: string, position: number) {
		const value = !!this.value && !!this.value[position] ? this.value[position] : null;
		return (
			<div class="pulse-mobile-date-picker-main__header__form-controls__form-control">
				<label class="pulse-mobile-date-picker-main__header__form-controls__form-control--label pulse-tp-hl6-comp-m">{label}</label>
				<div class="pulse-mobile-date-picker-main__header__form-controls__form-control--control-wrapper">
					<pulse-input type="text"
						onInputClick={ev => this.onInputClick(ev.detail)}
						readonly={true}
						value={!!value ? `${value.getDate() < 10 ? `0${value.getDate()}` : value.getDate()} ${this.MONTHS_SHORT[value.getMonth()]} ${value.getFullYear()}` : ''}
						name={name} placeholder="DD-MM-AAAA"></pulse-input>
					{this.selectListMonths(position)}
				</div>
			</div>
		)
	}

	private selectListMonths(position: number) {
		return (
			<select class="pulse-mobile-date-picker-main__header__form-controls__form-control--control-wrapper__month-select"
				name={`form-select-${position}`}
				id={`form-select-${position}`}
				onChange={(ev) => this.goSelectedMonth(ev)}>
				<option value="-">Seleccione una opción</option>
				{this.monthsToShow.map(date =>
					<option key={`${this.MONTHS[date.month]} ${date.year}`}
						value={`${date.month}-${date.year}`}>
						{`${this.MONTHS[date.month]} ${date.year}`}
					</option>
				)}
			</select>
		);
	}

	private separator() {
		return (
			<div class="pulse-mobile-date-picker-main__header__form-controls__separator">
				<div class="pulse-mobile-date-picker-main__header__form-controls__separator--line"></div>
			</div>
		)
	}

	render() {
		return (
			<div class="pulse-mobile-date-picker-main">
				<div class="pulse-mobile-date-picker-main__header">
					<pulse-flowth onClick={(ev) => this.onBackHeaderClick(ev)} showLeft={true} showRight={false}>
						<div slot="left-content" >
							<pulse-nav-button></pulse-nav-button>
						</div>
						<div slot="content">
							<span class="pulse-tp-bo2-comp-m">
								Selecciona {!!this.range ? 'tus fechas' : 'la fecha'}
							</span>
						</div>
					</pulse-flowth>
					<div class="pulse-mobile-date-picker-main__header--hr"></div>
					<div class={{
						'pulse-mobile-date-picker-main__header__form-controls': true,
						'ranged': !!this.range
					}}
						ref={el => this.formcontrolsref = el as HTMLElement}>
						{this.formControl(
							`${!!this.range ?
								(!!this.startlabel ? this.startlabel : 'Desde') :
								(!!this.startlabel ? this.startlabel : 'Fecha')}`, 'from', 0
						)}
						{!this.range ? null : this.separator()}
						{!this.range ? null : this.formControl((!!this.endlabel ? this.endlabel : 'Hasta'), 'to', 1)}
					</div>
				</div>
				<div class="pulse-mobile-date-picker-main__body">
					<div onClick={() => this.showMonthsOptionList = !this.showMonthsOptionList}
						class={{
							'pulse-mobile-date-picker-main__body--overlay': true,
							'hidden': !this.showMonthsOptionList
						}}>
					</div>
					<div class="pulse-mobile-date-picker-main__body__mobile-calendar"
						ref={el => this.mobilecalendarref = el as HTMLElement}>
						{this.monthsToRender.map((calendarDate: CalendarDate) =>
							<pulse-mobile-calendar
								class="pulse-mobile-calendar"
								key={`${calendarDate.month}-${calendarDate.year}`}
								id={`pmc-${calendarDate.month}-${calendarDate.year}`}
								color={this.color}
								currentDate={new Date(calendarDate.year, calendarDate.month, 1)}
								mindate={this.minDateState}
								maxdate={this.maxDateState}
								selecteddays={this.value}
								onDateSelected={(dateEv) => this.dateSelected(dateEv)}>
							</pulse-mobile-calendar>
						)}
					</div>
				</div>
				<div class="pulse-mobile-date-picker-main__footer">
					<div class="pulse-mobile-date-picker-main__footer__btn-wrapper">
						<pulse-button onClick={(ev) => this.onConfirmClick(ev)}
							id="btn-opt-main-action"
							disabled={!this.isValidDates}
							color={this.color}
							pulse-button-type="primary"
							block={true}
							colorgradient={true}>Confirmar</pulse-button>
					</div>
				</div>
			</div>
		)
	}
}
interface CalendarDate {
	month: number;
	year: number;
}
