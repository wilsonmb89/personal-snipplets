export interface VoucherModel {
  state: VoucherState;
  header: VoucherHeader;
  body: VoucherBody;
  controls: VoucherControls;
}

export type VoucherState =
  | 'success'
  | 'error'
  | 'pending';

export interface VoucherHeader {
  title: string;
  showStamp: boolean;
  voucherId: string;
  timestamp?: {
    date: Date,
    hideTime?: boolean
  };
}

export interface VoucherBody {
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
}

export interface VoucherControls {
  controlEmail?: VoucherControl;
  controlMainButton?: VoucherControl;
  controlSecondaryButton?: VoucherControl;
}

interface VoucherControl {
  title: string;
  hidden: boolean;
}
