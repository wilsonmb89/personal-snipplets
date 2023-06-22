import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/* providers */
import { AuthCredentialsProvider } from '../../../providers/auth-credentials/auth-credentials';
import { ProductsBalancesProvider } from '../../../providers/products-balances/products-balances';
import { NavigationProvider } from '../../../providers/navigation/navigation';

@IonicPage({
  segment: 'authenticator-handler'
})
@Component({
  selector: 'page-authentication-handler',
  templateUrl: 'authentication-handler.html',
})
// TO DO Delete this class ?
export class AuthenticationHandlerPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authCredentialsProvider: AuthCredentialsProvider,
    private navigation: NavigationProvider,
    private getProductsBalancesProvider: ProductsBalancesProvider
  ) {

    if (!this.navParams.get('mobile')) {
      this.authCredentialsProvider.getAuthentication();
    }
    navCtrl.setRoot('MasterPage');
  }

}
