/** * @author <a href="mailto:ivan.pena@avaldigitallabs.com">ivanntis</a> */

import { Component, Prop, EventEmitter, Event, State, Listen, Method, h, ComponentInterface, Element } from "@stencil/core";
import { Elevation, Color, ColorVariant, Position, Size } from '../../../interface';
import { createColorClasses } from "../../../utils/themes";

@Component({
  tag: 'pulse-tooltip',
  styleUrl: 'pulse-tooltip.scss',
  shadow: true
})

export class PulseTooltip implements ComponentInterface {

  @Element() elHost: HTMLElement;

  private tooltipmain: HTMLElement;
  private mobileSize: boolean;
  private MobileBreakpoint = 540;
  private presentState = false;
  @Prop() elevation: Elevation = 8;
  @Prop() color: Color = 'primary';
  @Prop() colorvariant: ColorVariant = '400';
  @Prop() colorgradient: boolean = false;
  @Prop() tiptitle: string;
  @Prop() description: string
  @Prop() position: Position = 'left-start'
  @Prop() objectdest: string;
  @Prop() objectdesthtml: HTMLElement;
  @Prop() size: Size = 'xs';
  @Prop() mobileView: boolean = false;
  @Event() onCloseChange: EventEmitter<string>;
  @Event() presentEnd: EventEmitter<string>;
  @State() closeEffect = {
    isClose: ''
  }



  @Listen('resize', { target: 'window' })
  resizeWindow() {
    this.recalculate()
  }
  @Listen('scroll', { target: 'window' })
  scrollWindow() {
    this.recalculate()
  }
  @Method()
  async recalculate() {

    this.mobileSize = window.innerWidth <= this.MobileBreakpoint ? true : false;
    this.mobileSize && this.mobileView
      ? this.elHost.classList.replace(`position-ind-${this.position}`, 'mobile')
      : this.elHost.classList.replace('mobile', `position-ind-${this.position}`);

    const rect = this.objectdesthtml.getBoundingClientRect();

    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const salida = { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    const leftFinal = salida.left + this.checkArrowPosition(this.position).left;
    const topFinal = salida.top + this.checkArrowPosition(this.position).top;
    if (this.mobileView && this.mobileSize) {
      this.elHost.style.top = '0px';
      this.elHost.style.left = '0px';
    } else {
      this.elHost.style.top = `${(topFinal)}px`;
      this.elHost.style.left = `${(leftFinal)}px`;
    }
  }

  checkArrowPosition(position) {
    switch (position) {
      case 'left-start': {
        return {
          left: this.objectdesthtml.clientWidth + 5,
          top: this.objectdesthtml.clientHeight - this.objectdesthtml.clientHeight / 2 - 20
        }
      }
      case 'left-end': {
        return {
          left: this.objectdesthtml.clientWidth + 5,
          top: (this.elHost.clientHeight * - 1) + this.objectdesthtml.clientHeight / 2 + 20
        }
      }
      case 'left-middle': {
        return {
          left: this.objectdesthtml.clientWidth + 5,
          top: ((this.elHost.clientHeight / 2 - this.objectdesthtml.clientHeight / 2) * -1)
        }
      }
      case 'right-start': {
        return {
          left: (this.elHost.clientWidth + 15) * -1,
          top: this.objectdesthtml.clientHeight - this.objectdesthtml.clientHeight / 2 - 20

        }
      }
      case 'right-end': {
        return {
          left: (this.elHost.clientWidth + 15) * -1,
          top: (this.elHost.clientHeight * - 1) + this.objectdesthtml.clientHeight / 2 + 20
        }
      }
      case 'right-middle': {
        return {
          left: (this.elHost.clientWidth + 15) * -1,
          top: ((this.elHost.clientHeight / 2 - this.objectdesthtml.clientHeight / 2) * -1)
        }
      }
      case 'top-middle': {
        return {
          left: ((this.elHost.clientWidth / 2) * -1) + this.objectdesthtml.clientWidth / 2,
          top: (this.objectdesthtml.clientHeight)
        }
      }
      case 'top-start': {
        return {
          left: this.objectdesthtml.clientWidth / 2 - 36,
          top: this.objectdesthtml.clientHeight
        }
      }
      case 'top-end': {
        return {
          left: (this.elHost.clientWidth * -1) + this.objectdesthtml.clientWidth / 2 + 36,
          top: this.objectdesthtml.clientHeight
        }
      }
      case 'bottom-middle': {
        return {
          left: ((this.elHost.clientWidth / 2) * -1) + this.objectdesthtml.clientWidth / 2,
          top: (this.elHost.clientHeight + 5) * -1
        }
      }
      case 'bottom-start': {
        return {
          left: this.objectdesthtml.clientWidth / 2 - 36,
          top: (this.elHost.clientHeight + 5) * -1
        }
      }
      case 'bottom-end': {
        return {
          left: (this.elHost.clientWidth * -1) + this.objectdesthtml.clientWidth / 2 + 36,
          top: (this.elHost.clientHeight + 5) * -1
        }
      }
    }
  }

  componentDidLoad() {
    this.recalculate();
    if (this.mobileView && this.mobileSize) {
      this.closeEffect = { isClose: 'mobileTooltipIn' }
    } else {
      this.closeEffect = { isClose: 'zoomIn' };
    }
    this.tooltipmain.addEventListener('animationend', (e) => {
      switch (e.animationName) {
        case 'zoomIn':
          this.presentEnd.emit(this.elHost.id);
          this.presentState = true;
          break;
        case 'zoomOut':
          this.onCloseChange.emit(this.elHost.id);
          this.elHost.parentNode.removeChild(this.elHost);
          this.presentState = false;
          break;

        case 'mobileTooltipIn':
          this.presentEnd.emit(this.elHost.id);
          this.presentState = true;
          break;
        case 'mobileTooltipOut':
          this.onCloseChange.emit(this.elHost.id);
          this.elHost.parentNode.removeChild(this.elHost);
          this.presentState = false;
          break;
      }
    }, false);
    window.onhashchange = () => {
      this.closeTooltip();
    };
  }

  constructor() { }

  hostData() {

    let classType = "";
    if (this.mobileView && this.mobileSize) {
      classType = 'mobile';
    } else {
      classType = `position-ind-${this.position}`;
    }
    return {
      class: {
        ...createColorClasses(this.color, this.colorvariant, this.colorgradient),
        [classType]: true,
      }
    };
  }

  @Method()
  async dismiss() {
    this.closeTooltip();
  }

  closeTooltip = () => {
    if (this.presentState) {
      if (this.mobileView && this.mobileSize) {
        this.closeEffect = { isClose: 'mobileTooltipOut' }
      } else {
        this.closeEffect = { isClose: 'zoomOut' };
      }
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

  render() {
    const shadown = !!this.elevation ? `pulse-elevation-${this.elevation}` : '';
    return (
      <div class="full-shadow" onClick={this.closeTooltipByShadow}>
        <div class={`tooltip_main tooltip_main__${this.size} animated  ${shadown} ${this.closeEffect.isClose}`}
          ref={el => this.tooltipmain = el as HTMLElement}>
          <div class="tooltip_main__close">
            <pulse-icon onClick={this.closeTooltip} icon='close' color='white'></pulse-icon>
          </div>
          <span class="pulse-tp-bo2-comp-b">
            {this.tiptitle}
          </span>
          {!!this.description ?
            <p class="tooltip_main__desc pulse-tp-bo3-comp-r">
              {this.description}
            </p>
            : ''
          }
        </div>
      </div>
    );
  }


}
