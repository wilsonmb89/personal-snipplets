// TODO: Remove this file when https://github.com/ionic-team/stencil-ds-output-targets/pull/59
// and sherpa library have the update ready to use

import { JSX } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/types/components';
import { createReactComponent } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/react-component-lib';

export const tag = 'miscellaneous';

export const MiscellaneousBdbMlHeaderBv = createReactComponent<JSX.BdbMlHeaderBv, HTMLBdbMlHeaderBvElement>(
  `${tag}-bdb-ml-header-bv`
);

export const MiscellaneousBdbAtToast = createReactComponent<JSX.BdbAtToast, HTMLBdbAtToastElement>(
  `${tag}-bdb-at-toast`
);

export const MiscellaneousBdbMlModal = createReactComponent<JSX.BdbMlModal, HTMLBdbMlModalElement>(
  `${tag}-bdb-ml-modal`
);

export const MiscellaneousBdbMlModalNormal = createReactComponent<JSX.BdbMlModalNormal, HTMLBdbMlModalNormalElement>(
  `${tag}-bdb-ml-modal-normal`
);

export const MiscellaneousBdbMlBmToken = createReactComponent<JSX.BdbMlBmToken, HTMLBdbMlBmTokenElement>(
  `${tag}-bdb-ml-bm-token`
);

export const MiscellaneousBdbMlBmOtp = createReactComponent<JSX.BdbMlBmOtp, HTMLBdbMlBmOtpElement>(
  `${tag}-bdb-ml-bm-otp`
);
