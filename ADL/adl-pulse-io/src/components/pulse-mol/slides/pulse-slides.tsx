import { Component, h, Host, State, Prop, Element, ComponentInterface, Event, EventEmitter } from '@stencil/core';
import { createColorClasses } from '../../../utils/themes';
import { Color, ColorVariant } from '../../../interface';

/**
 * Container of slides it's divide in three 4 sections
 * @slot Put multiples <pulse-slide>. progress indicator depend of them.
 * Back Action -> pulse-fab-button
 * Progress Indicator -> pulse-progress-indicator
 * Foward Action -> pulse-fab-button
 * More info [pulse-slides](https://pulseio.design).
 */
@Component({
  tag: 'pulse-slides',
  styleUrl: 'pulse-slides.scss',
  shadow: false
})
export class PulseSlides implements ComponentInterface {

  @Element() el!: HTMLPulseSlidesElement;
  /**
   * The color to use from your application's color palette to base.
   * For more information on colors, see [theming](https://pulseio.design).
   */
  @Prop() color: Color = 'primary';
  /**
   * The color hue to use from your application's based in colors.
   * For more information on colors, see [theming](https://pulseio.design).
   */
  @Prop() colorvariant: ColorVariant = '700';
  /**
     * Emmit event to client when change slide.
     * return new position
     */
  @Event() changeSlide!: EventEmitter<number>;

  @Event() changeIndicator!: EventEmitter<any>;

  @State() stepindicator = {
    total: 0,
    active: 0
  }

  @State() forwardButtonState = {
    disabled: false
  }
  @State() backButtonState = {
    disabled: true
  }

  private startTouchX: number;
  private diffTouchX = 0;


  private slideContent?: HTMLElement;

  componentDidLoad() {
    waitForSlides(this.el).then((x) => {
      this.stepindicator = {
        total: x.length,
        active: 1
      }
    }
    );
  }
  private previous = () => {
    if (this.stepindicator.active > 1) {
      const newStep = this.stepindicator.active - 1
      const newPos = (newStep - 1) * this.slideContent.offsetWidth;
      this.slideContent.scrollLeft = newPos;
      this.stepindicator = { ...this.stepindicator, active: newStep };
      this.backButtonState = { ...this.backButtonState, disabled: this.stepindicator.active === 1 };
      this.forwardButtonState = { ...this.forwardButtonState, disabled: this.stepindicator.active === this.stepindicator.total };
      this.changeSlide.emit(newStep);
      this.changeIndicator.emit(this.stepindicator)
    }
  }

  private next = () => {
    if (this.stepindicator.active < this.stepindicator.total) {
      const newStep = this.stepindicator.active
      const newPos = newStep * this.slideContent.offsetWidth;
      this.slideContent.scrollLeft = newPos;
      this.stepindicator = { ...this.stepindicator, active: newStep + 1 }
      this.forwardButtonState = { ...this.forwardButtonState, disabled: this.stepindicator.active === this.stepindicator.total };
      this.backButtonState = { ...this.backButtonState, disabled: this.stepindicator.active === 1 };
      this.changeSlide.emit(newStep);
      this.changeIndicator.emit(this.stepindicator)
    }
  }

  private touchStart = (e: TouchEvent) => {
    this.startTouchX = e.touches[0].clientX;
  }

  private touchEnd = (e: TouchEvent) => {
    this.diffTouchX = this.startTouchX - e.changedTouches[0].clientX;
    e.preventDefault;
    e.stopPropagation;

    if (this.diffTouchX < 0) {
      this.previous();
    } if (this.diffTouchX > 0) {
      this.next()
    }
    this.diffTouchX = 0;
  }


  showButtonBack() {
    return (
      <pulse-fab-button
        id="back-button"
        disabled={this.backButtonState.disabled}
        color={this.color}
        colorvariant={this.colorvariant}
        onClick={this.previous}>
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill-rule='nonzero' fill='#0040A8' d='M15 7H3.83l4.88-4.88c.39-.39.39-1.03 0-1.42A.996.996 0 0 0 7.3.7L.71 7.29a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L3.83 9H15c.55 0 1-.45 1-1s-.45-1-1-1z' /></svg>
      </pulse-fab-button>
    )

  }

  showForwardButton() {

    return (
      <pulse-fab-button
        id="forward-button"
        disabled={this.forwardButtonState.disabled}
        color={this.color}
        colorvariant={this.colorvariant}
        onClick={this.next}>
        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill-rule='nonzero' fill='#0040A8' d='M1 9h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 0 0 0-1.41L8.71.7A.996.996 0 1 0 7.3 2.11L12.17 7H1c-.55 0-1 .45-1 1s.45 1 1 1z' /></svg>
      </pulse-fab-button>
    )

  }


  render() {
    return (
      <Host
        class={{
          ...createColorClasses(this.color, this.colorvariant)
        }}>
        <div class="slides" >
          <div class="slides__content"
            ref={el => this.slideContent = el}
            onTouchEnd={this.touchEnd}
            onTouchStart={this.touchStart}>
            <slot></slot>
          </div>
          <div class="slides__actions pulse-grid row pulse-padding-xs-xs-h col-lg-offset-3 col-lg-6 col-md-offset-1 col-md-10 col-xs-12">
            <div class="slides__actions__back col-xs-4">
              {this.showButtonBack()}
            </div>
            <div class="slides__actions__middle col-xs-4" >
              <pulse-progress-indicator color={this.color} stepactive={this.stepindicator.active} steps={this.stepindicator.total} class="slide__actions__middle__indicator" ></pulse-progress-indicator>
            </div>
            <div class="slides__actions__forward col-xs-4">
              {this.showForwardButton()}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}

const waitForSlides = (el: HTMLElement) => {
  return Promise.all(
    Array.from(el.querySelectorAll('pulse-slide')))
};