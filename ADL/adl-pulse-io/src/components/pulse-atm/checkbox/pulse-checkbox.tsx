import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { Color, ColorVariant } from '../../../interface';
import { createColorClasses } from '../../../utils/themes';


@Component({
    tag: 'pulse-checkbox',
    styleUrl: 'pulse-checkbox.scss',
    shadow: true
})

export class PulseCheckBox {

    @Prop() disabled: boolean = false;
    @Prop() name: string;
    @Prop() value: string;
    @Prop() checked: boolean = true;
    @Prop() color: Color = "success";
    @Prop() colorvariant: ColorVariant = '700';
    @Prop() colorgradient: boolean = false;
    @Event() valueEmmit: EventEmitter<boolean>;

    constructor() { }
    hostData() {
    const { color, colorvariant, colorgradient } = this;
        return {
            class: {
                ...createColorClasses(color, colorvariant, colorgradient),
                [`checkbox-disabled`]: this.disabled,
                [`checkbox-disabled-checked`]: this.disabled && this.checked
            }
        }
    }

    handleCheck(event) {
        this.checked = event.target.checked;
        this.valueEmmit.emit(this.checked);
    }

    render() {
        return (
            <div class="checkbox">
                <input id="checkbox__input" class="checkbox__input" type="checkbox" checked={this.checked} name={this.name} value={this.value} disabled={this.disabled} onChange={(event) => this.handleCheck(event)} />
                <label htmlFor="checkbox__input" class="checkbox__label">
                    {
                        this.checked &&
                        (<svg class="icon-class" xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12">
                            <path fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M2 6l4 4 8-8" />
                        </svg>)
                    }
                </label>
            </div>
        );
    }
}