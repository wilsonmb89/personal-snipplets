import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { CustomerCardsListRs, CustomerCard } from '../../app/models/activation-cards/customer-cards-list-rs';
import { ActivateDebitRq } from '../../app/models/activation-cards/activate-debit-rq';
import { LoadingController } from 'ionic-angular';
import { Customer } from '../../app/models/bdb-generics/customer';
import { PinProvider } from '../authenticator/pin';
import { BdbModalProvider } from '../bdb-modal/bdb-modal';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { ENV } from '@app/env';
import { IdType } from '../../providers/bdb-utils/id-type.enum';
import { EncryptionIdType } from '../../providers/bdb-utils/encryption-id.enum';

@Injectable()
export class ActivationCardsProvider {

  constructor(
    public http: HttpClient,
    private bdbUtils: BdbUtilsProvider,
    public bdbHttpClient: BdbHttpClient,
    private loadingCtrl: LoadingController,
    private pinProvider: PinProvider,
    private bdbModal: BdbModalProvider,
    private bdbInMemory: BdbInMemoryProvider
  ) {
  }

  getInactiveCardsAndCustInfo(): Observable<CustomerCardsListRs> {
    const rq = {
      clientIp: this.bdbInMemory.getItemByKey(InMemoryKeys.IP)
    };
    return this.bdbHttpClient.post<CustomerCardsListRs>('ath/customer/cardsandinfo', rq);
  }

  activateDebit(activateDebitRq: ActivateDebitRq): Observable<any> {
    return this.bdbHttpClient.post<any>('mgmt/card/debit/activate', activateDebitRq);
  }

  mapDataSecure(card: CustomerCard, callback: any) {
    const load = this.loadingCtrl.create();
    load.present().then(() => {
      const customer: Customer = this.bdbUtils.getCustomer(IdType.BUS_BDB, EncryptionIdType.NONE);
      this.pinProvider.getDataSecure(
        customer.identificationType,
        customer.identificationNumber
      ).subscribe(
        (data: any) => {
          load.dismiss();
          if (!data.mobile || data.mobile === '') {
            this.bdbModal.launchErrModal('Error',
              'Actualiza tus datos a través de la Servilínea o en una de nuestras oficina e intenta de nuevo.',
              'Aceptar',
              () => {

              });
          } else {
            this.bdbInMemory.setItemByKey(InMemoryKeys.ActivationCard, card);
            this.bdbInMemory.setItemByKey(InMemoryKeys.ValidateNumberCard, card.lastDigits);
            this.bdbInMemory.setItemByKey(InMemoryKeys.ObfuscatedNumber, data.mobile);
            callback();
          }
        },
        (err) => {
          load.dismiss();
          if (ENV.STAGE_NAME === 'dev') {
            this.bdbInMemory.setItemByKey(InMemoryKeys.ActivationCard, card);
            this.bdbInMemory.setItemByKey(InMemoryKeys.ValidateNumberCard, card.lastDigits);
            this.bdbInMemory.setItemByKey(InMemoryKeys.ObfuscatedNumber, '1234');
            callback();
          } else {
            this.bdbModal.launchErrModal(
              'Error',
              'Error al consultar la información. Intente de nuevo',
              'Aceptar'
            );
          }
        }
      );
    });

  }

}
