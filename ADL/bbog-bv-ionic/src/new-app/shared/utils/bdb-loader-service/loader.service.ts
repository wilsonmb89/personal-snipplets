import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class BdbLoaderService {
    // TODO: Generate new loader to replace ionic loading controller.
    private loading: any;
    constructor(private loadingCtrl: LoadingController) {}

    public show(): void {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
    }

  public hide(): void {
    if (!!this.loading) {
      this.loading.dismiss();
    }

  }
}
