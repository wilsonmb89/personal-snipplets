import { TransactionTypes } from '@app/shared/modules/transaction-result/models/transaction-result.model';

export interface SendEmailNotificationRq {
  transactionType: TransactionTypes;
  emailAddresses: string[];
  subject: string;
  parameter: { [key: string]: string };
}

export interface SendEmailNotificationRs {
  message: string;
}
