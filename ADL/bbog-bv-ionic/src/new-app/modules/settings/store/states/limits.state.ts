import { BankLimit } from '@app/apis/customer-security/models/limitInformation.model';
import { BankLimitNatAcc } from '@app/apis/customer-security/models/limitInformationNatAcc.model';


export interface LimitsState {
  limitsItems: LimitsItem[];
  working: boolean;
  completed: boolean;
  error: any;
}

export interface LimitsItem {
  accountId: string;
  accountType: string;
  limits: BankLimit[];
  natAccountLimit: BankLimitNatAcc;
  error?: any;
  complete: boolean;
  working: boolean;
}
