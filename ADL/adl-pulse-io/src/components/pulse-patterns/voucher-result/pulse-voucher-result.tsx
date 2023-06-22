import { Component, h, Host, Prop, Event, EventEmitter } from '@stencil/core';
import { VoucherControls, VoucherHeader, VoucherState } from '../../../models/pulse-voucher.model';
import { formatAMPM, formatDate } from '../../../utils/utils';
import { getErrorIcon, getPendingIcon, getStampIcon, getSuccessIcon } from '../../../utils/icons/global-icons';

@Component({
  tag: 'pulse-voucher-result',
  styleUrl: 'pulse-voucher-result.scss',
  shadow: true
})
export class PulseVoucherResult {

  private currDate: string = '';

  @Prop() voucherHeader!: VoucherHeader;
  @Prop() voucherControls!: VoucherControls;
  @Prop() state?: VoucherState = 'success';

  @Event() mailclicked: EventEmitter;
  @Event() mainclicked: EventEmitter;
  @Event() secondaryclicked: EventEmitter;

  constructor() { }

  componentWillLoad(): void {
    this.setCurrDate();
  }

  private setCurrDate(): void {
    if (!!this.voucherHeader.timestamp && !!this.voucherHeader.timestamp.date) {
      const date: Date = this.voucherHeader.timestamp.date;
      this.currDate = `${formatDate(date, 'DD MMM YYYY')}${!this.voucherHeader.timestamp.hideTime ? ' - ' + formatAMPM(date) : ''}`;
    } else {
      const date = new Date();
      this.currDate = `${formatDate(date, 'DD MMM YYYY')} - ${formatAMPM(date)}`;
    }
  }

  render() {
    return (
      <Host>
        <div class="pulse-voucher-result-container">
          <div class="pulse-voucher-result-container__icon">
            <div class="pulse-voucher-result-container__icon--state-wrapper">
              {this.state === 'success' && getSuccessIcon()}
              {this.state === 'error' && getErrorIcon()}
              {this.state === 'pending' && getPendingIcon()}
            </div>
            {
              this.voucherHeader.showStamp && this.state === 'success' &&
              <div class="pulse-voucher-result-container__icon--stamp-wrapper">
                {getStampIcon()}
              </div>
            }
          </div>
          <div class="pulse-voucher-result-container__title">
            <span class="pulse-tp-hl3-comp-b">{this.voucherHeader.title}</span>
          </div>
          <div class="pulse-voucher-result-container__info">
            {
              this.state === 'success' &&
              !!this.voucherHeader.voucherId &&
              <div class="pulse-voucher-result-container__info--success">
                <span class="pulse-voucher-result-container__info--success__voucher-id pulse-tp-bo2-comp-r">
                  Comprobante No. {this.voucherHeader.voucherId}
                </span>
              </div>
            }
            <span class="pulse-voucher-result-container__info--success__voucher-date pulse-tp-bo4-comp-r">
              {this.currDate}
            </span>
            {
              (this.state === 'error' || this.state === 'pending') &&
              <div class="pulse-voucher-result-container__info--message pulse-tp-bo3-comp-r">
                <slot name="message-info"></slot>
              </div>
            }
          </div>
          {
            this.state === 'success' && !this.voucherControls.controlEmail.hidden &&
            <div class="pulse-voucher-result-container__mail-control">
              <pulse-button pulseButtonType="tertiary"
                            iconPosition="left"
                            pulseButtonSize="small"
                            icon="email-action-unread"
                            onClick={() => this.mailclicked.emit()}>
                Enviar por e-mail
              </pulse-button>
            </div>
          }
          <div class="pulse-voucher-result-container__controls">
            {
              !this.voucherControls.controlMainButton.hidden &&
              <pulse-button class="pulse-voucher-result-container__controls--button"
                onClick={() => this.mainclicked.emit()}
                fill={'outline'}>
                {this.voucherControls.controlMainButton.title}
              </pulse-button>
            }
            {
              !this.voucherControls.controlSecondaryButton.hidden &&
              <pulse-button class="pulse-voucher-result-container__controls--button"
                onClick={() => this.secondaryclicked.emit()}>
                {this.voucherControls.controlSecondaryButton.title}
              </pulse-button>
            }
          </div>
        </div>
      </Host>
    )
  };
}