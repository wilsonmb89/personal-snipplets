import React, { Fragment, useEffect, useRef } from 'react';
import Tooltip from '../pulse-tooltip/Tooltip';

interface PulseListItemProps {
  listItemData: ListItemData;
  slot?: string;
  children?: React.ReactNode;
}

export interface ListItemData {
  itemId: string;
  itemTitle: string;
  description: string;
  descriptionExpanded: string;
  avatarPath: string;
  isEditionEnabled: boolean;
  isExpanded: boolean;
  modified: boolean;
  tooltipData?: TooltipData;
}

interface TooltipData {
  title: string;
  description: string;
  isVisible: boolean;
  actions: {
    showTooltip: () => void;
    hideTooltip: () => void;
  };
}

const PulseListItem = ({ listItemData, children }: PulseListItemProps): JSX.Element => {
  const elementRef = useRef(null);

  const showTooltip = () => {
    if (listItemData && !!listItemData.tooltipData) {
      listItemData.tooltipData.actions.showTooltip();
    }
  };

  const hideTooltip = () => {
    if (listItemData && !!listItemData.tooltipData) {
      listItemData.tooltipData.actions.hideTooltip();
    }
  };

  useEffect(() => {
    elementRef.current.addEventListener('secondaryActionClicked', showTooltip);
    return () => {
      elementRef.current?.removeEventListener('secondaryActionClicked', showTooltip);
    };
  }, []);

  return (
    <Fragment>
      <pulse-list-item
        ref={elementRef}
        itemid={listItemData.itemId}
        itemtitle={listItemData.itemTitle}
        description={listItemData.description}
        descriptionexpanded={listItemData.descriptionExpanded}
        avatarpath={listItemData.avatarPath}
        tagtext={listItemData.modified ? 'Modificado' : ''}
        tagcolor="success"
        primarynavicon="expand-more"
        secondaryicon="information-bv"
        secondaryiconcolor="warning"
        isdisabled={!listItemData.isEditionEnabled}
        isexpanded={listItemData.isExpanded}
      >
        {children}
      </pulse-list-item>
      {listItemData.tooltipData && listItemData.tooltipData.isVisible && (
        <Tooltip
          title={listItemData.tooltipData.title}
          description={listItemData.tooltipData.description}
          mobilebehavior={true}
          element={elementRef.current.shadowRoot.querySelector(
            '.pulse-list-item__container__header__nav-controls--collapsed__secondary-btn'
          )}
          onClose={hideTooltip}
        />
      )}
    </Fragment>
  );
};

export default PulseListItem;
