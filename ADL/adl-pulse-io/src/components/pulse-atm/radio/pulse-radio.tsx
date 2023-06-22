import { Component, Prop, Event, EventEmitter, h, Watch } from '@stencil/core';
import { Color, ColorVariant } from '../../../interface';
import { createColorClasses } from '../../../utils/themes';


@Component({
    tag: 'pulse-radio',
    styleUrl: 'pulse-radio.scss',
    shadow: true
})

export class PulseRadio {
    private inputId = `pulse-rb-${radioButtonIds++}`;
    @Prop() disabled: boolean = false;
    @Prop() label: string;
    @Prop() name: string = this.inputId;
    @Prop({ mutable: true }) value?: any | null;
    @Prop() checked: boolean = false;
    @Prop() color: Color = "success";
    @Prop() colorvariant: ColorVariant = '700';
    @Prop() colorgradient: boolean = false;
    @Event() valueEmmit: EventEmitter<boolean>;

    /**
     * Emitted when the radio button is selected.
     */
    @Event() radioSelect!: EventEmitter<any>;

    /**
     * Emitted when checked radio button is selected.
     * @internal
     */
    @Event() radioDeselect!: EventEmitter<any>;


    /**
     * Emitted when the radio loads.
     * @internal
     */
    @Event() radioDidLoad!: EventEmitter<void>;

    /**
     * Emitted when the radio unloads.
     * @internal
     */
    @Event() radioDidUnload!: EventEmitter<void>;

    constructor() { }

    componentWillLoad() {
        if (this.value === undefined) {
            this.value = this.inputId;
        }
    }

    hostData() {
        const { color, colorgradient, colorvariant } = this;
        return {
            class: {
                ...createColorClasses(color, colorvariant, colorgradient),
                [`radio-disabled`]: this.disabled && !this.checked,
                [`radio-disabled-checked`]: this.disabled && this.checked
            }
        }
    }
    @Watch('checked')
    checkedChanged(isChecked: boolean) {
        if (isChecked) {
            this.radioSelect.emit({
                checked: true,
                value: this.value
            });
        }
    }
    componentDidLoad() {
        this.radioDidLoad.emit();
    }

    componentDidUnload() {
        this.radioDidUnload.emit();
    }


    private onClick = () => {
        if (this.checked) {
            this.radioDeselect.emit();
        } else {
            this.checked = true;
        }
    }

    render() {
        return (
            <div class="radio">
                <input id="radio__input" class="radio__input" type="radio" checked={this.checked} name={this.name} value={this.value} disabled={this.disabled} onClick={this.onClick} />
                <label htmlFor="radio__input" class="radio__label">{this.label}</label>
            </div>
        );
    }
}

let radioButtonIds = 0;