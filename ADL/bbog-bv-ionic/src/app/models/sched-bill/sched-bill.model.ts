import { Customer } from '../bdb-generics/customer';

export interface SchedBillAdd {
    daysBefAft: string;
    bill: Bill;
    maxAmount: any;
    pmtType: string;
    account: Account;
  }

  export interface Bill {
      orgId: string;
      nie: string;
      nickname: string;
      refId: string;
  }

  export interface Account {
      accountNumber: string;
      accountType: string;
  }
