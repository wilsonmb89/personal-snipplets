import { Component, h, Host, Prop, Event, EventEmitter } from '@stencil/core';
import { VoucherModel } from '../../../models/pulse-voucher.model';
import { getHeaderLogoM, getHeaderLogoS } from '../../../utils/icons/global-icons';

@Component({
  tag: 'pulse-transaction',
  styleUrl: 'pulse-transaction.scss',
  shadow: true
})
export class PulseTransaction {

  @Prop() voucherdata!: VoucherModel;

  @Event() mailactionclicked: EventEmitter;
  @Event() mainactionclicked: EventEmitter;
  @Event() secondaryactionclicked: EventEmitter;

  constructor() { }

  componentWillLoad(): void {
    this.buildVoucherData();
  }

  private buildVoucherData(): void {
    if (!this.voucherdata.controls.controlEmail) {
      this.voucherdata.controls.controlEmail = { title: '', hidden: true };
    }
    if (!this.voucherdata.controls.controlMainButton) {
      this.voucherdata.controls.controlMainButton = { title: '', hidden: true };
    }
    if (!this.voucherdata.controls.controlSecondaryButton) {
      this.voucherdata.controls.controlSecondaryButton = { title: '', hidden: true };
    }
  }

  render() {
    return (
      <Host>
        <pulse-flowthc>
          <div slot="header">
            <pulse-flowth>
              <div slot="content">
                <div class="pulse-transaction-container__header-logos">
                  <div class="pulse-transaction-container__header-logos--logo-m">
                    {getHeaderLogoM()}
                  </div>
                  <div class="pulse-transaction-container__header-logos--logo-s">
                    {getHeaderLogoS()}
                  </div>
                </div>
              </div>
            </pulse-flowth>
          </div>
          <div slot="content" class="pulse-transaction-container__body">
            <div class="pulse--grid">
              <div class="pulse-row">
                <div class="pulse-col pulse-col-sm-4 pulse-col-md-6 pulse-col-lg-10 pulse-offset-md-1 pulse-offset-lg-1">
                  <pulse-voucher>
                    <div slot="header" class="pulse-transaction-container__body__result">
                      <pulse-voucher-result voucherHeader={this.voucherdata.header}
                        voucherControls={this.voucherdata.controls}
                        state={this.voucherdata.state}
                        onMailclicked={() => { this.mailactionclicked.emit() }}
                        onMainclicked={() => { this.mainactionclicked.emit() }}
                        onSecondaryclicked={() => { this.secondaryactionclicked.emit() }}>
                        <div slot="message-info">
                          <slot name="message-info"></slot>
                        </div>
                      </pulse-voucher-result>
                    </div>
                    <div slot="data" class="pulse-transaction-container__body__summary">
                      <pulse-voucher-summary voucherBody={this.voucherdata.body}
                        voucherControls={this.voucherdata.controls}
                        state={this.voucherdata.state}
                        onMailclicked={() => { this.mailactionclicked.emit() }}
                        onMainclicked={() => { this.mainactionclicked.emit() }}
                        onSecondaryclicked={() => { this.secondaryactionclicked.emit() }}>
                        <div slot="summary-list-items">
                          <slot name="summary-list-items"></slot>
                        </div>
                      </pulse-voucher-summary>
                    </div>
                  </pulse-voucher>
                </div>
              </div>
            </div>
          </div>
        </pulse-flowthc>
      </Host>
    );
  }
}
