import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Events, IonicPage, LoadingController, NavController } from 'ionic-angular';
import { ChangeKeysService } from '../../../services/change-keys.service';
import { FormChangePass } from '../../../models/change-keys.model';
import { SessionProvider } from '../../../../../../providers/authenticator/session';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { PulseToastOptions } from '@app/shared/components/pulse-toast/model/generic-toast.model';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
    ServiceApiErrorModalService
} from '@app/shared/components/modals/service-api-error-modal/provider/service-api-error-modal.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';

@IonicPage()
@Component({
    selector: 'page-form-secure-pass',
    templateUrl: 'form-secure-pass.html'
})
export class FormSecurePassPage implements OnInit {

    private genericModalErr: GenericModalModel = {
        icon: {
            src: 'assets/imgs/generic-modal/icon-error-acct.svg',
            alt: 'error'
        },
        mainActionInClose: false,
        modalTitle: 'Error al cambiar clave',
        modalInfoData: 'En estos momentos no podemos hacer el cambio de tu clave. Por favor inténtalo más tarde.',
        actionButtons: [
            {
                id: 'generic-btn-action-1',
                buttonText: 'Entendido',
                block: true,
                colorgradient: true,
                action: () => {
                    this.onBackPage();
                }
            }
        ]
    };

    private optsToastSuccess: PulseToastOptions = {
        text: 'Cambio de clave exitoso.'
    };

    constructor(
        public navCtrl: NavController,
        private events: Events,
        private changeKeysService: ChangeKeysService,
        private genericModalService: GenericModalService,
        private viewRef: ViewContainerRef,
        private resolver: ComponentFactoryResolver,
        private pulseToastService: PulseToastService,
        private loadingCtrl: LoadingController,
        private serviceApiErrorModalService: ServiceApiErrorModalService,
    ) { }

    ngOnInit(): void {
        this.events.publish('srink', true);
    }

    ionViewWillEnter(): void {
        this.events.publish('srink', true);
    }

    ionViewWillLeave(): void {
        this.events.publish('srink', false);
    }

    async changePass(value: FormChangePass): Promise<void> {

        const loader = this.loadingCtrl.create();
        await loader.present();

        this.changeKeysService.updatePassDebitCard(
            value
        ).subscribe(async () => {
            loader.dismiss();
            await this.pulseToastService.create(this.optsToastSuccess);
            this.onBackPage();
        }, err => {
            loader.dismiss();
            this.validateUpdatePassError(err);
        });
    }

    onBackPage(): void {
        if (this.navCtrl.canGoBack()) {
            this.navCtrl.pop();
        } else {
            this.navCtrl.setRoot('DashboardPage');
        }
    }

    logout(): void {
        this.navCtrl.push('authentication/logout');
    }

    private validateUpdatePassError(error: HttpErrorResponse): void {
        if (!!error && !!error.status && error.status === 409
                && !!error.error && !!error.error.businessErrorCode
                && error.error.businessErrorCode === '1740') {
            this.buildInvalidDataModal();
        } else {
            const errorData: ApiGatewayError = error.error ? error.error : null;
            this.serviceApiErrorModalService.launchErrorModal(
                this.viewRef,
                this.resolver,
                !!errorData ? errorData.customerErrorMessage : null
            );
        }
    }

    private buildInvalidDataModal() {
        const custGenericModalErr: GenericModalModel = JSON.parse(JSON.stringify(this.genericModalErr));
        custGenericModalErr.actionButtons[0].action = () => { this.onBackPage(); };
        custGenericModalErr.modalTitle = 'Error en los datos ingresados';
        custGenericModalErr.modalInfoData = 'Asegúrate de ingresar los datos correctos. Por favor vuelve a intentar.';
        custGenericModalErr.additionalModalData = {
            icon: { src: 'assets/imgs/shared/generic-modal/advice.svg', alt: 'alert' },
            additionalInfoData: `<span class='pulse-tp-bo3-comp-r'>Recuerda que tienes 3 intentos o
            tu tarjeta será bloqueada por 24 horas por seguridad.</span>`
        };
        this.genericModalService.launchGenericModal(
            this.viewRef, this.resolver, custGenericModalErr
        );
    }
}
