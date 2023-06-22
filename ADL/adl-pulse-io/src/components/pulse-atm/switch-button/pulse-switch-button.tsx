/** * @author <a href="mailto:juan.gonzalez@avaldigitallabs.com">barto</a> */

import { Component, Prop, Event, EventEmitter, Method, h } from "@stencil/core";
import { Color, ColorVariant } from "../../../interface";
import { createColorClasses } from "../../../utils/themes";

@Component({
    tag: 'pulse-switch-button',
    styleUrl: 'pulse-switch-button.scss',
    shadow: true
})
/**
 * Componente para un switch button
 */
export class PulseSwitchButton {

    baseClassName = 'switch-container';
    trackClassName = `${this.baseClassName}__track`;
    thumbClassName = `${this.baseClassName}__thumb pulse-padding-s-xs-a`;
    @Prop() color: Color;
    @Prop() colorvariant: ColorVariant = '700';
    @Prop() colorgradient: boolean = false;
    @Prop({ mutable: true}) inputstate = false;

    @Event() switchChange: EventEmitter<boolean>;

    @Method()
    async changeStateSwitch(){
        this.toggleSwitch();
    }

    toggleSwitch = () => {
        this.inputstate = !this.inputstate;
        this.updateSwitchClass(this.inputstate);
        this.switchChange.emit(this.inputstate);
    }

    constructor() { }


    updateSwitchClass(newValue: boolean) {

        if (newValue) {
            this.trackClassName += ` ${this.baseClassName}__track--active`;
            this.thumbClassName += ` ${this.baseClassName}__thumb--active`;
        } else {
            this.trackClassName = `${this.baseClassName}__track`;
            this.thumbClassName = `${this.baseClassName}__thumb pulse-padding-s-xs-a`;
        }
    }

    hostData() {
        const { color, colorgradient, colorvariant } = this;
        return {
            class: {
                ...createColorClasses(color, colorvariant, colorgradient),
            }
        }
    }

    render() {
        this.updateSwitchClass(this.inputstate);
        return (
            <div class="switch-container" onClick={this.toggleSwitch}>
                <div class={this.trackClassName}></div>
                <div class={this.thumbClassName}><slot></slot></div>
            </div>
        );
    }
}