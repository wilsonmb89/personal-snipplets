import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { TransfersBdbMlCardList } from '@constants/sherpa-tagged-components';
import { useCashAdvanceWorkFlow } from '@cash-advance/hooks/useCashAdvanceWorkflow.hook';
import { CashAdvanceSteps } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.entity';
import { numberWithDecimalToCurrency } from '@utils/currency.utils';
import { Product } from '@store/products/products.entity';
import { cardsInfoSelector, customerCardListSelector } from '@store/cards-info/cards-info.select';
import { CREDIT_CARD_STATES } from '@constants/bank-codes';
import { balanceState } from '@store/balances/balance.select';

interface ItemData {
  icon: string;
  title: string;
  desc: string;
  typetag?: string;
  tag?: string;
  values: { label: string; amount: string }[];
  isDisabled?: boolean;
}

interface CardStatusData {
  typeTag: string;
  tagText: string;
  isDisabled: boolean;
}

const CreditCardList = (): JSX.Element => {
  const { creditCards, setCreditCardSelected, setWorkFlowStep } = useCashAdvanceWorkFlow();
  const cardsInfoList = useSelector(customerCardListSelector);
  const cardsInfoError = useSelector(cardsInfoSelector);
  const { error: balanceInquiryError, isConsumed: isBalanceInquiryConsumed } = useSelector(balanceState);

  const [listValues, setListValues] = useState<string>('[]');

  useEffect(() => {
    if (creditCards?.length > 0 && cardsInfoList?.length > 0) {
      mapListValues();
    }
  }, [creditCards, cardsInfoList, cardsInfoError, balanceInquiryError, isBalanceInquiryConsumed]);

  const mapListValues = (): void => {
    const itemsList: ItemData[] = creditCards.map<ItemData>(creditCard => {
      const { typeTag, tagText, isDisabled } = getCardStatusData(creditCard);
      const quotaCC = getQuotaLabel(creditCard);
      return {
        icon: getFranchiseIcon(creditCard.franchise, isDisabled),
        title: creditCard.productName,
        desc: creditCard.description,
        values: [
          {
            label: 'Número',
            amount: `**** ${creditCard.productNumber.slice(-4)}`
          },
          {
            label: 'Cupo disponible avances',
            amount: quotaCC
          }
        ],
        isDisabled: isDisabled,
        typetag: typeTag,
        tag: tagText
      };
    });
    const sortedItemList = [...itemsList].sort(item => (item.isDisabled ? 1 : -1));
    setListValues(JSON.stringify(sortedItemList));
  };

  const getCardStatusData = (creditCard: Product): CardStatusData => {
    const cardInfo = cardsInfoList.find(cardInfoP => cardInfoP.cardNumber === creditCard.productNumber);
    if (cardInfo?.cardState) {
      const { cardState } = cardInfo;
      if (CREDIT_CARD_STATES.BLOCKED.includes(cardState)) {
        return {
          typeTag: 'disabled',
          isDisabled: true,
          tagText: 'Bloqueada'
        };
      } else if (CREDIT_CARD_STATES.FROZEN.includes(cardState)) {
        return {
          typeTag: 'disabled',
          isDisabled: true,
          tagText: 'Congelada'
        };
      } else if (CREDIT_CARD_STATES.INDEBT.includes(cardState)) {
        return {
          typeTag: 'disabled',
          isDisabled: true,
          tagText: 'En mora'
        };
      } else if (CREDIT_CARD_STATES.WRONG_PIN.includes(cardState)) {
        return {
          typeTag: 'disabled',
          isDisabled: true,
          tagText: 'Pin errado'
        };
      }
    }
    return {
      typeTag: '',
      isDisabled: false,
      tagText: ''
    };
  };

  const getQuotaLabel = (creditCard: Product): string => {
    const balanceDetail = creditCard.balanceInfo?.balanceDetail;
    if (balanceDetail && balanceDetail?.AvailCredit && cardsInfoList?.length > 0) {
      return numberWithDecimalToCurrency(balanceDetail?.AvailCredit);
    } else {
      if ((!isBalanceInquiryConsumed && !balanceInquiryError) || !cardsInfoError) {
        return 'Consultando, por favor espere...'; // ToDo, charlar con UX
      } else {
        return 'Error consultando tus datos'; // ToDo, charlar con UX
      }
    }
  };

  const clickItemHandler = ({ detail }): void => {
    if (!detail.isDisabled) {
      const title = detail.title;
      const cardNumber = detail.values[0]?.amount.slice(-4);
      const cardSelected = creditCards.find(card => {
        const validCardNumber = cardNumber === card.productNumber.slice(-4);
        if (validCardNumber && title === card.productName) {
          return card;
        }
      });
      const balanceDetail = cardSelected.balanceInfo?.balanceDetail;
      if (cardSelected && cardSelected.status === 'A' && balanceDetail?.AvailCredit) {
        setCreditCardSelected(cardSelected);
        setWorkFlowStep(CashAdvanceSteps.Amount);
      }
    }
  };

  const getFranchiseIcon = (franchise: string, disabled = false): string => {
    switch (franchise.toLowerCase()) {
      case 'mastercard':
        return disabled ? 'ico-platinum-mastercard' : 'ico-infinite-mastercard';
      case 'visa':
        return disabled ? 'ico-platinum-visa' : 'ico-infinite-visa';
      default:
        return 'ico-card';
    }
  };

  return (
    <>
      {cardsInfoList && cardsInfoList?.length > 0 && (
        <TransfersBdbMlCardList
          idEl="check-credit-card-multi-action"
          data-testid={'check-credit-card-multi-action'}
          values-card-list={listValues}
          onActionCardListEmitter={clickItemHandler}
        />
      )}
    </>
  );
};

export default CreditCardList;
