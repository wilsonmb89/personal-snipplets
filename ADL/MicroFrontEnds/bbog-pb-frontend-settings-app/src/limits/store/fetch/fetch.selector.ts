import { find } from 'lodash';
import { Limit } from '../../models/limit.model';
import { RootState } from '../../../store';
import { LimitData, limitsContent, limitsSections, limitsTree, LimitsTree } from './fetch.data';
import { LimitsState, limitsAdapter } from './fetch.entity';
import { AccountLimit } from '../../models/account-limit.model';

const { selectAll } = limitsAdapter.getSelectors();

export const limitsState = (state: RootState): LimitsState => state.limitsState;

export const accountLimitSelector = (state: RootState): AccountLimit => {
  return state.limitsState.accountLimit;
};

export const limitsSelector = (state: RootState): Limit[] => {
  const limits = selectAll(limitsState(state).limits);
  const accountLimit = state.limitsState.accountLimit;

  if (accountLimit.trnCode) {
    const newAccountLimit: Limit = {
      desc: 'Límite de cuenta',
      channel: accountLimit.trnCode,
      amount: accountLimit.amount,
      modified: accountLimit.modified,
      isTooltipVisible: accountLimit.isTooltipVisible,
      isLimitItemExpanded: accountLimit.isLimitItemExpanded,
      count: 0,
      isAccountLimit: true
    };
    return [newAccountLimit, ...limits];
  }

  return limits;
};

export const limitsTreeSelector = (state: RootState): LimitsTree[] => {
  const limits = limitsSelector(state);
  return limitsTree.reduce<LimitsTree[]>((sectionList, limitTree) => {
    const limitTreeContent = find(limitsSections, { id: limitTree.id });
    if (limitTreeContent) {
      const newSection = {
        ...limitTreeContent,
        limits: limitTree.children.reduce<LimitData[]>((contents, channel) => {
          const content = find(limitsContent, { channel });
          const newState = find(limits, { channel });
          if (content && newState) {
            const newContent = { channel, content, state: newState };
            contents.push(newContent);
          }
          return contents;
        }, [])
      };
      sectionList.push(newSection);
    }
    return sectionList;
  }, []);
};
