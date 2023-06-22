import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ENV } from '@app/env';
import { AuthenticatorProvider } from '../../providers/authenticator/authenticator';
import { IdentificationTypeListProvider } from '../../providers/identification-type-list-service/identification-type-list-service';
import { BdbValidateAuthProvider } from '../../providers/bdb-validate-auth/bdb-validate-auth';
import { BdbModalProvider } from '../../providers/bdb-modal/bdb-modal';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { FunnelKeyModel } from '../../providers/funnel-keys/funnel-key-model';
import { FunnelKeysProvider } from '../../providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from '../../providers/funnel-events/funnel-events';
import { BdbRsaProvider } from '../../providers/bdb-rsa/bdb-rsa';
import { BdbPlatformsProvider } from '../../providers/bdb-platforms/bdb-platforms';
import { LoginData } from '../../app/models/login-data';
import { WebSocketSessionProvider } from '../../providers/web-socket-session/web-socket-session';
import { BdbSecuritySetupProvider } from '../../providers/bdb-security/bdb-security-setup';
import { Subscription } from 'rxjs/Subscription';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { LoginOptionsEnum } from '../../new-app/modules/login/components/login-form/login-form';
import { InitializeAppDelegateService } from '../../new-app/core/services-delegate/initialize-app/initialize-app-delegate.service';
import { UserFacade } from '../../new-app/shared/store/user/facades/user.facade';
import { switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { BdbAppVersionService } from '@app/shared/utils/bdb-app-version-service/bdb-app-version.service';
import {AuthFacade} from '@app/shared/../../new-app/modules/authentication/store/facades/auth.facade';
import {StepsLoginEnum} from '../../app/models/bdb-generics/bdb-constants';
import {ErrorMapperType} from '../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';

@IonicPage({
  name: 'loginweb',
  segment: 'loginweb'
})
@Component({
  selector: 'page-pb-landing',
  templateUrl: 'pb-landing.html',
})
export class PbLandingPage implements OnInit, OnDestroy {
  private dataLogin: LoginData = new LoginData();
  pbLandingForm: FormGroup;
  idTypes: Array<{ name, value }>;
  safeKeyPage: string;
  safeKeyLogin: string;
  forgotMyKey: string;
  pbClassic: string;
  loading = false;
  _funnel: FunnelKeyModel;
  logErr: string;
  tokenRecaptchaSubs: Subscription;
  appVersion$: Observable<string>;
  stepLogin$: Observable<StepsLoginEnum> = this.authenticationFacace.stepLogin$;
  stepsLoginEnum = StepsLoginEnum;
  private stepLoginSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private authenticator: AuthenticatorProvider,
    private identificationTypeList: IdentificationTypeListProvider,
    private bdbValidateAuth: BdbValidateAuthProvider,
    private bdbModal: BdbModalProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private renderer: Renderer2,
    private el: ElementRef,
    private bdbRsaProvider: BdbRsaProvider,
    private bdbPlatform: BdbPlatformsProvider,
    private wsSessionProvider: WebSocketSessionProvider,
    private bdbSecuritySetup: BdbSecuritySetupProvider,
    private recaptchaV3Service: ReCaptchaV3Service,
    private initializeAppDelegateService: InitializeAppDelegateService,
    private userFacade: UserFacade,
    private appVersionService: BdbAppVersionService,
    private authenticationFacace: AuthFacade,
    private bdbMicrofrontendEventsService: BdbMicrofrontendEventsService
    ) {
    this.safeKeyPage = ENV.SAFE_KEY_PAGE;
    this.safeKeyLogin = ENV.SAFE_KEY_LOGIN;
    this.forgotMyKey = ENV.FORGOT_MY_KEY;
    this.pbClassic = 'https://www.bancodebogota.com/Banking/pb/logon?a=00010016&pbold=true';
    this.pbLandingForm = formBuilder.group({
      idType: ['CC', Validators.compose([Validators.required])],
      idNumber: ['', Validators.compose([Validators.required])],
      pin: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])],
      lastDigits: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])]
    });
    this.idTypes = this.identificationTypeList.getListWithShort();
    this._funnel = this.funnelKeys.getKeys().login;
    this.appVersion$ = this.appVersionService.appVersion$;
  }
  ngOnInit() {
  this.logErr = '';
  this.bdbInMemory.clearAll();
    this.wsSessionProvider.wsSessionClosed();
    if (this.bdbPlatform.isCallBlockPlatform()) {
      this.navCtrl.setRoot('BlockPlatformPage');
    }
    this.stepLoginSubscription = this.stepLogin$.subscribe((stepLogin) => {
      switch (stepLogin) {
        case this.stepsLoginEnum.LOGIN_SUCCESS:
          this.successLogin();
          break;
        case this.stepsLoginEnum.LOGIN_ERROR_401:
          this.errorLogin('Error de autenticación. Por favor validar las credenciales ingresadas.');
          break;
        case this.stepsLoginEnum.LOGIN_ERROR:
          this.errorLogin('Error de autenticación. Por favor intenta nuevamente o ingresa desde otro navegador.');
          break;
        case this.stepsLoginEnum.TOKEN_MFA:
          this.doTokenLogin();
          break;
         case this.stepsLoginEnum.USER_BLOCKED:
          const err = this.authenticationFacace.getAuthenticationErrorResponse();
          if (err.error.backendErrorMessage === ErrorMapperType.UserBlockedUniversalKey) {
            this.errorLogin('Clave segura bloqueada. Dentro de 24 horas se reestablecerá y podrás volver a intentar.');
          } else {
            this.errorLogin('Se ha bloqueado tu Tarjeta Débito por seguridad. Acércate a una de nuestras oficinas para desbloquearla.');
          }
          break;
      }
    });
  }
  ngOnDestroy() {
    if (!!this.tokenRecaptchaSubs) {
      this.tokenRecaptchaSubs.unsubscribe();
    }
    if (!!this.stepLoginSubscription) {
      this.stepLoginSubscription.unsubscribe();
    }
  }
  ionViewDidLoad() {
    const hostElem = this.el.nativeElement;
    this.validateParent(hostElem);
    this.addStyle(hostElem);
  }
  addStyle(element: any) {
    this.renderer.setStyle(element, 'background', 'transparent');
  }
  validateParent(hostElem: any) {
    if (hostElem.parentElement === null) {
      return;
    }
    this.addStyle(hostElem.parentElement);
    this.validateParent(hostElem.parentElement);
  }

  ionViewWillEnter() {
    this.authenticationFacace.doReset();
    this.bdbInMemory.clearAll();
    this.userFacade.getPublicKey();
    this.bdbInMemory.setItemByKey(InMemoryKeys.IsLoginFromFrame, true);
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.openLanding);
  }
  onSubmit() {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.authenticate);
    this.dataLogin.identificationNumber = this.pbLandingForm.get('idNumber').value;
    this.dataLogin.identificationType = this.pbLandingForm.get('idType').value;
    this.dataLogin.password = this.pbLandingForm.get('pin').value;
    this.dataLogin.lastDigitDebitCard = this.pbLandingForm.get('lastDigits').value;
    this.dataLogin.type = LoginOptionsEnum.DEBIT_CARD;
    this.pbLandingForm.disable();
    this.loading = true;
    this.bdbInMemory.setItemByKey(InMemoryKeys.IsLoginFromFrame, true);
    this.tokenRecaptchaSubs = this.recaptchaV3Service.execute('loginweb')
    .pipe(
      // TODO: Remove this public key flow when login be implemented with ngrx
      switchMap(tokenRecaptcha => this.userFacade.user$.pipe(
        take(1),
        switchMap(user => {
          if (!user.publicKey) {
            this.userFacade.getPublicKey();
            return Observable.throw('PUBLIC_KEY');
          }
          return of(tokenRecaptcha);
        }))
      ))
    .subscribe(
      tokenRecaptcha => {
        this.dataLogin.tokenRecaptcha = tokenRecaptcha;
        this.authenticationFacace.doLogin(this.dataLogin);
      },
      err => {
        this.bdbInMemory.clearItem(InMemoryKeys.ThKyIn);
        this.pbLandingForm.enable();
        this.loading = false;
        this.logErr = err === 'PUBLIC_KEY' ? 'Presentamos fallas en el sistema, por favor inténtalo de nuevo.' : 'Error validando recaptcha, por favor intentelo de nuevo más tarde';
      }
    );
  }

  private successLogin() {
    this.initializeAppDelegateService.launchMaster(this.dataLogin);
    // window.top.location.href = ENV.DOMAIN_URL + 'dashboard';
    this.bdbMicrofrontendEventsService.sendTopNavigationEventToParentWindow(ENV.DOMAIN_URL + 'dashboard');
  }
  private doTokenLogin() {
      this.bdbInMemory.setItemByKey(InMemoryKeys.IsLoginFromFrame, 1);
      this.bdbInMemory.setItemByKey(InMemoryKeys.DataPbLandingLogin, this.dataLogin);
      // window.top.location.href = ENV.DOMAIN_URL;
      this.bdbMicrofrontendEventsService.sendTopNavigationEventToParentWindow(ENV.DOMAIN_URL);
    }
  private errorLogin(messageErr: string) {
      this.bdbInMemory.clearItem(InMemoryKeys.ThKyIn);
      this.pbLandingForm.enable();
      this.loading = false;
      this.authenticationFacace.doReset();
      this.logErr = messageErr;
  }

  public redirect(url) {
    // window.top.location.href = url;
    this.bdbMicrofrontendEventsService.sendTopNavigationEventToParentWindow(url);
  }
}
