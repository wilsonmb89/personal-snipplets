import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { SessionProvider } from '../../../../../../providers/authenticator/session';
import { CustomerCard } from '../../../../../../app/models/activation-cards/customer-cards-list-rs';
import { CardsInfoFacade } from '@app/modules/settings/store/facades/cards-info.facade';
import { Observable } from 'rxjs/Observable';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { catchError, map, take } from 'rxjs/operators';
import {
    BandActionsTypes,
    DebitCardBandActivationDelegateService
} from '@app/delegate/customer-security-delegate/debit-card-band-activation-delegate.service';
import {
    PulseTooltipInfoData,
    TooltipInfoOptions
} from '@app/shared/utils/bdb-pulse-ops-services/models/tooltip-info-options.model';
import { TooltipInfoOpsProvider } from '@app/shared/utils/bdb-pulse-ops-services/tooltip-info-ops';
import { BdbLoaderService } from '@app/shared/utils/bdb-loader-service/loader.service';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import { PulseToastOptions } from '@app/shared/components/pulse-toast/model/generic-toast.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { TokenOtpProvider } from '../../../../../../providers/token-otp/token-otp/token-otp';
import { DebitCardBandInfo } from '@app/apis/customer-security/models/debitCardBandActivations.model';

interface ActivationCard {
    cardNumber: string;
    description: string;
    displayNumber: string;
    startDate: Date;
    endDate: Date;
    state: 'activated' | 'non-activated';
    isCurrentActive: boolean;
    isStateEdited: boolean;
    isDateEdited: boolean;
}

@IonicPage()
@Component({
    selector: 'activation-band-page',
    templateUrl: 'activation-band.html'
})
export class ActivationBandPage {

    public activationsSubs: ActivationCard[];
    public activationsTemp: ActivationCard[];
    public MAX_DATE;
    public NOW = new Date();


    constructor(
        private navCtrl: NavController,
        private sessionProvider: SessionProvider,
        private tooltipInfoOpsProvider: TooltipInfoOpsProvider,
        private userFacade: UserFacade,
        private cardsInfoFacade: CardsInfoFacade,
        private debitBandDelegate: DebitCardBandActivationDelegateService,
        private loader: BdbLoaderService,
        private pulseToastService: PulseToastService,
        private genericModalService: GenericModalService,
        private viewRef: ViewContainerRef,
        private resolver: ComponentFactoryResolver,
        private tokenOtpProvider: TokenOtpProvider,
    ) {

        this.MAX_DATE = new Date();
        this.MAX_DATE.setMonth(this.MAX_DATE.getMonth() + 6);
        this.cardsInfoFacade.fetchCardsInfo();
        this.find();
    }





    public onBackPage(): void {
        if (this.navCtrl.canGoBack()) {
            this.navCtrl.pop();
        } else {
            this.navCtrl.setRoot('DashboardPage');
        }
    }

    public logout(): void {
        this.navCtrl.push('authentication/logout');
    }

    public getCardLogo(description: string): 'visa' | 'master' {
        return description.toLowerCase().includes('visa') ? 'visa' : 'master';
    }

    public getTagText(activationCard: ActivationCard): string {
        if (!activationCard.startDate) {
            return '';
        }
        if (this.NOW.getDate() < activationCard.startDate.getDate()) {
            return `Programado ${activationCard.startDate.getDate()}
                    ${this.getMontName(activationCard.startDate.getMonth())}
                    ${activationCard.startDate.getFullYear()}`;
        }
        if (this.NOW.getDate() >= activationCard.startDate.getDate()) {
            return 'Uso en el exterior';
        }
        return '';
    }

    private getMontName(m: number): string {
        return ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][m];
    }

    public onRadioChange(e, activationCard: ActivationCard): void {
        activationCard.isStateEdited = !activationCard.isStateEdited;
        activationCard.state = e.target.value;
    }


    public isMobile(): boolean {
        return (window.innerWidth < 540);
    }


    public getDatesFromPicker(e, activationCard: ActivationCard): void {
        if (e.detail.length === 2) {
            activationCard.startDate = (!!e.detail[0]) ? e.detail[0] : activationCard.startDate;
            activationCard.endDate = (!!e.detail[1]) ? e.detail[1] : activationCard.endDate;
            activationCard.isDateEdited = true;
        }
    }

    public saveBtnAction(activationCard: ActivationCard): void {
        this.validateToken(() => {

            if (activationCard.state === 'non-activated') {
                this.delete(activationCard);
            } else {
                if (activationCard.isCurrentActive) {
                    this.upDate(activationCard);
                } else {
                    this.save(activationCard);
                }
            }
        });
    }


    private save(activationCard: ActivationCard) {
        this.loader.show();
        this.debitBandDelegate.actionActiveCard(BandActionsTypes.SAVE,
            activationCard.cardNumber,
            activationCard.startDate,
            activationCard.endDate
        ).subscribe((v) => {
            this.loader.hide();
            this.showSuccessToast();
            this.find();
        }, err => {
            this.loader.hide();
            this.launchErrorModal(BandActionsTypes.SAVE);
            this.find();
        });

    }


    private upDate(activationCard: ActivationCard) {
        this.loader.show();
        this.debitBandDelegate.actionActiveCard(BandActionsTypes.UPDATE,
            activationCard.cardNumber,
            activationCard.startDate,
            activationCard.endDate
        ).subscribe(async (v) => {
            this.loader.hide();
            this.showSuccessToast();
            this.find();
        }, err => {
            this.loader.hide();
            this.launchErrorModal(BandActionsTypes.UPDATE);
            this.find();
        });


    }

    private delete(activationCard: ActivationCard) {
        this.loader.show();
        this.debitBandDelegate.actionActiveCard(BandActionsTypes.DELETE,
            activationCard.cardNumber,
            new Date(),
            new Date()
        ).subscribe((res) => {
            this.loader.hide();
            this.showSuccessToast();
            this.find();
        }, (err) => {
            this.loader.hide();
            this.launchErrorModal(BandActionsTypes.DELETE);
            this.find();
        });
    }

    private find() {
        const DEFAULT_ID = '0000';
        this.loader.show();
        combineLatest(
            this.cardsInfoFacade.cardsInfoDebitN$,
            this.debitBandDelegate.actionActiveCard(BandActionsTypes.FIND, DEFAULT_ID, null, null)
        ).pipe(map(([customerCards, debitCardsBandInfo]: [CustomerCard[], DebitCardBandInfo[]]) => {

            const dataMapped = customerCards.map((customerCard): ActivationCard => {

                const cardNumber = customerCard.cardNumber;
                const cardBandInfo = debitCardsBandInfo
                    .find(cInfo => cInfo.accountId === cardNumber.slice(cardNumber.length - 4));


                return {
                    cardNumber: customerCard.cardNumber,
                    description: customerCard.description,
                    displayNumber: customerCard.displayNumber,
                    startDate: (!!cardBandInfo) ? this.setUtcDateValues(cardBandInfo.startActivationDate) : null,
                    endDate: (!!cardBandInfo) ? this.setUtcDateValues(cardBandInfo.endActivationDate) : null,
                    state: (!!cardBandInfo) ? 'activated' : 'non-activated',
                    isCurrentActive: !!cardBandInfo,
                    isStateEdited: false,
                    isDateEdited: false
                };

            });

            this.loader.hide();
            return dataMapped;

        }), catchError(err => {
            this.loader.hide();
            return [];
        }), take(1)).subscribe(value => {
            this.activationsSubs = value;
            this.activationsTemp = this.activationsSubs.map(e => ({...e}));
        });
    }
    private setUtcDateValues(dateString: string): Date {
        return new Date(dateString + 'T00:00:00');
    }


    private async showSuccessToast() {
        const optsToast: PulseToastOptions = {
            text: 'Cambio en tu tarjeta realizado con éxito.'
        };
        await this.pulseToastService.create(optsToast);
    }

    public showTooltip(htmlElement: HTMLElement, type: 'exterior' | 'colombia'): void {
        const tooltipInfo = new Array<PulseTooltipInfoData>();
        if (type === 'exterior') {
            tooltipInfo.push({
                title: 'Uso en el exterior:',
                description: 'Al seleccionar esta opción permitirá que pagues o retires dinero con el chip electrónico de tu tarjeta o con la banda magnética de la misma. Debemos contemplar cualquier posibilidad de datáfono o tecnología al país que viajas.\n' +
                    'Recuerda tener presente los tips de seguridad de tu tarjeta en cajeros y establecimientos.'
            });
        } else {
            tooltipInfo.push({
                title: 'Solo en Colombia:',
                description: 'Esta opción te permitirá usar tu tarjeta dentro del territorio colombiano para compras en establecimientos, oficinas y cajeros automáticos.'
            });
        }
        const tooltipOptions: TooltipInfoOptions = {
            content: tooltipInfo,
            htmlelementref: htmlElement,
            id: 'stf_tooltip_1',
            orientation: 'right-start',
            size: 's'
        };
        this.tooltipInfoOpsProvider.presentToolTip(tooltipOptions).subscribe();
    }

    private launchErrorModal(action: BandActionsTypes): void {
        const genericModalData: GenericModalModel = {
            icon: {
                src: 'assets/imgs/generic-modal/icon-error-acct.svg',
                alt: 'error'
            },
            modalTitle: 'Algo ha sucedido',
            modalInfoData: `<span>En estos momentos no se pudo hacer la modificación en tu tarjeta. Por favor inténtalo más tarde.</span>`,
            actionButtons: [
                {
                    id: 'generic-btn-action-1',
                    buttonText: 'Entendido',
                    block: true,
                    colorgradient: true,
                    action: () => {
                    }
                }
            ]
        };
        this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
    }


    private validateToken(callback): void {
        this.tokenOtpProvider.requestToken(
            this.viewRef,
            this.resolver,
            callback
        );
    }


    public isActiveContinueBtn(card: ActivationCard): boolean {
        if (card.state === 'activated') {
            return card.isDateEdited;
        } else {
            if (card.isStateEdited) {
                return true;
            }
        }
        return false;
    }

    public onItemClicked(event) {
        if (!event.detail) {
            this.activationsTemp = this.activationsSubs.map(e => ({...e}));
        }
    }

}
