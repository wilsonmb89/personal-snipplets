import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Observable } from 'rxjs/Observable';
import { ENV } from '@app/env';
import { CsMainModel } from '../model/cs-main-model';
import { BdbConstants } from '../../../app/models/bdb-generics/bdb-constants';
import { BdbHttpClient } from '../../../providers/bdb-http-client/bdb-http-client';
import { BdbUtilsProvider } from '../../../providers/bdb-utils/bdb-utils';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { BdbRsaProvider } from '../../../providers/bdb-rsa/bdb-rsa';
import { NavController } from 'ionic-angular';
import { CustomValidateRs } from '../../../app/models/custom-validate/custom-validate-rs';
import getRandomInt from '@app/shared/utils/functions/random-number';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { map, take } from 'rxjs/operators';
import {
  DispatcherDelegateService
} from '../../../new-app/core/services-delegate/identity-validation-delegate/dispatcher-delegate.service';
import { RootPageComponent } from '@avaldigitallabs/fbog-module';


@Injectable()
export class CrossSellProvider {

  main: CsMainModel;
  basePath: string;
  crossSellItems: Array<CsMainModel> = [];

  private PORTFOLIO_PURCHASE = 'PORTFOLIO_PURCHASE';

  constructor(
    private bdbHttpClient: BdbHttpClient,
    private bdbUtils: BdbUtilsProvider,
    private bdbPlatforms: BdbPlatformsProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbRsa: BdbRsaProvider,
    private iab: InAppBrowser,
    private userFacade: UserFacade,
    private dispatcherDelegateService: DispatcherDelegateService
  ) {
    this.basePath = 'assets/imgs/cross-sell/';
    this.buildCrossSellList();
  }

  private buildCrossSellList() {
    this.getCrossSellToggle().subscribe(data => this.fillArray(data));
  }

  private getCrossSellToggle(): Observable<CrossSellToggle> {
    return this.userFacade.userFeatures$.pipe(take(1), map(({ toggle: { allowedServices } }) => {
      const crossSellToggleData: CrossSellToggle = {
        'SDA': allowedServices.crossSellSavingAccountSDA,
        'CCA': allowedServices.crossSellCreditCardCCA,
        'DLA': allowedServices.crossSellMortgageCreditDLA,
        '568': allowedServices.crossSellCreditService568,
        'LOC': allowedServices.crossSellCreditLOC,
        '678': allowedServices.crossSellLifeInsurance678,
        'CDA': allowedServices.crossSellCDTCDA,
        'FDA': allowedServices.crossSellFiduciaryFDA,
        PORTFOLIO_PURCHASE: allowedServices.crossSellPortfolioPurchase
      };
      return crossSellToggleData;
    }));
  }

  private fillArray(crossSellToggleData: CrossSellToggle): void {
    this.crossSellItems = [];
    Object.keys(crossSellToggleData)
      .filter(crossSellItem => crossSellToggleData[crossSellItem])
      .forEach(crossSellItem => {
        // ToDo implements strategy pattern to build specific object
        switch (crossSellItem) {
          case BdbConstants.SAVINGS_ACCOUNT:
            this.crossSellItems.push({
              key: BdbConstants.SAVINGS_ACCOUNT,
              cardTitle: 'Cuenta de Ahorros',
              cardDesc: 'Escoge la cuenta que se adapte a tus necesidades',
              btnText: 'Abrir una cuenta',
              iconPath: this.basePath + 'savings.svg',
              iconPathSm: this.basePath + 'savings-sm.svg',
              url: 'https://digital.bancodebogota.com.co/cuenta-ahorros/index.html'
            });
            break;
          case BdbConstants.CREDIT_CARD:
            this.crossSellItems.push({
              key: BdbConstants.CREDIT_CARD,
              cardTitle: 'Tarjeta de Crédito',
              cardDesc: 'Aprobación inmediata y envío a la puerta de tu casa.',
              btnText: 'Pídela aquí',
              iconPath: this.basePath + 'creditcard.svg',
              iconPathSm: this.basePath + 'creditcard-sm.svg',
              url: ENV.CCA_CROSSELL_URL,
            });
            break;
          case BdbConstants.USM_CREDIT:
            this.crossSellItems.push({
              key: BdbConstants.USM_CREDIT,
              cardTitle: 'Crédito de Vivienda',
              cardDesc: 'Simula tu crédito y haz tu sueño realidad.',
              btnText: 'Solicítalo ahora',
              iconPath: this.basePath + 'mortgage.svg',
              iconPathSm: this.basePath + 'mortgage-sm.svg',
              url: 'https://viviendadigital.bancodebogota.co/'
            });
            break;
          case BdbConstants.CREDISERVICE_1:
            this.crossSellItems.push({
              key: BdbConstants.CREDISERVICE_1,
              cardTitle: 'Crédito de Libranza',
              cardDesc: 'Aprobación rápida sin documentos.',
              btnText: 'Solicítala ahora',
              iconPath: this.basePath + 'libranza.svg',
              iconPathSm: this.basePath + 'libranza-sm.svg',
              url: 'https://tulibranzafacil.bancodebogota.co/welcome',
              postAuthUrl: ENV.LIBRANZA_POSTAUTH
            });
            break;
          case BdbConstants.CREDIT:
            this.crossSellItems.push({
              key: BdbConstants.CREDIT,
              cardTitle: 'Crédito de libre inversión',
              cardDesc: 'Tener lo que siempre quisiste en pocos pasos.',
              btnText: 'Solicita el tuyo',
              iconPath: this.basePath + 'loan.svg',
              iconPathSm: this.basePath + 'loan-sm.svg',
              url: ENV.LOC_CROSSELL_URL,
            });
            break;
        }
      }
      );
    this.shuffle(this.crossSellItems);
  }
  /**
   * This method randomize the cross sell card to show to user
   * @returns an object of CsMainModel
   */
  getCrossSellCard(): CsMainModel {
    const filteredItems = this.crossSellItems.filter(item => item.key !== BdbConstants.CDT);
    const index = getRandomInt(0, filteredItems.length - 1);
    this.main = filteredItems[index];
    return this.main;
  }
  /**
   * This method return a list of cross sell items different than the main card
   * if no main card has been selected, the system will setup one
   * @returns Array of CsMainModel filtered
   */
  getCrossSellMosaic(): Array<CsMainModel> {
    if (this.main === undefined) {
      this.getCrossSellCard();
    }
    this.shuffle(this.crossSellItems);
    return this.crossSellItems.filter((e: CsMainModel) => {
      return e.key !== this.main.key;
    }).slice(0, 4);
  }

  /**
   * this method redirect to desired url, switching between cordova and non-cordova builds
   * @param url string to redirect to
   */
  redirect(url: string) {
    if (this.bdbPlatforms.isApp()) {
      this.iab.create(url).show();
    } else {
      window.open(url, '_blank');
    }
  }

  handleDispatcher(model: CsMainModel, navCtrl?: NavController) {
    // si el modelo tiene una url de post autenticacion
    // consumir dispatcher
    if (model.postAuthUrl) {
      this.dispatcherDelegateService.triggerDispatcher().subscribe((data: { uuid }) => {
        if (data) {
          this.redirect(model.postAuthUrl.concat(data.uuid));
        }
      });
      // si no redirigir a la url del sitio sin autenticar
    } else if (!!model.url) {
      this.redirect(model.url);
    } else if (!!model.page) {
      navCtrl.push(model.page, null, { animate: false });
    }
  }

  public getApprovedCredit(resolve, reject): void {

    this.getCrossSellToggle().pipe(map(data => !!data[BdbConstants.CREDIT]))
      .subscribe(itemAvaliable => {
        if (itemAvaliable) {
          this.main = {
            key: BdbConstants.CREDIT,
            cardTitle: 'Crédito Libre Destino',
            cardDesc: '',
            btnText: 'Desembolsa aquí',
            iconPath: this.basePath + 'approved-credit.svg',
            iconPathSm: this.basePath + 'approved-credit.svg',
            url: 'https://digital.bancodebogota.co/credito/index.html',
            postAuthUrl: ENV.CONSUMO_POSTAUTH
          };
          const approvedCredit = this.bdbInMemory.getItemByKey(InMemoryKeys.ApprovedCredit);
          if (approvedCredit) {
            this.main.approved = approvedCredit;
            this.crossSellItems = this.crossSellItems.filter(item => item.key !== BdbConstants.CREDIT);
            resolve(this.main);
          } else {
            reject();
          }
        } else {
          reject();
        }
      }, error => reject()
      );
  }

  getFiduciaOption() {
    const fiduciary_url = ENV.API_FIDUCIA_URL;
    return this.bdbHttpClient.post<CustomValidateRs>('fic/lambda/customer-enabled ', undefined, fiduciary_url).toPromise();
  }


  public addPortfolioPurchaseCreditCardItem(): void {

    this.getCrossSellToggle().subscribe(data => {
      const itemAvailable = !!data[this.PORTFOLIO_PURCHASE];
      if (itemAvailable) {
        const isACard = !!this.crossSellItems.find(card => card.key === this.PORTFOLIO_PURCHASE);
        if (!isACard) {
          this.crossSellItems.push({
            key: this.PORTFOLIO_PURCHASE,
            cardTitle: 'Compra de cartera con Tarjeta de Crédito',
            cardDesc: 'Realiza tu compra de cartera.',
            btnText: 'Compra de cartera con tarjeta de crédito',
            iconPath: this.basePath + 'compra-cartera.svg',
            iconPathSm: this.basePath + 'compra-cartera-sm.svg',
            url: ENV.COMPRA_CARTERA_URL,
          });
        }
      }
    });
  }

  public getLifeInsuranceItem(): Observable<CsMainModel> {
    return this.getCrossSellToggle().pipe(
      map(data => {
        const itemAvaliable = !!data[BdbConstants.LIFE_INSURANCE];
        if (itemAvaliable) {
          const mainCard = {
            key: BdbConstants.LIFE_INSURANCE,
            cardTitle: 'Conoce los seguros que tenemos para tí.',
            cardDesc: 'Siéntete tranquilo mientras te protegemos. Conoce toda la oferta de seguros que tenemos para tí.',
            btnText: 'Ver seguros',
            iconPath: this.basePath + 'lifeinsurance.svg',
            iconPathSm: this.basePath + 'lifeinsurance-sm.svg',
            url: 'https://seguros.bancodebogota.com.co/',
            postAuthUrl: ENV.INSURANCE_POSTAUTH
          };
          this.main = mainCard;
          return mainCard;
        } else {
          throw new Error('Item no avaliable by user features');
        }
      })
    );
  }

  public getLifeInsuranceInMosaic(): Observable<Array<CsMainModel>> {
    return this.getCrossSellToggle().pipe(
      map(data => {
        const itemAvaliable = !!data[BdbConstants.LIFE_INSURANCE];
        if (itemAvaliable) {
          const lifeInsuranceCard = {
            key: BdbConstants.LIFE_INSURANCE,
            cardTitle: 'Seguros desempleo y vida',
            cardDesc: 'Conoce los seguros que tenemos para tí',
            btnText: 'Adquiérelo ahora',
            iconPath: this.basePath + 'lifeinsurance.svg',
            iconPathSm: this.basePath + 'lifeinsurance-sm.svg',
            url: 'https://seguros.bancodebogota.com.co/',
            postAuthUrl: ENV.INSURANCE_POSTAUTH
          };
          this.shuffle(this.crossSellItems);
          const tempItems: Array<CsMainModel> = [...this.crossSellItems];
          tempItems.unshift(lifeInsuranceCard);
          return tempItems.slice(0, 4);
        } else {
          throw new Error('Item no avaliable by user features');
        }
      })
    );
  }

  public getFiduciaryItem(): Observable<CsMainModel> {
    return this.getCrossSellToggle().pipe(
      map(data => {
        const itemAvaliable = !!data[BdbConstants.FUDUCIARY];
        if (itemAvaliable) {
          return {
            key: BdbConstants.FUDUCIARY,
            cardTitle: 'Fondo de Inversión',
            cardDesc: 'Tener lo que siempre quisiste en pocos pasos.',
            btnText: 'Solicita el tuyo',
            iconPath: this.basePath + 'fiduciary.svg',
            iconPathSm: this.basePath + 'fiduciary.svg',
            page: RootPageComponent
          };
        } else {
          throw new Error('Item no avaliable by user features');
        }
      })
    );
  }

  public addCDTCard(): void {
    this.getCrossSellToggle().subscribe((data) => {
      const itemAvailable = !!data[BdbConstants.CDT];
      if (itemAvailable) {
        const cdtCard = !!this.crossSellItems.find(card => card.key === BdbConstants.CDT);
        if (!cdtCard) {
          this.crossSellItems.push({
            key: BdbConstants.CDT,
            cardTitle: 'CDT Digital',
            cardDesc: '',
            btnText: 'Adquiérelo ahora',
            iconPath: this.basePath + 'cdt.svg',
            iconPathSm: this.basePath + 'cdt.svg',
            url: ENV.CDT_GET_URL
          });
        }
      }
    });
  }

  private shuffle(array: Array<any>): Array<any> {
    let currentIndex = array.length;
    let temporaryValue = 0;
    let randomIndex = 0;
    while (0 !== currentIndex) {
      randomIndex = getRandomInt(0, currentIndex - 1);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
}

interface CrossSellToggle {
  [key: string]: boolean;
}
