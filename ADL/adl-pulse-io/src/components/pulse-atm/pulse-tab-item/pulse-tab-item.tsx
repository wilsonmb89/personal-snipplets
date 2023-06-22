import { Component, Prop, h } from '@stencil/core';


@Component({
    tag: 'pulse-tab-item',
    styleUrl: 'pulse-tab-item.scss',
    shadow: true
})
export class PulseTabItem {

    @Prop() tabtext: string;
    @Prop() disabled: boolean = false;

    render() {
        return (
          <slot></slot>
        );
    }
}

