import { Component, h, Host, Element, Method } from "@stencil/core";

@Component({
    tag: 'pulse-list',
    styleUrl: 'pulse-list.scss'
})
export class PulseList {

    @Element() el!: HTMLElement;

    @Method()
    async reduceAllItems() {
        this.waitForItems(this.el).then((elements: HTMLPulseItemElement[]) => {
            elements.forEach((item: HTMLPulseItemElement) => {
                item.openExpand = false;
            });
        });
    }

    waitForItems = (el: HTMLElement) => {
        return Promise.all(
            Array.from(el.querySelectorAll('pulse-item')));
    }

    componentDidLoad() {
        this.waitForItems(this.el).then((elements: HTMLPulseItemElement[]) => {
            elements.forEach((item: HTMLPulseItemElement) => {
                item.addEventListener('reduceAllItems', async () => this.reduceAllItems());
            });
            const lastItem = elements[elements.length - 1];
            lastItem.lines = false;
        });
    }

    render() {
        return (
            <Host class="pulse-list pulse-elevation-8">
            </Host>
        )
    }

}