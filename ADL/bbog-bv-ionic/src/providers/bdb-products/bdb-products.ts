import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import {LoadingController, NavController} from 'ionic-angular';
import { CardButton } from '../../components/core/molecules/bdb-card-detail';
import { AccessDetailProvider } from '../../providers/access-detail/access-detail';
import { NavigationProvider } from '../../providers/navigation/navigation';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import * as iconsInline from './icons-products.json';
import { BdbUtilsProvider } from '../../providers/bdb-utils/bdb-utils';
import { BdbModalProvider } from '../../providers/bdb-modal/bdb-modal';
import {ProductDetail} from '../../app/models/products/product-model';
import {ExtraordinaryPaymentService} from '@app/modules/payments/services/extraordinary-payment.service';
import {ExtraordinaryPaymentRs} from '@app/apis/payment-nonbillers/models/extraordinary-payment.model';
import { allowedServiceMapperType, UserFeaturesDelegateService } from '@app/delegate/user-features/user-features-delegate.service';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';
import { CashAdvanceWorkflowState, ProductBalanceInfo } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.types';


@Injectable()
export class BdbProductsProvider {

    private readonly CONST_ZERO_VALUE = '0';

    public btnReqPayRoll = {
        text: 'Adelanto',
        icon: iconsInline['payrollLoan'],
        id: 'payroll_request',
        action: (navCtrl) => {
            this.redirect(navCtrl, 'AdnPage');
        }
    };

    private btnExtracts = {
        text: 'Extractos',
        icon: iconsInline['extracts'],
        id: 'extracts',
        action: (navCtrl) => {
            this.redirect(navCtrl, 'StatementDownloadPage');
        }
    };

    private btnPayBill = {
        text: 'Hacer pago',
        icon: iconsInline['payBill'],
        id: 'pay_bill',
        action: (navCtrl) => {
            this.redirect(navCtrl, 'PaymentsMainPage');
        }
    };
    private btnTransfer = {
        text: 'Transferir',
        icon: iconsInline['transfer'],
        id: 'transfer',
        action: (navCtrl) => {
            this.redirect(navCtrl, 'NewTransferMenuPage');
        }
    };

    private btnAdvance = {
        text: 'Avance',
        icon: iconsInline['advance'],
        id: 'advance',
        action: (navCtrl) => {
            const legacyCallback = () => this.redirect(navCtrl, 'CashAdvanceAmountPage', 'dest');
            const microfrontendCallback = () => {
                const cashAdvanceData = this.buildCashAdvanceWorkflowState();
                this.bdbMicrofrontendEventsService.saveStateInSessionStorage<CashAdvanceWorkflowState>(
                    'CashAdvanceWorkflowState',
                    cashAdvanceData
                  );
                this.bdbMicrofrontendEventsService.sendRouteEventToParentWindow('/transferencias/avances');
            };
            this.validateMicrofrontRedirection(
                'cashAdvance',
                legacyCallback,
                microfrontendCallback
            );
        }
    };

    private btnLoanTransfer = {
        text: 'Utilizar',
        icon: iconsInline['transfer'],
        id: 'loanTransfer',
        action: (navCtrl) => {
            this.redirect(navCtrl, 'LoanTransferAmountPage');
        }
    };

    private productTypes = {
        ST: {
            type: 'SDA',
            subtype: '062',
            payMap: 'ST',
            mainProp: 'disponibleBBOG',
            actions: [
                this.btnTransfer,
                this.btnPayBill,
                this.btnExtracts,
            ]
        },
        AF: {
            type: 'SDA',
            subtype: '067',
            payMap: 'AF',
            mainProp: '',
            actions: [
                this.btnExtracts,
            ]
        },
        IM: {
            type: 'DDA',
            subtype: '010CC',
            payMap: 'IM',
            mainProp: 'disponibleBBOG',
            actions: [
                this.btnTransfer,
                this.btnPayBill,
                this.btnExtracts,
            ]
        },
        MC: {
            type: 'CCA',
            subtype: 'MC',
            payMap: 'MC',
            mainProp: 'cupoComprasBBOG',
            actions: [
                {
                    text: 'Pagar',
                    icon: iconsInline['payBill'],
                    id: 'pay_tc_mc',
                    action: (navCtrl) => {
                        this.redirect(navCtrl, 'creditcard%amount%select', 'dest');
                    }
                },
                this.btnExtracts,
                this.btnAdvance
            ],
            paymentAvailables: [
                'pagMinimoBBOG',
                'fecProxPagoBBOG'
            ]
        },
        CB: {
            type: 'CCA',
            subtype: 'CB',
            payMap: 'CB',
            mainProp: 'cupoComprasBBOG',
            actions: [
                {
                    text: 'Pagar',
                    icon: iconsInline['payBill'],
                    id: 'pay_tc_cb',
                    action: (navCtrl) => {
                        this.redirect(navCtrl, 'creditcard%amount%select', 'dest');
                    }
                },
                this.btnExtracts,
                this.btnAdvance
            ],
            paymentAvailables: [
                'pagMinimoBBOG',
                'fecProxPagoBBOG'
            ]
        },
        FB: {
            type: 'FDA',
            subtype: 109,
            payMap: 1,
            mainProp: 'disponibleBBOG',
            actions: [
                {
                    text: 'Invertir',
                    icon: iconsInline['invest'],
                    id: 'invest',
                    action: (navCtrl) => {

                        if (this.bdbUtils.validateBusinessDay()) {
                            this.redirect(navCtrl, 'TrustAgreementAmountPage', 'dest');
                        } else {
                            this.bdbModal.launchModalContingencyFIC();
                        }
                    }
                },
                {
                    text: 'Retirar',
                    icon: iconsInline['disinvest'],
                    id: 'disinvest',
                    action: (navCtrl) => {
                        if (this.bdbUtils.validateBusinessDay()) {
                            this.redirect(navCtrl, 'TrustAgreementAmountPage', 'origin');
                        } else {
                            this.bdbModal.launchModalContingencyFIC();
                        }
                    }
                }
            ]
        },
        LB: {
            type: 'DLA',
            subtype: '131ML',
            payMap: 'LB',
            mainProp: '',
            actions: [
                {
                    text: 'Pagar',
                    icon: iconsInline['payBill'],
                    id: 'pay__an',
                    action: (navCtrl) => {
                        this.redirect(navCtrl, 'credit%amount%select', 'dest');
                    }
                },
                this.btnExtracts
            ],
            propertyForPayments: [
                'valTotPagarBBOG'
            ],
            paymentAvailables: [
                'valTotPagarBBOG',
                'valTotPagarBBOG'
            ]
        },
        LF: {
            type: 'LOC',
            subtype: '118ML',
            payMap: 'LF',
            mainProp: 'saldObligLeasingBBOG',
            propertyForPayments: [
                'saldObligLeasingBBOG'
            ],
            paymentAvailables: [
                'valorCanonLeasingBBOG',
                'saldObligLeasingBBOG'
            ],
            actions: [
                this.btnExtracts,
            ]
        },
        AV: {
            type: 'LOC',
            subtype: '119ML',
            payMap: '1',
            mainProp: 'saldoCapitalBBOG',
            actions: [
                {
                    text: 'Pagar',
                    icon: iconsInline['payBill'],
                    id: 'pay_av',
                    action: (navCtrl) => {
                        this.redirect(navCtrl, 'credit%amount%select', 'dest');
                    }
                },
                this.btnExtracts
            ],
            propertyForPayments: [
                'vlrPagCreHipBBOG',
                'fecProxPagoBBOG'
            ],
            paymentAvailables: [
                'vlrPagCreHipBBOG',
                'saldoCapitalBBOG'
            ]
        },
        DN: {
            type: 'LOC',
            subtype: '110ML',
            payMap: '1',
            mainProp: 'cupoDispoCreSerBBOG',
            actions: [
                {
                    text: 'Pagar',
                    icon: iconsInline['payBill'],
                    id: 'pay_dn',
                    action: (navCtrl) => {
                        this.redirect(navCtrl, 'credit%amount%select', 'dest');
                    }
                },
                this.btnExtracts,
                this.btnLoanTransfer
            ],
            propertyForPayments: [
                'vlrProxCuotaBBOG',
                'fecProxPagoBBOG'
            ],
            paymentAvailables: [
                'vlrProxCuotaBBOG',
                'vlrTotPagCreSerBBOG'
            ],
            propertyForLoanTransfer: 'cupoDispoCreSerBBOG'
        },
        LA: {
            type: 'LOC',
            subtype: '106ML',
            payMap: '1',
            mainProp: '',
            actions: [
                this.btnExtracts,
            ]
        },
        AN: {
            type: 'LOC',
            subtype: '568ML',
            payMap: '1',
            mainProp: 'cupoDispoCreSerBBOG',
            actions: [
                {
                    text: 'Pagar',
                    icon: iconsInline['payBill'],
                    id: 'pay__an',
                    action: (navCtrl) => {
                        this.redirect(navCtrl, 'credit%amount%select', 'dest');
                    }
                },
                this.btnExtracts,
                this.btnLoanTransfer
            ],
            propertyForPayments: [
                'vlrProxCuotaBBOG',
                'fecProxPagoBBOG'
            ],
            paymentAvailables: [
                'vlrProxCuotaBBOG',
                'vlrTotPagCreSerBBOG'
            ],
            propertyForLoanTransfer: 'cupoDispoCreSerBBOG'
        },
        AP: {
          type: 'LOC',
          subtype: '568ML',
          payMap: 1,
          mainProp: 'cupoDispoCreSerBBOG',
          propertyForPayments: [
            'vlrProxCuotaBBOG',
            'fecProxPagoBBOG'
          ],
          paymentAvailables: [
            'vlrProxCuotaBBOG',
            'vlrTotPagCreSerBBOG'
          ],
          propertyForLoanTransfer: 'cupoDispoCreSerBBOG',
          actions: [
            {
              text: 'Pagar',
              icon: iconsInline['payBill'],
              id: 'pay_ad',
              action: (navCtrl) => {
                this.redirect(navCtrl, 'credit%amount%select', 'dest');
              }
            },
            this.btnExtracts,
            this.btnLoanTransfer
          ]
        },
        CD: {
            type: 'CDA',
            subtype: '292CDT',
            payMap: '1',
            mainProp: '',
            actions: []
        },
        AD: {
            type: 'DLA',
            subtype: '073ML',
            payMap: '1',
            mainProp: 'vlrTotPagCreSerBBOG',
            actions: [
                {
                    text: 'Pagar',
                    icon: iconsInline['payBill'],
                    id: 'pay_ad',
                    action: (navCtrl) => {
                        this.redirect(navCtrl, 'credit%amount%select', 'dest');
                    }
                },
                this.btnExtracts
            ],
            propertyForPayments: [
                'vlrProxCuotaBBOG',
                'fecProxPagoBBOG'
            ],
            paymentAvailables: [
                'vlrProxCuotaBBOG',
                'vlrTotPagCreSerBBOG'
            ]
        },
        LH: {
            type: 'DLA',
            subtype: '117ML',
            payMap: '1',
            mainProp: '',
            propertyForPayments: [
                'vlrPagCreHipBBOG',
                'fecProxPagoBBOG'
            ],
            paymentAvailables: [
                'vlrPagCreHipBBOG',
                'saldoCapitalBBOG'
            ],
            actions: [
                this.btnExtracts,
            ]
        },
        1: {
            type: 'DDA'
        },
        2: {
            type: 'SDA'
        },
        3: {
            type: 'CDA'
        },
        4: {
            type: 'DLA'
        },
        5: {
            type: 'CCA'
        },
        '05O': {
            type: 'DDA'
        },
        '10O': {
            type: 'SDA'
        },
        '15O': {
            type: 'CCA'
        },
        '20O': {
            type: 'DLA'
        },
        '22O': {
            type: 'DLA'
        },
        '25O': {
            type: 'CDA'
        },
        '30O': {
            type: 'DLA'
        },
        '99O': {
            type: 'DLA'
        },
        '01': {
            type: 'SDA'
        },
        '03': {
            type: 'CCA'
        },
        '04': {
            type: 'DLA'
        },
        '05': {
            type: 'CDA'
        },
        '06': {
            type: 'DDA'
        },
        '07': {
            type: 'AFC'
        },
        '09': {
            type: 'LPA'
        },
        '10': {
            type: 'D'
        },
        '11': {
            type: ''
        },
        '12': {
            type: 'SPA'
        },
        '20': {
            type: ''
        },
        '21': {
            type: 'DLA'
        },
        '99': {
            type: ''
        }
    };

    constructor(
        private navigation: NavigationProvider,
        private accessDetail: AccessDetailProvider,
        private bdbInMemory: BdbInMemoryProvider,
        private bdbUtils: BdbUtilsProvider,
        private bdbModal: BdbModalProvider,
        private extraordinaryPaymentService: ExtraordinaryPaymentService,
        private loading: LoadingController,
        private userFeaturesService: UserFeaturesDelegateService,
        private bdbMicrofrontendEventsService: BdbMicrofrontendEventsService,
    ) { }

    getActionsByProduct(productType): CardButton[] {
        const tempMap = this.productTypes[productType];
        return (tempMap) ? tempMap.actions : [];
    }

  redirect(navCtrl: NavController, page: string, section = 'origin') {
    const productDetail = this.SetAccesDetail(section);
    if (page === 'credit%amount%select') {
      const loader = this.loading.create();
      loader.present();
      // TO DO: unsubscribe from services
      this.extraordinaryPaymentService.checkExtraPayment('bdbCardDetail', productDetail)
        .subscribe({
          next: (res: ExtraordinaryPaymentRs) => {
            productDetail.hasAdvancePmnt = res.status === '1';
            this.bdbInMemory.setItemByKey(InMemoryKeys.ProductDetail, productDetail);
            navCtrl.push(page, {flag: 'bdbCardDetail'});
          }
          , error:
            error => {
              loader.dismiss();
              navCtrl.push(page, {flag: 'bdbCardDetail'});
            },
          complete: () => {
            loader.dismiss();
          }
        });
    } else {
      navCtrl.push(page);
    }

  }

    private SetAccesDetail(section: string): ProductDetail {
        const prodAction = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductDetail);
        if (section === 'dest') {
            prodAction.disinvest = false;
            this.setDestination(prodAction);
        } else {
            prodAction.disinvest = true;
            this.setOrigin(prodAction);
        }
        return prodAction;
    }

    setOrigin(product) {
        this.accessDetail.unselectedOrigin();
        this.accessDetail.setOriginSelected(product);
    }

    setDestination(product) {
        this.accessDetail.unselectedDestination();
        this.accessDetail.setDestinationSelected(product);
    }

    private validateMicrofrontRedirection(
        userFeatureService: allowedServiceMapperType,
        legacyCallback: () => void,
        microfrontendCallback: () => void
    ): void {
        this.userFeaturesService.isAllowedServiceFor(userFeatureService)
            .pipe(take(1))
            .subscribe((isActive) => isActive ? microfrontendCallback() : legacyCallback());
    }

    private buildCashAdvanceWorkflowState(): CashAdvanceWorkflowState {
        const product: ProductDetail = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductDetail);
        const { productDetailApi } = product;
        let balanceInfo: ProductBalanceInfo = null;
        if (!!product && !!product.balanceDetail) {
            balanceInfo = {
                balanceDetail: {
                    CashAvail: product.balanceDetail.cupoAvancesBBOG || this.CONST_ZERO_VALUE,
                    CreditLimit: product.balanceDetail.cupoTarjetaBBOG || this.CONST_ZERO_VALUE,
                    AvailCredit: product.balanceDetail.cupoComprasBBOG || this.CONST_ZERO_VALUE,
                    PayoffAmt: null,
                    Principal: product.balanceDetail.totalFechaBBOG || this.CONST_ZERO_VALUE
                }
            };
        }
        return {
            step: 1,
            cardSelected: {
                productNumber: productDetailApi.productNumber,
                productName: productDetailApi.productName,
                description: productDetailApi.description,
                officeId: productDetailApi.officeId,
                productAthType: productDetailApi.productAthType,
                productBankType: productDetailApi.productBankType,
                productBankSubType: productDetailApi.productBankSubType,
                valid: productDetailApi.valid,
                franchise: productDetailApi.franchise,
                openDate: productDetailApi.openDate,
                status: productDetailApi.status,
                balanceInfo: balanceInfo
            },
            directAccess: true
        };
    }

}
