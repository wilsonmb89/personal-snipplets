import {CustomFields} from '@app/apis/user-features/models/catalogue.model';

export class BanksRs {
  public banks: BanksList[];
}

export class BanksList {
  public id: string;
  public name: string;
  public customFields?: CustomFields;
}

export interface CustomFields {
   isAval: string;
   type: string;
   isActive: string;
}
