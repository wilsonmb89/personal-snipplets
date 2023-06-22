import React, { Suspense } from 'react';
import App, {
  BetweenAccountListLazy,
  EnrollAccountLazy,
  ScheduledTransferAcctCheck,
  ScheduledTransferCreateLazy,
  ScheduledTransferListLazy,
  TransferAccountLazy
} from './App';
import store from './store';
import { render } from './test-utils/provider-mock';

describe('App unit tests', () => {
  const navigate = jest.fn();
  store.dispatch({ type: 'MOUNT' });
  test('should start the application succesfully', () => {
    const app = render(<App navigate={navigate} />);
    expect(app).toBeTruthy();
  });

  test('shoulld load lazy components', async () => {
    const app = render(
      <Suspense fallback={<div>Loader</div>}>
        <ScheduledTransferCreateLazy />
        <ScheduledTransferListLazy />
        <ScheduledTransferAcctCheck />
        <BetweenAccountListLazy />
        <EnrollAccountLazy />
        <TransferAccountLazy />
      </Suspense>
    );
    expect(app).toBeTruthy();
  });
});
