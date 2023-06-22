import { Component, ComponentFactoryResolver, Input, OnInit, ViewContainerRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TokenOtpProvider } from '../../../../../providers/token-otp/token-otp/token-otp';
import { CardOptionModel } from './model/card-option.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';

@Component({
  selector: 'card-option',
  templateUrl: './card-option.html'
})
export class CardOptionComponent implements OnInit {

  @Input() cardOptionData: CardOptionModel;

  constructor(
    private navCtrl: NavController,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private tokenOtp: TokenOtpProvider,
    private genericModalService: GenericModalService,
  ) {}

  ngOnInit() {}

  public navigationTo(): void {
    try {
      if (!!this.cardOptionData.allowedOTPService) {
        this.tokenOtp.requestToken(
          this.viewRef,
          this.resolver,
          () => {
            this.navCtrl.push(this.cardOptionData.navigationPath);
          },
          this.cardOptionData.allowedOTPService);
      } else {
        this.navCtrl.push(this.cardOptionData.navigationPath);
      }
    } catch (err) {
      this.launchErrorModal();
    }
  }

  private launchErrorModal(): void {
    const genericModalData: GenericModalModel = {
      icon: {
        src: 'assets/imgs/generic-modal/icon-error-acct.svg',
        alt: 'error'
      },
      modalTitle: 'Algo ha sucedido',
      modalInfoData: `<span>Estamos teniendo inconvenientes pagando tu impuesto. Por favor, inténtalo más tarde.</span>`,
      actionButtons: [
        {
          id: 'generic-btn-action-1',
          buttonText: 'Entendido',
          block: true,
          colorgradient: true,
          action: () => {}
        }
      ]
    };
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

}
