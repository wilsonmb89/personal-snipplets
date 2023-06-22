import { Component, h, Host, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';
import { Color, CssClassMap } from '../../../interface';
import { createColorClasses } from '../../../utils/themes';

@Component({
  tag: 'pulse-mobile-calendar',
  styleUrl: 'pulse-mobile-calendar.scss',
  shadow: true
})
export class PulseMobileCalendar {

  private readonly LABEL_DAY = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];
  private readonly MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  @State() weeksForShow: Array<Array<CalendarDay>>;

  @Prop() currentDate!: Date;
  @Prop() maxdate?: Date;
  @Prop() mindate?: Date;
  @Prop() selecteddays?: Array<Date> = [];
  @Prop() showmonthtitle?: boolean = true;
  @Prop() color: Color = 'primary';

  @Event() dateSelected: EventEmitter<Date>;

  constructor() {}

  componentWillLoad(): void {
    this.weeksForShow = this.getWeeksForMonth();
  }

  @Watch('selecteddays')
  selectedDaysUpdate(): void {
    this.weeksForShow = this.getWeeksForMonth();
  }

  private getWeeksForMonth(): Array<Array<CalendarDay>> {
    const month: number = this.currentDate.getMonth();
    const year: number = this.currentDate.getFullYear();
    const initialDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dayInFirstWeek = initialDay.getDay() === 0 ? 7 : initialDay.getDay();
    const weeks: Array<Array<CalendarDay>> = [];
    let counter = 1;
    do {
      const newWeek: Array<CalendarDay> = [];
      for (let j = 1; j <= 7; j++) {
        if ((weeks.length === 0 && j < dayInFirstWeek) || (counter > lastDay.getDate())) {
          newWeek.push(null);
        } else {
          const auxDate = new Date(year, month, counter);
          const newDate: NewDate = {
            day: counter,
            month: month,
            year: year,
            time: auxDate.getTime(),
            dayOfWeek: auxDate.getDay()
          };
          newWeek.push(this.buildCalendarDay(newDate));
          counter++;
        }
      }
      weeks.push(newWeek);
    } while (counter <= lastDay.getDate());
    return weeks;
  }

  private buildCalendarDay(newDate: NewDate): CalendarDay {
    const newCalendarDay: CalendarDay = {
      date: newDate,
      active: this.dayIsActive(newDate),
      ranged: this.dayIsRanged(newDate),
      selected: this.dayIsSelected(newDate)
    };
    return newCalendarDay;
  }

  private dayIsActive(date: NewDate): boolean {
    if (!!this.mindate && date.time < this.mindate.getTime()) {
      return false;
    } else if (!!this.maxdate && date.time > this.maxdate.getTime()) {
      return false;
    }
    return true;
  }

  private dayIsRanged(date: NewDate): Ranged {
    if (!!this.selecteddays && this.selecteddays.length > 1) {
      const startDate = this.selecteddays[0];
      const endDate = this.selecteddays[1];
      if (date.time > startDate.getTime() && date.time < endDate.getTime()) {
        const auxDate = new Date(date.year, date.month + 1, 0);
        return {
          isRanged: true,
          left: (date.dayOfWeek === 1 || date.day === 1),
          right: (date.dayOfWeek === 0 || date.day === auxDate.getDate())
        };
      }
      return { isRanged: false };
    }
    return { isRanged: false };
  }

  private dayIsSelected(date: NewDate): Selected {
    if (!!this.selecteddays && this.selecteddays.length > 1) {
      const startDate = this.selecteddays[0];
      const endDate = this.selecteddays[1];
      const auxDate = new Date(date.year, date.month + 1, 0);
      if (date.time === startDate.getTime() || date.time === endDate.getTime()) {
        return {
          isSelected: true,
          start: date.time === startDate.getTime() 
            && date.day !== auxDate.getDate() 
            && startDate.getTime() !== endDate.getTime(),
          end: date.time === endDate.getTime()
            && date.day !== 1
            && startDate.getTime() !== endDate.getTime()
        };
      }
      return { isSelected: false };
    } else if (!!this.selecteddays && this.selecteddays.length > 0) {
      const startDate = this.selecteddays[0];
      if (date.time === startDate.getTime()) {
        return {
          isSelected: true,
          start: false,
          end: false
        };
      }
      return { isSelected: false };
    } else {
      return { isSelected: false };
    }
  }

  private createDayClasses(calendarDay: CalendarDay): CssClassMap | undefined {
    return !!calendarDay ? {
      'active': calendarDay.active,
      'inactive': !calendarDay.active,
      'selected': calendarDay.selected.isSelected,
      'start': calendarDay.selected.isSelected && !!calendarDay.selected.start,
      'end': calendarDay.selected.isSelected && !!calendarDay.selected.end,
      'ranged': calendarDay.ranged.isRanged,
      'rounded-left': calendarDay.ranged.isRanged && !!calendarDay.ranged.left,
      'rounded-right': calendarDay.ranged.isRanged && !!calendarDay.ranged.right
    } : undefined;
  }

  private selectedDay(selectDay: CalendarDay): void {
    if (!!selectDay && selectDay.active) {
      const newDate = selectDay.date;
      const emitDate = new Date(newDate.year, newDate.month, newDate.day);
      this.dateSelected.emit(emitDate);
    }
  }

  render() {
    return (
      <Host>
        
        <div class={{
          'pulse-mobile-calendar-main': true,
          ...createColorClasses(this.color, '700', false)
        }}>
          <div class="pulse-mobile-calendar-main__header">
            {this.showmonthtitle && <div class="pulse-mobile-calendar-main__header--date-title">
              <span class="pulse-tp-bo2-comp-b">{this.MONTHS[this.currentDate.getMonth()]} </span>
              <span class="pulse-tp-bo2-comp-r">{this.currentDate.getFullYear()}</span>
            </div>}
            <div class="pulse-mobile-calendar-main__header--days-title pulse-tp-bo3-comp-r">
              {this.LABEL_DAY.map(labelDay =>
                <div key={labelDay} class="pulse-mobile-calendar-main__header--days-title__day">{labelDay}</div>
              )}
            </div>
          </div>
          <div class="pulse-mobile-calendar-main__body">
            <div class="pulse-mobile-calendar-main__body__calendar pulse-tp-bo3-comp-m">
              {this.weeksForShow.map((week: [], indexMonth: number) =>
                <div key={`week-${indexMonth}`} class="pulse-mobile-calendar-main__body__calendar__week">
                  {week.map((calendarDay: CalendarDay, indexDay: number) => 
                    <div key={`day-${indexDay}`} 
                    class={{
                      'pulse-mobile-calendar-main__body__calendar__week__day': true,
                      ...this.createDayClasses(calendarDay)
                    }}
                    onClick={() => this.selectedDay(calendarDay)}>
                      {(!!calendarDay) ? calendarDay.date.day : ''}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

interface CalendarDay {
  date: NewDate;
  active: boolean;
  selected: Selected
  ranged: Ranged
}

interface NewDate {
  day: number,
  month: number,
  year: number,
  time: number,
  dayOfWeek: number
}
interface Ranged {
  isRanged: boolean;
  left?: boolean;
  right?: boolean;
}

interface Selected {
  isSelected: boolean;
  start?: boolean;
  end?: boolean;
}
