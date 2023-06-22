import { Component, h, Host, Prop, EventEmitter, Event } from "@stencil/core";

@Component({
    tag: 'pulse-item',
    styleUrl: 'pulse-item.scss',
    shadow: true
})
export class PulseItem {

    @Prop() description?: string | string[];
    @Prop() alwaysDescription: boolean = false;
    @Prop() lines: boolean = true;
    @Prop() hasExpand: boolean = false;
    @Prop() openExpand: boolean = false;
    @Prop() fullContentMobile: boolean = false;
    @Prop() fullContentTablet: boolean = false;
    @Prop() fullContentDesktop: boolean = false;
    @Event() reduceAllItems: EventEmitter;
    @Event() reduceExpand: EventEmitter;
    @Event() expand: EventEmitter;

    onClickItem() {

        if (!this.hasExpand || this.openExpand) {
            return;
        }

        this.reduceAllItems.emit();

        setTimeout(() => {
            this.openExpand = !this.openExpand;
            this.expand.emit();
        }, 100);
    }

    closeExpand(ev: MouseEvent) {
        ev.stopPropagation();
        this.openExpand = false;
        this.reduceExpand.emit();
    }

    render() {
        return (
            <Host class="pulse-item">
                <div class={{
                    'pulse-item-container': true,
                    'pulse-item-container--hover': this.hasExpand && !this.openExpand,
                    'pulse-item-container--expand': this.openExpand
                }} onClick={() => this.onClickItem()}>
                    <div class="pulse-item-container__start">
                        <slot name="start"></slot>
                    </div>
                    <div class="pulse-item-container__label">
                        <div class={{
                            'pulse-item-container__label--content': true,
                            'pulse-tp-hl4-comp-r': !this.openExpand,
                            'pulse-tp-hl4-comp-m': this.openExpand,
                        }}>
                            <slot></slot>
                        </div>
                        {
                            (!!this.description && !this.openExpand) || this.alwaysDescription ?
                                <div class="pulse-item-container__label--description pulse-tp-hl5-comp-r">
                                    {this.description}
                                </div>
                                : ''
                        }
                    </div>
                    <div class="pulse-item-container__end">
                        {
                            this.hasExpand && this.openExpand ?
                                <pulse-icon icon="close" style={{
                                    cursor: 'pointer'
                                }} onClick={ev => this.closeExpand(ev)}></pulse-icon> :
                                <slot name="end"></slot>
                        }

                    </div>
                    <div class={{
                        'pulse-item-container__expand': true,
                        'expand': this.openExpand,
                        'full-content-mobile': this.fullContentMobile,
                        'full-content-tablet': this.fullContentTablet,
                        'full-content-desktop': this.fullContentDesktop
                    }}>
                        <slot name="expand"></slot>
                    </div>
                    <div class={{
                        'pulse-item-container__line': this.lines
                    }}></div>
                </div>
            </Host >
        )
    }

}