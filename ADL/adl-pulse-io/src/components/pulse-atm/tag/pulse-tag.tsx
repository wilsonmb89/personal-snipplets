import { Component, Prop, h, Host, State, Watch, Event, EventEmitter } from '@stencil/core';
import { Color, ColorVariant, CssClassMap, CssCustomRule, Fill, Size } from '../../../interface';
import { createColorClasses } from '../../../utils/themes';
import { getCustomCssProps } from '../../../utils/utils';

@Component({
  tag: 'pulse-tag',
  styleUrl: 'pulse-tag.scss',
  shadow: true
})
export class PulseTag {
  private hostmain: HTMLElement;
  private tagmain: HTMLElement;

  @State() iconcolor: Color = 'carbon';
  @State() iconcolorvariant: ColorVariant = '900';

  @Prop({ reflectToAttr: true }) fill: Fill = 'solid';
  @Prop() color: Color = 'primary';
  @Prop() colorvariant: ColorVariant = '900';
  @Prop() text: string;
  @Prop() closeable: boolean = false;
  @Prop() stayalways: boolean = false;
  @Prop() size: Size = 's';
  @Prop() disabled: boolean = false;
  @Prop() skeleton: boolean = false;
  @Prop() maxwidth?: number = 0;

  @Event() closeClick: EventEmitter;

  @Watch('closeable')
  closeableChanged() {
    this.fixIconColor();
  }

  @Watch('disabled')
  disabledChanged() {
    this.fixIconColor();
  }

  @Watch('skeleton')
  skeletonChanged() {
    this.fixIconColor();
  }

  @Watch('maxwidth')
  maxwidthChanged() {
    this.setMaxWidth();
  } 

  constructor() {}

  componentWillLoad(): void {
    this.skeleton = (this.skeleton ? (!this.disabled) : false);
    this.iconcolor = this.color;
    this.iconcolorvariant = this.colorvariant;
  }

  componentDidLoad(): void {
    this.fixIconColor();
    this.setMaxWidth();
  }

  private setMaxWidth(): void {
    if (!!this.maxwidth) {
      this.tagmain.style.maxWidth = `${this.maxwidth}rem`;
    } else {
      this.tagmain.style.removeProperty('max-width');
    }
  }

  private fixIconColor(): void {
    const cssColorsRules = getCustomCssProps('pulse-color');
    if (this.fill === 'solid' && !this.disabled && !this.skeleton) {
      const value = getComputedStyle(this.tagmain).getPropertyValue('--pulse-color-fg').trim();
      const color: CssCustomRule = cssColorsRules.find(rule => rule.value === value);
      if (!!color && !!color.name) {
        const groupColor: string[] = color.name.replace('--pulse-color-', '').split('-');
        this.iconcolor = groupColor[0] as Color;
        this.iconcolorvariant = groupColor[1] as ColorVariant;
      }
    } else if (this.disabled || this.skeleton) {
      this.iconcolor = 'carbon';
      this.iconcolorvariant = '100';
    }
  }

  private setTipography(size: Size): CssClassMap {
    let typography = 'pulse-tp-hl6-comp-b';
    switch (size) {
      case 'm':
        typography = 'pulse-tp-hl5-comp-b';
        break;
      case 'l':
      case 'xl':
        typography = 'pulse-tp-hl4-comp-b';
        break;
    }
    return {
      [typography]: true
    };
  }

  private mouseOverIcon(): void {
    if (!this.disabled && !this.skeleton) {
      this.iconcolor = this.color;
      this.iconcolorvariant = this.colorvariant;
    }
  }

  private mouseOutIcon(): void {
    this.fixIconColor();
  }

  private mouseClickIcon(): void {
    if (!this.disabled) {
      this.closeClick.emit();
      if (!this.stayalways) {
        this.hostmain.remove();
      }
    }
  }

  render() {
    return (
      <Host class="pulse-tag"
            ref={el => this.hostmain = el as HTMLElement}>
        <div
          ref={el => this.tagmain = el as HTMLElement}
          class={{
            [`tag-${this.fill}`]: true,
            [`tag-size-${(this.size === 'xl' ? 'l' : (this.size === 'xs' ? 's' : this.size))}`]: true,
            ...createColorClasses(this.color, this.colorvariant),
            "tag-container": true,
            "tag-closeable": this.closeable,
            "tag-disabled": this.disabled,
            "tag-skeleton": this.skeleton,
          }}>
          <div class={{
            "tag-container__text": true,
            ...this.setTipography(this.size)
          }}>
            {
              this.skeleton ?
              <div class="tag-container__text--skeleton skeleton-loader-anim"></div> :
              (this.text ?
                <span>{this.text}</span> :
                <slot></slot>)
            }
          </div>
          {!!this.closeable && (<div class="tag-container__icon"
            onMouseOver={() => this.mouseOverIcon()}
            onMouseOut={() => this.mouseOutIcon()}
            onClick={() => this.mouseClickIcon()}>
            <pulse-icon icon="close"
                        color={this.iconcolor}
                        colorvariant={this.iconcolorvariant}
                        size={(this.size === 'xl' ? 'l' : (this.size === 'xs' ? 's' : this.size))}>
            </pulse-icon>
          </div>)}
        </div>
      </Host>
    );
  }
}
