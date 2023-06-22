import { Component, Prop, Listen, Element, Event, EventEmitter, h } from '@stencil/core';
import { hasShadowDom } from '../../../utils/utils';
import { Color, ColorVariant } from '../../../interface';
import { createColorClasses } from '../../../utils/themes';
// import { createColorClasses } from '../../../utils/themes';

@Component({
  tag: 'pulse-fab-button',
  styleUrl: 'pulse-fab-button.scss',
  shadow: true
})
export class PulseFabButton {

  @Element() el: HTMLElement;

  @Event() pulseFocus: EventEmitter;
  @Event() pulseBlur: EventEmitter;
  @Event() fabButtonDidLoad: EventEmitter;

  @Prop() text: string;
  @Prop() color: Color;
  @Prop() colorvariant: ColorVariant = '700';
  @Prop() colorgradient: boolean = false;
  @Prop({ reflectToAttr: true }) disabled = false;
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';
  @Prop() textposition: 'bottom' | 'right'  = 'bottom';

  @Listen('click')
  onClick(ev: Event) {
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
  }

  private onBlur = () => {
    this.pulseBlur.emit();
  }
  
  componentDidLoad() {
    this.fabButtonDidLoad.emit(this.el);
  }

  hostData() {
    const { disabled, color, colorvariant, colorgradient, textposition } = this;
    return {
      'aria-disabled': disabled ? 'true' : null,
      class: {
        ...createColorClasses(color, colorvariant, colorgradient),
        'button': true,
        'button-disabled': disabled,
        'pulse-focusable': true,
        [`button-title-${textposition}`]: textposition ,
      }
    };
  }

  render() {
    const attrs = { type: this.type }

    return (
      <div tabindex="0" class="button-main pulse-padding-s-xs-a">
        <button tabindex="-1"
          {...attrs}
          class="button-native"
          onFocus={this.onFocus}
          onBlur={this.onBlur}>
          <slot></slot>
        </button>
        <p tabindex="-1" class="button-title pulse-margin-s-xs-v">{this.text}</p>
      </div>
    );
  }
}