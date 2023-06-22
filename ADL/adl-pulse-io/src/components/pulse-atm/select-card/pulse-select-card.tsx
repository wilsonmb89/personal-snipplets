import { Component, Prop, h, Event, EventEmitter, Watch, Listen } from '@stencil/core';
import { Color, ColorVariant, SwitchType } from '../../../interface';
import { createColorClasses } from '../../../utils/themes';

@Component({
    tag: 'pulse-select-card',
    styleUrl: 'pulse-select-card.scss',
    shadow: true
})
export class PulseSelectCard {

    private inputId = `pulse-sc-${selectCardIds++}`;
    color: Color = 'primary';
    colorvariant: ColorVariant = '700';
    colorgradient: boolean = false;
    @Prop({ reflectToAttr: true }) disabled = false;
    @Prop({ mutable: true, reflectToAttr: true }) value?: any | null;
    @Prop({ mutable: true, reflectToAttr: true }) selected = false;
    @Prop() switchtype: SwitchType = "none";

    /**
     * Emitted when the select card is selected.
     */
    @Event() sCardSelect!: EventEmitter<any>;

    /**
     * Emitted when selected select card is selected.
     * @internal
     */
    @Event() sCardDeselect!: EventEmitter<any>;

    /**
 * Emitted when the radio loads.
 * @internal
 */
    @Event() sCardDidLoad!: EventEmitter<void>;

    /**
     * Emitted when the radio unloads.
     * @internal
     */
    @Event() sCardDidUnload!: EventEmitter<void>;


    @Watch('selected')
    selectChanged(isSelected: boolean) {
        if (isSelected) {
            this.sCardSelect.emit({
                selected: true,
                value: this.value
            });
        }
    }

    constructor() { }

    componentDidLoad() {
        if (this.selected) {
            this.selectChanged(this.selected);
        }
        this.sCardDidLoad.emit();
    }

    componentDidUnload() {
        this.sCardDidUnload.emit();
    }

    componentWillLoad() {
        if (this.value === undefined) {
            this.value = this.inputId;
        }
    }

    private onClick = () => {
        if(!this.disabled){
            if (this.selected) {
                this.sCardDeselect.emit();
            } else {
                this.selected = true;
            }
        }
    }
    @Listen('keydown')
    handleKeyDown(ev: KeyboardEvent){
      if (ev.key === 'Enter'){
        this.onClick();
      }
    }
    hostData() {
        const { disabled, color, colorgradient, colorvariant, switchtype, selected  } = this;
        return {
            class: {
                ...createColorClasses(color, colorvariant, colorgradient),
                'button-disabled': disabled,
                'pulse-focusable': true,
                'pulse-padding-m-xs-h': false,
                'pulse-padding-xs-xs-v': false,
                'btn-select--selected': selected && switchtype !== "radio",
                'btn-select--selected-green': selected && switchtype === "radio",
                'switch': (switchtype === "radio"),
            }
        };
    }

    getComponentByType() {
        switch (this.switchtype) {
            case "radio":
                return  <pulse-radio checked={this.selected} disabled={this.disabled} value={this.value} tabindex="-1"></pulse-radio>
        
            case "none" :
                return <div></div>
        }
    }

    render() {
        return (
            <div class="btn-select pulse-padding-l-xs-h pulse-padding-xs-xs-v" onClick={this.onClick}  tabindex="1">
                 { this.getComponentByType() }
                <div class="btn-select__body">
                    <div class="btn-select__regular">
                        <slot></slot>
                    </div>
                    <div class="btn-select__complex">
                        <slot name="complex"></slot>
                    </div>
                </div>
            </div>
        );
    }
}

let selectCardIds = 0;