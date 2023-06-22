import React from 'react';
import '@testing-library/jest-dom';

import { act, render, waitFor, screen, createEvent } from '@test-utils/provider-mock';
import BdbMlModalImp, { BdbMlModalImpProps } from './BdbMlModalImp';

describe('BdbMlModalImpl component unit tests', () => {
  const onClickButtonHandlerMock = jest.fn();
  const onCloseHandlerMock = jest.fn();

  const modalData: BdbMlModalImpProps = {
    icon: 'success',
    title: 'title test',
    message: 'message test',
    controls: [
      {
        text: 'action test 1',
        action: onClickButtonHandlerMock
      }
    ],
    onClose: onCloseHandlerMock
  };

  test('should load the component successfully', async () => {
    act(() => {
      render(<BdbMlModalImp {...modalData} />);
    });
    const element = await waitFor(() => screen.getByTestId('bdb-modal-info'));
    expect(element).toBeInTheDocument();
  });

  test('should load the component successfully with default data', async () => {
    act(() => {
      render(
        <BdbMlModalImp
          title="title test"
          controls={[
            {
              text: 'action test 1',
              action: onClickButtonHandlerMock
            }
          ]}
          onClose={onClickButtonHandlerMock}
        />
      );
    });
    const element = await waitFor(() => screen.getByTestId('bdb-modal-info'));
    expect(element).toBeInTheDocument();
  });

  test('should load the component successfully without buttons', async () => {
    const dataNoButtons: BdbMlModalImpProps = {
      ...modalData,
      controls: []
    };
    act(() => {
      render(<BdbMlModalImp {...dataNoButtons} />);
    });
    const element = await waitFor(() => screen.getByTestId('bdb-modal-info'));
    expect(element).toBeInTheDocument();
  });

  test('should do an action from click in action button', async () => {
    act(() => {
      render(<BdbMlModalImp {...modalData} />);
    });
    const element = await waitFor(() => screen.getByTestId('bdb-modal-info'));
    expect(element).toBeInTheDocument();
    const event: Event & { detail?: unknown } = createEvent('buttonAlertClicked', element);
    event.detail = {
      value: 'action test 1'
    };
    element.dispatchEvent(event);
    expect(onClickButtonHandlerMock).toBeCalled();
  });

  test('should do an action from click in close button', async () => {
    act(() => {
      render(<BdbMlModalImp {...modalData} />);
    });
    const element = await waitFor(() => screen.getByTestId('bdb-modal-info'));
    expect(element).toBeInTheDocument();
    const event: Event & { detail?: unknown } = createEvent('closeAlert', element);
    element.dispatchEvent(event);
    expect(onCloseHandlerMock).toBeCalled();
  });
});
