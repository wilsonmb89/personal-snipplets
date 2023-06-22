import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';

@IonicPage()
@Component({
  selector: 'page-modal-info',
  templateUrl: 'modal-info.html',
})
export class ModalInfoPage {
  @ViewChild('contentTop') topRef: ElementRef;

  title: string;
  message: string;
  msgButton: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    public view: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private event: Events,
    private bdbPlatforms: BdbPlatformsProvider
  ) {
    this.title = navParams.get('title');
    this.message = navParams.get('message');
    this.msgButton = navParams.get('msgButton');
  }

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

  mainClick() {
    this.view.dismiss(this.msgButton);
  }

}
