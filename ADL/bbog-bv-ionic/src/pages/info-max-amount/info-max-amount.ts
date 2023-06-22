import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BdbPlatformsProvider } from '../../providers/bdb-platforms/bdb-platforms';

@IonicPage()
@Component({
  selector: 'page-info-max-amount',
  templateUrl: 'info-max-amount.html',
})
export class InfoMaxAmountPage {

  @ViewChild('contentTop') topRef: ElementRef;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private el: ElementRef,
    private renderer: Renderer2,
    private bdbPlatforms: BdbPlatformsProvider,
    public viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    const hostElem = this.el.nativeElement;
    const heightTop = this.topRef.nativeElement.scrollHeight;
    this.renderer.setStyle(hostElem.parentNode, 'height', `${heightTop + 46}px`);

    if (this.bdbPlatforms.isMobile()) {
      const deviceHeight = this.bdbPlatforms.getDeviceHeight();
      const modalWrapper = new ElementRef(hostElem.parentNode);
      const modalWrapperElem = modalWrapper.nativeElement;
      this.renderer.setStyle(modalWrapperElem.parentNode, 'padding-top', `${deviceHeight - modalWrapperElem.scrollHeight}px`);
    }
  }

  eventDismiss() {
    this.viewCtrl.dismiss();
  }

}
