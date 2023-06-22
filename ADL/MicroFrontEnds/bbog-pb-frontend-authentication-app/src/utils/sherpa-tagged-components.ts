// TODO: Remove this file when https://github.com/ionic-team/stencil-ds-output-targets/pull/59
// and sherpa library have the update ready to use

import { JSX } from '@sherpa-react/types/components';
import { createReactComponent } from '@sherpa-react/react-component-lib';

export const tag = 'auth';

export const AuthBdbAtBackdrop = createReactComponent<JSX.BdbAtBackdrop, HTMLBdbAtBackdropElement>(
  `${tag}-bdb-at-backdrop`
);

export const AuthBdbAtCheckButton = createReactComponent<JSX.BdbAtCheckButton, HTMLBdbAtCheckButtonElement>(
  `${tag}-bdb-at-check-button`
);

export const AuthBdbAtDropdown = createReactComponent<JSX.BdbAtDropdown, HTMLBdbAtDropdownElement>(
  `${tag}-bdb-at-dropdown`
);

export const AuthBdbAtInput = createReactComponent<JSX.BdbAtInput, HTMLBdbAtInputElement>(`${tag}-bdb-at-input`);

export const AuthBdbAtLogo = createReactComponent<JSX.BdbAtLogo, HTMLBdbAtLogoElement>(`${tag}-bdb-at-logo`);

export const AuthBdbMlBmOtp = createReactComponent<JSX.BdbMlBmOtp, HTMLBdbMlBmOtpElement>(`${tag}-bdb-ml-bm-otp`);

export const AuthBdbMlBmToken = createReactComponent<JSX.BdbMlBmToken, HTMLBdbMlBmTokenElement>(
  `${tag}-bdb-ml-bm-token`
);

export const AuthBdbMlHeaderBv = createReactComponent<JSX.BdbMlHeaderBv, HTMLBdbMlHeaderBvElement>(
  `${tag}-bdb-ml-header-bv`
);

export const AuthBdbMlHorizontalSelector = createReactComponent<
  JSX.BdbMlHorizontalSelector,
  HTMLBdbMlHorizontalSelectorElement
>(`${tag}-bdb-ml-horizontal-selector`);

export const AuthBdbMlLoader = createReactComponent<JSX.BdbMlLoader, HTMLBdbMlLoaderElement>(`${tag}-bdb-ml-loader`);

export const AuthBdbMlModal = createReactComponent<JSX.BdbMlModal, HTMLBdbMlModalElement>(`${tag}-bdb-ml-modal`);

export const AuthBdbMlMultiAction = createReactComponent<JSX.BdbMlMultiAction, HTMLBdbMlMultiActionElement>(
  `${tag}-bdb-ml-multi-action`
);

export const AuthBdbMlSecondtabs = createReactComponent<JSX.BdbMlSecondtabs, HTMLBdbMlSecondtabsElement>(
  `${tag}-bdb-ml-secondtabs`
);

export const AuthBdbMlBoxButton = createReactComponent<JSX.BdbMlBoxButton, HTMLBdbMlBoxButtonElement>(
  `${tag}-bdb-ml-box-button`
);

export const AuthBdbMlActiveSelector = createReactComponent<JSX.BdbMlActiveSelector, HTMLBdbMlActiveSelectorElement>(
  `${tag}-bdb-ml-active-selector`
);

export const AuthBdbMlModalTerms = createReactComponent<JSX.BdbMlTerms, HTMLBdbMlTermsElement>(`${tag}-bdb-ml-terms`);
