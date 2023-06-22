import { Component, HostListener } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';

interface InfoPage {
  image: string;
  title1: string;
  text1: string;
  title2: string;
  text2: string;
  icon2: string;
  title3: string;
  text3: string;
}

@IonicPage()
@Component({
  selector: 'enrolled-page',
  templateUrl: 'enrolled.html'
})
export class EnrolledPage {

  public infoPage: InfoPage;


  constructor(private events: Events,
              public navCtrl: NavController,
              public navParams: NavParams) {

    this.events.publish('srink', true);

    const cardType: 'unicef' | 'greenCard' = this.navParams.get('data');

    switch (cardType) {
      case 'unicef':

        this.infoPage = {
          image: 'assets/imgs/shared/cards-campaign-carousel/unicef/success-page/unicef-success.png',
          title1: 'Envío',
          text1: 'De 3 a 5 días hábiles te llegará tu Tarjeta Débito UNICEF.',
          title2: 'Ayuda a los niños',
          text2: 'Por cada uso de tu tarjeta, donarás el 1% del valor de la compra.',
          icon2: 'party-balloons',
          title3: 'Sin cobros',
          text3: 'Esta tarjeta no genera cobros adicionales en tu cuenta.'

        };
        break;
      case 'greenCard':
        this.infoPage = {
          image: 'assets/imgs/shared/cards-campaign-carousel/green-card/success-page/green-card-success.png',
          title1: 'Envío',
          text1: 'De 3 a 5 días hábiles te llegará tu Tarjeta Débito AMAZONÍA.',
          title2: 'Ayuda al Amazonas',
          text2: ' Por cada uso de tu tarjeta, donarás el 1% del valor de la compra.',
          icon2: 'ecology-plant-hand',
          title3: 'Sin cobros',
          text3: 'Esta tarjeta no genera cobros adicionales en tu cuenta.'

        };
        break;
      default:
        this.navCtrl.push('DetailAndTxhistoryPage');
    }

  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    event.preventDefault();
    this.navCtrl.push('DetailAndTxhistoryPage');
  }

  public finishButton(): void {
    this.navCtrl.push('DetailAndTxhistoryPage');
  }

}
