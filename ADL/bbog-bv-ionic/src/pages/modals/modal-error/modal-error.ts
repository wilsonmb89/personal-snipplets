import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';

@IonicPage()
@Component({
  selector: 'page-modal-error',
  templateUrl: 'modal-error.html',
})
export class ModalErrorPage {

  title: string;
  message: string;
  modalType: string;
  msgButton: string;
  auxButton: string;
  positionText = 'center';
  @ViewChild('contentTop') topRef: ElementRef;

  constructor(
    public view: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private event: Events,
    public viewCtrl: ViewController,
    private el: ElementRef,
    private renderer: Renderer2,
    private bdbPlatforms: BdbPlatformsProvider
  ) {
    this.positionText = (navParams.get('positionText') === null ||  navParams.get('positionText') === undefined )
    ? 'center'
    : navParams.get('positionText');
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

  ionViewWillLoad() {
    this.title = this.navParams.get('title');
    this.message = this.navParams.get('message');
    this.modalType = this.navParams.get('modalType');
    this.msgButton = this.navParams.get('msgButton');
    this.auxButton = this.navParams.get('auxButton');
  }

  mainClick() {
    this.view.dismiss(this.msgButton);
  }

  auxClick() {
    this.view.dismiss(this.auxButton);
  }

}
