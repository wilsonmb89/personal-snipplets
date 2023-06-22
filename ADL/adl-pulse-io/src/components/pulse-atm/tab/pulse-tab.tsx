import { Component, Prop, h, Event, EventEmitter, Watch } from '@stencil/core';
import { Color, ColorVariant } from '../../../interface';
import { createColorClasses } from '../../../utils/themes';
// import { createColorClasses } from '../../../utils/themes';

@Component({
    tag: 'pulse-tab',
    styleUrl: 'pulse-tab.scss',
    shadow: true
})
export class PulseTab {

    private inputId = `pulse-tab-${tabIds++}`;
    @Prop() color: Color = 'primary';
    @Prop() colorvariant: ColorVariant = '700';
    @Prop() colorgradient: boolean = false;
    @Prop({ reflectToAttr: true }) disabled = false;
    @Prop() tabtext: string;

    @Prop({ mutable: true, reflectToAttr: true }) value?: any | null;
    @Prop({ mutable: true, reflectToAttr: true }) selected = false;

    /**
     * Emitted when the select card is selected.
     */
    @Event() tabSelect!: EventEmitter<any>;

    /**
     * Emitted when selected select card is selected.
     * @internal
     */
    @Event() tabDeselect!: EventEmitter<any>;

    /**
 * Emitted when the radio loads.
 * @internal
 */
    @Event() tabDidLoad!: EventEmitter<void>;

    /**
     * Emitted when the radio unloads.
     * @internal
     */
    @Event() tabDidUnload!: EventEmitter<void>;


    @Watch('selected')
    selectChanged(isSelected: boolean) {
        if (isSelected) {
            this.tabSelect
                .emit({
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
        this.tabDidLoad.emit();
    }

    componentDidUnload() {
        this.tabDidUnload.emit();
    }

    componentWillLoad() {
        if (this.value === undefined) {
            this.value = this.inputId;
        }
    }

    private onClick = () => {
        if (this.selected) {
            this.tabDeselect.emit();
        } else {
            this.selected = true;
        }
    }

    hostData() {
        const { disabled, color, colorvariant, colorgradient } = this;
        return {
            class: {
                ...createColorClasses(color, colorvariant, colorgradient),
                'button-disabled': disabled,
                'pulse-focusable': true,
                'tab-select--selected': this.selected
            }
        };
    }

    render() {
        return (
            <div class='tab-select pulse-padding-xs-s-a' onClick={this.onClick}>
                <div class="tab-select__inner">
                    <div class="tab-select__inner--content pulse-padding-xs-s-a">
                        <slot></slot>
                        <p class='tab-select__inner--content__tab-text'>{this.tabtext}</p>
                    </div>
                </div>
            </div>
        );
    }
}

let tabIds = 0;
