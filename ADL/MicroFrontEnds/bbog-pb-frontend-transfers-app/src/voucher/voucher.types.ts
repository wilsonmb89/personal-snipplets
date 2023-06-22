export enum VoucherStates {
  SUCCESS = 'SUCCESS',
  PROGRESS = 'PROGRESS',
  FAIL = 'FAIL'
}

export type VoucherState = `${VoucherStates}`;

export enum VoucherTypes {
  ONE = 1,
  FOUR = 4
}

export type VoucherType = 1 | 4;

export enum VoucherStamps {
  PAID = 'paid',
  APPROVED = 'approved'
}

export type VoucherStamp = `${VoucherStamps}`;
