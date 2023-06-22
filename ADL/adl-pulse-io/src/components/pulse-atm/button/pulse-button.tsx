import {
  Component,
  Prop,
  Listen,
  Element,
  Event,
  EventEmitter,
  h
} from '@stencil/core';
import { hasShadowDom } from '../../../utils/utils';
import { Color, Fill, ColorVariant } from '../../../interface';
import { createColorClasses } from '../../../utils/themes';

@Component({
  tag: 'pulse-button',
  styleUrl: 'pulse-button.scss',
  shadow: true
})
export class PulseButton {
  @Element() el: HTMLElement;

  @Event() pulseFocus!: EventEmitter;
  @Event() pulseBlur!: EventEmitter;

  @Prop() color: Color = 'primary';
  @Prop({ reflectToAttr: true }) fill: Fill = 'solid';
  @Prop({ reflectToAttr: true }) disabled = false;

  @Prop({
    attribute: 'pulse-button-type'
  }) pulseButtonType: 'primary' | 'secondary' | 'tertiary' = 'primary';

  @Prop({
    attribute: 'pulse-button-size'
  }) pulseButtonSize: 'default' | 'small' = 'default';

  @Prop() icon: string;
  @Prop({
    attribute: 'icon-color'
  }) iconColor: Color = 'primary';

  @Prop({
    attribute: 'icon-color-variant'
  }) iconColorVariant: ColorVariant = '700';

  @Prop({
    attribute: 'icon-position'
  }) iconPosition: 'left' | 'right' = 'right';

  @Prop() type: 'submit' | 'reset' | 'button' = 'button';
  @Prop() colorvariant: ColorVariant = '700';
  @Prop() colorgradient: boolean = true;
  @Prop() block: boolean = false;

  @Listen('click')
  onClick(ev: Event) {
    if (this.disabled) {
      return;
    }
    if (hasShadowDom(this.el)) {
      //Busca si hay un padre que contiene el elemento aislado por el shadowDom
      const form = this.el.closest('form');
      if (form) {
        ev.preventDefault();
        const virtualButton = document.createElement('button');
        virtualButton.type = this.type;
        virtualButton.style.display = 'none';
        form.appendChild(virtualButton);
        virtualButton.click();
        virtualButton.remove();
      }
    }
  }

  private onFocus = () => {
    this.pulseFocus.emit();
  };

  private onBlur = () => {
    this.pulseBlur.emit();
  };

  hostData() {
    const {
      disabled,
      color,
      fill,
      colorvariant,
      colorgradient,
      pulseButtonType,
      pulseButtonSize,
      icon,
      iconPosition
    } = this;
    return {
      'aria-disabled': disabled ? 'true' : null,
      class: {
        ...createColorClasses(color, colorvariant, colorgradient),
        button: true,
        [`button-${fill}`]: true,
        [`button-type-${pulseButtonType}`]: true,
        [`button-size-${pulseButtonSize}`]: true,
        [`icon-position-${iconPosition}`]: true,
        'button-icon': !!icon,
        'button-disabled': disabled,
        'pulse-focusable': true,
        'pulse-block': this.block
      }
    };
  }

  render() {
    const attrs = { type: this.type };

    return (

      <button
        {...attrs}
        class='button-native pulse-tp-btn-comp-m'
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <slot></slot>
        <slot name="variations"></slot>
        {
          !!this.icon &&
          <div class="button-native__icon">
            <pulse-icon
              icon={this.icon}
              color={this.iconColor}
              size={this.pulseButtonSize === 'default' ? 'm' : 's'}
              colorvariant={this.iconColorVariant}
            ></pulse-icon>
          </div>
        }
      </button>
    );
  }
}
