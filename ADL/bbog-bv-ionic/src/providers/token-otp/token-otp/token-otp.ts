import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { PulseModalControllerProvider } from '../../../providers/pulse-modal-controller/pulse-modal-controller';
import { ValidateTokenComponent } from '../../../components/token-otp/validate-token/validate-token';
import { ValidateOtpComponent } from '../../../components/token-otp/validate-otp/validate-otp';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { BdbOtpProvider } from '../../../providers/bdb-otp-provider/bdb-otp-provider';
import { LoadingController } from 'ionic-angular';
import { toggleAllowedOTPMapperType } from '../../../new-app/core/services-delegate/user-features/user-features-delegate.service';

@Injectable()
export class TokenOtpProvider {

  private viewRef: ViewContainerRef;
  private resolver: ComponentFactoryResolver;

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private bdbOtpProvider: BdbOtpProvider,
    private loadingCtrl: LoadingController
  ) { }

  public requestToken(
    viewRef: ViewContainerRef,
    resolver: ComponentFactoryResolver,
    callback: () => void,
    userFeaturesOrigin?: toggleAllowedOTPMapperType,
    close?: () => void
  ): void {

    this.viewRef = viewRef;
    this.resolver = resolver;

    if (!close) {
      close = () => { };
    }

    if (this.userHasToken()) {
      this.launchTokenModal(
        'input',
        callback,
        userFeaturesOrigin,
        close
      );
    } else {
      this.validateOtpDataToOpenModal(
        callback,
        userFeaturesOrigin,
        close
      );
    }
  }

  public userHasToken(): boolean {
    return this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.HasToken);
  }

  public async launchTokenModal(
    stepToken: string,
    callback?: () => void,
    userFeaturesOrign?: toggleAllowedOTPMapperType,
    close?: () => void
  ): Promise<void> {
    const modal = await this.pulseModalCtrl.create({
      component: ValidateTokenComponent,
      componentProps: {
        stepToken: stepToken,
        userFeaturesOrign
      }
    }, this.viewRef, this.resolver);

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (!!data) {
      if (!!data.validate) {
        callback();
      } else if (!!data.toOTP) {
        this.launchOtpModal(
          callback,
          userFeaturesOrign,
          close
        );
      }
    } else {
      close();
    }
  }

  private async launchOtpModal(
    callback?: () => void,
    userFeaturesOrigin?: toggleAllowedOTPMapperType,
    close?: () => void
  ): Promise<void> {

    const modal = await this.pulseModalCtrl.create({
      component: ValidateOtpComponent,
      componentProps: {
        userFeaturesOrigin: userFeaturesOrigin
      }
    }, this.viewRef, this.resolver);

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (!!data && !!data.validate) {
      callback();
    } else {
      close();
    }
  }

  private validateOtpDataToOpenModal(
    callback?: () => void,
    userFeaturesOrign?: toggleAllowedOTPMapperType,
    close?: () => void
  ): void {
    const loading = this.loadingCtrl.create();
    loading.present().then(async () => {
      const validateUserPhoneNumber = await this.bdbOtpProvider.validateOtpData(userFeaturesOrign);
      if (validateUserPhoneNumber) {
        loading.dismiss();
        this.launchOtpModal(
          callback,
          userFeaturesOrign,
          close
        );
      } else {
        loading.dismiss();
        this.launchTokenModal('need', callback, userFeaturesOrign, close);
      }
    });
  }

}
