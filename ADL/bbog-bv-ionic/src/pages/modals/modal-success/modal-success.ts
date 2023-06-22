import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalSuccess } from '../../../app/models/modal-success';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';

@IonicPage({
  name: 'modal%success',
  segment: 'modal%success'
})
@Component({
  selector: 'page-modal-success',
  templateUrl: 'modal-success.html',
})
export class ModalSuccessPage {

  dataModal: ModalSuccess;
  @ViewChild('contentTop') topRef: ElementRef;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private el: ElementRef,
    private renderer: Renderer2,
    private bdbPlatforms: BdbPlatformsProvider
  ) {
    this.dataModal = navParams.get('dataModal');
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

  btnFooterAction() {
    this.viewCtrl.dismiss();
  }

}
