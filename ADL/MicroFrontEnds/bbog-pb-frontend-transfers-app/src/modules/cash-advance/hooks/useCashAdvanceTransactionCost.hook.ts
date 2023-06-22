import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCatalog } from '@store/catalogs/catalogs.effect';
import { getNamedCatalog } from '@store/catalogs/catalogs.select';
import { cashAdvanceWorkflowActions } from '../store/cash-advance-workflow/cash-advance-workflow.reducer';
import { DEFAULT_TRANSACTION_COST } from '@cash-advance/constants/utilsConstants';

const TRANSACTION_COST_CATALOG = 'VALOR_TRANSACCIONES';
const CASH_ADVANCE_ID = 'CASH_ADVANCE';

export const useCashAdvanceTransactionCost = (): void => {
  const dispatch = useDispatch();

  const transactionCostCatalogData = useSelector(getNamedCatalog(TRANSACTION_COST_CATALOG));

  useEffect(() => {
    dispatch(fetchCatalog({ catalogName: TRANSACTION_COST_CATALOG }, { useCache: true, disableLoader: true }));
  }, []);

  useEffect(() => {
    if (transactionCostCatalogData && transactionCostCatalogData.length > 0) {
      const transactionCostValue = transactionCostCatalogData.find(item => item.id === CASH_ADVANCE_ID);
      dispatch(
        cashAdvanceWorkflowActions.setTransactionCost(
          transactionCostValue && transactionCostValue.name ? transactionCostValue.name : DEFAULT_TRANSACTION_COST
        )
      );
    }
  }, [transactionCostCatalogData]);
};
