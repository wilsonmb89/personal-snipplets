import React, { Fragment } from 'react';
import showVoucher from './index';
import { VoucherControls, VoucherData, VoucherEvents } from './Voucher';
import { screen, waitFor } from '../test-utils/provider-mock';

const data: VoucherData = {
  data: {
    labelTop: 'Destino',
    valueTop: 'Mamá',
    labelBottom: 'Costo de la transacción',
    valueBottom: '8500',
    amount: '120.000,00',
    date: '4 de octubre 2021 - 3:25:06 pm',
    voucherNumber: '9876545787',
    description: 'Pa mi mae',
    transactionNumber: '7665676768889',
    value: '120000',
    tax: 'tax',
    consumptionTax: 'consumptionTax',
    bakSheesh: 'bakSheesh',
    numberFee: 'numberFee'
  },
  bodyTop: (
    <Fragment>
      <p style={{ textAlign: 'right' }}>Banco de Bogotá</p>
      <p style={{ textAlign: 'right' }}>Ahorros No. 12436453242</p>
      <div style={{ borderBottom: '1px solid var(--sherpa-carbon-200)' }}></div>
    </Fragment>
  ),
  bodyBottom: (
    <Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>
          <b>Nota:</b>
        </p>
        <p>Cumpleaños Noviembre</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>Factura:</p>
        <p>1234567654</p>
      </div>
    </Fragment>
  )
};

const controls: VoucherControls = {
  stamp: 'paid',
  typeVoucher: 4,
  state: 'SUCCESS'
};

const events: VoucherEvents = {
  onButtonOk: jest.fn(),
  onButtonShare: jest.fn(),
  onPaymentError: jest.fn(),
  onExit: jest.fn()
};

let voucher: HTMLElement;
let transferVoucher: HTMLElement;
let transferHeader: HTMLElement;

describe('voucher index', () => {
  beforeEach(async () => {
    showVoucher(data, controls, events);
    voucher = await waitFor(() => screen.getByTestId('voucher'));
    transferVoucher = voucher.querySelector('transfers-bdb-ml-bm-voucher');
    transferHeader = voucher.querySelector('transfers-bdb-ml-header-bv');
  });

  test('suold show voucher', () => {
    expect(voucher).toBeTruthy();
  });

  test('should call VoucherEvents.onExit when click on link exit', async () => {
    transferHeader.dispatchEvent(new CustomEvent('forwardBtnClicked'));
    expect(events.onExit).toHaveBeenCalled();
  });

  test('should call VoucherEvents.onButtonOk when click on button ok', async () => {
    transferVoucher.dispatchEvent(new CustomEvent('buttonOk'));
    expect(events.onButtonOk).toHaveBeenCalled();
  });

  test('should call VoucherEvents.onButtonSahre when click on button share', async () => {
    transferVoucher.dispatchEvent(new CustomEvent('buttonShare'));
    expect(events.onButtonShare).toHaveBeenCalled();
  });

  test('should call VoucherEvents.onPaymenError when click on link payment error', async () => {
    transferVoucher.dispatchEvent(new CustomEvent('paymentError'));
    expect(events.onPaymentError).toHaveBeenCalled();
  });
});
