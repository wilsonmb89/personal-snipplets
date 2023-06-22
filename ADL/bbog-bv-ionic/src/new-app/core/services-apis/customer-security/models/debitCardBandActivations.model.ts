export interface DebitCardBandFindRs {
  debitCardBandInfoList: DebitCardBandInfo[];
}


export interface DebitCardBandInfo {
  accountId: string;
  startActivationDate: string;
  endActivationDate: string;
}


export interface BandActivationRq {
  accountId: string;
  startActivationDate: string;
  endActivationDate: string;
}
