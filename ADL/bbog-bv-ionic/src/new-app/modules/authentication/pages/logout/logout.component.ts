import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {AuthFacade} from '@app/modules/authentication/store/facades/auth.facade';

@IonicPage({
  name: 'authentication/logout',
  segment: 'authentication/logout'
})
@Component({
  selector: 'bdb-authentication-logout',
  template: ''
})
export class BdbAuthenticationLogoutComponent {
  constructor(private authenticationFacade: AuthFacade) {}

  ionViewDidEnter() {
    this.authenticationFacade.doLogout();
  }
}
