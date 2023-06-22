import { Injectable } from '@angular/core';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { ParameterTypeDto, NotificationEmail } from '../../app/models/notification-email';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ENV } from '@app/env';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { ModalConfirmation, ModalConfDetail } from '../../components/confirmation-modal';
import { VoucherData, VoucherInfo, VoucherDetail } from '../../app/models/voucher/voucher-data';
import { TransactionResultModel } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { DatePipe } from '@angular/common';

@Injectable()
export class EmailProvider {

    constructor(
        private bdbInMemoryProvider: BdbInMemoryProvider,
        private bdbRsaProvider: BdbRsaProvider,
        public bdbHttpClient: BdbHttpClient,
        private event: Events,
        private datePipe: DatePipe,
    ) {}

    sendMailVoucher(data: VoucherData, email: string, emailOptions: any) {
        return this.sendEmails(this.sendMailActionVoucher(data, email, emailOptions));
    }

    buildParamsVoucherTransfer(data: VoucherData): ParameterTypeDto[] {

      const {voucherInfo, originAcct, destinationAcct, costTransaction, transferValue} = this.buildBasicData(data);

      const result = [
            { name: 'num_autorizacion', value: voucherInfo.number },
            { name: 'fecha_hora', value: voucherInfo.date },
            { name: 'cta_origen', value: originAcct.text[3] ? originAcct.text[3].value : originAcct.text[0].value },
            { name: 'cta_destino', value: destinationAcct.text[3] ? destinationAcct.text[3].value : destinationAcct.text[0].value },
            { name: 'valor_transferencia', value: transferValue.text[0].value },
            { name: 'resultado', value: 'Exitoso' },
            { name: 'canal', value: 'Banca Virtual' },
            { name: 'ip_cliente', value: this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.IP) }];
        if (!!costTransaction) {
          result.push({ name: 'costo_transaccion', value: costTransaction.text[0].value });
        }
        return result;
    }

  buildParamsVoucherPay(data: VoucherData): ParameterTypeDto[] {

         const {voucherInfo, originAcct, destinationAcct, costTransaction, transferValue} = this.buildBasicData(data);

        return [
            { name: 'num_autorizacion', value: voucherInfo.number },
            { name: 'fecha_hora', value: voucherInfo.date },
            { name: 'cta_origen', value: originAcct.text[0].value },
            { name: 'empresa_servicio', value: destinationAcct.text[1].value },
            { name: 'nombre_servicio', value: destinationAcct.text[0].value },
            { name: 'ref_pago', value: destinationAcct.text[2] ? destinationAcct.text[2].value : '' },
            { name: 'valor_pago', value: transferValue.text[0].value },
            { name: 'resultado', value: 'Exitoso' },
            { name: 'costo_transaccion', value: costTransaction.text[0].value },
            { name: 'canal', value: 'Banca Virtual' },
            { name: 'ip_cliente', value: this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.IP) }
        ];
    }

  private buildBasicData(data: VoucherData): any {
    const voucherInfo: VoucherInfo = data.voucher;
    const voucherDetail: VoucherDetail[] = voucherInfo.content;

    const originAcct: VoucherDetail = voucherDetail.find(e => {
      return e.name.startsWith('Cuenta de origen') || e.name === 'Origen';
    });

    const destinationAcct: VoucherDetail = voucherDetail.find(e => {
      return e.name.startsWith('Destino') || e.name === 'Cuenta destino';
    });

    const costTransaction: VoucherDetail = voucherDetail.find(e => {
      return e.name.startsWith('Costo de la transacción');
    });

    const transferValue: VoucherDetail = voucherDetail.find(e => {
      return e.name.startsWith('Valor');
    });
    return {voucherInfo, originAcct, destinationAcct, costTransaction, transferValue};
  }

    sendMailActionVoucher(data: VoucherData, email: string, emailOptions: any): NotificationEmail {
        return this.buildMailBasic(
            emailOptions.TEMPLATE,
            emailOptions.SUBJECT,
            [{ title: email, isValid: true }],
            (emailOptions.TEMPLATE === BdbConstants.EMAIL_OPTIONS.TRANSFER.TEMPLATE) ?
              this.buildParamsVoucherTransfer(data) :
              this.buildParamsVoucherPay(data)
        );
    }

    sendMailAction(dataModal): NotificationEmail {
        let params: ParameterTypeDto[];
        if (dataModal.typeEmail.TEMPLATE === BdbConstants.EMAIL_OPTIONS.TRANSFER.TEMPLATE) {
            params = this.buildParamsTransfer(dataModal.data);
        } else {
            params = this.buildParamsPay(dataModal.data);
        }
        return this.buildMailBasic(dataModal.typeEmail.TEMPLATE, dataModal.typeEmail.SUBJECT, dataModal.emails, params);
    }

    private buildParamsTransfer(dataModal: ModalConfirmation): ParameterTypeDto[] {
        let destAcct: string;
        let originAcct: string;
        const isDestination: ModalConfDetail = dataModal.modalConfDetails.find((e: ModalConfDetail) => {
            return e.detailTitle.startsWith('Cuenta dest');
        });

        if (isDestination) {
            destAcct = isDestination.desc;
            originAcct = dataModal.modalConfSubHeader.subTitle;
        } else {
            originAcct = dataModal.modalConfDetails[0].desc.split('-')[1];
            destAcct = dataModal.modalConfSubHeader.desc[1];
        }

        const parameters: ParameterTypeDto[] = [
            { name: 'num_autorizacion', value: dataModal.modalConfHeader.authNumber },
            { name: 'fecha_hora', value: dataModal.modalConfHeader.dateTime },
            { name: 'cta_origen', value: originAcct },
            { name: 'cta_destino', value: destAcct },
            { name: 'valor_transferencia', value: dataModal.modalConfLeft.desc },
            { name: 'resultado', value: 'Exitoso' },
            { name: 'costo_transaccion', value: dataModal.modalConfRight.desc },
            { name: 'canal', value: 'Banca Virtual' },
            { name: 'ip_cliente', value: this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.IP) }
        ];
        return parameters;
    }

    private buildParamsPay(dataModal: ModalConfirmation): ParameterTypeDto[] {
        const ref = dataModal.modalConfDetails.find((e) => {
            return e.detailTitle.startsWith('Referencia de');
        });
        const parameters: ParameterTypeDto[] = [
            { name: 'num_autorizacion', value: dataModal.modalConfHeader.authNumber },
            { name: 'fecha_hora', value: dataModal.modalConfHeader.dateTime },
            {
                name: 'cta_origen', value: dataModal.modalConfDetails.find((e) => {
                    return e.detailTitle.startsWith('Cuenta de ori');
                }).desc
            },
            { name: 'empresa_servicio', value: dataModal.modalConfSubHeader.desc[0] },
            { name: 'nombre_servicio', value: dataModal.modalConfSubHeader.subTitle },
            { name: 'ref_pago', value: (ref === null || ref === undefined) ? '' : ref.desc },
            { name: 'valor_pago', value: dataModal.modalConfLeft.desc.replace('$', '') },
            { name: 'resultado', value: 'Exitoso' },
            { name: 'costo_transaccion', value: dataModal.modalConfRight.desc.replace('$', '') },
            { name: 'canal', value: 'Banca Virtual' },
            { name: 'ip_cliente', value: this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.IP) }
        ];
        return parameters;
    }

    private buildMailBasic(template, subject, emails, parameters): NotificationEmail {
        this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.IdentificationType);
        const bodyMailRq: NotificationEmail = {
            template,
            subject,
            eMails: this.getListEmails(emails),
            parameter: parameters
        };
        return bodyMailRq;
    }

    private getListEmails(emails: any[]) {
        emails = emails.filter(m => m.isValid);
        const em = emails.map(e => this.bdbRsaProvider.encrypt(e.title));
        return em;
    }

    public sendEmails(emails: NotificationEmail): Observable<any> {
        return this.bdbHttpClient.post<any>('notification/email', emails, ENV.API_URL)
            .catch((err: HttpErrorResponse) => {
                if (err.status === 200) {
                    const res = new HttpResponse({
                        body: null,
                        headers: err.headers,
                        status: err.status,
                        statusText: err.statusText,
                        url: err.url
                    });

                    return Observable.of(res);
                } else {
                    return Observable.throw(err);
                }
            });
    }
}
