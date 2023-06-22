import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Outlet, useLocation } from 'react-router-dom';
import { CashAdvancePaths } from '../../../modules/cash-advance/constants/navigationPaths';
import { ScheduledTranfersPaths } from '../../../modules/scheduled-transfers/constants/navigation-paths';
import { mainPageSelector } from '../../../store/shell-events/shell-events.store';

import styles from './LayoutWrapper.module.scss';

const LayoutWrapper = (): JSX.Element => {
  const location = useLocation();
  const mainPage = useSelector(mainPageSelector);

  const [isMainPage, setIsMainPage] = useState(false);

  useEffect(() => {
    checkMainPage();
  }, [location, mainPage]);

  const checkMainPage = (): void => {
    switch (location.pathname) {
      case ScheduledTranfersPaths.BASE_ROOT:
        setIsMainPage(true);
        break;
      case CashAdvancePaths.BASE_ROOT:
        mainPage !== null && mainPage !== undefined && setIsMainPage(mainPage);
        break;
      default:
        setIsMainPage(false);
        break;
    }
  };

  return (
    <div className={`${styles['schedule-transfers']} ${isMainPage && styles['schedule-transfers__portal-mode']}`}>
      <Outlet />
    </div>
  );
};

export default LayoutWrapper;
