import React from 'react';
import { LimitData, LimitsTree } from '../../store/fetch/fetch.data';
import { useDispatch } from 'react-redux';
import styles from './LimitSection.module.scss';
import PulseListItem, { ListItemData } from '../../../components/pulse/pulse-list-item/PulseListItem';
import LimitForm from '../limit-form/LimitForm';
import PulseListGroup from '../../../components/pulse/pulse-list-group/PulseListGroup';
import { limitsActions } from '../../store/fetch/fetch.reducer';
import { numberToCurrency } from '../../../utils/currency';

interface LimitSectionProps {
  limitTree: LimitsTree;
  isEditionEnabled: boolean;
  slot?: string;
}

const LimitSection = ({ limitTree, isEditionEnabled }: LimitSectionProps): JSX.Element => {
  const dispatch = useDispatch();

  const expandLimitListItem = (customEvent: CustomEvent) => {
    const idLimitListItem = customEvent.detail || '';
    dispatch(limitsActions.expandLimitItem({ channel: idLimitListItem }));
  };

  const buildLimitData = (limitData: LimitData): ListItemData => {
    return {
      itemId: limitData.channel,
      itemTitle: limitData.content.title,
      description: numberToCurrency(limitData.state.amount.toString()).concat(
        limitData.state.count ? ` o ${limitData.state.count} transacciones diarias` : ''
      ),
      descriptionExpanded: limitData.content.descriptionExpanded,
      avatarPath: limitData.content.icon,
      isEditionEnabled: isEditionEnabled,
      isExpanded: limitData.state.isLimitItemExpanded,
      modified: limitData.state.modified,
      tooltipData: {
        title: limitData.content.tooltipInfo.title,
        description: limitData.content.tooltipInfo.description,
        isVisible: limitData.state.isTooltipVisible,
        actions: {
          showTooltip: () => {
            dispatch(limitsActions.showTooltip({ channel: limitData.channel }));
          },
          hideTooltip: () => {
            dispatch(limitsActions.showTooltip({}));
          }
        }
      }
    };
  };

  return (
    <div className={styles['limit-section-container']}>
      <div className={styles['limit-section-container__header']}>
        <div className={styles['limit-section-container__header__title']}>
          <span className="pulse-tp-hl3-comp-m">{limitTree.title}</span>
        </div>
        <div className={styles['limit-section-container__header__desc']}>
          <span className="pulse-tp-bo3-comp-r">{limitTree.description}</span>
        </div>
      </div>
      <div className={styles['limit-section-container__body']}>
        {!!limitTree?.limits && limitTree.limits.length > 0 && (
          <PulseListGroup isAccordion={true} itemChanged={expandLimitListItem}>
            {limitTree.limits.map(limit => (
              <PulseListItem key={limit.channel} listItemData={buildLimitData(limit)}>
                <div className={styles['limit-section-container__body__form']}>
                  <LimitForm limit={limit} isEditionEnabled={isEditionEnabled} />
                </div>
              </PulseListItem>
            ))}
          </PulseListGroup>
        )}
      </div>
    </div>
  );
};

export default LimitSection;
