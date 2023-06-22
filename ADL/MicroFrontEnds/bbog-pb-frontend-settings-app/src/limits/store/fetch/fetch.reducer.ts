import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountLimit } from '../../models/account-limit.model';
import { Limit } from '../../models/limit.model';
import { initialState, limitsAdapter } from './fetch.entity';

const { selectAll } = limitsAdapter.getSelectors();

export const createLimitsState = createSlice({
  name: 'LimitsState',
  initialState,
  reducers: {
    fetchLimitsSuccess(state, { payload }: PayloadAction<Limit[]>) {
      limitsAdapter.setAll(state.limits, payload);
    },
    fetchAccountLimitSuccess(state, { payload }: PayloadAction<AccountLimit>) {
      state.accountLimit = payload;
    },
    updateLimitSuccess(state, { payload }: PayloadAction<Omit<Limit, 'desc'>>) {
      const changes = { ...payload, modified: true };
      const update = { id: payload.channel, changes };
      limitsAdapter.updateOne(state.limits, update);
    },
    showTooltip(state, { payload }: PayloadAction<Partial<Limit>>) {
      const limits = selectAll(state.limits);
      const updates = limits.map(({ channel }) => ({
        id: channel,
        changes: { isTooltipVisible: payload.channel === channel }
      }));
      limitsAdapter.updateMany(state.limits, updates);
      state.accountLimit.isTooltipVisible = payload.channel === state.accountLimit.trnCode;
    },
    expandLimitItem(state, { payload }: PayloadAction<Partial<Limit>>) {
      const limits = selectAll(state.limits);
      const updates = limits.map(({ channel }) => ({
        id: channel,
        changes: { isLimitItemExpanded: payload.channel === channel }
      }));
      limitsAdapter.updateMany(state.limits, updates);
      state.accountLimit.isLimitItemExpanded = payload.channel === state.accountLimit.trnCode;
    },
    closeAllLimitItems(state) {
      const limits = selectAll(state.limits);
      const updates = limits.map(({ channel }) => ({
        id: channel,
        changes: { isLimitItemExpanded: false }
      }));
      limitsAdapter.updateMany(state.limits, updates);
      state.accountLimit.isLimitItemExpanded = false;
    },
    updateAccountLimitSuccess(state, { payload }: PayloadAction<AccountLimit>) {
      state.accountLimit = { ...payload, modified: true };
    },
    reset(state) {
      state.limits = initialState.limits;
      state.accountLimit = initialState.accountLimit;
    }
  }
});

export const limitsActions = createLimitsState.actions;
