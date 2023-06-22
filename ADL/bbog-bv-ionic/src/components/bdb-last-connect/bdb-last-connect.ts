import { Component } from '@angular/core';
import { UserFacade } from '../../new-app/shared/store/user/facades/user.facade';
import { Observable } from 'rxjs/Observable';
import { LastLoginRs } from '../../new-app/core/services-apis/identity-validation/models/last-login.model';
/**
 * Generated class for the BdbGenericInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bdb-last-connect',
  templateUrl: 'bdb-last-connect.html'
})
export class BdbUserLastConnectComponent {

  lastLogin$: Observable<LastLoginRs>;

  constructor(private userFacade: UserFacade) {
    this.lastLogin$ = this.userFacade.lastLogin$;
  }

}
