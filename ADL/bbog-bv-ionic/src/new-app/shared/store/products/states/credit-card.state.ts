import { CreditCardAccountInfoRs } from '@app/apis/customer-security/models/creditCardAccountInfo';
import { CreditCardActivationRs } from '@app/apis/customer-security/models/creditCardActivation';
import { CreditCardBlockRs } from '@app/apis/customer-security/models/creditCardBlock';
import { CreditCardUnblockRs } from '@app/apis/customer-security/models/creditCardUnblock';

export interface CreditCardState {
  accountInfoSuccess: CreditCardAccountInfoRs;
  accountInfoError: any;
  activationSuccess: CreditCardActivationRs;
  activationError: any;
  blockSuccess: CreditCardBlockRs;
  blockError: any;
  unblockSuccess: CreditCardUnblockRs;
  unblockError: any;
  creditCardsBannerHidden?: boolean;
  remeberTooltipKey: boolean;
}

export const initialState: CreditCardState = {
  accountInfoSuccess: null,
  accountInfoError: null,
  activationSuccess: null,
  activationError: null,
  blockSuccess: null,
  blockError: null,
  unblockSuccess: null,
  unblockError: null,
  creditCardsBannerHidden: true,
  remeberTooltipKey: false,
};
