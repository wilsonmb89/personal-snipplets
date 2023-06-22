import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AcObligationsState } from '../states/ac-obligations.state';
import { PaymentObligation } from '../../../../core/services-apis/transfer/transfer-core/models/payment-obligations.model';


export const acObligationState = createFeatureSelector<AcObligationsState>('acObligationsState');


export const getAvalCreditsObligationWorking = createSelector(
  acObligationState,
  (state: AcObligationsState) => state.working
);

export const getAvalCreditsObligationError = createSelector(
  acObligationState,
  (state: AcObligationsState) => state.error
);

export const getAvalCreditsObligation = createSelector(
  acObligationState,
  (state: AcObligationsState) => state.creditObligations
);

export const isAvalCreditsCompleted = createSelector(
  acObligationState,
  (state: AcObligationsState) => state.isAvalCreditsCompleted
);

export const isBogCreditsCompleted = createSelector(
  acObligationState,
  (state: AcObligationsState) => state.isBogCreditsCompleted
);

const mapContraction = (productAlias: string): string => {
  let v = '';
  productAlias.split(' ').forEach((value, index, array) => {
    if (index === 0) {
      v = value.charAt(0);
    }
    if (index === (array.length - 1)) {
      v += value.charAt(0);
    }
  });
  return v;
};


const mapCard = (avalCredits: PaymentObligation[]): CardACObligation[] => {
  return avalCredits.map((e: PaymentObligation) => {
    return {
      contraction: mapContraction(e.productAlias),
      cardTitle: e.productAlias,
      cardDesc: [
        `No. ${e.productNumber}`
      ],
      cardSubDesc: [
        e.productBank
      ],
      credit: e
    } as CardACObligation;
  });
};


export const getCardsACObligations = createSelector(
  getAvalCreditsObligation,
  (avalCreditObligations: PaymentObligation[]) => mapCard(avalCreditObligations)
);

export interface CardACObligation {
  contraction?;
  cardTitle;
  cardDesc;
  cardSubDesc?;
  credit;
}




