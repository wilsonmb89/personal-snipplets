import { Component, h, Host } from '@stencil/core';
@Component({
  tag: 'pulse-voucher',
  styleUrl: 'pulse-voucher.scss',
  shadow: true
})
export class PulseVoucher {

  constructor() { }

  render() {
    return (
      <Host>
        <div class="pulse-voucher-container pulse-elevation-8">
          <div class="pulse-voucher-container__header">
            <div class="pulse-voucher-container__header--corners"></div>
            <div class="pulse-voucher-container__header__main">
              <slot name="header"></slot>
            </div>
          </div>
          <div class="pulse-voucher-container__data">
            <div class="pulse-voucher-container__data__main">
              <slot name="data"></slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
