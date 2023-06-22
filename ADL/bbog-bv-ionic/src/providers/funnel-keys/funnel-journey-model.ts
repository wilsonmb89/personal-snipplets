import { FunnelKeyModel } from './funnel-key-model';

export interface FunnelJourneyModel {
  login: FunnelKeyModel;
  quickAccess: FunnelKeyModel;
  menu: FunnelKeyModel;
  products: FunnelKeyModel;
  recharges: FunnelKeyModel;
  cards: FunnelKeyModel;
  credits: FunnelKeyModel;
  bills: FunnelKeyModel;
  transfers: FunnelKeyModel;
  fiducias: FunnelKeyModel;
  enrolleBills: FunnelKeyModel;
  enrollCreditCards: FunnelKeyModel;
  enrollCredits: FunnelKeyModel;
  enrollAccounts: FunnelKeyModel;
  token: FunnelKeyModel;
  modal: FunnelKeyModel;
  cashAdvance: FunnelKeyModel;
  loanTransfer: FunnelKeyModel;
  tax: FunnelKeyModel;
  pila: FunnelKeyModel;
  donations: FunnelKeyModel;
  historyTransfer: FunnelKeyModel;
  historyPayment: FunnelKeyModel;
  pocket: FunnelKeyModel;
  forex: FunnelKeyModel;
  cdt: FunnelKeyModel;
  cdtRenewal: FunnelKeyModel;
}
