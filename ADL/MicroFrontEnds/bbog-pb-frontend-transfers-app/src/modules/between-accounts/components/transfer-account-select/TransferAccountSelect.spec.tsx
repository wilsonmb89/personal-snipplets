import React from 'react';
import { act, render, waitFor, screen, createEvent, fireEvent, cleanup } from '../../../../test-utils/provider-mock';
import TransferAccountSelect from './TransferAccountSelect';

describe('Transfer account select', () => {
  const ownAccounts = [
    {
      seeDetails: false,
      value: '100.000',
      cardDescription: 'Cuenta n 123',
      cardName: '',
      isChecked: 'true',
      labelValue: '',
      productBankSubType: '',
      productNumber: '',
      secureValue: '',
      productBankType: ''
    },
    {
      seeDetails: false,
      value: '800.000',
      cardDescription: 'Cuenta n 456',
      cardName: '',
      isChecked: 'true',
      labelValue: '',
      productBankSubType: 'DDA',
      productNumber: '456',
      secureValue: '',
      productBankType: ''
    }
  ];

  test('Should load and press summary and do transfer button', async () => {
    const doTransfer = jest.fn();

    act(() => {
      render(
        <TransferAccountSelect
          doTransfer={doTransfer}
          disableButton={false}
          updateAccount={jest.fn()}
          ownAccounts={ownAccounts}
        />
      );
    });
    fireEvent(
      screen.getByTestId('transfer-button'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
    expect(doTransfer).toBeCalled();
    cleanup();
  });

  test('Should load and press option for card select', async () => {
    const updateAccount = jest.fn();
    const accountForSelect = {
      cardDescription: 'No. 0019817386',
      cardName: 'Cuenta corrinte',
      productNumber: '0019817386',
      productBankType: 'DDA'
    };
    act(() => {
      render(
        <TransferAccountSelect
          doTransfer={jest.fn()}
          disableButton={false}
          updateAccount={updateAccount}
          ownAccounts={ownAccounts}
        />
      );
    });

    const accountSelector: HTMLElement = (await waitFor(() =>
      screen.getByTestId('account-selector')
    )) as HTMLBdbMlCardPriceElement;

    act(() => {
      const clickForCard: Event & { detail?: unknown } = createEvent('cardSelected', accountSelector);
      clickForCard.detail = {
        ...accountForSelect
      };
      accountSelector.dispatchEvent(clickForCard);
      fireEvent(accountSelector, clickForCard);
    });
    expect(updateAccount).toBeCalled();
    cleanup();
  });
});
