import { Component, h, Prop } from '@stencil/core';

@Component({
    tag: 'pulse-modaltc',
    styleUrl: 'pulse-modaltc.scss',
    shadow: true
})
export class PulseModaltc {

    @Prop() title!: string;

    render() {
        return (
            <div class="modaltc-main">
                <div class="modaltc-main__icon">
                    <slot name="icon"></slot>
                </div>

                <div class="modaltc-main__title pulse-tp-hl3-comp-b">
                    <slot name="title"></slot>
                </div>
                <div class="modaltc-main__body pulse-tp-bo3-comp-r">
                    <slot name="body"></slot>
                </div>
            </div>
        )
    }
}