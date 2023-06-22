
import { Injectable } from '@angular/core';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { Observable } from 'rxjs/Observable';
import { HistoryTxRq } from '../../app/models/history-tx/history-tx-rq';
import { ModalRs } from '../../app/models/modal-rs/modal-rs';
import { ENV } from '@app/env';
import { BdbMaskProvider } from '../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../providers/bdb-mask/bdb-mask-type.enum';
import { ColumnOptionsDynamic } from '../../app/models/column-options-dynamic';
import { BdbPdfProvider } from '../../providers/bdb-pdf/bdb-pdf';
import { RequestEvents } from '../../app/models/analytics-event/request-event';
import { BdbEventsConstants } from '../../app/models/analytics-event/bdb-transactions-code';

/*
  Generated class for the HistoryTxProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HistoryTxProvider {

    constructor(
        private bdbHttpClient: BdbHttpClient,
        private bdbMask: BdbMaskProvider,
        private pdfProvider: BdbPdfProvider,

    ) {
    }

  public geHistoryByDate(rq: HistoryTxRq): Observable<ModalRs> {
    return this.bdbHttpClient.post(
      'payment-core/transaction-history',
      rq,
      ENV.API_GATEWAY_ADL_URL, null, new RequestEvents(BdbEventsConstants.security.paymentHistory));
  }

    public buildHistoryTable(historyType): any {
        return this.getTypes()[historyType];
    }

    public getTypes(): any {
        return {
            payment: {
                columns: [
                    {
                        header: 'Fecha', xl: '2',
                        lg: '1',
                        md: '3',
                        tablet: true,
                        cell: (element: any) => `${this.bdbMask.maskFormatFactory(element.orderInfo.expDt, MaskType.DATE)}`
                    },
                    {
                        header: 'Resultado',
                        xl: '2',
                        lg: '2',
                        cell: (element: any) => {
                            return element.orderInfo.desc.toUpperCase().includes('NO EXITOSO') ? 'No Exitoso' : 'Exitoso';
                        }
                    },
                    {
                        header: 'Referencia de pago', xl: '2', lg: '2', md: '5', tablet: true, mobile: true, col: '7',
                        cell: (element: any) => `${element.transactionInfo.desc}`
                    },
                    {
                        header: 'Cuenta origen', xl: '2', lg: '2',
                        cell: (element: any) => `${element.accountFrom.acctType}`
                    },
                    {
                        header: 'Canal', xl: '2', lg: '2',
                        cell: (element: any) => `${element.channelInfo.channel}`
                    },
                    {
                        header: 'Monto', xl: '1', lg: '2', md: '3', tablet: true, mobile: true, col: '3', class: (e: any) =>
                            ['text', 'text-right-mobile'],
                        cell: (element: any) => `${element.transactionCost.amt}`
                    },
                    {
                        header: '', xl: '1', lg: '1', btn1: true, md: '1', tablet: true, mobile: true, col: '2',
                        cell: (element: any) => 'baseline-open-in-new-24-px-copy-19.svg'
                    },
                ],
                title: 'Historial de Pagos',
                type: '1',
            },
            transfer: {
                title: 'Historial de transferencias',
                type: '3',
                columns: [
                    {
                        header: 'Fecha', xl: '1', lg: '1', md: '3', tablet: true,
                        cell: (element: any) => `${this.bdbMask.maskFormatFactory(element.orderInfo.expDt, MaskType.DATE)}`
                    },
                    {
                        header: 'Resultado', xl: '2', lg: '2',
                        cell: (element: any) => {
                            return element.orderInfo.desc.toUpperCase().includes('NO EXITOSO') ? 'No Exitoso' : 'Exitoso';
                        }
                    },
                    {
                        header: 'Cuenta origen', xl: '2', lg: '2',
                        cell: (element: any) => `${element.accountFrom.acctType}`
                    },
                    {
                        header: 'Cuenta destino', xl: '2', lg: '2', md: '4', tablet: true, mobile: true, col: '7',
                        cell: (element: any) => `${element.accountTo.acctType}`
                    },
                    {
                        header: 'Canal', xl: '1', lg: '1',
                        cell: (element: any) => `${element.channelInfo.channel}`
                    },
                    {
                        header: 'Tipo', xl: '1', lg: '1', md: '2', tablet: true,
                        cell: (element: any) => `${element.transactionInfo.trnId}`
                    },
                    {
                        header: 'Monto',
                        xl: '2',
                        lg: '2',
                        md: '2',
                        tablet: true, mobile: true, col: '3', class: (e: any) =>
                            ['text', 'text-right-mobile'],
                        cell: (element: any) => `${element.transactionCost.amt}`
                    },
                    {
                        header: '', xl: '1', lg: '1', btn1: true, md: '1', tablet: true, mobile: true, col: '2',
                        cell: (element: any) => 'baseline-open-in-new-24-px-copy-19.svg'
                    },
                ]
            }
        };
    }


    export(dataSource: any[], columns: ColumnOptionsDynamic[]) {
        let result = dataSource.map(row => {
            const separator = ',';
            return this.bdbMask.maskFormatFactory(row.orderInfo.expDt, MaskType.DATE)
                + separator + row.orderInfo.desc
                + separator + row.transactionInfo.desc
                + separator + row.accountFrom.acctType
                + separator + row.channelInfo.channel
                + separator + `"${row.transactionCost.amt}"`;
        }).join('\r\n');
        const fileName = `histTx${new Date().getUTCDate()}`;
        const cols = columns.map(col => col.header).join(',');
        result = `${cols}\n${result}`;
        this.pdfProvider.generatCSV(result, fileName, 'text/csv');
    }

    exportData(dataSource: any[], columns: ColumnOptionsDynamic[]) {
        const result = this.getCSVData(dataSource, columns);
        const fileName = `histTx${new Date().getTime()}`;
        this.pdfProvider.generatCSV(result, fileName, 'text/csv');
    }

    getCSVData(dataSource: any[], columns: ColumnOptionsDynamic[]): string {
        const separator = ';';
        const cols = columns.filter(col => col.header !== '');
        let result = dataSource
            .map(row => cols.map(col => {
                return `"${col.cell(row)}"`;
            }
            ).join(separator)).join('\r\n');
        const colsTitle = cols.map(col => col.header).join(separator);
        result = `${colsTitle}\n${result}`;
        return result;
    }
}

