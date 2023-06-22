import React, { useEffect, useRef, useState } from 'react';
import styles from './ModalProducts.module.scss';
import { AuthBdbAtBackdrop, AuthBdbMlMultiAction } from '@utils/sherpa-tagged-components';
import Layout from '../layout/Layout';

export interface ModalProps {
  data: ProductsDataItem[];
  title: string;
  onClose?: (data) => void;
}

interface ProductsDataItem {
  icon: string;
  title: string;
  desc: string;
  link?: string;
}

const ModalProducts = ({ data, title, onClose }: ModalProps): JSX.Element => {
  const backdrop = useRef<HTMLBdbAtBackdropElement>(null);
  const closeButtonRef = useRef(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (backdrop.current.openBackdrop) {
      backdrop.current.openBackdrop();
    }
    closeButtonRef.current.addEventListener('click', closeViewer);
    return () => setOpen(false);
  }, []);

  const closeViewer = () => {
    if (backdrop.current.closeBackdrop) {
      backdrop.current.closeBackdrop();
    }
    onClose(false);
    setOpen(false);
  };

  return (
    <Layout>
      <AuthBdbAtBackdrop
        ref={backdrop}
        isOpen={open}
        tabClose={true}
        onBackDropClosed={closeViewer}
        data-testid="modal-backdrop"
      >
        <div slot="bodyBackdrop" className="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-lg-offset-5">
          <div className={`${styles['modal-products']}`}>
            <div
              className={`${styles['modal-products__header']} col-sm-8 col-md-8 col-lg-9 col-sm-offset-2 col-md-offset-2 col-lg-offset-2`}
            >
              <div className={`${styles['modal-products__header__title']} sherpa-typography-heading-5`}>{title}</div>
              <button
                ref={closeButtonRef}
                data-testid="modal-close-button"
                className={`${styles['modal-products__header__close']} bdb-at-btn bdb-at-btn-action bdb-at-btn-action--terciary bdb-at-btn-action--sm`}
              >
                <span className="ico-close"></span>
              </button>
            </div>
            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
              <AuthBdbMlMultiAction
                values-to-card={JSON.stringify(data)}
                onCardClicked={e => window.open(e.detail.link)}
                data-testid="options"
              />
            </div>
          </div>
        </div>
      </AuthBdbAtBackdrop>
    </Layout>
  );
};

export default ModalProducts;
