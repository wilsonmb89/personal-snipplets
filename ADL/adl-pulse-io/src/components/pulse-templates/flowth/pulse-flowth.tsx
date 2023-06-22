import { Component, Element, h, Host, Listen, Prop, State } from '@stencil/core';
import { Elevation } from '../../../interface';

@Component({
  tag: 'pulse-flowth',
  styleUrl: 'pulse-flowth.scss',
  shadow: true
})
/**
 * Se define un  template que se adapta al 100% del ancho
 * de la pantalla.
 * Tiene una fila contenedora correspondiente a la cabecera
 */
export class PulseFlowth {

  @Element() elHost: HTMLElement;

  @Prop() elevation: Elevation = 8;
  @Prop() showRight: boolean = true;
  @Prop() showLeft: boolean = true;

  @State() scrolled: boolean = false;
  @State() cssTypeText: string = 'pulse-tp-hl4-comp-r';
  private mobileBreakpoint = 540;

  componentWillLoad() {
    this.cssTypeText = (this.getWindowWidth() >= this.mobileBreakpoint) ? 'pulse-tp-hl4-comp-' : 'pulse-tp-hl5-comp-';
  }

  @Listen('scroll', { target: 'window', capture: true })
  handleScroll() {
    const slotContentQuery = document.querySelectorAll('[slot="content"]:last-child');
    if (!!slotContentQuery && slotContentQuery.length > 0) {
      const slotContentChild = slotContentQuery[0].getBoundingClientRect();
      this.scrolled = true;
      if (slotContentChild.top === this.elHost.clientHeight) {
        this.scrolled = false;
      }
    }
  }

  private getWindowWidth(): number {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }


  render() {
    return (

      <Host class={{
        'pulse-flowth': true,
        [`pulse-elevation-${this.elevation}`]: this.scrolled
      }}>
        <div class="pulse--grid">
          <div class="pulse-row">
            <div
              class={`pulse-col pulse-col-lg-10 pulse-offset-lg-1 pulse-col-md-8 pulse-col-sm-4`}>
              <div class="pulse-flowth-container">
                <div class={{ [`pulse-flowth-container__nav`]: !this.showLeft, ['pulse-col pulse-col-lg-3 pulse-col-md-1 pulse-col-sm-1']: true }}>
                  <slot name="left-content"></slot>
                </div>
                <div
                  class={`pulse-col pulse-col-lg-6 pulse-col-md-6 pulse-col-sm-2 ${this.cssTypeText} pulse-flowth-container__content`}>
                  <slot name="content"></slot>
                </div>
                <div class={{ [`pulse-flowth-container__nav`]: !this.showRight, ['pulse-col pulse-col-lg-3 pulse-col-md-1 pulse-col-sm-1']: true }}>
                  <slot name="right-content"></slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Host>

    );
  }
}
