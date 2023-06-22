import { createEvent, fireEvent } from '@testing-library/dom';
import { screen } from './provider-mock';

export const sherpaEvent = {
  type: (
    element: HTMLBdbAtInputElement,
    detail: { value: string; name?: string; type?: string; valid?: boolean }
  ): HTMLBdbAtInputElement => {
    const inputEvent = new Event('atInputChanged') as Event & { detail: unknown };
    element.value = detail.value;
    inputEvent.detail = detail;
    fireEvent(element, inputEvent);

    return element;
  },
  closeModal: (): void => {
    const modal = screen.getByTestId('sherpa-modal');
    const event = createEvent('clickedCancelModalBtn', modal);
    fireEvent(modal, event);
  }
};

export const sherpaEventDatePickers = {
  type: (element: HTMLBdbMlDatePickerElement, detail: Date[]): HTMLBdbMlDatePickerElement => {
    const inputEvent = new Event('datePickerChange') as Event & { detail: unknown };
    element.value = detail;
    inputEvent.detail = detail;
    fireEvent(element, inputEvent);
    return element;
  }
};
