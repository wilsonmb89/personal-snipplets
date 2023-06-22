import { Component, Host, h, ComponentInterface } from '@stencil/core';


@Component({
  tag: 'pulse-slide',
  styleUrl: 'pulse-slide.scss',
  shadow: false
})
export class PulseSlide implements ComponentInterface {


  render() {
    return (
      <Host
        class={{
          'slide': true,
        }}>
      </Host>
    );
  }
}

