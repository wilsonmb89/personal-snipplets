import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PulseModalControllerProvider} from '../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import {BdbCardDetailModel} from '../../../../../components/core/molecules/bdb-card-detail';
import {BdbStorageService} from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import {InMemoryKeys} from '../../../../../providers/storage/in-memory.keys';
import {UserFacade} from '@app/shared/store/user/facades/user.facade';
import {Observable} from 'rxjs/Observable';
import {BasicDataRs} from '@app/apis/customer-basic-data/models/getBasicData.model';
import {PulseToastService} from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import {PulseToastOptions} from '@app/shared/components/pulse-toast/model/generic-toast.model';
import {BdbConstants} from '../../../../../app/models/bdb-generics/bdb-constants';
import {getValueDocumentTypeAsLoginForm} from '@app/shared/utils/bdb-constants/constants';



@Component({
  selector: 'account-clipboard',
  templateUrl: 'account-clipboard.html'
})
export class ModalAccountClipboardComponent implements OnInit {

  @Input() accountData: BdbCardDetailModel;
  customerName: string;
  customerIdentification: string;
  customerBasicData: Observable<BasicDataRs>;
  pName: string;
  accountNumber: string;
  showFullName = true;

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
    private bdbStorageService: BdbStorageService,
    private userFacade: UserFacade,
    private pulseToastService: PulseToastService,
  ) {
  }
  ngOnInit(): void {
    this.customerIdentification = getValueDocumentTypeAsLoginForm(this.bdbStorageService.getItemByKey(InMemoryKeys.IdentificationType))
    + ' ' + this.bdbStorageService.getItemByKey(InMemoryKeys.IdentificationNumber).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    this.customerBasicData = this.userFacade.basicData$;
    this.pName = this.accountData.product.productDetailApi.productBankType === BdbConstants.SAVINGS_ACCOUNT ? 'Ahorros' : 'Corriente';
    this.accountNumber = this.accountData.product.productDetailApi.productNumber.substring(1);
    this.validateName();
  }

  async closeModal() {
    await this.pulseModalCtrl.dismiss();
  }


  private async copyAccountInfo(): Promise<void> {
    try {
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      const accountInfo = document.getElementById('accountInfo').textContent;
        const info = this.mapIdType(accountInfo)
          .replace(/^\s*\n/gm, '')
          .replace(/\./g, '')
          .replace(/^[^\S\r\n]+|[^\S\r\n]+$/gm, '');
        textarea.value = info;
        textarea.select();
        document.execCommand('copy');
        if (textarea && textarea.parentNode) {
          textarea.parentNode.removeChild(textarea);
        }
        await this.pulseToastService.create(this.buildToastOptions(1));
    } catch (err) {
      await this.pulseToastService.create(this.buildToastOptions(2));
    }
    await this.closeModal();
  }

  private buildToastOptions(result: ToastState): PulseToastOptions {
    const toastOptions: PulseToastOptions = {
      text: result === 1 ? 'Datos copiados. Pégalos en donde lo necesites.' : 'No se pudieron copiar los datos. Vuélvelo a intentar.',
      closeable: true,
      color: result === 1 ? 'success' : 'error',
      colorvariant: '100',
      image: result === 1 ? 'assets/imgs/pulse-toast/clipboard_share.svg' : 'assets/imgs/pulse-toast/info-alert.svg'
    };
    return toastOptions;
  }

  public validateName(): void {
    this.customerBasicData.subscribe(res => {
     if (!!res) {
       this.showFullName = !(res.firstName === '' && res.lastName === '');
     }
    });
  }

  private mapIdType(idTypeDesc: string): string {
   this.getListAsLoginForm().forEach( n => {
    idTypeDesc = idTypeDesc.replace(n.value, n.name);
   } );
   return idTypeDesc;
  }

  private getListAsLoginForm(): { name: string, value: string }[] {
    return [
      { name: 'Cédula de ciudadanía', value: 'C.C.' },
      { name: 'Tarjeta de Identidad', value: 'T.I.' },
      { name: 'Cédula de Extranjería', value: 'C.E.' },
      { name: 'NIT Persona Natural', value: 'N.P.N.' },
      { name: 'NIT Persona Extranjera', value: 'N.P.E.' },
      { name: 'NIT Persona Jurídica', value: 'N.P.J.' },
      { name: 'Pasaporte', value: 'P.S.' },
      { name: 'Registro Civil', value: 'R.C.' }
    ];
  }

}

enum ToastState {
  success = 1,
  error
}
