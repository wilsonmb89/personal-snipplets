import React from 'react';
import { createEvent, fireEvent, render, RenderResult, screen, waitFor } from '../../../test-utils/provider-mock';
import LayoutSummary from './LayoutSummary';

describe('Layout summary component', () => {
  const setShowBackdrop = jest.fn();
  const openBackdrop = jest.fn();
  const closeBackdrop = jest.fn();

  const avatarValues = {
    color: 'white',
    icon: 'ico-saving',
    text: 'Mandatory'
  };

  const headerValues = {
    title: 'Nueva Cuenta',
    desc: 'Banco',
    desc2: '1234567890'
  };

  const detailValues = [
    { title: 'Titular:', value: 'Christopher' },
    { title: 'Documento:', value: 'C.C. 123456789' }
  ];

  const renderLayoutSummary = (): RenderResult => {
    return render(
      <LayoutSummary {...{ avatarValues, headerValues, detailValues, setShowBackdrop }} showBackdrop>
        <div>Content</div>
      </LayoutSummary>
    );
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  test('should load a summary layout', async () => {
    const layoutSummary = renderLayoutSummary();
    expect(layoutSummary).toBeTruthy();
  });

  test('should open the backdrop', async () => {
    const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: { openBackdrop } });
    const layoutSummary = renderLayoutSummary();
    expect(useRefSpy).toBeCalledTimes(1);
    expect(layoutSummary).toBeTruthy();
  });

  test('should close the backdrop when you click outside the summary', async () => {
    const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: { closeBackdrop } });
    const layoutSummary = renderLayoutSummary();

    const backdrop = await waitFor(() => screen.getByTestId('summary-backdrop'));
    const clickBackDropClosedEvent: Event = createEvent('backDropClosed', backdrop);
    fireEvent(backdrop, clickBackDropClosedEvent);

    expect(useRefSpy).toBeCalled();
    expect(layoutSummary).toBeTruthy();
  });

  test('should close the backdrop when you click to close the summary', async () => {
    const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: { closeBackdrop } });
    const layoutSummary = renderLayoutSummary();

    const summary = await waitFor(() => screen.getByTestId('summary'));
    const clickAtCloseResumenEvent: Event = createEvent('atCloseResumeBtnClick', summary);
    fireEvent(summary, clickAtCloseResumenEvent);

    expect(useRefSpy).toBeCalled();
    expect(layoutSummary).toBeTruthy();
  });
});
