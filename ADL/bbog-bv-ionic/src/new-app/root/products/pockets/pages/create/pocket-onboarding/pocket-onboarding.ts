import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { take } from 'rxjs/operators';

import { UserFacade } from '../../../../../../../new-app/shared/store/user/facades/user.facade';

@IonicPage()
@Component({
  selector: 'page-pocket-onboarding',
  templateUrl: 'pocket-onboarding.html',
})
export class PocketOnboardingPage {

  data = [];
  viewBtnLast = true;

  showButton = false;

  private step1 = {
    mainTitle: '¡Crea hasta <b>5 alcancías</b>!',
    description: 'Selecciona tus metas más importantes y créales una alcancía para lograrlas.',
    imageUrl: 'assets/imgs/pocket/onboarding01.svg'
  };

  private step2 = {
    mainTitle: 'Controla <b>tu dinero y tu meta</b>',
    description: 'Que tus ahorros no se vuelvan plata de bolsillo, cuando los necesites pásalos a tu Cuenta de Ahorros.',
    imageUrl: 'assets/imgs/pocket/onboarding02.svg'
  };

  private step3 = {
    mainTitle: '<b>Sigue tu meta</b> paso a paso',
    description: 'En cualquier momento podrás ver cuanto has ahorrado y cuanto te falta ¡No pierdas el foco!',
    imageUrl: 'assets/imgs/pocket/onboarding03.svg'
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public events: Events,
    private userFacade: UserFacade
  ) {
    this.data = this.getData();
  }

  ionViewDidLoad() {
    this.events.publish('srink', true);
  }

  public isShowButton(event): void {
    this.showButton = event.detail;
  }

  public closeModal(): void {
    this.viewCtrl.dismiss();
  }

  public checkOnBoarding(): void {
    this.userFacade.userFeatures$
    .pipe(take(1))
    .subscribe(userFeatures => {
      userFeatures.settings.onBoarding.pockets = true;
      this.userFacade.updateUserFeaturesData(userFeatures);
      this.navCtrl.push('PocketGoalPage');
    });

  }

  public getData(): any[] {
    this.data.push(this.step1);
    this.data.push(this.step2);
    this.data.push(this.step3);
    return this.data;
  }

  public onCancel(): void {
    this.navCtrl.push('PocketGoalPage');
  }

}
