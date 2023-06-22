import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { AccountLimit } from '../../models/account-limit.model';
import { Limit } from '../../models/limit.model';

export interface LimitsState {
  limits: EntityState<Limit>;
  accountLimit: AccountLimit;
}

export const limitsAdapter = createEntityAdapter<Limit>({
  selectId: (limit: Limit) => limit.channel
});

export const initialState: LimitsState = {
  limits: limitsAdapter.getInitialState({
    ids: [],
    entities: {}
  }),
  accountLimit: {
    amount: null,
    trnCode: null,
    typeField: null
  }
};
