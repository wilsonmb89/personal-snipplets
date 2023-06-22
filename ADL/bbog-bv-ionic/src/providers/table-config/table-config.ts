import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BdbMaskProvider, MaskType } from '../bdb-mask';
import { BdbGenericTable } from '../../app/models/generic-table/bdb-generic-table';

@Injectable()
export class TableConfigProvider {

  productHistory: BdbGenericTable = {
    columns: [
      {
        header: 'Fecha aplicación', platform: {
          desktop: { column: 'minmax(124px, 1fr)' },
          tablet: { column: 'minmax(106px, 1fr)' }
        }, nowrap: true, cell: (element: any) => `${element.date}`
      },
      {
        header: 'Descripción', platform: {
          desktop: { column: '4fr' },
          tablet: { column: '4fr' },
          mobile: { column: '1fr' }
        }, cell: (element: any) => `${element.description}`
      },
      {
        header: 'Monto', platform: {
          desktop: { column: 'minmax(144px, 1fr)' },
          tablet: { column: 'minmax(120px, 1fr)' },
          mobile: { column: '1fr' }
        }, justify: 'end',
        color: (element: any) => {
          return (!!element && !!element.amount && !!element.amount.positive && element.amount.positive) ? 'active-green' : null;
        },
        type: 'money',
        cell: (element: any) => `${element.symbol}${this.buildHtmlDecimal(element.amount.amount)}`
      }
    ],
    expandable: []
  };

  productHistoryCC: BdbGenericTable = {
    columns: [
      {
        header: 'Fecha aplicación', platform: {
          desktop: { column: 'minmax(124px, 1fr)' },
          tablet: { column: 'minmax(106px, 1fr)' }
        }, nowrap: true, cell: (element: any) => `${element.date}`
      },
      {
        header: 'Descripción', platform: {
          desktop: { column: '4fr' },
          tablet: { column: '4fr' },
          mobile: { column: '1fr', nowrap: true }
        }, cell: (element: any) => `${element.description}`
      },
      {
        header: 'Cuotas', platform: {
          desktop: { column: '45px' },
          tablet: { column: '45px' },
        }, justify: 'end', nowrap: true, cell: (element: any) => `${element.installments}`
      },
      {
        header: 'Monto', platform: {
          desktop: { column: 'minmax(144px, 1fr)' },
          tablet: { column: 'minmax(120px, 1fr)' },
          mobile: { column: '1fr' }
        }, justify: 'end',
        color: (element: any) => {
          return (!!element && !!element.amount && !!element.amount.positive && element.amount.positive) ? 'active-green' : null;
        },
        type: 'money',
        cell: (element: any) => `${element.symbol}${this.buildHtmlDecimal(element.amount.amount)}`
      },
      {
        header: '', platform: {
          mobile: { column: '24px' }
        }, justify: 'center',
        cell: (element: any) => `${this.buildIconArrow()}`
      }
    ],
    expandable: [{
      title: 'Cuotas',
      platform: {
        mobile: true
      },
      cell: (element: any) => `${element.installments}`
    }]
  };

  pocketHistory: BdbGenericTable = {
    columns: [
      {
        header: 'Fecha aplicación', platform: {
          desktop: { column: 'minmax(124px, 1fr)' },
          tablet: { column: 'minmax(106px, 1fr)' }
        }, nowrap: true, cell: (element: any) => `${element.date}`
      },
      {
        header: 'Descripción', platform: {
          desktop: { column: '4fr' },
          tablet: { column: '4fr' },
          mobile: { column: '1fr' }
        }, cell: (element: any) => `${element.description}`
      },
      {
        header: 'Monto', platform: {
          desktop: { column: 'minmax(144px, 1fr)' },
          tablet: { column: 'minmax(120px, 1fr)' },
          mobile: { column: '1fr' }
        }, justify: 'end',
        color: (element: any) => {
          return (!!element && !!element.amount && !!element.amount.positive && element.amount.positive) ? 'active-green' : null;
        },
        type: 'money',
        cell: (element: any) => `${element.symbol}${this.buildPocketHtmlDecimal(element.amount.amount)}`
      }
    ],
    expandable: []
  };

  constructor(
    public cp: CurrencyPipe,
    private bdbMask: BdbMaskProvider
  ) { }

  public getTransactionTableType() {
    return {
      accounts: {
        columns: [
          { header: 'Fecha', lg: '3', md: '', tablet: true, cell: (element: any) => `${element.date}` },
          { header: 'Descripción', lg: '6', tablet: true, mobile: true, cell: (element: any) => `${element.description}` },
          {
            header: 'Monto', lg: '2', tablet: true, mobile: true, class: (element: any) => {
              if (element && element.amount) {
                return ['text-right', 'currency-movements', element.amount.positive ? 'active-green' : ''];
              } else {
                return ['text-right', 'currency-movements'];
              }
            }, cell: (element: any) => `${element.symbol}${this.cp.transform(element.amount.amount, 'USD', 'symbol', '1.0-0')}`
          },
        ]
      },
      creditCards: {
        columns: [
          { header: 'Fecha', lg: '3', tablet: true, cell: (element: any) => `${element.date}` },
          { header: 'Descripción', lg: '4', tablet: true, mobile: true, cell: (element: any) => `${element.description}` },
          {
            header: 'Cuotas', md: '2', lg: '2', xl: '1', tablet: true, mobile: true, class: (element: any) => {
              return ['text-right'];
            }, cell: (element: any) => `${element.installments}`
          },
          {
            header: 'Monto', lg: '3', tablet: true, mobile: true, class: (element: any) => {
              if (element && element.amount) {
                return ['text-right', 'currency-movements', element.amount.positive ? 'active-green' : ''];
              } else {
                return ['text-right', 'currency-movements'];
              }
            }, cell: (element: any) => `${element.symbol}${this.cp.transform(element.amount.amount, 'USD', 'symbol', '1.0-0')}`
          },
        ]
      },
      tuPlus: {
        columns: [
          {
            header: 'Entidad', lg: '2', tablet: true, mobile: true, img: true,
            cell: (element: any) => `${this.getIconBank(element.bank)}`
          },
          {
            header: 'Fecha acumulación', lg: '2', tablet: true, mobile: false,
            cell: (element: any) => `${this.bdbMask.maskFormatFactory(element.date, MaskType.DATE)}`
          },
          {
            header: 'Establecimiento', lg: '4', tablet: true, mobile: true,
            cell: (element: any) => `${element.establishment}`
          },
          {
            header: 'Puntos acumulados', lg: '2', tablet: true, mobile: true, class: (element: any) => ['text-right'],
            cell: (element: any) => `${element.accumulatedPoints}`
          },
          {
            header: 'Monto', lg: '2', tablet: false, mobile: false, class: (element: any) => ['text-right'],
            cell: (element: any) => `${this.bdbMask.maskFormatFactory(element.amount, MaskType.CURRENCY)}`
          },
        ],
        expandableData: [
          {
            title: 'Monto:', hiddenWeb: true,
            cell: (element: any) => `${this.bdbMask.maskFormatFactory(element.amount, MaskType.CURRENCY)}`
          },
          { title: 'Producto:', hiddenWeb: false, cell: (element: any) => `${element.product}` },
          {
            title: 'Vencimiento puntos:', hiddenWeb: false,
            cell: (element: any) => `${this.bdbMask.maskFormatFactory(element.expDt, MaskType.DATE)}`
          },
          { title: 'Tipo de transacción:', hiddenWeb: false, cell: (element: any) => `${element.transactionType}` }
        ]
      },
    };
  }

  public getIconBank(bank) {
    switch (bank) {
      case 'Banco Popular':
        return 'iconbp.png';
      case 'Banco de Occidente':
        return 'iconbo.png';
      case 'Banco AV Villas':
        return 'iconavv.png';
      default:
        return 'logo_white.svg';
    }
  }

  getProductHistory() {
    return this.productHistory;
  }

  getProductHistoryCC() {
    return this.productHistoryCC;
  }

  getPocketHistory() {
    return this.pocketHistory;
  }

  buildIconArrow() {
    return `
      <div class="bdb-generic-table-container__img__icon-arrow">
      </div>
    `;
  }

  buildHtmlDecimal(value) {
    const amount = this.bdbMask.maskFormatFactory(value, MaskType.CURRENCY);
    return `
      ${amount.substring(0, amount.indexOf(','))}<sup>${amount.substring(amount.indexOf(','), amount.length)}</sup>
    `;
  }

  buildPocketHtmlDecimal(value) {
    const amount = this.bdbMask.maskFormatFactory(value, MaskType.CUSTOM_CURRENCY);
    return `
      ${amount.substring(0, amount.indexOf('.'))}<sup>${amount.substring(amount.indexOf('.'), amount.length)}</sup>
    `;
  }

}
