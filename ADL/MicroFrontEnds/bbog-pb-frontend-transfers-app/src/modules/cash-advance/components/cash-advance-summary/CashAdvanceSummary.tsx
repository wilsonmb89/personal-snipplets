import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styles from './CashAdvanceSummary.module.scss';
import { cashAdvanceWorkflowSelector } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.select';
import { TransfersBdbMlResume } from '@constants/sherpa-tagged-components';
import {
  IAttributeResumeHeader,
  IAttributeResumeDetail,
  IAttributeResumeAvatar
} from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/types/components/sherpa-ml/bdb-ml-resume/IResume';
import { CREDIT_CARD_TYPES } from '@constants/bank-codes';

interface CashAdvanceSummaryProps {
  infoAvatar?: IAttributeResumeAvatar;
  infoHeader?: IAttributeResumeHeader;
  infoDetail?: IAttributeResumeDetail[];
}

const CashAdvanceSummary = (): JSX.Element => {
  const { cardSelected, advanceAmount, destinationAcct, transactionCost } = useSelector(cashAdvanceWorkflowSelector);

  const [summaryInfo, setSummaryInfo] = useState<CashAdvanceSummaryProps>({});

  useEffect(() => {
    if (cardSelected) {
      setSummaryInfo(summaryInfoP => ({
        ...summaryInfoP,
        infoAvatar: {
          text: '',
          icon: getFranchiseIcon(cardSelected?.franchise || '')
        },
        infoHeader: {
          title: cardSelected?.productName,
          desc: cardSelected?.description || '',
          desc2: `No. **** ${cardSelected?.productNumber.slice(-4)}`
        }
      }));
    }
  }, [cardSelected]);

  useEffect(() => {
    setSummaryInfo(summaryInfoP => ({
      ...summaryInfoP,
      infoDetail: [
        {
          title: 'Monto',
          value: `${advanceAmount ? '$ ' + advanceAmount : '-'}`
        },
        {
          title: 'Cuenta destino',
          value: destinationAcct ? `${destinationAcct?.productName} No. ${destinationAcct?.productNumber}` : '-'
        },
        {
          title: 'Costo',
          value: transactionCost || '-'
        }
      ]
    }));
  }, [advanceAmount, destinationAcct]);

  const getFranchiseIcon = (franchise: string): string => {
    switch (franchise.toLowerCase()) {
      case CREDIT_CARD_TYPES.MASTER_CARD:
        return 'ico-infinite-mastercard';
      case CREDIT_CARD_TYPES.VISA:
        return 'ico-infinite-visa';
      default:
        return 'ico-card';
    }
  };

  return (
    <div className={styles['main-container']}>
      <div className={`${styles['main-container__title']} roboto-medium sherpa-typography-body-1`}>Resumen:</div>
      <div className={styles['main-container__summary']}>
        {summaryInfo?.infoHeader?.title && (
          <TransfersBdbMlResume idEl="cash-advance-summary" data-testid={'cash-advance-summary'} {...summaryInfo} />
        )}
      </div>
    </div>
  );
};

export default CashAdvanceSummary;
