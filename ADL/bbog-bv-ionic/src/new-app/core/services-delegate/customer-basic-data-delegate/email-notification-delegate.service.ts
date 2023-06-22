import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CustomerBasicDataService } from '@app/apis/customer-basic-data/customer-basic-data.service';
import { SendEmailNotificationRq, SendEmailNotificationRs } from '@app/apis/customer-basic-data/models/sendEmailNotification.model';
import { TransactionTypes, TransactionResultModel } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';

@Injectable()
export class EmailNotificationDelegateService {
  constructor(
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private customerBasicDataService: CustomerBasicDataService,
    private datePipe: DatePipe
  ) {}

  public sendEmailNotification(transactionData: TransactionResultModel, emails: string[]): Observable<SendEmailNotificationRs> {
    const request = this.buildEmailNotificationRequest(transactionData, emails);
    return this.customerBasicDataService.sendEmailNotification(request);
  }

  private buildEmailNotificationRequest(transactionData: TransactionResultModel, emails: string[]): SendEmailNotificationRq {
    const request = {
      transactionType: transactionData.type,
      emailAddresses: emails,
      subject: transactionData.body.mailData.SUBJECT,
      parameter: this.buildParameters(transactionData),
    };

    return request;
  }

  private buildParameters({ header, body, type }: TransactionResultModel): { [key: string]: string } {
    const transactionDate = header.timestamp && header.timestamp.date ? header.timestamp.date : new Date();
    const defaultParameters = {
      num_autorizacion: header.voucherId,
      fecha_hora: this.datePipe.transform(transactionDate, 'd MMM y h:mm a'),
      resultado: 'Exitoso',
      canal: 'Banca Virtual',
      ip_cliente: this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.IP),
    };

    const isTransfer = TransactionTypes.DISINVESTMENT === type ||
      TransactionTypes.INVESTMENT === type ||
      TransactionTypes.RECHARGE === type ||
      TransactionTypes.TRANSFER === type ||
      TransactionTypes.PAYROLL_ADVANCE === type;

    if (isTransfer) {
      return {
        ...defaultParameters,
        cta_origen: body.originAcct,
        cta_destino: this.formatDestinationAccount(body.destination),
        valor_transferencia: body.amtInfo ? body.amtInfo.amt : null,
        costo_transaccion: body.transactionCost.replace('$', '')
      };
    } else if (type === TransactionTypes.CREDIT_CARD_ADVANCE) {
      return {
        ...defaultParameters,
        tc_origen: body.originAcct,
        cta_destino: this.formatDestinationAccount(body.destination),
        valor_transferencia: body.amtInfo ? body.amtInfo.amt : null,
        costo_canal: body.transactionCost.replace('$', '')
      };
    } else if (type === TransactionTypes.CREDISERVICE) {
      return {
        ...defaultParameters,
        credito_origen: body.originAcct,
        cta_destino: this.formatDestinationAccount(body.destination),
        valor_transferencia: body.amtInfo ? body.amtInfo.amt : null,
        costo_canal: body.transactionCost.replace('$', '')
      };
    } else if (type === TransactionTypes.DONATION) {
      return {
        ...defaultParameters,
        cta_origen: body.originAcct,
        empresa_servicio: body.destination.originName,
        valor_pago: body.amtInfo ? body.amtInfo.amt : null
      };
    } else if (type === TransactionTypes.LOAN_PAYMENT) {
      return {
        ...defaultParameters,
        cta_origen: body.originAcct,
        banco_destino: this.formatDestinationAccount(body.destination),
        nombre_obligacion: body.destination.type,
        num_obligacion: body.destination.originId,
        valor_pago: body.amtInfo ? body.amtInfo.amt : null,
        costo_transaccion: body.transactionCost.replace('$', '')
      };
    } else if (type === TransactionTypes.BILL_PAYMENT) {
      return {
        ...defaultParameters,
        cta_origen: body.originAcct,
        empresa_servicio: body.destination.originName,
        nombre_servicio: body.destination.type,
        ref_pago: body.destination.originId,
        valor_pago: body.amtInfo ? body.amtInfo.amt : null,
        costo_transaccion: body.transactionCost.replace('$', '')
      };
    }

    return null;
  }

  private formatDestinationAccount(destination): string {
    const destAcct = `${destination.type} ${destination.originName} ${destination.originId}`;
    return destAcct;
  }
}
