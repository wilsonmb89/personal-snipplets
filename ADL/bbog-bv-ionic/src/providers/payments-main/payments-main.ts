import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DefaultViewMenuComponent } from '../../components/default-view-menu/default-view-menu';
import { BillSelelectPage } from '../../pages/payments/bills/bill-selelect/bill-selelect';
import { CCDestinationAcctPage } from '../../pages/payments/credit-card/cc-destination-acct/cc-destination-acct';
import { LoanDestinationAcctPage } from '../../pages/payments/credits/loan-destination-acct/loan-destination-acct';
import { HistoryPage } from '../../pages/payments/history/history';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { TokenOtpProvider } from '../../providers/token-otp/token-otp/token-otp';
import { TaxSelectPage } from '../../new-app/modules/payments/pages/taxes/tax-select/tax-select';
import { RechargeChoicePage } from '@app/modules/payments/pages/recharges/recharge-choice/recharge-choice';

@Injectable()
export class PaymentsMainProvider {

  constructor(
    private tokenOtp: TokenOtpProvider
  ) {
  }

  public tabsData(
    navCtrl: NavController,
    viewRef: ViewContainerRef,
    resolver: ComponentFactoryResolver
  ) {
    const pathEmptyStates = BdbConstants.DIR_EMPTY_STATE;
    return [
      {
        title: 'Historial',
        segment: 'history',
        component: HistoryPage,
        funnelKey: 'historyPayment',
        empty: {
          message: 'none'
        }
      },
      {
        title: 'Servicios',
        segment: 'bills',
        component: BillSelelectPage,
        funnelKey: 'bills',
        empty: {
          message: 'account',
        }
      },
      {
        title: 'Tarjetas de Crédito',
        segment: 'cc-payments',
        component: CCDestinationAcctPage,
        funnelKey: 'cards',
        empty: {
          message: 'avalPay',
        }
      },
      {
        title: 'Créditos',
        segment: 'credits-payment',
        component: LoanDestinationAcctPage,
        funnelKey: 'credits',
        empty: {
          message: 'avalPay'
        }
      },
      {
        title: 'Impuestos',
        segment: 'tax',
        component: TaxSelectPage,
        funnelKey: 'tax',
        empty: {
          message: 'none'
        }
      },
      {
        title: 'Recargas',
        segment: 'recharge',
        component: RechargeChoicePage,
        funnelKey: 'recharges',
        empty: {
          message: 'none'
        }
      },
      {
        title: 'Planilla asistida',
        segment: 'pila',
        component: DefaultViewMenuComponent,
        funnelKey: 'pila',
        empty: {
          img: {
            desktop: pathEmptyStates + 'tax.svg',
            mobile: pathEmptyStates + 'tax.svg'
          },
          message: 'Realiza aquí el pago de tu planilla asistida (PILA).',
          button: {
            message: 'Buscar planilla',
            callback: () => {
              this.tokenOtp.requestToken(
                viewRef,
                resolver,
                () => {
                  navCtrl.push('page%pila%select');
                },
                'pilaPayment');
            }
          }
        }
      },
    ];
  }

}
