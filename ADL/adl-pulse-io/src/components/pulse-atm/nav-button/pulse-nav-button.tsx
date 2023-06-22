import { Component, Element, Event, EventEmitter, h, Listen, Prop, State } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { Color, GridBreakpoints } from '../../../interface';
import { getGridBreakpointBySize } from '../../../utils/utils';

@Component({
  tag: 'pulse-nav-button',
  styleUrl: 'pulse-nav-button.scss',
  shadow: true
})
export class PulseNavButton {

  @State() hasSlot: boolean;
  @State() hasOnlyIcon: boolean;
  @Element() hostElement: HTMLStencilElement;

  @Event() pulseFocus: EventEmitter;
  @Event() pulseBlur: EventEmitter;

  @Prop({
    attribute: 'icon-position'
  }) iconPosition: 'left' | 'right' = 'left';
  @Prop() icon: string;
  @Prop() fill: 'clear' | 'solid' = 'solid';
  @Prop() disabled = false;
  @Prop() iconcolor?: Color = 'primary';
  @Prop({
    attribute: 'only-icon-device'
  }) onlyIconDevice: GridBreakpoints | GridBreakpoints[] | string;

  @Listen('click')
  onClick(ev: Event) {
    ev.preventDefault();
    if (this.disabled) {
      return;
    }

    this.hostElement.classList.add('nav-button-click');

    setTimeout(() => {
      this.hostElement.classList.remove('nav-button-click');
    }, 250);
  }

  @Listen('resize', { target: 'window' })
  handleResize() {
    const breakpoint: GridBreakpoints = getGridBreakpointBySize(window.innerWidth);

    if (typeof this.onlyIconDevice === 'string') {
      const splitStr = this.onlyIconDevice.split(',');
      if (splitStr.length > 0) {
        this.hasOnlyIcon = splitStr.includes(breakpoint);
      } else {
        this.hasOnlyIcon = this.onlyIconDevice === breakpoint;
      }
    } else if (Array.isArray(this.onlyIconDevice)) {
      this.hasOnlyIcon = this.onlyIconDevice.includes(breakpoint);
    }
  }

  componentWillLoad() {
    this.hasSlot = !!this.hostElement.innerHTML;
    if (!this.icon) {
      this.icon = this.iconPosition === 'right' ? 'chevron-right' : 'chevron-left';
    }

    this.handleResize();
  }

  hostData() {
    return {
      class: {
        'pulse-nav-button': true,
        'nav-button-clear': this.fill === 'clear',
        'nav-button-disabled': !!this.disabled
      }
    }
  }

  render() {
    return (
      <div class={{
        'pulse-nav-button-container': true,
        'icon-row-reverse': this.iconPosition === 'right'
      }}>
        <div
          class="pulse-nav-button-container__icon-container"
        >
          <pulse-icon
            icon={this.icon}
            color={!this.disabled ? this.iconcolor : 'carbon'}
            colorvariant={!this.disabled ? '700' : '100'}
          ></pulse-icon>
        </div>
        {
          this.hasSlot && !this.hasOnlyIcon &&
          <div
            class={{
              'pulse-nav-button-container__text': true,
              'pulse-tp-hl6-comp-m': true,
              'icon-row-reverse': this.iconPosition === 'right'
            }}
          >
            <div class="pulse-nav-button-container__text--padding"></div>
            <slot></slot>
          </div>
        }
      </div>
    );
  }
}
