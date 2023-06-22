import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CCObligationsState } from '../states/cc-obligations.state';
import { PaymentObligation } from '../../../../core/services-apis/transfer/transfer-core/models/payment-obligations.model';
import { AccountBalance } from '../../../../../app/models/enrolled-transfer/account-balance';
import { CardCCObligation } from '../../../../../pages/payments/credit-card/cc-destination-acct/cc-destination-acct';

const CC_MASTER_CARD_MAPPING = 'MASTER';
const CC_MASTER_CARD_NAME = 'MasterCard';
const CC_MASTER_CARD_SUB_TYPE = 'MC';
const CC_VISA_MAPPING = 'VISA';
const CC_VISA_NAME = 'Visa';
const CC_VISA_SUB_TYPE = 'CB';

export const ccObligationsState = createFeatureSelector<CCObligationsState>('ccObligationsState');

export const getAllCCObligationsWorking = createSelector(
    ccObligationsState,
    (state: CCObligationsState) => state.working
);

export const getAllCCObligationsCompleted = createSelector(
    ccObligationsState,
    (state: CCObligationsState) => state.completed
);

export const getAllCCObligationsError = createSelector(
    ccObligationsState,
    (state: CCObligationsState) => state.error
);

export const getAllCCObligations = createSelector(
    ccObligationsState,
    (state: CCObligationsState) => state.paymentObligations
);

const mapCardCC = (paymentObligations: PaymentObligation[]) => {

    return paymentObligations
        .map((obligation: PaymentObligation) => {
            const productNumber = obligation.productNumber.substring(obligation.productNumber.length - 16);
            let franchise = '';
            let productSubType = '';

            if (obligation.franchise === CC_MASTER_CARD_MAPPING) {
                franchise = `${CC_MASTER_CARD_NAME} `;
                productSubType = CC_MASTER_CARD_SUB_TYPE;
            } else if (obligation.franchise === CC_VISA_MAPPING) {
                franchise = `${CC_VISA_NAME} `;
                productSubType = CC_VISA_SUB_TYPE;
            }
            const creditCard = new AccountBalance(
                obligation.productBank,
                obligation.bankId,
                obligation.productAlias,
                obligation.productType,
                productNumber,
                obligation.productName,
                null,
                null,
                obligation.aval,
                null,
                productSubType
            );

            const obfuscated = productNumber.substring(productNumber.length - 4);
            return {
                contraction: obligation.productAlias,
                cardTitle: obligation.productAlias,
                cardDesc: [
                    `${franchise}****${obfuscated}`
                ],
                cardSubDesc: [
                    obligation.productBank
                ],
                creditCard: creditCard
            } as CardCCObligation;
        });
};

export const getAllCardsCCObligations = createSelector(
    getAllCCObligations,
    (paymentObligations: PaymentObligation[]) => mapCardCC(paymentObligations)
);

