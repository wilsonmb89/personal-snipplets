import { Component, h, Element, Listen } from '@stencil/core';

@Component({
    tag: 'pulse-modaltb',
    styleUrl: 'pulse-modaltb.scss',
    shadow: true
})

export class PulseModaltb {

    @Element() el!: HTMLPulseModaltbElement

    @Listen('resize', { target: 'window' })
    handleScroll() {
        this.reCalculateSize();
    }

    componentDidLoad() {
        this.reCalculateSize();
    }

    reCalculateSize() {
        const container: HTMLElement = this.el.shadowRoot.querySelector(`.modaltb-main`);
        const padding = 32;
        const header: HTMLElement = this.el.shadowRoot.querySelector(`.modaltb-main__header`);
        const body: HTMLElement = this.el.shadowRoot.querySelector(`.modaltb-main__body`);
        const footer: HTMLElement = this.el.shadowRoot.querySelector(`.modaltb-main__footer`);

        if (container.scrollHeight >= window.innerHeight) {
            body.style.maxHeight = `${window.innerHeight - padding - header.clientHeight - footer.clientHeight}px`;
            body.style.overflow = 'scroll';
        } else {
            body.style.maxHeight = null;
            body.style.overflow = null;
        }
    }

    render() {
        return (
            <div class="modaltb-main">
                <div class="modaltb-main__header">
                    <slot name="header"></slot>
                </div>
                <div class="modaltb-main__body">
                    <slot name="content"></slot>
                </div>
                <div class="modaltb-main__footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        )
    }
}