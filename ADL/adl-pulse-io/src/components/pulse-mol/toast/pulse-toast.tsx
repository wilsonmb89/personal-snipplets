import { Component, h, Prop, Host, getAssetPath, State, ComponentInterface, Element, Event, EventEmitter } from '@stencil/core';
import { Color, ColorVariant, Elevation } from '../../../interface';
import { createColorClasses } from '../../../utils/themes';

@Component({
  tag: 'pulse-toast',
  styleUrl: 'pulse-toast.scss',
  scoped: true
})
export class PulseToast implements ComponentInterface {

  private mobileBreakpoint = 540;

  @Element() elHost: HTMLElement;

  @Prop() color: Color = 'success';
  @Prop() colorvariant: ColorVariant = '100';
  @Prop() text: string;
  @Prop() closeable: boolean = true;
  @Prop() image: string;
  @Prop() time: number = 10000;
  @Prop() elevation: Elevation = 8;

  @State() isVisible = true;
  @State() closeEffect: string = '';
  @State() openEffect: string = '';

  @Event() toastClosed: EventEmitter;

  constructor() {

    setTimeout(() => {
      this.closeToast();
    }, this.time);
  }

  componentWillLoad() {
    this.openEffect = (this.getWindowWidth() >= this.mobileBreakpoint) ? 'webToastOpen' : 'mobileToastOpen';
  }

  componentDidLoad() {
    this.addEventListeners();
  }

  closeToast = () => {
    this.isVisible = false;
    this.closeEffect = (this.getWindowWidth() >= this.mobileBreakpoint) ? 'webToastClosed' : 'mobileToastClose';
  };

  colorCloseable = () => {
    if (this.color === 'carbon') {
      return 'white';
    } else {
      return 'carbon';
    }
  };

  private getWindowWidth(): number {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }

  private addEventListeners(): void {
    this.elHost.addEventListener('animationend', (e) => {
      switch (e.animationName) {
        case 'webToastClosed':
        case 'mobileToastClose':
          this.toastClosed.emit();
          break;
      }
    }, false);
    window.onhashchange = () => {
      this.closeToast();
    };
  }

  render() {
    return (
      <Host class="pulse-toast">
        <div class={{
          ...createColorClasses(this.color, this.colorvariant),
          [`pulse-elevation-${this.elevation}`]: true,
          'pulse-toast__container pulse-tp-bo3-comp-m': true,
          [`animated ${this.closeEffect}`]: !this.isVisible,
          [`animated ${this.openEffect}`]: this.isVisible
        }}>

          <div class="toast-icon">
            <img width="48" height="48" src={getAssetPath(this.image)}/>
          </div>
          <div class="pulse-toast__container--text">
            <div class="pulse-toast__container--text__inner">{this.text}</div>
          </div>
          <div class="pulse-toast__container__header">
            {
              this.closeable == true ?
                <pulse-icon onClick={this.closeToast} icon='close' color={this.colorCloseable()} style={{
                  cursor: 'pointer'
                }}></pulse-icon>
                : ''
            }
          </div>
        </div>
      </Host>
    );
  }

}
