import { Component, h, Host, Prop, Element, State, Listen, Event, EventEmitter } from '@stencil/core';
import { Color, ColorVariant } from '../../../interface';

@Component({
    tag: 'pulse-collapsible',
    styleUrl: 'pulse-collapsible.scss',
    shadow: true
})
export class PulseCollapsible {

  @Element() el!: HTMLElement;

  @Prop() name: string;
  @Prop() description: string;
  @Prop() disabled: boolean = false;
  @Prop() separator: boolean = false;

  @Prop() tagtext: string;
  @Prop() tagcolor: Color = 'success';
  @Prop() tagcolorvariant: ColorVariant = '900';

  @Prop() carousel: boolean = false;
  @Prop() scrollsize: number = 300;

  @Event() pulseCollapsibleOpen!: EventEmitter<boolean>;

  @State() isExpanded: boolean = false;
  @State() backButtonFade = {
    hidden: ''
  }
  @State() forwardButtonFade = {
    hidden: ''
  }

  private slider: HTMLElement;
  private backButton: HTMLElement;
  private forwardButton: HTMLElement;

  private toogleExpandContent() {
    if (!this.disabled) {
      this.isExpanded = !this.isExpanded;
      this.setCollapsibleHeight();
      this.pulseCollapsibleOpen.emit(this.isExpanded);
    }
  }

  private setCollapsibleHeight() {
    const collapsibleBodyElement = (this.el.shadowRoot.querySelector('#collapsible-body') as HTMLElement);
    const newMaxHeight = this.isExpanded ? collapsibleBodyElement.scrollHeight : 0;
    collapsibleBodyElement.style.maxHeight = `${newMaxHeight}px`;
  }

  private startScrollable() {
    this.slider.onscroll = this.onScrollEvent;
  }

  private onScrollEvent = () => {
    const scrollLeft = this.slider.scrollLeft;
    const scrollMax = (this.slider.scrollWidth - this.slider.clientWidth);
    if (scrollLeft === 0) {
      this.backButtonFade = {
        hidden: 'zoomOut'
      }
    } else if (scrollLeft >= scrollMax) {
      this.forwardButtonFade = {
        hidden: 'zoomOut'
      }
    } else {
      this.backButton.style.display = "inline-block";
      this.forwardButton.style.display = "block";
      this.backButtonFade = {
        hidden: 'zoomIn'
      }
      this.forwardButtonFade = {
        hidden: 'zoomIn'
      }
    }
  }

  private next = () => {
    this.slider.scrollLeft = this.slider.scrollLeft + this.scrollsize;
  }

  private previous = () => {
    this.slider.scrollLeft = this.slider.scrollLeft - this.scrollsize;
  }

  @Listen('resize', { target: 'window' })
  handleResize() {
    this.setCollapsibleHeight();
  }

  private showButtonBack() {
    if (!!this.slider) {
      return (this.slider.scrollWidth > this.slider.offsetWidth) &&
        <pulse-fab-button
          id="back-button"
          ref={el => this.backButton = el as HTMLElement}
          style={{ display: 'none' }}
          class={`animated pulse-collapsible-container__body__actions-layer__back ${this.backButtonFade.hidden}`} onClick={this.previous}>
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill-rule='nonzero' d='M15 7H3.83l4.88-4.88c.39-.39.39-1.03 0-1.42A.996.996 0 0 0 7.3.7L.71 7.29a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L3.83 9H15c.55 0 1-.45 1-1s-.45-1-1-1z' /></svg>
        </pulse-fab-button>
    }
    return undefined
  }

  private showForwardButton() {
    if (!!this.slider) {
      return (this.slider.scrollWidth > this.slider.offsetWidth) &&
        <pulse-fab-button
          id="forward-button"
          ref={el => this.forwardButton = el as HTMLElement}
          class={`animated pulse-collapsible-container__body__actions-layer__forward ${this.forwardButtonFade.hidden}`} onClick={this.next}>
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill-rule='nonzero' d='M1 9h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 0 0 0-1.41L8.71.7A.996.996 0 1 0 7.3 2.11L12.17 7H1c-.55 0-1 .45-1 1s.45 1 1 1z' /></svg>
        </pulse-fab-button>
    }
    return undefined;
  }

  render() {
    return (
      <Host class='pulse-collapsible'>
        <div class='pulse-collapsible-container'>
          <div class={{
                  'pulse-collapsible-container__header':true,
                  'disabled': this.disabled
                }}
                onClick={() => this.toogleExpandContent()}>
            <div class='pulse-collapsible-container__header__info'>
              <div class='pulse-collapsible-container__header__info__title-wrapper'>
                <div class='pulse-collapsible-container__header__info__title-wrapper__title pulse-tp-hl3-comp-m'>
                  {this.name}
                </div>
                {
                  !!this.tagtext ?
                    <div class='pulse-collapsible-container__header__info__title-wrapper__tag'>
                      <pulse-tag text={this.tagtext}
                                  color={this.tagcolor}
                                  colorvariant={this.tagcolorvariant}></pulse-tag>
                    </div>
                    : ''
                }
              </div>
              <div class='pulse-collapsible-container__header__info__description pulse-tp-hl5-comp-r'>
                {this.description}
              </div>
            </div>
            <div class={{
                'pulse-collapsible-container__header__chevron': true,
                'pulse-collapsible-container__header__chevron--expanded': this.isExpanded
              }}>
              <pulse-icon icon='expand-more' color={this.disabled ? 'carbon' : 'primary'}></pulse-icon>
            </div>
          </div>
          <div id='collapsible-body'
                class='pulse-collapsible-container__body'>
            <div class="pulse-collapsible-container__body__actions-layer">
              { this.showButtonBack() }
              { this.showForwardButton() }
            </div>
            <div id='collapsible-body__content-wrapper'
                  ref={rel => this.slider = rel as HTMLElement}
                  class={{
                    'pulse-collapsible-container__body__content': true,
                    'carousel': this.carousel
                  }}>
              <slot name="content"></slot>
            </div>
          </div>
        </div>
        { !!this.separator ? <div class='pulse-collapsible-separator'></div> : '' }
      </Host>
    )
  }

  componentDidLoad() {
    if (this.carousel) {
      const rootSlotElement = (this.el.shadowRoot.querySelector('#collapsible-body__content-wrapper slot') as HTMLSlotElement).assignedNodes();
      rootSlotElement.forEach(
        (slotElement: HTMLElement) => {
          Array.from(slotElement.children).forEach((element: HTMLElement) => {
            element.style.display = 'inline-block';
            element.style.margin = '0 1rem';
          });
        }
      );
      this.startScrollable();
    }
  }
}
