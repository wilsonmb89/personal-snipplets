import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {IonicPage, LoadingController, NavController} from 'ionic-angular';
import {LoginData} from '../../../../../app/models/login-data';
import {AuthenticatorProvider} from '../../../../../providers/authenticator/authenticator';
import {InMemoryKeys} from '../../../../../providers/storage/in-memory.keys';
import {BdbInMemoryProvider} from '../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import {BdbValidateAuthProvider} from '../../../../../providers/bdb-validate-auth/bdb-validate-auth';
import {PulseModalControllerProvider} from '../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import {boxAnimation} from '../../../../../components/core/utils/animations/transitions';
import {BdbPlatformsProvider} from '../../../../../providers/bdb-platforms/bdb-platforms';
import {BdbInMemoryIonicProvider} from '../../../../../providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import {FunnelKeyModel} from '../../../../../providers/funnel-keys/funnel-key-model';
import {FunnelKeysProvider} from '../../../../../providers/funnel-keys/funnel-keys';
import {FunnelEventsProvider} from '../../../../../providers/funnel-events/funnel-events';
import {Subscription} from 'rxjs/Subscription';
import {ReCaptchaV3Service} from 'ng-recaptcha';
import {InitializeAppDelegateService} from '../../../../core/services-delegate/initialize-app/initialize-app-delegate.service';
import {UserFacade} from '../../../../shared/store/user/facades/user.facade';
import {switchMap, take} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {BdbAppVersionService} from '@app/shared/utils/bdb-app-version-service/bdb-app-version.service';
import {AuthFacade} from '@app/modules/authentication/store/facades/auth.facade';
import {StepsLoginEnum} from '../../../../../app/models/bdb-generics/bdb-constants';
import {ErrorMapperType} from '../../../../core/http/http-client-wrapper/http-client-wrapper.service';
import {GenericModalModel} from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import {GenericModalService} from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  animations: [boxAnimation]
})
export class LoginPage implements OnInit, OnDestroy {

  stepsLoginEnum = StepsLoginEnum;
  loginData: LoginData;
  numberSafeSite = '------';
  _login: FunnelKeyModel;
  tokenRecaptchaSubs: Subscription;
  appVersion$: Observable<string>;
  stepLogin$: Observable<StepsLoginEnum> = this.authenticationFacace.stepLogin$;
  isTokenError$: Observable<boolean> = this.authenticationFacace.isTokenError$;
  loginData$: Observable<LoginData> = this.authenticationFacace.loginData$;
  private stepLoginSubscription: Subscription;
  private loginDataSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authenticatorProvider: AuthenticatorProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbValidateAuth: BdbValidateAuthProvider,
    private pulseModalCtrl: PulseModalControllerProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private bdbPlatform: BdbPlatformsProvider,
    private ionicStorage: BdbInMemoryIonicProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private recaptchaV3Service: ReCaptchaV3Service,
    private initializeAppDelegateService: InitializeAppDelegateService,
    private userFacade: UserFacade,
    private authenticationFacace: AuthFacade,
    private appVersionService: BdbAppVersionService,
    private bdbMicrofrontendEventsService: BdbMicrofrontendEventsService,
    private genericModalService: GenericModalService
  ) {
  }

  ngOnInit(): void {
    this._login = this.funnelKeysProvider.getKeys().login;

    if (this.bdbPlatform.isCallBlockPlatform()) {
      this.navCtrl.setRoot('BlockPlatformPage');
    }

    this.funnelEventsProvider.callFunnel(this._login, this._login.steps.openSecure);
    this.appVersion$ = this.appVersionService.appVersion$;

    this.stepLoginSubscription = this.stepLogin$.subscribe((stepLogin: StepsLoginEnum) => {

      switch (stepLogin) {
        case this.stepsLoginEnum.LOGIN_SUCCESS:
          this.successLogin();
          break;
        case this.stepsLoginEnum.LOGIN_ERROR_401:
           this.launchErrorModal(
              'assets/imgs/generic-modal/error-login.svg',
              'Error al ingresar',
              '  Por favor verifica tus datos e intenta nuevamente.',
              'Entendido'
            );
          break;
        case this.stepsLoginEnum.LOGIN_ERROR:
           this.launchErrorModal(
              'assets/imgs/generic-modal/error-login.svg',
              'Error al ingresar',
              'Por favor intenta nuevamente o ingresa desde otro navegador.',
              'Entendido'
            );
          break;
        case this.stepsLoginEnum.INVALID_TOKEN_MFA:
          this.authenticationFacace.hide();
          this.loginData.tokenMFA = '';
          this.authenticationFacace.refreshMFAStep();
          this.authenticationFacace.load();
          break;
        case this.stepsLoginEnum.TOKEN_MFA:
          this.authenticationFacace.hide();
          break;
        case this.stepsLoginEnum.NUMBER_SAFE_SITE:
          this.authenticationFacace.hide();
          this.numberSafeSite = this.authenticationFacace.getAuthenticationResponse().secureSiteKey;
          break;
        case this.stepsLoginEnum.TOKEN_LOCKED:
          this.authenticationFacace.hide();
          break;
        case this.stepsLoginEnum.USER_BLOCKED:
          const err = this.authenticationFacace.getAuthenticationErrorResponse();
          if (err.error.backendErrorMessage === ErrorMapperType.UserBlockedUniversalKey) {
            this.launchErrorModal(
              'assets/imgs/generic-modal/blocked-secure-key.svg',
              'Clave segura bloqueada',
              'Por seguridad hemos bloqueado tu clave segura. Dentro de 24 horas se reestablecerá y podrás volver a intentar.',
              'Entendido'
            );
          } else {
            this.launchErrorModal(
              'assets/imgs/generic-modal/blocked-debit-card.svg',
              'Tarjeta Débito bloqueda',
              'Se ha bloqueado tu Tarjeta Débito por seguridad. Acércate a una de nuestras oficinas para desbloquearla.',
              'Entendido'
            );

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
    if (!!this.loginDataSubscription) {
      this.loginDataSubscription.unsubscribe();
    }
  }

  ionViewWillEnter(): void {
    this.bdbMicrofrontendEventsService.sendLogoutEventToParentWindow();
    this.loginDataSubscription = this.loginData$.subscribe(loginDataState => {
      if (!!loginDataState) {
        this.loginData = loginDataState;
      }
    });
    this.authenticationFacace.doInitLoginForm();
  }

  submitLogin(data: LoginData): void {
    this.funnelEventsProvider.callFunnel(this._login, this._login.steps.authenticate);
    this.loginData = data;
    this.authenticationFacace.load();
    this.tokenRecaptchaSubs = this.recaptchaV3Service.execute('login')
      .pipe(
        // TODO: Remove this public key flow when login be implemented with ngrx
        switchMap(tokenRecaptcha => this.userFacade.user$.pipe(
          take(1),
          switchMap(user => {
            if (!user.publicKey) {
              this.userFacade.getPublicKey();
              return Observable.throw('Error getting public key');
            }
            return of(tokenRecaptcha);
          }))
        ))
      .subscribe(
        tokenRecaptcha => {
          this.loginData.tokenRecaptcha = tokenRecaptcha;
          this.authenticationFacace.doLogin(this.loginData);
        },
        err =>  this.launchErrorModal(
              'assets/imgs/generic-modal/error-login.svg',
              'Error al ingresar',
              'Por favor intenta nuevamente o ingresa desde otro navegador.',
              'Entendido'
            )
      );
  }

  onSubmitToken(token: string): void {
    this.loginData.tokenMFA = token;
    this.authenticationFacace.load();
    this.tokenRecaptchaSubs = this.recaptchaV3Service.execute('loginToken')
      .subscribe(
        tokenRecaptcha => {
          this.loginData.tokenRecaptcha = tokenRecaptcha;
          this.authenticationFacace.doLogin(this.loginData);
        }
      );
  }

  onSubmitSafeSite(): void {
    this.launch();
  }

  onFirstStep(): void {
    this.authenticationFacace.doReset();
  }

  private successLogin(): void {
    this.launch();
  }

  private launch(): void {
    this.initializeAppDelegateService.launchMaster(this.loginData);
    this.authenticationFacace.hide();
    this.navCtrl.setRoot('MasterPage');
  }

  private launchErrorModal(
    imgSrcPath: string,
    title: string,
    description: string,
    actionText: string
  ): void {
    this.authenticationFacace.hide();
    this.authenticationFacace.doReset();
    this.bdbInMemory.clearItem(InMemoryKeys.ThKyIn);
    const genericModalData: GenericModalModel = {
      icon: {
        src: imgSrcPath,
        alt: 'error'
      },
      modalTitle: title,
      modalInfoData: `<span>${description}</span>`,
      actionButtons: [
        {
          id: 'generic-btn-action-1',
          buttonText: actionText,
          block: true,
          colorgradient: true,
          action: () => { }
        }
      ]
    };
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

}
