// TODO: Remove this file when https://github.com/ionic-team/stencil-ds-output-targets/pull/59
// and sherpa library have the update ready to use

import { JSX } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/types/components';
import { createReactComponent } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/react-component-lib';

export const tag = 'transfers';

export const TransfersBdbMlHeaderBv = createReactComponent<JSX.BdbMlHeaderBv, HTMLBdbMlHeaderBvElement>(
  `${tag}-bdb-ml-header-bv`
);

export const TransfersBdbAtToast = createReactComponent<JSX.BdbAtToast, HTMLBdbAtToastElement>(`${tag}-bdb-at-toast`);

export const TransfersBdbMlModal = createReactComponent<JSX.BdbMlModal, HTMLBdbMlModalElement>(`${tag}-bdb-ml-modal`);

export const TransfersBdbAtInput = createReactComponent<
  JSX.BdbAtInput & { onAtInputChanged?: (e) => void },
  HTMLBdbAtInputElement
>(`${tag}-bdb-at-input`);

export const TransfersBdbMlDatePicker = createReactComponent<JSX.BdbMlDatePicker, HTMLBdbMlDatePickerElement>(
  `${tag}-bdb-ml-date-picker`
);

export const TransfersBdbAtDropdown = createReactComponent<JSX.BdbAtDropdown, HTMLBdbAtDropdownElement>(
  `${tag}-bdb-at-dropdown`
);

export const TransfersBdbAtCheckButton = createReactComponent<JSX.BdbAtCheckButton, HTMLBdbAtCheckButtonElement>(
  `${tag}-bdb-at-check-button`
);

export const TransfersBdbAtAvatar = createReactComponent<JSX.BdbAtAvatar, HTMLBdbAtAvatarElement>(
  `${tag}-bdb-at-avatar`
);

// FIX: review sherpa's version to remove idEl and onItemClicked
export const TransfersBdbMlCardList = createReactComponent<
  JSX.BdbMlCardList & { idEl?: string; onItemClicked?: (e) => void },
  HTMLBdbMlCardListElement
>(`${tag}-bdb-ml-card-list`);

export const TransfersBdbAtAlert = createReactComponent<JSX.BdbAtAlert, HTMLBdbAtAlertElement>(`${tag}-bdb-at-alert`);

export const TransfersBdbMlResume = createReactComponent<JSX.BdbMlResume, HTMLBdbMlResumeElement>(
  `${tag}-bdb-ml-resume`
);

export const TransfersBdbAtBackdrop = createReactComponent<JSX.BdbAtBackdrop, HTMLBdbAtBackdropElement>(
  `${tag}-bdb-at-backdrop`
);

export const TransfersBdbAtAutocomplete = createReactComponent<JSX.BdbAtAutocomplete, HTMLBdbAtAutocompleteElement>(
  `${tag}-bdb-at-autocomplete`
);

export const TransfersBdbMlHorizontalSelector = createReactComponent<
  JSX.BdbMlHorizontalSelector,
  HTMLBdbMlHorizontalSelectorElement
>(`${tag}-bdb-ml-horizontal-selector`);

export const TransfersBdbCardPrice = createReactComponent<JSX.BdbMlCardPrice, HTMLBdbMlCardPriceElement>(
  `${tag}-bdb-ml-card-price`
);

export const TransfersBdbMlConfirmation = createReactComponent<JSX.BdbMlConfirmation, HTMLBdbMlConfirmationElement>(
  `${tag}-bdb-ml-confirmation`
);

export const TransfersBdbMlBmVoucher = createReactComponent<JSX.BdbMlBmVoucher, HTMLBdbMlBmVoucherElement>(
  `${tag}-bdb-ml-bm-voucher`
);
