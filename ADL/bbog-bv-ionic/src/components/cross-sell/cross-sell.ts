import { Component, Input } from '@angular/core';
import { CsMainModel } from './model/cs-main-model';
import { CrossSellProvider } from './provider/cross-sell';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'cross-sell',
  templateUrl: 'cross-sell.html'
})
export class CrossSellComponent {

  @Input() mosaicList: Array<CsMainModel> = [];
  @Input() mainCard: CsMainModel = new CsMainModel();
  @Input() approvedCard: any;

  crossTitle: string;

  constructor(
    private navCtrl: NavController,
    private crossSell: CrossSellProvider
  ) {
    this.crossTitle = 'Solicita nuevos productos aquí';
  }


  onItemClicked(event: CsMainModel) {
    this.crossSell.handleDispatcher(event, this.navCtrl);
  }

}
