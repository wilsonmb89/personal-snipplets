import { Injectable } from '@angular/core';
import { PulseToastOptions } from '@app/shared/components/pulse-toast/model/generic-toast.model';
import { CreditCardSetPinRq } from '../../../core/services-apis/customer-security/models/set-pin.model';
import { CustomerSecurityService } from '@app/apis/customer-security/customer-security.service';
import { Observable } from 'rxjs/Observable';
import { BdBGenericResponse } from '../../../core/models/generic-rs.model';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { NavController } from 'ionic-angular';

@Injectable()
export class CreditCardService {
    public readonly plasticValidator = {
        g: 'gold',
        p: 'platinum',
        i: 'infinite',
        b: 'black'
    };

    public readonly benefits = {
        first: {
            title: 'Beneficios',
            subtitle: 'Cuentas con asistencia médica para vehículo, hogar y viajes.'
        },
        second: {
            title: 'Flexibilidad',
            subtitle: 'Cambia los plazos de pago de tus compras.'
        },
        third: {
            title: 'Administración',
            subtitle: 'Bloquea y desbloquea tus tarjetas cuando lo necesites.'
        }
    };

    constructor(
        private customerSecurityService: CustomerSecurityService
    ) { }

    public correctLength = (key: any[]) => (key.length === 4 ? true : false);

    public checkEqualKey = (key: any[]) => {
        let numEqual = 0;
        for (let i = 0; i < key.length - 1; i++) {
            if (key[i] === key[i + 1]) { numEqual++; }
        }
        return numEqual === 3 ? true : false;
    }

    public checkConsecutiveKey = (key: any[]) => {
        key = key.map(number => Number(number));
        let allConsecutive = 0;
        for (let i = 0; i < key.length - 1; i++) {
            if (key[i] + 1 === key[i + 1]) { allConsecutive++; }
        }
        let doubleConsecutive = 0;
        for (let i = 0; i < key.length - 1; i++) {
            if (key[i] + 1 === key[i + 1]) { doubleConsecutive++; }
            i++;
        }
        return allConsecutive === 3 ? true : false ||
            doubleConsecutive === 2 ? true : false;
    }

    public IsEqualKey = (key: string, confirmKey: string) => {
        return key === confirmKey ? true : false;
    }

    public buildToastOptions(text: string): PulseToastOptions {
        const toastOptions: PulseToastOptions = {
            text: text,
            closeable: true,
            color: 'success',
            colorvariant: '100',
            image: 'assets/imgs/pulse-toast/info-alert.svg'
        };
        return toastOptions;
    }

    public setCreditCardPin(cardId, pin): Observable<BdBGenericResponse> {
        const body = {
            cardId,
            keyToAssign: pin,
            cardType: 'Credit'
        } as CreditCardSetPinRq;
        return this.customerSecurityService.setCardPin(body);
    }

    public buildModalErrorData(navCtrl: NavController, modalInfo: any): GenericModalModel {
        return {
            icon: {
              src: 'assets/imgs/generic-modal/icon-error-acct.svg',
              alt: 'error'
            },
            modalTitle: 'Algo ha sucedido',
            modalInfoData: `<span>${modalInfo.infoData}</span>`,
            actionButtons: [
              {
                id: 'generic-btn-key-error',
                buttonText: 'Entendido',
                block: true,
                colorgradient: true,
                action: () => {
                  navCtrl.push(modalInfo.navCtrlRedirect);
                }
              }
            ],
            hideCloseButton: true
          } as GenericModalModel;
    }
}
