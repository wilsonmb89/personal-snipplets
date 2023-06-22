import React from 'react';
import store from '../../../store';
import { render } from '../../../test-utils/provider-mock';
import AccountList from './AccountList';

describe('Account list component', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
  });
  beforeEach(async () => {
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  const accountData = [
    {
      title: 'title',
      desc: 'description',
      desc2: 'description two',
      value: 123,
      avatar: { text: 'alias-test', color: 'bouquet', size: 'sm' }
    }
  ];

  test('render the component with accounts', async () => {
    const accountList = render(<AccountList title="test" accounts={accountData} />);
    expect(accountList).toBeTruthy();
  });

  test('render the component with hiddenArrow in false', async () => {
    const accoountList = render(
      <AccountList title="test" hiddenArrow={false} clickActionCard={jest.fn()} accounts={accountData} />
    );
    expect(accoountList).toBeTruthy();
  });
});
