import { Component, h, Method, Prop, State, Watch } from '@stencil/core';
import { Color, ColorVariant, Size } from '../../../interface';
import { SVGS } from './icons';


@Component({
  tag: 'pulse-icon',
  styleUrl: 'pulse-icon.scss',
  shadow: true
})
export class PulseIcon {


  private iconId = `pulse-icon-${iconId++}`;
  @Prop() color: Color = 'primary';
  @Prop() colorvariant: ColorVariant = '700';
  @Prop() size: Size = 'm';
  @Prop() icon: string;
  @Prop() name = this.iconId;

  @State() paths: string[];

  @Method()
  async getIconsNames(): Promise<string[]>{
    return SVGS.$children$[0].$children$.map((v) => v.$attrs$.id);
  }

  @Watch('icon')
  watchHandler(newValue: boolean) {
    this.paths = this.getPaths(newValue);
  }

  componentWillLoad() {
    this.paths = this.getPaths(this.icon);
  }


  private getPaths = (iconId): string[] => {
    try {
      return SVGS.$children$[0].$children$
        .filter(value => value.$attrs$.id === iconId)[0].$children$
        .map(v => v.$attrs$.d);
    } catch (e) {
      console.error(`pulse-icon: ${iconId} is not defined. ${this.iconId}`);
      return [];
    }
  };

  hostData() {
    return {
      class: {
        [`pulse-color-${this.color}-${this.colorvariant}`]: true
      }
    };
  }


  render() {
    return (
      <div class="pulse-icon-container">
        <svg class={{ [`size--${this.size}`]: true }}
             viewBox='0 0 24 24' fill='currentColor'>
          {this.paths.map((v) => {
            return <path d={v}></path>
          })}
        </svg>
      </div>

    );
  }
}

let iconId = 0;
