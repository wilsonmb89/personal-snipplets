import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PageData, secureKeyPageData } from '@secure-key/constants/secure-key-constants';
import { RootState } from '@store/index';
import { Customer, initialState, RegisterBasicData } from './customer.entity';

const searchFlowData = (isForget: boolean) => {
  return isForget ? secureKeyPageData.forget : secureKeyPageData.register;
};

export const customerState = createSlice({
  name: 'CustomerState',
  initialState,
  reducers: {
    setIsForgetFlow(state, { payload }: PayloadAction<boolean>) {
      return { ...state, flowData: searchFlowData(payload) };
    },
    setCustomer(state, { payload }: PayloadAction<Customer>) {
      return { ...state, customer: payload };
    },
    setBasicData(state, { payload }: PayloadAction<RegisterBasicData>) {
      return { ...state, registerBasicData: payload };
    },
    reset() {
      return { ...initialState };
    }
  }
});

export const customerActions = customerState.actions;

export const getCustomer = (state: RootState): Customer => state.customerState.customer;
export const getFlowData = (state: RootState): PageData => state.customerState.flowData;
export const getRegisterBasicData = (state: RootState): RegisterBasicData => state.customerState.registerBasicData;
