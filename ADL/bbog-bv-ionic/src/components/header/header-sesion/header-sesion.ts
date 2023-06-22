import { Component } from '@angular/core';
import {App} from 'ionic-angular';
import {BdbMicrofrontendEventsService} from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';
import { Observable } from 'rxjs/Observable';
import { UserFeaturesDelegateService } from '../../../new-app/core/services-delegate/user-features/user-features-delegate.service';

@Component({
  selector: 'header-sesion',
  templateUrl: 'header-sesion.html'
})
export class HeaderSesionComponent {

  text: string;
  isHelpCenterActive$: Observable<boolean>;

  constructor(
    private appCtrl: App,
    private bdbMicrofrontendEventsService: BdbMicrofrontendEventsService,
    private userFeaturesService: UserFeaturesDelegateService
  ) {
    this.isHelpCenterActive$ = this.userFeaturesService.isAllowedServiceFor('helpCenter');
  }

  logout() {
    this.appCtrl.getRootNav().push('authentication/logout');
  }

  help() {
    this.bdbMicrofrontendEventsService.sendRouteEventToParentWindow('/ayuda');
  }

}
