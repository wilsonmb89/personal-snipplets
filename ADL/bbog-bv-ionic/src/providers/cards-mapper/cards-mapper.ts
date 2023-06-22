import { Injectable } from '@angular/core';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { ProductDetail } from '../../app/models/products/product-model';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { BdbMaskProvider } from '../bdb-mask/bdb-mask';
import { MaskType } from '../bdb-mask/bdb-mask-type.enum';
import { UnknownBalanceProvider } from '../../providers/unknown-balance/unknown-balance';
import { BdbCardDetailModel, CardButton } from '../../components/core/molecules/bdb-card-detail';
import { BdbProductsProvider } from '../../providers/bdb-products/bdb-products';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { AdnOpsProvider } from '../../providers/adn-ops/adn-ops';

@Injectable()
export class CardsMapperProvider {

  constructor(
    private bdbUtils: BdbUtilsProvider,
    private bdbMask: BdbMaskProvider,
    private unknownBalanceHanlder: UnknownBalanceProvider,
    private bdbProducts: BdbProductsProvider,
    private adnOps: AdnOpsProvider
  ) { }

  mapToPCard(e: ProductDetail): PCardModel {
    let mainProp = e.productBank !== 'Banco de Bogotá' ? '' : this.bdbUtils.getMainProperty(e.productType);
    if (e.productType === BdbConstants.ATH_FUDUCIARY) {
      mainProp = 'totalBBOG';
    }
    const paymentAvailable = this.bdbUtils.getPaymentAvailable(e.productType);
    let varPaymentAvailable = false;
    const varMinPay = {
      key: paymentAvailable ? BdbConstants.namedMap[paymentAvailable[0]].label2 : null,
      value: '0'
    };
    const varNextDate = {
      key: paymentAvailable ? BdbConstants.namedMap[paymentAvailable[1]].label2 : null,
      value: null
    };
    let varProgress = null;
    let varCreditLine = null;
    const hasProgressBar = e.category === BdbConstants.TARJETA_CREDITO_BBOG ||
      (e.category === BdbConstants.CREDITOS_BBOG &&
        (e.productType === BdbConstants.ATH_ADELANTO_NOMINA ||
          e.productType === BdbConstants.ATH_CREDISERVICE_ALS_PNATURAL ||
          e.productType === BdbConstants.ATH_CREDISERVICE_AP));
    if (e.balanceDetail && hasProgressBar) {
      const creditLine = this.getCreditLine(e);
      varCreditLine = this.bdbMask.maskFormatFactory(creditLine, BdbConstants.namedMap['cupoTarjetaBBOG'].format);
      varProgress = (e.amount / creditLine) * 100 + '%';
    }
    if (e.balanceDetail && this.unknownBalanceHanlder.hasNextPayment(e)) {
      varPaymentAvailable = true;
      varMinPay.key = this.getMinPaymentLabel(e);
      const value = this.getMinPaymentValue(e);
      varMinPay.value = this.bdbMask.maskFormatFactory(
        value, BdbConstants.namedMap['pagMinimoBBOG'].format2);
      varNextDate.key = BdbConstants.namedMap.fecProxPagoBBOG.label2;
      varNextDate.value = this.bdbMask.maskFormatFactory(
        e.balanceDetail.fecProxPagoBBOG, BdbConstants.namedMap['fecProxPagoBBOG'].format2);
    }
    return {
      pName: e.productName,
      pNumber: e.productNumber,
      pBalance: {
        key: mainProp !== '' ? BdbConstants.namedMap[mainProp].label : e.description,
        value: e.amount
      },
      logo: this.getCreditCardLogo(e),
      product: e,
      showBalanceLoader: false,
      paymentAvailable: varPaymentAvailable,
      minPay: varMinPay,
      nextDate: varNextDate,
      creditLine: varCreditLine,
      progress: varProgress
    };
  }

  getMinPaymentValue(e: ProductDetail) {
    let value = '';
    if (e.category === BdbConstants.TARJETA_CREDITO_BBOG) {
      value = e.balanceDetail.pagMinimoBBOG;
    } else if (e.category === BdbConstants.CREDITOS_BBOG && e.productType === BdbConstants.ATH_CREDITO_HIP) {
      value = e.balanceDetail.vlrPagCreHipBBOG;
    } else if (e.category === BdbConstants.CREDITOS_BBOG) {
      value = e.balanceDetail.vlrProxCuotaBBOG;
    }
    return value;
  }

  getMinPaymentLabel(e: ProductDetail) {
    let label = '';
    if (e.category === BdbConstants.TARJETA_CREDITO_BBOG) {
      label = BdbConstants.namedMap.pagMinimoBBOG.label2;
    } else if (e.category === BdbConstants.CREDITOS_BBOG) {
      label = BdbConstants.namedMap.vlrProxCuotaBBOG.label2;
    }
    return label;
  }

  getCreditLine(e: ProductDetail) {
    return e.category === BdbConstants.TARJETA_CREDITO_BBOG ? e.balanceDetail.cupoTarjetaBBOG :
      (e.category === BdbConstants.CREDITOS_BBOG &&
        (e.productType === BdbConstants.ATH_ADELANTO_NOMINA ||
          e.productType === BdbConstants.ATH_CREDISERVICE_ALS_PNATURAL ||
          e.productType === BdbConstants.ATH_CREDISERVICE_AP
        ) ?
        e.balanceDetail.cupoTotCreSerBBOG : null);
  }

  mapToPCardDetail(account: ProductDetail): BdbCardDetailModel {
    const mainProp = this.bdbUtils.getMainProperty(account.productType);
    return {
      cardHeader: {
        title: account.productName,
        subtitle: `No. ${account.productNumber}`
      },
      firstColData: {
        key: `${mainProp !== '' ? BdbConstants.namedMap[mainProp].label : account.description} `,
        value: this.bdbMask.maskFormatFactory(this.setValue(account), MaskType.CURRENCY),
        type: MaskType.CURRENCY
      },
      dataToShow: this.mapBalanceDetails(account.balanceDetail, mainProp),
      cardOptions: {
        showError: false,
        backgroundImg: 'assets/imgs/card-detail-imgs/bbog-shape.svg',
        color: 'primary',
        colorGradient: true,
        msgError: ''
      },
      cardButton: this.bdbProducts.getActionsByProduct(account.productType),
      logo: this.getCreditCardLogo(account),
      product: account
    };
  }

  setValue(account: ProductDetail): string {
    if (account.productType === BdbConstants.ATH_FUDUCIARY) {
      return account.balanceDetail['disponibleBBOG'];
    } else {
      return account.amount;
    }
}

  mapToPcardDetailError(account: ProductDetail): BdbCardDetailModel {
    return {
      cardHeader: {
        title: account.productName,
        subtitle: `No. ${account.productNumber}`
      },
      firstColData: null,
      dataToShow: null,
      cardOptions: {
        showError: true,
        backgroundImg: 'assets/imgs/card-detail-imgs/bbog-shape.svg',
        color: 'primary',
        colorGradient: true,
        msgError: 'Hubo un error al cargar los detalles'
      },
      cardButton: [],
      logo: this.getCreditCardLogo(account)
    };
  }

  mapBalanceDetails(balance: any, mainProp: string): BdbMap[] {
    const mArray: any[] = [];
    const mKeys = Object.keys(balance);
    mKeys.forEach(e => {
      if (BdbConstants.namedMap[e] && e !== mainProp) {
        const label = BdbConstants.namedMap[e].label;
        const formatVal = this.bdbMask.maskFormatFactory(balance[e], BdbConstants.namedMap[e].format);
        const priority = BdbConstants.namedMap[e].priority;
        mArray.push({
          key: `${label}`,
          value: formatVal,
          type: BdbConstants.namedMap[e].format,
          priority: BdbConstants.namedMap[e].priority
        });
      }
    });
    mArray.sort((a, b) => {
      if (!!a.priority && !!b.priority) {
        return a.priority - b.priority;
      } else {
        return 0;
      }
    });
    return mArray;
  }

  getCreditCardLogo(product: ProductDetail): string {
    return this.bdbUtils.getImageUrl(product.productType);
  }

  mapToPCardDetailAdn(account: ProductDetail): Observable<CardButton> {
    if (
      account.productType === BdbConstants.ATH_SAVINGS_ACCOUNT
      && account.productDetailApi.productBankSubType === BdbConstants.PAYROLL_ACCOUNT_CODE
    ) {
      return this.adnOps.availableToAdn(account.productNumber)
        .pipe(
          switchMap((data) => {
            if (!!data  && data) {
               return of(this.bdbProducts.btnReqPayRoll);
            }
            return  of();
          })
        );

    } else {
      return  of();
    }
  }

}

export interface PCardModel {
  pName: string;
  pNumber: string;
  pBalance: BdbMap;
  product: ProductDetail;
  logo: string;
  showBalanceLoader: boolean;
  paymentAvailable: boolean;
  minPay: BdbMap;
  nextDate: BdbMap;
  creditLine: string;
  progress: string;
}

export interface PCardDetail extends PCardModel {
  pDetails?: Array<BdbMap>;
  pOptions?: Array<string>;
}
