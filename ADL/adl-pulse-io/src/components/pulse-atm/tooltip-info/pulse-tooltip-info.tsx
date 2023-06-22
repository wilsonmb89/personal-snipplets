import { Component, Prop, Listen, Method, Host, h, ComponentInterface, Element, State, Event, EventEmitter, Watch } from "@stencil/core";
import { HTMLStencilElement } from "@stencil/core/internal";
import { PulseTooltipInfoData, Size, Position, Color, ColorVariant } from "../../../interface";
import { createColorClasses } from "../../../utils/themes";

@Component({
  tag: 'pulse-tooltip-info',
  styleUrl: 'pulse-tooltip-info.scss',
  shadow: true
})
export class PulseTooltipInfo implements ComponentInterface {

  @Element() elHost: HTMLStencilElement;

  private readonly auto_size_order = ['size-xl', 'size-l', 'size-m', 'size-s', 'size-xs'];
  private readonly tooltip_size_values = { 'size-xl': '50rem', 'size-l': '50rem', 'size-m': '40rem', 'size-s': '32rem', 'size-xs': '25.2rem' };
  private readonly auto_position_order = ['top', 'right', 'left', 'bottom'];
  private sizeState: string = 'size-xs';
  private current_auto_position = 0;
  private tooltipmain: HTMLElement;
  private mobileBreakpoint = 540;
  private presentState = false;

  @Prop() htmlelementref: HTMLElement;
  @Prop() content: Array<PulseTooltipInfoData> = [];
  @Prop() size: Size = 'xs';
  @Prop() orientation: Position = 'right-end';
  @Prop() color: Color = 'carbon';
  @Prop() colorvariant: ColorVariant = '900';
  @Prop() mobilebehavior: boolean = true;
  @Prop() dynamicposition: boolean = true;
  @Prop() removeinclose: boolean = true;

  @State() position: string = 'right';
  @State() align: string = 'end';
  @State() closeEffect = {
    isClose: ''
  };

  @Event() presentEnd: EventEmitter<string>;
  @Event() onCloseChange: EventEmitter<string>;

  constructor() {}

  componentWillLoad() {
    this.position = this.orientation.split('-')[0];
    this.align = this.orientation.split('-')[1];
    this.sizeState = `size-${this.size}`;
    this.closeEffect = { isClose: (this.checkMobileBreakpoint()) ? 'zoomIn' : 'mobileTooltipIn' };
  }

  componentDidLoad() {
    this.recalculate();
    this.addEventListeners();
  }

  @Watch('orientation')
  handleWatchOrientation() {
    this.position = this.orientation.split('-')[0];
    this.align = this.orientation.split('-')[1];
    this.recalculate();
  }

  @Watch('size')
  handleWatchSize() {
    this.sizeState = `size-${this.size}`;
    this.recalculate();
  }

  @Listen('resize', { target: 'window' })
  resizeWindow() {
    this.recalculate();
  }

  @Listen('scroll', { target: 'window' })
  scrollWindow() {
    this.recalculate();
  }

  @Method()
  async recalculate() {
    if (!!this.htmlelementref) {
      this.setTooltipSize();
      if (this.checkMobileBreakpoint()) {
        this.elHost.style.bottom = '';
        const { x: htmlLeft, y: htmlTop } = this.htmlelementref.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const spacingTooltip = 15;
        let cornerPos = 0;
        switch (this.position) {
          case 'top':
            cornerPos = this.getCornerPosition(this.elHost.clientWidth, this.align);
            this.elHost.style.top = `${htmlTop + scrollTop - this.elHost.clientHeight - spacingTooltip}px`;
            this.elHost.style.left = `${htmlLeft + (this.htmlelementref.clientWidth / 2) - cornerPos}px`;
            break;
          case 'bottom':
            cornerPos = this.getCornerPosition(this.elHost.clientWidth, this.align);
            this.elHost.style.top = `${htmlTop + scrollTop + this.htmlelementref.clientHeight + spacingTooltip + 3}px`;
            this.elHost.style.left = `${htmlLeft + (this.htmlelementref.clientWidth / 2) - cornerPos}px`;
            break;
          case 'left':
            cornerPos = this.getCornerPosition(this.elHost.clientHeight, this.align);
            this.elHost.style.top = `${htmlTop + scrollTop + (this.htmlelementref.clientHeight / 2) - cornerPos}px`;
            this.elHost.style.left = `${htmlLeft - this.elHost.clientWidth - spacingTooltip}px`;
            break;
          case 'right':
            cornerPos = this.getCornerPosition(this.elHost.clientHeight, this.align);
            this.elHost.style.top = `${htmlTop + scrollTop  + (this.htmlelementref.clientHeight / 2) - cornerPos}px`;
            this.elHost.style.left = `${htmlLeft + this.htmlelementref.clientWidth + spacingTooltip + 3}px`;
            break;
          default:
            this.elHost.style.top = `${htmlTop + scrollTop}px`;
            this.elHost.style.left = `${htmlLeft + scrollTop}px`;
            break;
        }
        if (this.dynamicposition) {
          this.checkOverlowTooltip();
        }
      } else {
        this.elHost.style.top = '';
        this.elHost.style.bottom = this.elHost.style.left = '0px';
      }
    }
  }

  private getCornerPosition(length: number, align: string): number {
    const percentage = (align === 'start') ? 15 : (align === 'middle' ? 50 : 85);
    const positionFit = (align === 'start') ? -10 : (align === 'middle' ? 0 : 15);
    return ((percentage * length) / 100) - positionFit;
  }

  private checkOverlowTooltip(): void {
    const hostRecProps = this.elHost.getBoundingClientRect();
    switch (this.position) {
      case 'top':
        if (hostRecProps.x <= 0 || this.getWindowWidth() <= (hostRecProps.x + hostRecProps.width) || hostRecProps.y <= 0) {
          this.setCustomOrientation();
        }
        break;
      case 'right':
        if (this.getWindowWidth() <= (hostRecProps.x + hostRecProps.width) || hostRecProps.y <= 0) {
          this.setCustomOrientation();
        }
        break;
      case 'left':
        if (hostRecProps.x <= 0 || hostRecProps.y <= 0) {
          this.setCustomOrientation();
        }
        break;
      case 'bottom':
        if (this.sizeState !== 'size-xs' 
          && (hostRecProps.x <= 0 || this.getWindowWidth() <= (hostRecProps.x + hostRecProps.width))) {
          this.setCustomSize();
        }
        break;
    }
  }

  private setTooltipSize(): void {
    if (this.tooltipmain) {
      let tooltipWidth = '100%';
      if (this.checkMobileBreakpoint()) {
        tooltipWidth = this.tooltip_size_values[this.sizeState] || '25.2rem';
      }
      this.tooltipmain.style.width = tooltipWidth;
    }
  }

  private setCustomOrientation(): void {
    if (this.position !== 'bottom') {
      this.position = this.auto_position_order[this.current_auto_position];
      this.align = 'middle';
      this.current_auto_position++;
      this.recalculate();
    }
  }

  private setCustomSize(): void {
    if (this.sizeState !== 'size-xs') {
      const currentSizeIndex = this.auto_size_order.findIndex(size => size === this.sizeState);
      this.sizeState = this.auto_size_order[currentSizeIndex + 1];
      this.recalculate();
    }
  }

  @Method()
  async dismiss() {
    this.closeTooltip();
  }

  closeTooltip = () => {
    if (this.presentState) {
      this.closeEffect = { isClose: (this.checkMobileBreakpoint()) ? 'zoomOut' : 'mobileTooltipOut' };
    }
  }

  closeTooltipByShadow = (event: MouseEvent) => {
    event.preventDefault();
    if (event.target === event.currentTarget) {
      if (this.presentState) {
        this.closeEffect = { isClose: 'mobileTooltipOut' };
      }
    }
  }

  private addEventListeners(): void {
    this.tooltipmain.addEventListener('animationend', (e) => {
      switch (e.animationName) {
        case 'zoomIn':
        case 'mobileTooltipIn':
          this.presentEnd.emit(this.elHost.id);
          this.presentState = true;
          break;
        case 'zoomOut':
        case 'mobileTooltipOut':
          this.onCloseChange.emit(this.elHost.id);
          this.presentState = false;
          if (this.removeinclose) {
            this.elHost.parentNode.removeChild(this.elHost);
          }
          break;
      }
      this.recalculate();
    }, false);
    window.onhashchange = () => {
      this.closeTooltip();
    };
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

  private checkMobileBreakpoint(): boolean {
    return this.getWindowWidth() >= this.mobileBreakpoint 
      || (!this.mobilebehavior && this.getWindowWidth() < this.mobileBreakpoint);
  }

  render() {
    return (
      <Host class={{
        'pulse-tooltip-info': true,
        'mobile-behavior-disabled': !this.mobilebehavior,
        ...createColorClasses(this.color, this.colorvariant, false)
      }}>
        <div class="pulse-tooltip-info__main">
          <div class='pulse-tooltip-info__main__shadow' onClick={this.closeTooltipByShadow}></div>
          <div class={`pulse-tooltip-info__main__container pulse-elevation-8 position-${this.position} align-${this.align} animated ${this.closeEffect.isClose}`}
            ref={el => this.tooltipmain = el as HTMLElement}>
            <div class="pulse-tooltip-info__main__container__header">
              <pulse-icon onClick={this.closeTooltip} icon='close' color='white'></pulse-icon>
            </div>
            <div class="pulse-tooltip-info__main__container__body">
              {this.content.map((data, idx) =>
                <div key={`${idx}_${data.title}`} class="pulse-tooltip-info__main__container__body__data-container">
                  <span class="pulse-tooltip-info__main__container__body__data-container--title pulse-tp-hl4-comp-b">
                    {data.title}
                  </span><br/>
                  <p class="pulse-tooltip-info__main__container__body__data-container--desc pulse-tp-bo3-comp-r">
                    {data.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Host>
    )
  }

}
