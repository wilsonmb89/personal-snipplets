import { Component, h, Host, Element, Prop, Event, EventEmitter, State } from '@stencil/core';
import { Color } from '../../../interface';

@Component({
    tag: 'pulse-date-picker',
    styleUrl: 'pulse-date-picker.scss',
    shadow: true
})
export class PulseDatePicker {

    @Element() el!: HTMLElement;

    private MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

    @State() isShowCalendar = false;
    @Prop() value!: Array<Date>;
    @Prop() range?: boolean = false;
    @Prop() color?: Color = 'primary';
    @Prop() maxDate?: Date;
    @Prop() minDate?: Date;
    @Prop() disabled?: boolean = false;
    @Prop() startlabel?: string = '';
	@Prop() endlabel?: string = '';
    @Event() datePickerChange: EventEmitter<Array<Date>>;

    componentDidLoad() {
        document.addEventListener('click', () => {
            this.isShowCalendar = false;
        });
    }

    onCalendarChange(value: Array<Date>) {
        this.value = value;
        this.isShowCalendar = !(!this.range && this.value.length === 1 || this.range && this.value.length === 2)
        this.datePickerChange.emit(value);
    }

    onFormInputFocus(ev: MouseEvent) {
        ev.stopPropagation();
        this.isShowCalendar = this.isShowCalendar ? this.isShowCalendar : !this.isShowCalendar;
    }

    onInputKeyDown() {
        document.onkeydown = () => false;
    }

    onInputKeyUp() {
        document.onkeydown = e => e;
    }

    onInputClick(ev: MouseEvent) {
        ev.stopPropagation();
    }

    onCalendarClick(ev: MouseEvent) {
        ev.stopPropagation();
    }

    formControl(label: string, name: string, position: number) {

        const value = !!this.value && !!this.value[position] ? this.value[position] : null;

        return (
            <div class="picker-form-container__form-control">
                <label class="picker-form-container__form-control--label pulse-tp-hl6-comp-m">{label}</label>
                <pulse-input type="text" onInputKeyDown={() => this.onInputKeyDown()}
                    onInputClick={ev => this.onInputClick(ev.detail)}
                    onInputKeyUp={() => this.onInputKeyUp()} onInputFocus={ev => this.onFormInputFocus(ev.detail)}
                    value={!!value ? `${value.getDate() < 10 ? `0${value.getDate()}` : value.getDate()} ${this.MONTHS[value.getMonth()]} ${value.getFullYear()}` : ''}
                    name={name} placeholder="DD-MM-AAAA" disabled={this.disabled}></pulse-input>
            </div>
        )
    }

    separator() {
        return (
            <div class="picker-form-container__separator">
                <div class="picker-form-container__separator--line"></div>
            </div>
        )
    }

    render() {
        return (
            <Host class="date-picker">
                <div>
                    <div class="picker-form-container">
                        {this.formControl(
                            `${!!this.range ?
                                (!!this.startlabel ? this.startlabel : 'Desde') :
                                (!!this.startlabel ? this.startlabel : 'Fecha')}`, 'from', 0
                        )}
                        {!this.range ? null : this.separator()}
                        {!this.range ? null : this.formControl((!!this.endlabel ? this.endlabel : 'Hasta'), 'to', 1)}
                    </div>
                    {this.isShowCalendar ?
                        <pulse-calendar class="picker-form-container__calendar"
                            range={this.range}
                            maxDate={this.maxDate}
                            minDate={this.minDate}
                            value={this.value}
                            color={this.color}
                            onClick={ev => this.onCalendarClick(ev)}
                            onCalendarChange={ev => this.onCalendarChange(ev.detail)}
                        ></pulse-calendar> : ''
                    }
                </div>
            </Host >
        )
    }
}