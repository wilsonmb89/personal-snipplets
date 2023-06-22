import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ViewController } from 'ionic-angular';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BdbPlatformsProvider } from '../../providers/bdb-platforms/bdb-platforms';
import { BdbCookies } from '../../providers/bdb-cookie/bdb-cookie';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { OnboardingHomeProvider } from '../../providers/onboarding-home/onboarding-home';

@IonicPage()
@Component({
  selector: 'page-onboarding-home',
  animations: [
    trigger('openClose', [
      state('true', style({
        opacity: 0,
        display: 'none'
      })),
      state('false', style({
        opacity: 1,
      })),
      transition('true => false', [
        animate('0.6s')
      ]),
      transition('false => true', [
        animate('0.6s')
      ]),
    ]),
    trigger('btnUpAndDown', [
      state('true', style({
        bottom: '16px'
      })),
      state('false', style({
        bottom: '-56px',
        display: 'none'
      })),
      transition('true => false', [
        animate('0.6s')
      ]),
      transition('false => true', [
        animate('0.6s')
      ]),
    ]),
  ],
  templateUrl: 'onboarding-home.html',
})
export class OnboardingHomePage {

  @ViewChild(Slides) slides: Slides;

  listSlides: any = [{
    title: {
      text: '¡Bienvenido a tu nueva',
      bold: 'Zona Transaccional!'
    },
    subtitle: 'Hemos diseñado una nueva experiencia para que realices todas tus transacciones más fácil y rápido.',
    img: {
      desktop: 'assets/imgs/onboarding-home/welcome-onboarding.svg',
      mobile: 'assets/imgs/onboarding-home/welcome-onboarding.svg'
    }
  }, {
    title: {
      text: 'Transacciones',
      bold: 'recomendadas'
    },
    subtitle: 'Aquí encuentras tus facturas a vencer y transferencias frecuentes para que lo realices más rápido.',
    img: {
      desktop: 'assets/imgs/onboarding-home/quick-access-onboarding.png',
      mobile: 'assets/imgs/onboarding-home/quick-access-onboarding-mobile.png'
    }
  }, {
    title: {
      text: 'Personaliza',
      bold: 'tus favoritos'
    },
    subtitle: 'Marca con una estrella las cuentas que más uses y pasarán a estar en transacciones recomendadas.',
    img: {
      desktop: 'assets/imgs/onboarding-home/favorites-onboarding.png',
      mobile: 'assets/imgs/onboarding-home/favorites-onboarding-mobile.png'
    }
  }, {
    title: {
      text: '¿No encuentras',
      bold: 'lo que buscas?'
    },
    subtitle: 'En cualquier momento puedes volver al portal anterior ingresando desde el link que encuentras en la parte inferior de la página de ingreso.',
    img: {
      desktop: 'assets/imgs/onboarding-home/pb-onboarding.png',
      mobile: 'assets/imgs/onboarding-home/pb-onboarding-mobile.png'
    }
  }, {
    title: {
      text: 'Seguimos',
      bold: 'mejorando'
    },
    subtitle: 'Pronto encontrarás nuevas funciones para hacer tu vida financiera más sencilla.',
    img: {
      desktop: 'assets/imgs/onboarding-home/welcome-onboarding.svg',
      mobile: 'assets/imgs/onboarding-home/welcome-onboarding.svg'
    }
  },
  ];

  viewBtnPrev = true;
  viewBtnNext = true;
  viewBtnFirst = true;
  viewBtnLast = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private bdbPlatforms: BdbPlatformsProvider,
    private bdbCookies: BdbCookies,
    private bdbInMemory: BdbInMemoryProvider,
    private onboardingHome: OnboardingHomeProvider
  ) {
  }

  ionViewDidLoad() {
  }

  slideChanged() {

    const currentIndex = this.slides.getActiveIndex();

    if (currentIndex === 0) {
      this.viewBtnNext = true;
      this.viewBtnPrev = true;
      this.viewBtnFirst = true;
      this.viewBtnLast = true;
    } else if (this.slides.length() === currentIndex + 1) {
      this.viewBtnNext = true;
      this.viewBtnLast = false;
    } else {
      this.viewBtnNext = false;
      this.viewBtnPrev = false;
      this.viewBtnFirst = false;
      this.viewBtnLast = true;
    }
  }

  next() {
    this.slides.slideNext();
  }

  prev() {
    this.slides.slidePrev();
  }

  close() {
    this.onboardingHome.setUserInCookie();
    this.viewCtrl.dismiss();
  }

}
