import {
  IAttributeResumeAvatar,
  IAttributeResumeDetail,
  IAttributeResumeHeader
} from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/types/components/sherpa-ml/bdb-ml-resume/IResume';
import React, { Fragment, useEffect, useRef } from 'react';
import { TransfersBdbAtBackdrop, TransfersBdbMlResume } from '../../../constants/sherpa-tagged-components';
import styles from './LayoutSummary.module.scss';

interface LayoutSummaryProps {
  children: React.ReactNode;
  avatarValues: IAttributeResumeAvatar;
  headerValues: IAttributeResumeHeader;
  detailValues: IAttributeResumeDetail[];
  showBackdrop: boolean;
  setShowBackdrop: (value: boolean) => void;
}

const LayoutSummary = ({
  children,
  avatarValues,
  headerValues,
  detailValues,
  showBackdrop,
  setShowBackdrop
}: LayoutSummaryProps): JSX.Element => {
  const backdrop = useRef<HTMLBdbAtBackdropElement>(null);

  useEffect(() => {
    if (showBackdrop) {
      openBackDrop();
    }
  }, [showBackdrop]);

  const openBackDrop = () => {
    if (backdrop.current.openBackdrop) {
      backdrop.current.openBackdrop();
    }
  };

  const closeBackDrop = () => {
    setShowBackdrop(false);
    if (backdrop.current.closeBackdrop) {
      backdrop.current.closeBackdrop();
    }
  };

  return (
    <Fragment>
      <div className={styles['layout-summary']} data-testid="layout-summary-page">
        <div className={styles['layout-summary__content']}>{children}</div>
        <div className={styles['layout-summary__summary']}>
          <div className={`${styles['layout-summary__summary__title']} sherpa-typography-body-1`}>Resumen</div>
          <TransfersBdbMlResume
            with-close={false}
            infoAvatar={avatarValues}
            infoHeader={headerValues}
            infoDetail={detailValues}
          />
        </div>
      </div>
      <TransfersBdbAtBackdrop
        ref={backdrop}
        isOpen={false}
        tabClose={true}
        onBackDropClosed={closeBackDrop}
        data-testid="summary-backdrop"
      >
        <div slot="bodyBackdrop" className="col-xs-11 col-sm-7 col-md-7">
          <TransfersBdbMlResume
            data-testid="summary"
            onAtCloseResumeBtnClick={closeBackDrop}
            with-close={true}
            infoAvatar={avatarValues}
            infoHeader={headerValues}
            infoDetail={detailValues}
          />
        </div>
      </TransfersBdbAtBackdrop>
    </Fragment>
  );
};

export default LayoutSummary;
