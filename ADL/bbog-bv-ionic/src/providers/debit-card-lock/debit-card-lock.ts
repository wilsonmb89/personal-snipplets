import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BdbModalProvider } from '../../providers/bdb-modal/bdb-modal';
import { BdbHttpClient } from '../../providers/bdb-http-client/bdb-http-client';
import { ENV } from '@app/env';

@Injectable()
export class DebitCardLockProvider {

  constructor(
    public http: HttpClient,
    private bdbModal: BdbModalProvider,
    private bdbHttpClient: BdbHttpClient
  ) {
  }

  getReasonBlocking(): Array<any> {
    return [
      {
        key: '0',
        value: 'Congelar temporalmente',
        info: 'Congelarás temporalmente tu Tarjeta Débito. Para descongelarla debes comunicarte a la Servilínea.',
        refType: 'V'
      },
      {
        key: '1',
        value: 'Congelar por perdida o robo',
        info: 'Congelarás por completo tu Tarjeta Débito. Para obtener una nueva debes dirigirte a una oficina del Banco.',
        refType: 'R'
      }
    ];
  }

  changeGroup(index: any, group: FormGroup, callback: any, mobileCallBack: any) {
    return (option: any) => {

      if (option === '') {
        return;
      }

      const reasonBlocking = this.getItemReasonBlocking(option);

      this.bdbModal.launchErrModal(
        reasonBlocking.value,
        reasonBlocking.info,
        'Cancelar',
        (e) => {
          if (e === 'Bloquear') {

            const _params = {
              index,
              reasonBlocking: group.get('reasonBlocking').value
            };

            callback(_params).then(mobileCallBack);
          }

          group.controls.reasonBlocking.setValue('');
        },
        'Bloquear'
      );

    };
  }

  buildBlockCardRq(card: any, option: any) {
    const reasonBlocking: any = this.getItemReasonBlocking(option);
    const cardAccount: any = {
      accountId: card.cardNumber,
      accountType: card.acctType
    };

    return {
      cardAccount,
      refType: reasonBlocking.refType
    };
  }

  sendBlockCard(blockCardRq: any) {
    return this.bdbHttpClient.put<any>('card/block', blockCardRq, ENV.API_ADL_URL);
  }

  getItemReasonBlocking(option: any) {
    return this.getReasonBlocking().filter(e => e.key === option)[0];
  }

}
