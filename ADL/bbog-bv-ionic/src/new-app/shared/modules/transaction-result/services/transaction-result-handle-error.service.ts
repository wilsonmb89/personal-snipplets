import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { CallToAction, CustomerErrorActions } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';

@Injectable()
export class TransactionResultHandleErrorService {

  constructor(private microfrontendService: BdbMicrofrontendEventsService) {}

  private readonly REDIRECT_ONLY_MAP = {
    LIMITS: {
      text: 'Cambiar topes',
      path: '/settings/accounts',
      params: {},
      isMicrofrontend: true
    },
    DASHBOARD: {
      text: 'Volver a productos',
      path: 'DashboardPage',
      params: {}
    }
  };

  public getCallToActionsCallbacks(
    actions: CustomerErrorActions,
    navController: NavController
  ): CallToAction[] {
    const callToActions: CallToAction[] = [];
    if (!!actions) {
      Object.keys(actions).forEach((key: string) => {
        const value = actions[key];
        const newAction = this.translateAction(key, value, navController);
        if (!!newAction) {
          callToActions.push(newAction);
        }
      });
    }
    return callToActions;
  }

  private translateAction(action: string, value: string, navController: NavController): CallToAction {
    switch (action) {
      case 'redirectTo':
        const redirectActionProps = this.REDIRECT_ONLY_MAP[value] || this.REDIRECT_ONLY_MAP.DASHBOARD;
        const redirectAction = () => {
          if (redirectActionProps.isMicrofrontend) {
            this.microfrontendService.sendRouteEventToParentWindow(redirectActionProps.path);
            return navController.setRoot('DashboardPage', {});
          }
          navController.setRoot(redirectActionProps.path, redirectActionProps.params);
        };
        return { actionName: action, text: redirectActionProps.text, action: redirectAction };
      default:
        return null;
    }
  }
}

