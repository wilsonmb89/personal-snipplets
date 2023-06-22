import { Component, h, Element, Prop, Host, Method, Listen, Event, EventEmitter } from '@stencil/core';
import { SizeModal } from '../../../interface';

@Component({
  tag: 'pulse-modal-lite',
  styleUrl: 'pulse-modal-lite.scss',
  scoped: true
})
export class PulseModalLite {

  @Element() el!: HTMLPulseModalElement;

  @Prop() size: SizeModal = 'default';

  @Event() willDismiss!: EventEmitter<any>;

  @Listen('resize', { target: 'window' })
  handleScroll() {
    this.reCalculateSize();
  }

  @Method()
  async dismiss(data?: any): Promise<boolean> {
    this.willDismiss.emit({ data });
    return true;
  }

  @Method()
  onWillDismiss(): Promise<any> {
    return this.eventMethod(this.el, 'willDismiss');
  }

  componentDidLoad(): void {
    this.reCalculateSize();
  }

  private eventMethod(element: HTMLElement, eventName: string): Promise<any> {
    let resolve: (detail: any) => void;
    const promise = new Promise<any>(r => resolve = r);
    this.onceEvent(element, eventName, (event: any) => {
      resolve(event.detail);
    });
    return promise;
  };

  private onceEvent(element: HTMLElement, eventName: string, callback: (ev: Event) => void) {
    const handler = (ev: Event) => {
      element.removeEventListener(eventName, handler);
      callback(ev);
    };
    element.addEventListener(eventName, handler);
  };

  private reCalculateSize(): void {
    const docWidth = window.innerWidth
    const docHeight = window.innerHeight;
    const container: HTMLElement = this.el.querySelector(`.pulse-modal-lite__wrapper`);

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
      <Host class="pulse-modal-lite">
        <div class={{
          'pulse-modal-lite__wrapper': true,
          'pulse-elevation-8': true,
          [`pulse-modal-lite__wrapper--size-${this.size}`]: true
        }}>
          <slot></slot>
        </div>
        <div class="pulse-modal-lite__backdrop"></div>
      </Host >
    );
  }

}