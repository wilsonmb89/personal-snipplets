import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { NavigationProvider } from '../../../providers/navigation/navigation';
import { BdbConstants } from '../../../app/models/bdb-generics/bdb-constants';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { CustomerCard } from '../../../app/models/activation-cards/customer-cards-list-rs';
import { ActivationCardsProvider } from '../../../providers/activation-cards/activation-cards';

@IonicPage({
  name: 'activation-list-cards',
  segment: 'activation-list-cards'
})
@Component({
  selector: 'page-list-cards',
  templateUrl: 'list-cards.html',
})
export class ListCardsPage {

  title: string;
  subtitle: string;
  abandonText: string;
  logoPath: string;
  listCards: Array<CustomerCard> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private navigation: NavigationProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private events: Events,
    private activationCards: ActivationCardsProvider
  ) {
    this.title = 'Activación de Tarjetas';
    this.subtitle = 'Selecciona la tarjeta de deseas activar';
    this.abandonText = 'Cancelar';
    this.logoPath = BdbConstants.BBOG_LOGO_WHITE;
  }

  buildListCard() {
    const dataCache = this.bdbInMemory.getItemByKey(InMemoryKeys.ListCardsActivate);
    if (dataCache) {
      this.listCards = dataCache.map((e: CustomerCard) => {
        e.nameCard =  (e.cardType === 'DEB') ? 'Tarjeta Débito' : '' ;
        return e;
      });
    }
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.events.publish('header:title', this.title);
    this.buildListCard();
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  selectCard(card: CustomerCard) {
    this.bdbInMemory.setItemByKey(InMemoryKeys.ActivationCard, card);
    this.bdbInMemory.setItemByKey(InMemoryKeys.ValidateNumberCard, card.lastDigits);
    this.navCtrl.push('debit-card-number');
  }

}
