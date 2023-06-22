import { Injectable } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { BdbPlatformsProvider } from '../bdb-platforms/bdb-platforms';

@Injectable()
export class NavigationProvider {

  constructor(
    public bdbPlatforms: BdbPlatformsProvider,
    public modalCtrl: ModalController
  ) { }

  abandonTransaction(navCtrl: NavController) {
    navCtrl.popToRoot({
      animate: true,
      animation: 'ios-transition',
      direction: 'back'
    });
  }

  /**
   * this method takes a navcontroller and handles the on back navigation of the app
   * @param navCtrl nav controller to navigate if no page available to back, redirect to DashboardPage
   */
  onBackPressed(navCtrl: NavController) {
    if (navCtrl.canGoBack()) {
      navCtrl.pop();
    } else {
      navCtrl.setRoot('DashboardPage');
    }
  }
  /**
   * this method handles the abandon button navigation of the app
   * @param navCtrl nav controller to navigate, if no page available to back redirect to DashboardPage
   */
  onAbandonPressed(navCtrl: NavController) {
    if (navCtrl.canGoBack()) {
      navCtrl.pop();
    } else {
      navCtrl.setRoot('DashboardPage');
    }
  }

  public onBackPressedCustPage(navCtrl: NavController, page?: string, tab?: string): void {
    if (navCtrl.canGoBack()) {
      navCtrl.pop({
        animate: true,
        animation: 'ios-transition',
        direction: 'back'
      });
    } else {
      const defaultPage = 'DashboardPage';
      const pageNav = page || defaultPage;
      try {
        if (pageNav !== defaultPage) {
          if (!!tab) {
            navCtrl.setRoot(pageNav, { 'tab': tab });
          } else {
            navCtrl.setRoot(pageNav);
          }
        } else {
          navCtrl.setRoot(defaultPage);
        }
      } catch (error) {
        navCtrl.setRoot(defaultPage);
      }
    }
  }
}
