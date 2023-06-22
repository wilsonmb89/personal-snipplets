import { fireEvent } from '@testing-library/dom';

const sherpaEvent = {
  type: (
    element: HTMLBdbAtInputElement,
    detail: { value: string; name?: string; type?: string; valid?: boolean }
  ): HTMLBdbAtInputElement => {
    const inputEvent = new Event('atInputChanged') as Event & { detail: unknown };
    element.value = detail.value;
    inputEvent.detail = detail;
    fireEvent(element, inputEvent);

    return element;
  }
};

export default sherpaEvent;
