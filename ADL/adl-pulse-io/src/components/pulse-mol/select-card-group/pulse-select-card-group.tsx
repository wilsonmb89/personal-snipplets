import { Component, Event, EventEmitter, Listen, Prop, Watch, h, Method, State } from '@stencil/core';
import { CardStyles } from '../../../interface';


@Component({
  tag: 'pulse-select-card-group',
  styleUrl: 'pulse-select-card-group.scss',
  shadow: true
})
export class PulseSelectCardGroup {

  private inputId = `pulse-scg-${selectCardGroupIds++}`;
  private labelId = `${this.inputId}-lbl`;
  private selectCards: HTMLPulseSelectCardElement[] = [];
  private backButton: HTMLElement;
  private forwardButton: HTMLElement;
  private slider: HTMLElement;
  private slideSize: number;

  @Prop() allowEmptySelection = false;

  @Prop() groupstyle: CardStyles = 'buttons';

  @Prop({ mutable: true }) value?: any | null;

  @Prop() position;

  @State() backButtonFade = {
    hidden: ''
  }

  @State() forwardButtonFade = {
    hidden: ''
  }

  @State() sliderLoaded = false;

  @Watch('value')
  valueChanged(value: any | undefined) {
    this.updateCards();
    this.cardChange.emit({ value });
  }

  @Watch('position')
  private positionChange(value: any) {
    if(!!this.slider) {
      this.slider.scrollLeft = value;
    }
    return;
  }

  @Method()
  async isScrollBegin() {
    return Promise.resolve(this.slider.scrollLeft === 0);
  }

  @Method()
  async isScrollable() {
    return Promise.resolve(this.slider.scrollWidth > this.slider.offsetWidth)
  }

  @Method()
  async moveForward() {
    this.next();
  }

  next = () => {
    this.slider.scrollLeft = this.slider.scrollLeft + this.slideSize;
  }

  previous = () => {
    this.slider.scrollLeft = this.slider.scrollLeft - this.slideSize;
  }

  @Method()
  async moveBackwards() {
    this.previous();
  }

  @Event() cardChange!: EventEmitter<any>;

  @Event() pulseScroll!: EventEmitter<any>;

  @Event() pulseScrollEnd!: EventEmitter<any>;

  @Event() pulseScrollZero!: EventEmitter<any>;

  @Listen('sCardDidLoad')
  onSelectCardDidLoad(ev: Event) {
    const card = ev.target as HTMLPulseSelectCardElement;
    this.slideSize = card.offsetWidth;
    this.selectCards.push(card);
    if (this.value == null && card.selected) {
      this.value = card.value;
    } else {
      this.updateCards();
    }
  }

  @Listen('sCardDidUnload')
  onSelectCardDidUnload(ev: Event) {
    const index = this.selectCards.indexOf(ev.target as HTMLPulseSelectCardElement);
    if (index > -1) {
      this.selectCards.splice(index, 1);
    }
  }

  @Listen('sCardSelect')
  onCardSelect(ev: Event) {
    const selectedCard = ev.target as HTMLPulseSelectCardElement | null;
    if (selectedCard) {
      selectedCard.selected = true;
      this.value = selectedCard.value;
    }
  }

  @Listen('sCardDeselect')
  onCardDeselect(ev: Event) {
    if (this.allowEmptySelection) {
      const selectedCard = ev.target as HTMLPulseSelectCardElement;
      if (selectedCard) {
        selectedCard.selected = false;
        this.value = undefined;
      }
    }
  }

  @Listen('fabButtonDidLoad')
  onFabButtonDidLoad(ev: any) {
    const target = ev.detail as HTMLPulseFabButtonElement;
    this.stateScrollActions(target);
  }

  @Listen('resize', { target: 'window' })
  handleResize() {
    this.sliderLoaded = !this.sliderLoaded;
  }

  componentDidLoad() {
    if (!!this.slider) {
      this.sliderLoaded = !this.sliderLoaded;
    }
    setTimeout(() => {
      this.positionChange(this.position);
    }, 50);
  }

  private stateScrollActions(el: HTMLPulseFabButtonElement) {
    this.forwardButtonFade = {
      hidden: 'zoomIn'
    };
    this.slider.addEventListener('animationend', (e) => {
      this.hideActions(e, el);
    });
  }

  private hideActions(e: AnimationEvent, el: HTMLElement) {
    if (e.animationName === 'zoomOut') {
      el.style.display = "none";
    }
  }

  private updateCards() {
    const value = this.value;
    let hasSelected = false;
    this.selectCards.forEach((e) => {
      if (!hasSelected && e.value === value) {
        hasSelected = true;
        e.selected = true;
      } else {
        e.selected = false;
      }
    });
  }

  hostData() {
    return {
      'aria-labelledby': this.labelId,
      class: {
        'grid-select': this.groupstyle === 'buttons',
        'tabs-select': this.groupstyle === 'tabs',
        'composable-row' : this.groupstyle === 'composable-row',
        'composable-column' : this.groupstyle === 'composable-column'
      }
    };
  }

  scrollEvent = () => {
    const scrollLeft = this.slider.scrollLeft;
    const scrollMax = (this.slider.scrollWidth - this.slider.clientWidth);
    this.pulseScroll.emit(scrollLeft);
    if (scrollLeft === 0) {
      this.pulseScrollZero.emit();
      this.backButtonFade = {
        hidden: 'zoomOut'
      }
    } else if (scrollLeft >= scrollMax) {
      this.pulseScrollEnd.emit();
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

  showButtonBack() {
    if (!!this.slider) {
      return (this.slider.scrollWidth > this.slider.offsetWidth) &&
        <pulse-fab-button
          id="back-button"
          ref={el => this.backButton = el as HTMLElement}
          style={{ display: 'none' }}
          class={`animated slide-wrapper__actions-layer__back ${this.backButtonFade.hidden}`} onClick={this.previous}>
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill-rule='nonzero' d='M15 7H3.83l4.88-4.88c.39-.39.39-1.03 0-1.42A.996.996 0 0 0 7.3.7L.71 7.29a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L3.83 9H15c.55 0 1-.45 1-1s-.45-1-1-1z' /></svg>
        </pulse-fab-button>
    }
    return undefined
  }

  showForwardButton() {
    if (!!this.slider) {
      return (this.slider.scrollWidth > this.slider.offsetWidth) &&
        <pulse-fab-button
          id="forward-button"
          ref={el => this.forwardButton = el as HTMLElement}
          class={`animated slide-wrapper__actions-layer__forward ${this.forwardButtonFade.hidden}`} onClick={this.next}>
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill-rule='nonzero' d='M1 9h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59a.996.996 0 0 0 0-1.41L8.71.7A.996.996 0 1 0 7.3 2.11L12.17 7H1c-.55 0-1 .45-1 1s.45 1 1 1z' /></svg>
        </pulse-fab-button>
    }
    return undefined;
  }

  render() {
    return (
      <div class="slide-wrapper">
        <div class="slide-wrapper__actions-layer">
          {
            this.showButtonBack()
          }
          {
            this.showForwardButton()
          }
        </div>
        <div class="slide-wrapper__slide" ref={el => this.slider = el as HTMLElement} onScroll={this.scrollEvent}>
          <slot></slot>
        </div>
      </div>

    );
  }
}

let selectCardGroupIds = 0;