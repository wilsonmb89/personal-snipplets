import { MailTemplate } from '@app/shared/components/modals/send-mail-modal/models/send-mail-modal.model';

export enum TransactionTypes {
  TRANSFER = 'TRANSFER',
  INVESTMENT = 'INVESTMENT',
  DISINVESTMENT = 'DISINVESTMENT',
  TRANSFIYA = 'TRANSFIYA',
  DONATION = 'DONATION',
  CREDIT_CARD_ADVANCE = 'CREDIT_CARD_ADVANCE',
  LOAN_PAYMENT = 'LOAN_PAYMENT',
  BILL_PAYMENT = 'BILL_PAYMENT',
  CREDISERVICE = 'CREDISERVICE',
  PAYROLL_ADVANCE = 'PAYROLL_ADVANCE',
  RECHARGE = 'RECHARGE',
  QR_PURCHASE = 'QR_PURCHASE'
}

export interface TransactionResultModel {
  type: TransactionTypes;
  state: TransactionResultState;
  header: TransactionResultHeader;
  body: TransactionResultBody;
  controls: TransactionResultControls;
}

export type TransactionResultState =
  | 'success'
  | 'pending'
  | 'error';

export interface TransactionResultHeader {
  title: string;
  showStamp: boolean;
  messageInfo?: string;
  voucherId: string;
  timestamp?: {
    date: Date,
    hideTime?: boolean
  };
}

export interface TransactionResultBody {
  amtInfo?: {
    amt: string;
    amtLabel: string;
  };
  destination: {
    type: string;
    originName: string;
    originId: string;
  };
  transactionCost: string;
  originAcct: string;
  addendum?: {
    note: string;
    billId: string;
  };
  mailData?: MailTemplate;
  channel?: string;
}

export interface TransactionResultControls {
  controlEmail?: TransactionResultControl;
  controlMainButton?: TransactionResultControl;
  controlSecondaryButton?: TransactionResultControl;
}

export interface TransactionResultControl {
  title: string;
  hidden: boolean;
  action?: () => void;
}
