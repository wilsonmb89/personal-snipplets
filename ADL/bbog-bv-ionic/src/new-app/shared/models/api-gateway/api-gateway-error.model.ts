export interface ApiGatewayError {
  originComponent: string;
  backendErrorMessage: string;
  businessErrorCode: string;
  serverStatusCode: string;
  errorMessage: string;
  customerErrorMessage: CustomerErrorMessage;
}

export interface CustomerErrorMessage {
  title: string;
  message: string;
  alertType: string;
  actions: CustomerErrorActions;
}

export interface CustomerErrorActions {
  redirectTo: string;
}

export interface CallToAction {
  actionName: string;
  text: string;
  action: () => void;
}
