import { CustomerErrorMessage } from '@app/shared/models/api-gateway/api-gateway-error.model';

export interface ErrorModalModel {
  iconPath: string;
  customerErrorMessage: CustomerErrorMessage;
  callToActionInClose: boolean;
  callToAction: () => void;
}
