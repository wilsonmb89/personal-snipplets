export type RechargeType = 'phone' | 'facilpass';

export interface RechargeItem {
  type: RechargeType;
  key: string;
  value: string;
  code: string;
  src?: string;
}
