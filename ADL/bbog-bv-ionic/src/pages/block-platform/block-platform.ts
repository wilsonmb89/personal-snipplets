import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BdbPlatformsProvider } from '../../providers/bdb-platforms/bdb-platforms';
import { WebSocketSessionProvider } from '../../providers/web-socket-session/web-socket-session';

@IonicPage()
@Component({
  selector: 'page-block-platform',
  templateUrl: 'block-platform.html',
})
export class BlockPlatformPage implements OnInit {

  ROUTE_IMGS = 'assets/imgs/';
  img = 'block-browser.svg';
  title = 'Tu navegador no es compatible';
  subtitle = 'Para una mejor experiencia usa uno de estos <br> navegadores desde las siguientes versiones.';
  browsers = [
    {
      img: 'Edge.svg',
      text: 'Edge<br>V.15',
      url: 'https://www.microsoft.com/es-co/windows/microsoft-edge'
    },
    {
      img: 'Chrome.svg',
      text: 'Chrome<br>V.28',
      url: 'https://www.google.com/intl/es_ALL/chrome/'
    },
    {
      img: 'Firefox.svg',
      text: 'Firefox<br>V.35',
      url: 'https://www.mozilla.org/es-ES/firefox/new/'
    },
    {
      img: 'Safari.svg',
      text: 'Safari<br>V.7.1',
      url: 'https://www.apple.com/co/safari/'
    },
  ];

  pbClassic = 'https://www.bancodebogota.com/Banking/pb/logon?a=00010016&pbold=true';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbPlatform: BdbPlatformsProvider,
    private el: ElementRef,
    private renderer: Renderer2,
    private wsSessionProvider: WebSocketSessionProvider
  ) {
  }

  ngOnInit() {
    this.wsSessionProvider.wsSessionClosed();
    if (!this.bdbPlatform.isCallBlockPlatform()) {
      this.navCtrl.setRoot('LoginPage');
    }

    const hostElem = this.el.nativeElement;
    this.validateParent(hostElem);
    this.addStyle(hostElem);
  }

  validateParent(hostElem: any) {

    if (hostElem.parentElement === null) {
      return;
    }

    this.addStyle(hostElem.parentElement);
    this.validateParent(hostElem.parentElement);
  }

  addStyle(element: any) {
    this.renderer.setStyle(element, 'background', 'transparent');
  }

  openUrl(url: any) {
    window.open(url);
  }

  redirect(url) {
    window.top.location.href = url;
  }

}
