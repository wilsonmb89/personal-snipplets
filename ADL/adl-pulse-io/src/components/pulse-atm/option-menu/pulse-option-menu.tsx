import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { Position, Size } from '../../../interface';


@Component({
  tag: 'pulse-option-menu',
  styleUrl: 'pulse-option-menu.scss',
  shadow: true
})
export class PulseOptionMenu {
  private id = `pulse-option-menu-${optionMenuId++}`;
  private readonly menu_size_values = {
    'size-xl': '50rem',
    'size-l': '50rem',
    'size-m': '40rem',
    'size-s': '32rem',
    'size-xs': '28.2rem'
  };
  private sizeState: string = 'size-xs';
  private menumain: HTMLElement;

  @Element() elHost: HTMLElement;

  @Prop() data: any[] = [];
  @Prop() height: string = 'auto';
  @Prop() value: any;
  @Prop() show: boolean = true;
  @Prop() name = this.id;
  @Prop() htmlelementref: HTMLElement;
  @Prop() size: Size = 'xs';
  @Prop() orientation: Position = 'right-end';

  @State() showState: boolean = true;
  @State() align: string = 'end';
  @State() position: string = 'right';

  @Event() valueChanged: EventEmitter;
  @Event() presentEnd: EventEmitter<string>;

  componentDidLoad() {
    this.recalculate();
    document.addEventListener('click', () => {
      this.show = false;
    });
    this.elHost.addEventListener('click', () => {
      this.show = false;
    });
  }

  componentWillLoad() {
    this.sizeState = `size-${this.size}`;
    this.position = this.orientation.split('-')[0];
    this.align = this.orientation.split('-')[1];
  }

  @Listen('resize', { target: 'window' })
  resizeWindow() {
    this.recalculate();
  }

  @Method()
  async recalculate() {
    this.setMenuSize();
    const spacingTooltip = 15;
    if (!!this.htmlelementref) {
      const { x: htmlLeft, y: htmlTop } = this.htmlelementref.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      this.elHost.style.top = `${htmlTop + scrollTop + this.htmlelementref.clientHeight + spacingTooltip - 10}px`;
      this.elHost.style.left = `${(htmlLeft + this.htmlelementref.clientWidth) - this.elHost.clientWidth - spacingTooltip}px`;
    }
  }

  @Watch('value')
  valueWatchHandler(newValue: any) {
    this.valueChanged.emit(newValue);
  }


  @Watch('show')
  handler(newV: boolean) {
    this.showState = newV;
  }

  @Listen('optionDidLoad')
  onOptionDidLoad(ev: CustomEvent) {
    this.data.push(ev);
  }

  @Listen('optionOnClick')
  onOptionOnClick(ev: CustomEvent) {
    this.value = ev;
  }

  private setMenuSize(): void {
    const menuWidth = this.menu_size_values[this.sizeState] || '28.2rem';
    this.menumain.style.width = menuWidth;
  }


  render() {
    return (
      <Host class='pulse-option-menu'>
        <pulse-card class={{
          ['menu-container']: true,
          ['menu-container--hide']: !this.show,
          ['menu-container--show']: this.show
        }} style={{ maxHeight: this.height }} ref={el => this.menumain = el as HTMLElement}>
          <div class={'menu-container__slot'}>
            <slot></slot>
          </div>
        </pulse-card>
      </Host>
    );
  }

}

let optionMenuId = 0;
