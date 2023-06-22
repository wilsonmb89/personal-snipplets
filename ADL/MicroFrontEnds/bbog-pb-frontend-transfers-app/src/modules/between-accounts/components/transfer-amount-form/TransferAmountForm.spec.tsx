import React from 'react';
import { act, cleanup, createEvent, fireEvent, render, screen, waitFor } from '../../../../test-utils/provider-mock';
import TransferAmountForm from './TransferAmountForm';
import { TransferAccount } from '../../store/transfer/account-transfer.entity';
import { sherpaEvent } from '../../../../test-utils/sherpa-event';

describe('Transfer form', () => {
  const accountFrom = {
    description: '',
    productBankSubType: '',
    productBankType: '',
    productNumber: ''
  };
  const accountTo = {
    description: '',
    title: '',
    icon: '',
    productBankName: ''
  };

  test('should load and press summary and continue button', async () => {
    const changeStep = jest.fn();

    const transferAccount: TransferAccount = {
      accountFrom: {
        ...accountFrom
      },
      accountTo: {
        ...accountTo
      },
      displayValue: '$1.0',
      amount: '1.0',
      note: 'note',
      numberOfBill: 'bill'
    };

    act(() => {
      render(
        <TransferAmountForm
          infoCost=""
          updateInfo={jest.fn()}
          changeStep={changeStep}
          defaultValue={transferAccount}
          minimunAmount={0.1}
        />
      );
    });

    const button = screen.getByText('Continuar');
    await waitFor(() => fireEvent.submit(button), { timeout: 100 });

    expect(changeStep).toBeCalled();
    cleanup();
  });

  test('should load and change values of inputs', async () => {
    const updateInfo = jest.fn();

    const transferAccount: TransferAccount = {
      accountFrom: {
        ...accountFrom
      },
      accountTo: {
        ...accountTo
      },
      displayValue: '$100.000,12',
      amount: '100.000,12',
      note: 'note',
      numberOfBill: 'bill'
    };

    act(() => {
      render(
        <TransferAmountForm
          infoCost=""
          updateInfo={updateInfo}
          changeStep={jest.fn()}
          defaultValue={transferAccount}
          minimunAmount={0.1}
        />
      );
    });
    const amount = screen.getByTestId('amount') as HTMLBdbAtInputElement;
    sherpaEvent.type(amount, { value: '90.000' });

    const note = screen.getByTestId('note') as HTMLBdbAtInputElement;
    sherpaEvent.type(note, { value: '90.000' });

    const numberOfBill = screen.getByTestId('numberOfBill') as HTMLBdbAtInputElement;
    sherpaEvent.type(numberOfBill, { value: 'bill' });

    const inpuutNoteUpdated: Event & { detail?: unknown } = createEvent('atInputUpdated', note);
    fireEvent(note, inpuutNoteUpdated);

    const inputNumberBillUpdated: Event & { detail?: unknown } = createEvent('atInputUpdated', numberOfBill);
    fireEvent(numberOfBill, inputNumberBillUpdated);

    expect(updateInfo).toBeCalled();
    cleanup();
  });
});
