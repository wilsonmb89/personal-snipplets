import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IAttributesVoucher } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/types/components/sherpa-ml/bdb-ml-bm-voucher/IAttributesVoucher';
import { format } from 'date-fns';
import eoLocale from 'date-fns/locale/es';

import { VoucherStates } from '../../../voucher/voucher.types';
import { cashAdvanceWorkflowSelector } from '../store/cash-advance-workflow/cash-advance-workflow.select';

type voucherStamp = 'paid' | 'approved' | 'none';

interface UseCashAdvanceResult {
  status: VoucherStates;
  stamp: voucherStamp;
  voucher: IAttributesVoucher;
}

const GENERIC_ERROR_MESSAGE =
  'Tu transacción fue rechazada. Por favor comunícate con nuestra Servilínea para más información.';

export const useCashAdvanceResult = (): UseCashAdvanceResult => {
  const { advanceAmount, fetchApiResult } = useSelector(cashAdvanceWorkflowSelector);

  const [voucherData, setVoucherData] = useState<UseCashAdvanceResult>({
    status: VoucherStates.SUCCESS,
    stamp: 'none',
    voucher: null
  });

  useEffect(() => {
    validateCashAdvanceResult();
  }, [fetchApiResult]);

  useEffect(() => {
    buildVoucherSummary();
  }, [advanceAmount]);

  const validateCashAdvanceResult = (): void => {
    if (fetchApiResult.success) {
      buildSuccessVoucherData();
    } else {
      buildErrorVoucherData();
    }
  };

  const buildVoucherSummary = (): void => {
    setVoucherData(voucherDataRes => ({
      ...voucherDataRes,
      voucher: {
        ...voucherDataRes.voucher,
        date: format(new Date(), "d 'de' MMMM yyyy - h:mm:ss aaa", {
          locale: eoLocale
        }),
        amount: advanceAmount
      }
    }));
  };

  const buildSuccessVoucherData = (): void => {
    setVoucherData(voucherDataRes => ({
      ...voucherDataRes,
      status: VoucherStates.SUCCESS,
      stamp: 'approved',
      voucher: {
        ...voucherDataRes.voucher,
        voucherNumber: fetchApiResult.success.approvalId
      }
    }));
  };

  const buildErrorVoucherData = (): void => {
    setVoucherData({
      ...voucherData,
      status: VoucherStates.FAIL,
      stamp: 'none',
      voucher: {
        ...voucherData.voucher,
        description:
          fetchApiResult?.error?.attemps < 3
            ? fetchApiResult?.error?.data?.message || GENERIC_ERROR_MESSAGE
            : GENERIC_ERROR_MESSAGE
      }
    });
  };

  return voucherData;
};
