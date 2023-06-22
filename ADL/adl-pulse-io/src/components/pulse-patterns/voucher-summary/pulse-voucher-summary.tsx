import { Component, h, Host, Prop, Event, EventEmitter, State, Listen } from '@stencil/core';
import { VoucherBody, VoucherControls, VoucherState } from '../../../models/pulse-voucher.model';

@Component({
  tag: 'pulse-voucher-summary',
  styleUrl: 'pulse-voucher-summary.scss',
  shadow: true
})
export class PulseVoucherSummary {

  private mobileBreakpoint = 771;

  @State() blockButton: boolean = false;

  @Prop() voucherBody!: VoucherBody;
  @Prop() voucherControls!: VoucherControls;
  @Prop() state?: VoucherState = 'success';

  @Event() mailclicked: EventEmitter;
  @Event() mainclicked: EventEmitter;
  @Event() secondaryclicked: EventEmitter;

  constructor() { }

  componentDidLoad() {
    this.recalculate();
  }

  @Listen('resize', { target: 'window' })
  resizeWindow() {
    this.recalculate();
  }

  private recalculate(): void {
    this.blockButton = window.innerWidth <= this.mobileBreakpoint;
  }

  render() {
    return (
      <Host>
        <div class={{
          'pulse-voucher-result-container': true,
          'error': this.state === 'error'
        }}>
          {
            !!this.voucherBody.amtInfo &&
            <div class="pulse-voucher-result-container__amt-info">
              <span class="pulse-voucher-result-container__amt-info__amt pulse-tp-hl2-comp-m">{this.voucherBody.amtInfo.amt}</span>
              <span class="pulse-voucher-result-container__amt-info__info pulse-tp-bo4-comp-r">{this.voucherBody.amtInfo.amtLabel}</span>
            </div>
          }
          <div class="pulse-voucher-result-container__summary">
            <pulse-voucher-summary-item titlename={"Destino:"} state={this.state}>
              <div class="pulse-voucher-result-container__summary__item--data">
                <span class="pulse-voucher-result-container__summary__item--data--900 pulse-tp-bo2-comp-m">{this.voucherBody.destination.type}</span>
                <span class="pulse-tp-bo3-comp-r">{this.voucherBody.destination.originName}</span>
                <span class="pulse-tp-bo3-comp-r">{this.voucherBody.destination.originId}</span>
              </div>
            </pulse-voucher-summary-item>
            {!!this.voucherBody.transactionCost &&
              <pulse-voucher-summary-item titlename={"Costo de la transacción:"} state={this.state}>
                <div class="pulse-voucher-result-container__summary__item--data">
                  <span class="pulse-voucher-result-container__summary__item--data--900 pulse-tp-bo2-comp-r">
                    {(this.state === 'success' || this.state === 'pending') ? this.voucherBody.transactionCost : '$0'}
                  </span>
                </div>
              </pulse-voucher-summary-item>
            }
            <pulse-voucher-summary-item titlename={"Cuenta de origen:"} state={this.state}>
              <div class="pulse-voucher-result-container__summary__item--data">
                <span class="pulse-tp-bo3-comp-r">{this.voucherBody.originAcct}</span>
              </div>
            </pulse-voucher-summary-item>
            <slot name="summary-list-items"></slot>
            <pulse-voucher-summary-item titlename={"Estado:"} state={this.state} hideborder={true}>
              {
                this.state === 'success' &&
                <pulse-tag fill={'outline'} color={'success'}>Exitoso</pulse-tag>
              }
              {
                this.state === 'error' &&
                <pulse-tag fill={'outline'} color={'error'} colorvariant={'700'}>Fallido</pulse-tag>
              }
              {
                this.state === 'pending' &&
                <pulse-tag fill={'outline'} color={'warning'} colorvariant={'900'}>Pendiente de aprobación</pulse-tag>
              }
            </pulse-voucher-summary-item>
          </div>
          {
            !this.voucherControls.controlEmail.hidden &&
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
              <pulse-button block={this.blockButton} class="pulse-voucher-result-container__controls--button"
                onClick={() => this.mainclicked.emit()}
                fill={'outline'}>
                {this.voucherControls.controlMainButton.title}
              </pulse-button>
            }
            {
              !this.voucherControls.controlSecondaryButton.hidden &&
              <pulse-button block={this.blockButton} class="pulse-voucher-result-container__controls--button"
                onClick={() => this.secondaryclicked.emit()}>
                {this.voucherControls.controlSecondaryButton.title}
              </pulse-button>
            }
          </div>
        </div>
      </Host>
    );
  }
}
