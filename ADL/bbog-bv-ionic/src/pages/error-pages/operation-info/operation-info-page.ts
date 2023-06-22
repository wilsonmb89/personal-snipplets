import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';

import { PageTrack } from '../../../app/core/decorators/AnalyticTrack';
import { OperationInfoDto } from './OperationInfoDto';
import { SessionProvider } from '../../../providers/authenticator/session';


@PageTrack({ title: 'operation-info-page' })
@IonicPage()
@Component({
  selector: 'operation-info-page',
  templateUrl: 'operation-info-page.html'
})
export class OperationInfoPage {

  public infoData: OperationInfoDto;

  private monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  constructor(
    private navParams: NavParams,
    public navCtrl: NavController
  ) {
    this.infoData = navParams.get('data') as OperationInfoDto;
    if (!(!!this.infoData)) {
      this.navCtrl.push('DashboardPage');
    }
  }

  public onLogout(): void {
    this.navCtrl.push('authentication/logout');
  }

  public formatDate(dateTime: number): string {
    const date = new Date(dateTime);
    return `${date.getDate()} ${this.monthNames[date.getMonth()]} ${date.getFullYear()} - ${this.formatAMPM(date)}`;
  }

  private formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ampm;
  }

  public numberWithCommas(x): string {
    return `$${x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}`;
  }

}
