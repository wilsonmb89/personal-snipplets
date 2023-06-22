import { Component, Event, EventEmitter, h, Listen, Prop, State, Element } from '@stencil/core';


@Component({
  tag: 'pulse-dropdown',
  styleUrl: 'pulse-dropdown.scss',
  shadow: true
})
export class PulseDropdown {

  private id = `pulse-dropdown-${dropDown++}`;

  @Element() el!: HTMLElement;
  @Prop() disabled: boolean = false;
  @Prop() label: string;
  @Prop() placeholder: string = 'Seleccionar';
  @Prop() value: string;
  @Prop() name = this.id;
  @Prop() text: string;
  @Prop() ellipsis = true;
  @Prop() insideelement: boolean = false;
  @State() show: boolean = false;
  @Event() pulseChange: EventEmitter;

  @Listen('valueChanged')
  onMenuValueChange(ev: CustomEvent) {
    this.text = ev.detail.target.textContent;
    this.value = ev.detail.target.value;
    this.pulseChange.emit(this.value);
  }

  private onClick = () => {
    this.show = !this.show;
  };


  waitForItems = (el: HTMLElement) => {
    return Promise.all(
      Array.from(el.querySelectorAll('pulse-option')));
  }

  componentDidLoad() {
    this.waitForItems(this.el).then((elements: HTMLPulseOptionElement[]) => {
      if (!!this.value) {
        const option = elements.find((el: HTMLPulseOptionElement) => el.value === this.value);
        this.text = option.innerText;
      }
    });
  }

  render() {
    return (
      <div
        onClick={!this.disabled ? this.onClick : null}
        class={{
          ['dropdown']: true
        }}>
        <pulse-input
          disabled={this.disabled}
          label={this.label}
          readonly={true}
          icon={this.show ? 'expand-less' : 'expand-more'}
          iconcolor={this.disabled ? 'carbon' : 'primary'}
          placeholder={this.placeholder}
          value={this.text}
          name={this.name}
        />

        {
          this.show ? <div class="dropdown__inputcontainer__before-menu"></div> : ''
        }
        <div class="dropdown__inputcontainer__menu">
          <pulse-option-menu class={{
            'dropdown-menu': true,
            'inside-element': this.insideelement
          }} 
          height="20rem" show={this.show}>
            <slot />
          </pulse-option-menu>
        </div>
      </div>
    );
  }

}

let dropDown = 0;
