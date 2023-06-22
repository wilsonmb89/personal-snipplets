import { Component, h, Element, Prop, Host, Method, Listen, Event, EventEmitter } from '@stencil/core';
import { SizeModal } from '../../../interface';

@Component({
    tag: 'pulse-modal',
    styleUrl: 'pulse-modal.scss',
    scoped: true
})
export class PulseModal {

    @Element() el!: HTMLPulseModalElement;
    @Prop() component!: any;
    @Prop() componentProps?: any;
    @Prop() delegate: any;
    @Prop() size: SizeModal = 'default';
    @Event() willDismiss!: EventEmitter<any>;

    @Listen('resize', { target: 'window' })
    handleScroll() {
        this.reCalculateSize();
    }

    @Method()
    async present(): Promise<void> {

        const deepReady = async (el: any | undefined): Promise<void> => {
            const element = el as any;
            if (element) {
                if (element.componentOnReady != null) {
                    const stencilEl = await element.componentOnReady();
                    if (stencilEl != null) {
                        return;
                    }
                }
                await Promise.all(Array.from(element.children).map(deepReady));
            }
        };

        const container = this.el.querySelector(`.pulse-modal__wrapper`);
        const usersElement = await this.delegate.attachViewToDom(container, this.component, this.componentProps);
        await deepReady(usersElement);
    }

    @Method()
    async dismiss(data?: any): Promise<boolean> {
        this.willDismiss.emit({ data });
        this.el.remove();
        return true;
    }

    @Method()
    onWillDismiss(): Promise<any> {
        return this.eventMethod(this.el, 'willDismiss');
    }

    componentDidLoad() {
        this.reCalculateSize();
    }

    eventMethod(element: HTMLElement, eventName: string): Promise<any> {
        let resolve: (detail: any) => void;
        const promise = new Promise<any>(r => resolve = r);
        this.onceEvent(element, eventName, (event: any) => {
            resolve(event.detail);
        });
        return promise;
    };

    onceEvent(element: HTMLElement, eventName: string, callback: (ev: Event) => void) {
        const handler = (ev: Event) => {
            element.removeEventListener(eventName, handler);
            callback(ev);
        };
        element.addEventListener(eventName, handler);
    };

    reCalculateSize() {
        const docWidth = window.innerWidth
        const docHeight = window.innerHeight;
        const container: HTMLElement = this.el.querySelector(`.pulse-modal__wrapper`);

        if (container.clientHeight >= docHeight) {
            container.style.maxHeight = `${window.innerHeight}px`;
        } else {
            container.style.maxHeight = null;
        }

        if (container.clientWidth >= docWidth) {
            container.style.maxWidth = `${window.innerWidth}px`;
        } else {
            container.style.maxWidth = null;
        }
    }

    render() {
        return (
            <Host class="pulse-modal">
                <div class={{
                    'pulse-modal__wrapper': true,
                    'pulse-elevation-8': true,
                    [`pulse-modal__wrapper--size-${this.size}`]: true
                }}></div>
                <div class="pulse-modal__backdrop"></div>
            </Host >
        )
    }

}