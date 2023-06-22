import { Component, h, Host, Prop } from '@stencil/core';
import { VoucherState } from '../../../models/pulse-voucher.model';

@Component({
  tag: 'pulse-voucher-summary-item',
  styleUrl: 'pulse-voucher-summary-item.scss',
  shadow: true
})
export class PulseVoucherSummaryItem {

  @Prop() titlename!: string;
  @Prop() state?: VoucherState = 'success';
  @Prop() hideborder?: boolean = false;

  constructor() { }

  render() {
    return (
      <Host>
        <div class={{
          'pulse-voucher-summary-item': true,
          'hide-border': this.hideborder,
          'error': this.state === 'error',
        }}>
          <span class="pulse-voucher-summary-item--title pulse-tp-bo3-comp-r">
            {this.titlename}
          </span>
          <div class="pulse-voucher-summary-item--data">
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
