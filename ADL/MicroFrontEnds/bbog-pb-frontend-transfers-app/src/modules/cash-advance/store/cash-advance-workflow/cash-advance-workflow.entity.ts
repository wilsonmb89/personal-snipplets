import { Product } from '@store/products/products.entity';
import { CashAdvanceRs } from '../cash-advance/cash-advance.entity';

export enum CashAdvanceSteps {
  List,
  Amount,
  Destination,
  Empty,
  Confirm,
  Result
}

export interface CashAdvanceWorkflowData {
  step: CashAdvanceSteps;
  cardSelected: Product;
  advanceAmount: string;
  destinationAcct: Product;
  transactionCost: string;
  directAccess: boolean;
  fetchApiResult: {
    success: CashAdvanceRs;
    error: {
      data: Error | null;
      attemps: number;
    };
  };
}

export const initialState: CashAdvanceWorkflowData = {
  step: CashAdvanceSteps.List,
  cardSelected: null,
  advanceAmount: null,
  destinationAcct: null,
  transactionCost: null,
  directAccess: null,
  fetchApiResult: {
    success: null,
    error: {
      data: null,
      attemps: 0
    }
  }
};
