import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthenticatorProvider } from '../../../providers/authenticator/authenticator';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { ProductsBalancesProvider } from '../../../providers/products-balances/products-balances';

@IonicPage()
@Component({
  selector: 'page-authenticator',
  templateUrl: 'authenticator.html',
})
// TO DO: Borrar clase
export class AuthenticatorPage implements OnInit {

  uuid: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private authenticatorProvider: AuthenticatorProvider,
    private loadingCtrl: LoadingController,
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private alertCtrl: AlertController,
    private getProductsBalancesProvider: ProductsBalancesProvider) {
  }

  ngOnInit() {
    this.getAuth();
  }

  getAuth() {
    const loading = this.loadingCtrl.create();
    let url = '';
    if (window.location.href.split('?').length > 1) {
      url = window.location.href.split('?')[1];
      const par = url.split('=');
      if (par[0] && par[1]) {
        loading.present().then(() => {
          this.authenticatorProvider.getAuthentication(par[1])
            .subscribe(response => {
              if (response.isValid && !response.isBlocked) {
                // TODO new response doesnt have identification
                this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.IdentificationType, response.identificationType);
                this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.IdentificationNumber, response.identificationNumber);
                this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.AccessToken, response.accessToken);

                this.getProductsBalancesProvider.getProductsRedirectRecharge(this.navCtrl);
                // this.navCtrl.push('AuthenticationHandlerPage');
                loading.dismiss();
              } else {
                loading.dismiss();
                this.showAlert('Usuario no encontrado', 'Intente autenticarse de nuevo', '');
              }
            }, error => {
              this.showAlert('Error', 'Error al intentar autenticar', error);
            });
        });
      }
    } else {
      this.showAlert('Error', 'Faltan parametros', '');
    }
  }

  showAlert(title: string, subtitle: string, error: string) {
    const alert = this.alertCtrl.create({
      title,
      subTitle: `${subtitle} ${error}`,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }
}


