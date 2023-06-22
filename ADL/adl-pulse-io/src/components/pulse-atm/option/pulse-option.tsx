import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { Color, ColorVariant } from '../../../interface';


@Component({
  tag: 'pulse-option',
  styleUrl: 'pulse-option.scss',
  shadow: true
})
export class PulseOption {

  private id = `pulse-option-${optionId++}`;
  @Prop() value: string;
  @Prop() disabled: boolean = false;
  @Prop() name = this.id;
  @Prop() color?: Color = 'carbon';
  @Prop() icon?: string;
  @Prop() colorvariant?: ColorVariant ='700';
  @Prop() showIcon?: boolean = false;

  @Event() optionDidLoad: EventEmitter<void>;
  @Event() optionOnClick: EventEmitter<string>;

  componentDidLoad() {
    this.optionDidLoad.emit();
  }

  private onClick = () => {
    this.optionOnClick.emit(this.value);
  }

  render() {
    return (
      <div class={{
        ['option__content']: true,
        ['option__content--disabled']: this.disabled
      }} onClick={!this.disabled ? this.onClick : null}>
        <div class={{ ['option__content--show']: true}}>
          <div>
            {
              this.showIcon === true ?
                <pulse-icon color={this.color} colorvariant={this.colorvariant} icon={this.icon}></pulse-icon>
                : ''
            }
          </div>
          <div style={{color:`var(--pulse-color-${this.color}-${this.colorvariant})`}}>
            <slot>
            </slot>
          </div>
        </div>
      </div>
    );
  }
}

let optionId = 0;
