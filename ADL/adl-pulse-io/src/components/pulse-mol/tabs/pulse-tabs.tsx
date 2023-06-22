import { Component, Event, EventEmitter, Listen, Prop, Watch, h } from '@stencil/core';

@Component({
    tag: 'pulse-tabs',
    styleUrl: 'pulse-tabs.scss',
    shadow: true
})
export class PulseTabs {

    private inputId = `pulse-tabs-${tabsIds++}`;
    private labelId = `${this.inputId}-lbl`;
    private tabs: HTMLPulseTabElement[] = [];

    @Prop() allowEmptySelection = false;

    @Prop({ mutable: true }) value?: any | null;


    @Watch('value')
    valueChanged(value: any | undefined) {
        this.updateCards();
        this.tabChange.emit({ value });
    }

    @Event() tabChange!: EventEmitter<any>;

    @Listen('tabDidLoad')
    onSelectTabDidLoad(ev: Event) {
        const tab = ev.target as HTMLPulseTabElement;
        this.tabs.push(tab);
        if (this.value == null && tab.selected) {
            this.value = tab.value;
        } else {
            this.updateCards();
        }
    }

    @Listen('tabDidUnload')
    onTabDidUnload(ev: Event) {
        const index = this.tabs.indexOf(ev.target as HTMLPulseTabElement);
        if (index > -1) {
            this.tabs.splice(index, 1);
        }
    }

    @Listen('tabSelect')
    onTabSelect(ev: Event) {
        const selectedTab = ev.target as HTMLPulseTabElement | null;
        if (selectedTab) {
            selectedTab.selected = true;
            this.value = selectedTab.value;
        }
    }

    @Listen('tabDeselect')
    onTabDeselect(ev: Event) {
        if (this.allowEmptySelection) {
            const selectedTab = ev.target as HTMLPulseTabElement;
            if (selectedTab) {
                selectedTab.selected = false;
                this.value = undefined;
            }
        }
    }

    @Listen('resize', { target: 'window' })
    handleResize() {

    }

    componentDidLoad() {
    }

    private updateCards() {
        const value = this.value;
        let hasSelected = false;
        this.tabs.forEach((e) => {
            if (!hasSelected && e.value === value) {
                hasSelected = true;
                e.selected = true;
            } else {
                e.selected = false;
            }
        });
    }

    hostData() {
        return {
            'aria-labelledby': this.labelId,
            class: {
                'tab-group': true
            }
        };
    }

    render() {
        return (
            <div class="tabs-wrapper pulse-padding-s-xs-v">
                    <slot></slot>
            </div>

        );
    }
}

let tabsIds = 0;