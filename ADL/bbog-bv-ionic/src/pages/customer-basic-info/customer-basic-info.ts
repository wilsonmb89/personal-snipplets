import { Component, ViewContainerRef, ComponentFactoryResolver, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, Events, ModalController, ModalOptions } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors, FormControl } from '@angular/forms';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { CustomerInfo } from '../../providers/customer-management/customer-info';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { Observable } from 'rxjs/Observable';
import { BdbModalProvider } from '../../providers/bdb-modal/bdb-modal';
import { ModalSuccess } from '../../app/models/modal-success';
import { NavigationProvider } from '../../providers/navigation/navigation';
import { TokenOtpProvider } from '../../providers/token-otp/token-otp/token-otp';
import { UpdateBasicDataService } from '@app/delegate/customer-basic-data-delegate/update-basic-data.delegate.service';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { map, take } from 'rxjs/operators';
import { ListCataloguesDelegateProvider } from '@app/delegate/list-parameters/list-catalogues-delegate.service';
import { CatalogsEnum } from '@app/delegate/list-parameters/enums/catalogs-enum';
import { Catalogue } from '@app/apis/user-features/models/catalogue.model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { UserFeatures } from '@app/apis/user-features/models/UserFeatures';
import { PhoneNumberRecord, PostAddressRecord, UpdateBasicDataRq } from '@app/apis/customer-basic-data/models/updateBasicData.model';
import {
  ServiceApiErrorModalService
} from '@app/shared/components/modals/service-api-error-modal/provider/service-api-error-modal.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';

@IonicPage()
@Component({
  selector: 'page-customer-basic-info',
  templateUrl: 'customer-basic-info.html',
})
export class CustomerBasicInfoPage {

  private economicSectorMap: { [key: string]: boolean } = {
    ['1']: false,
    ['2']: true,
    ['3']: true,
    ['4']: false,
    ['5']: false,
    ['6']: false,
    ['7']: false,
    ['8']: false,
    ['9']: false,
    ['10']: false,
    ['11']: false,
    ['12']: false,
    ['13']: false,
    ['14']: false,
    ['15']: false,
    ['16']: false,
    ['17']: false,
    ['18']: true,
  };

  formPersonalData: FormGroup;
  formContactData: FormGroup;

  countries: Array<BdbMap> = [];
  departments: Array<BdbMap> = [];
  cities: Array<BdbMap> = [];
  countriesBirth: Array<BdbMap> = [];
  departmentsBirth: Array<BdbMap> = [];
  citiesBirth: Array<BdbMap> = [];
  economicActivities: Array<BdbMap> = [];
  nationalities: Array<BdbMap> = [];
  sectorList: Array<BdbMap> = [];
  occupationList: Array<BdbMap> = [];
  prefixList: Array<BdbMap> = [];
  maritalStatusList: Array<BdbMap> = [];
  educationLevelList: Array<BdbMap> = [];
  housingList: Array<BdbMap> = [];
  reportList: Array<BdbMap> = [];
  addressTypeList: Array<BdbMap> = [];
  phoneTypeList: Array<BdbMap> = [];
  wayTypeList: Array<BdbMap> = [];
  propertyTypeList: Array<BdbMap> = [];
  btnLeft = 'Cancelar';
  btnRight = 'Guardar';

  customerInfo: CustomerInfo;
  // var to control confirmation email validation
  equalEmails = false;
  errorConfEmail: string;
  errorEmail = 'El correo electrónico es inválido';
  // var to control phone lenght validation
  errorPhone: string;
  invalidPhone = false;
  errorMobile: string;
  invalidMobile = false;

  requiredField = 'Campo requerido';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbModal: BdbModalProvider,
    private loadingCtrl: LoadingController,
    private platforms: Platform,
    private events: Events,
    private navigation: NavigationProvider,
    private tokenOtp: TokenOtpProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private userFacade: UserFacade,
    private updateBasicDataService: UpdateBasicDataService,
    private listCataloguesDelegateProvider: ListCataloguesDelegateProvider,
    private serviceApiErrorModalService: ServiceApiErrorModalService,
  ) {
    this.customerInfo = bdbInMemory.getItemByKey(InMemoryKeys.CustomerInfo);
    this.formPersonalData = formBuilder.group({
      nationality: ['0', Validators.compose([Validators.required])],
      maritalStatus: [this.customerInfo.maritalStatus],
      educationLevel: [!!this.customerInfo.levelEducation ? this.customerInfo.levelEducation : ''],
      countryBirth: ['0', Validators.compose([Validators.required])],
      departmentBirth: ['0', Validators.compose([Validators.required])],
      cityBirth: ['0', Validators.compose([Validators.required])],
      occupation: [this.customerInfo.occupation, Validators.compose([Validators.required])],
      sector: ['00'],
      economicActivity: ['0010', Validators.compose([Validators.required])],
      housing: [this.customerInfo.typeHousing],
      deliveryMethod: [this.customerInfo.deliveryMethod]
    });

    this.formContactData = formBuilder.group({
      addressType: [this.customerInfo.addressType, Validators.compose([Validators.required])],
      wayType1: [this.customerInfo.wayType1, Validators.compose([Validators.required])],
      number1: [this.customerInfo.number1, Validators.compose([Validators.required])],
      wayType2: [this.customerInfo.wayType2],
      number2: [this.customerInfo.number2, Validators.compose([Validators.required])],
      propertyType1: [this.customerInfo.propertyType1],
      number3: [this.customerInfo.number3],
      propertyType2: [this.customerInfo.propertyType2],
      number4: [this.customerInfo.number4],
      neighbourhood: [this.customerInfo.neighborhood, Validators.compose([Validators.required])],
      country: ['0', Validators.compose([Validators.required])],
      department: ['0', Validators.compose([Validators.required])],
      city: ['0', Validators.compose([Validators.required])],
      phoneType: [this.customerInfo.typePhone, Validators.compose([Validators.required])],
      prefix: ['0'],
      phoneNumber: [this.customerInfo.phone, Validators.required],
      ext: [this.customerInfo.extension],
      mobileNumber: [this.customerInfo.cellular,
      Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      email: [this.customerInfo.email, Validators.compose([Validators.email, Validators.required])],
      emailConf: ['', Validators.compose([Validators.email, Validators.required])],
    });
    this.validatePhoneType();
  }

  ionViewWillEnter() {
    this.fillArrays();
    // actualizar el titulo del modal en mobil
    if (!this.platforms.is('core')) {
      this.events.publish('header:title', 'Actualización de datos');
    }
    this.getCountries();
    this.onOccupationChange(!!this.customerInfo.occupation);
    if (this.customerInfo.indicative !== '') {
      this.formContactData.get('prefix').setValue(this.customerInfo.indicative);
    }
  }

  private fillArrays(): void {
    const load = this.loadingCtrl.create();
    load.present().then(
      () => {
        forkJoin(
          this.getTransformCatalog(CatalogsEnum.SECTOR_ECONOMICO),
          this.getTransformCatalog(CatalogsEnum.INDICATIVO),
          this.getTransformCatalog(CatalogsEnum.OCUPACION),
          this.getTransformCatalog(CatalogsEnum.ESTADO_CIVIL),
          this.getTransformCatalog(CatalogsEnum.NIVEL_EDUCATIVO),
          this.getTransformCatalog(CatalogsEnum.TIPO_VIVIENDA),
          this.getTransformCatalog(CatalogsEnum.METODO_ENTREGA),
          this.getTransformCatalog(CatalogsEnum.TIPO_DIRECCION),
          this.getTransformCatalog(CatalogsEnum.TIPO_TELEFONO).pipe(map(items => items.filter(item => item.key !== '12'))),
          this.getTransformCatalog(CatalogsEnum.TIPO_CALLE),
          this.getTransformCatalog(CatalogsEnum.PROPIEDAD_CALLE)
        ).subscribe(
          catalogs => {
            this.sectorList = catalogs[0];
            this.prefixList = catalogs[1];
            this.occupationList = catalogs[2];
            this.maritalStatusList = catalogs[3];
            this.educationLevelList = catalogs[4];
            this.housingList = catalogs[5];
            this.reportList = catalogs[6];
            this.addressTypeList = catalogs[7];
            this.phoneTypeList = catalogs[8];
            this.wayTypeList = catalogs[9];
            this.propertyTypeList = catalogs[10];
            load.dismiss();
          },
          (err) => {
            load.dismiss();
            this.showErrorModal(err);
          }
        );
      }
    );
  }

  private upperCaseToFirstLetter(data: Array<BdbMap>): Array<BdbMap> {
    return data.map((e: BdbMap) => {
      const lower = e.value.toLowerCase();
      const upper = lower.replace(/^\w/, (chr) => chr.toUpperCase());
      e.value = upper;
      return e;
    });
  }

  private getCountries(): void {
    this.listCataloguesDelegateProvider
      .getListCatalogs(CatalogsEnum.PAISES, '')
      .pipe(
        map<Catalogue[], BdbMap[]>(
          countries => countries
            .map(country => ({
              key: country.parentId,
              value: country.name,
              cod: country.id
            })
            )
        ))
      .subscribe(
        data => {
          const dataList = this.upperCaseToFirstLetter(data);
          this.countries = this.countriesBirth = this.nationalities = dataList;
          if (!!this.customerInfo.countryBirth) {
            this.formPersonalData.get('countryBirth').setValue(this.customerInfo.countryBirth);
          }
          if (this.customerInfo.country) {
            this.formContactData.get('country').setValue(this.customerInfo.country);
          }
          if (!!this.customerInfo.nationality) {
            this.formPersonalData.get('nationality').setValue(this.customerInfo.nationality);
          }
          this.onCountryBirthChange(true);
          this.onCountryChange(true);
        },
        (err) => { this.showErrorModal(err); }
      );
  }

  private updateProvinceByCountry(
    countryId: string = '',
    refreshData: boolean = false,
    isBirthStateProv: boolean = true
  ): void {
    this.getTransformCatalog(CatalogsEnum.DEPARTAMENTOS, countryId)
      .subscribe(
        departments => {
          if (isBirthStateProv) {
            this.departmentsBirth = departments;
            if (refreshData && !!this.customerInfo.departmentBirth) {
              this.formPersonalData.get('departmentBirth').setValue(this.customerInfo.departmentBirth);
            }
            this.resetControl(this.formPersonalData, 'cityBirth');
            this.updateCityByDepartment(
              this.formPersonalData.get('departmentBirth').value,
              true,
              true
            );
          } else {
            this.departments = departments;
            if (refreshData && !!this.customerInfo.department) {
              this.formContactData.get('department').setValue(this.customerInfo.department);
            }
            this.resetControl(this.formContactData, 'city');
            this.updateCityByDepartment(
              this.formContactData.get('department').value,
              true,
              false
            );
          }
        },
        (err) => { this.showErrorModal(err); }
      );
  }

  private updateCityByDepartment(
    departmentId: string = '',
    refreshData: boolean = false,
    isBirthCity: boolean = true
  ): void {
    if (!!departmentId) {
      if (isBirthCity) {
        this.citiesBirth = [];
        this.formPersonalData.get('cityBirth').disable();
      } else {
        this.cities = [];
        this.formContactData.get('city').disable();
      }
      this.getTransformCatalog(CatalogsEnum.CIUDADES, departmentId)
        .subscribe(
          cities => {
            if (isBirthCity) {
              this.citiesBirth = cities;
              this.formPersonalData.get('cityBirth').enable();
              if (refreshData && !!this.customerInfo.cityBirth) {
                this.formPersonalData.get('cityBirth').setValue(this.customerInfo.cityBirth);
              }
            } else {
              this.cities = cities;
              this.formContactData.get('city').enable();
              if (refreshData && !!this.customerInfo.city) {
                this.formContactData.get('city').setValue(this.customerInfo.cityId);
              }
            }
          },
          (err) => { this.showErrorModal(err); }
        );
    } else {
      this.resetControl(
        isBirthCity ? this.formPersonalData : this.formContactData,
        isBirthCity ? 'cityBirth' : 'city',
        true
      );
    }
  }

  private resetControl(form: FormGroup, controlName: string, disabled: boolean = false): void {
    form.get(controlName).setValue('');
    if (disabled) {
      form.get(controlName).disable();
    } else {
      form.get(controlName).enable();
    }
  }

  private updateEconomicActBySector(
    economicSector: string,
    refreshData: boolean = false
  ): void {
    this.resetControl(this.formPersonalData, 'economicActivity', true);
    if (!!economicSector) {
      this.getTransformCatalog(
        CatalogsEnum.ACTIVIDAD_ECONOMICA,
        economicSector
      ).subscribe(
        data => {
          this.economicActivities = data;
          this.formPersonalData.get('economicActivity').enable();
          if (refreshData) {
            this.formPersonalData.get('economicActivity').setValue(this.customerInfo.economicActivity);
          }
        },
        (err) => { this.showErrorModal(err); }
      );
    }
  }

  cancel() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  save() {
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => {
        this.updateBasicData();
      },
      'updateData');
  }

  private updateBasicData(): void {
    const load = this.loadingCtrl.create({});
    load.present().then(() => {
      this.userFacade.userFeatures$.pipe(take(1)).subscribe(
        userFeatures => {
          const request = this.buildUpdateBasicDataRq(
            this.formPersonalData,
            this.formContactData,
            userFeatures,
            this.customerInfo.addressCode
          );
          this.updateBasicDataService.updateBasicDataDelegate(request).subscribe(
            () => {
              load.dismiss();
              this.userFacade.refreshBasicData();
              this.launchSuccessSaveDataModal();
            },
            (err) => {
              load.dismiss();
              this.showErrorModal(err);
            }
          );
        },
        (err) => { this.showErrorModal(err); }
      );
    });
  }

  private launchSuccessSaveDataModal(): void {
    const data: ModalSuccess = new ModalSuccess();
    data.title = 'Cambios realizados';
    data.content = 'Los datos han sido modificados.';
    data.button = 'Finalizar';
    this.bdbModal.launchSuccessModal(data, () => {
      if (!this.platforms.is('browser')) {
        this.events.publish('modal:close');
      }
      this.navCtrl.setRoot('DashboardPage');
    });
  }

  onSectorChange() {
    const sectorKey: string = this.formPersonalData.get('sector').value;
    this.updateEconomicActBySector(sectorKey);
  }

  onOccupationChange(refreshData: boolean = false) {
    const occupationKey = this.formPersonalData.get('occupation').value;
    if (!!occupationKey) {
      const sector = !!refreshData ? this.customerInfo.sector : '00';
      this.formPersonalData.get('sector').setValue(sector);
      this.formPersonalData.get('economicActivity').setValue('');
      const hasSector = !!this.economicSectorMap[occupationKey];
      if (hasSector) {
        this.formPersonalData.get('sector').setValidators(this.sectorValidation());
        this.formPersonalData.get('sector').enable();
        this.formPersonalData.get('economicActivity').disable();
      } else {
        this.formPersonalData.get('sector').setValidators([]);
        this.formPersonalData.get('sector').disable();
        this.formPersonalData.get('economicActivity').enable();
      }
      this.updateEconomicActBySector(sector, refreshData);
    } else {
      this.formPersonalData.get('sector').disable();
      this.formPersonalData.get('sector').setValue('00');
      this.formPersonalData.get('economicActivity').disable();
      this.formPersonalData.get('economicActivity').setValue('');
    }
  }

  public onDepartmentBirthChange(): void {
    this.resetControl(this.formPersonalData, 'cityBirth');
    const dpKey: string = this.formPersonalData.get('departmentBirth').value;
    this.updateCityByDepartment(dpKey, false, true);
  }

  public onDepartmentChange(): void {
    this.resetControl(this.formContactData, 'city');
    const dpKey: string = this.formContactData.get('department').value;
    this.updateCityByDepartment(dpKey, false, false);
  }

  public onCountryBirthChange(refreshData: boolean = false): void {
    const countryKey = this.formPersonalData.get('countryBirth').value;
    if (countryKey === 'COL') {
      this.formPersonalData.get('cityBirth').enable();
      this.formPersonalData.get('departmentBirth').enable();
      this.formPersonalData.get('departmentBirth').setValue('');
      const countryBdbMap = this.countriesBirth.find(country => country.key === 'COL');
      this.updateProvinceByCountry(countryBdbMap.cod, refreshData, true);
    } else {
      this.formPersonalData.get('cityBirth').disable();
      this.formPersonalData.get('departmentBirth').disable();
      this.formPersonalData.get('cityBirth').setValue('');
      this.formPersonalData.get('departmentBirth').setValue('');
      this.citiesBirth = [];
      this.departmentsBirth = [];
    }
  }

  public onCountryChange(refreshData: boolean = false): void {
    const countryKey = this.formContactData.get('country').value;
    if (countryKey === 'COL') {
      this.formContactData.get('city').enable();
      this.formContactData.get('department').enable();
      this.formContactData.get('department').setValue('');
      const countryBdbMap = this.countries.find(country => country.key === 'COL');
      this.updateProvinceByCountry(countryBdbMap.cod, refreshData, false);
    } else {
      this.formContactData.get('city').disable();
      this.formContactData.get('department').disable();
      this.formContactData.get('city').setValue('');
      this.formContactData.get('department').setValue('');
      this.cities = [];
      this.departments = [];
    }
  }

  onPhoneTypeChange() {
    this.validatePhoneType();
  }

  validatePhoneType() {
    const phoneTypeK = this.formContactData.get('phoneType').value;
    switch (phoneTypeK) {
      // 11 equivale a oficina
      // 43 equivale a otros
      case '11':
      case '43':
        this.formContactData.get('phoneNumber').setValidators([Validators.minLength(7), Validators.maxLength(7)]);
        this.formContactData.get('prefix').setValidators([Validators.required]);
        this.formContactData.get('ext').enable();
        this.formContactData.get('prefix').enable();
        break;
      // 12 equivale a celular
      case '12':
        this.formContactData.get('phoneNumber').setValidators([Validators.minLength(10), Validators.maxLength(10)]);
        this.formContactData.get('prefix').setValidators([]);
        this.formContactData.get('ext').disable();
        this.formContactData.get('prefix').disable();
        this.formContactData.get('ext').setValue('');
        this.formContactData.get('prefix').setValue('');
        break;
      // 15 es residencial
      case '15':
        this.formContactData.get('phoneNumber').setValidators([Validators.minLength(7), Validators.maxLength(7)]);
        this.formContactData.get('prefix').setValidators([]);
        this.formContactData.get('ext').disable();
        this.formContactData.get('prefix').enable();
        this.formContactData.get('ext').setValue('');
        break;
    }
    const number = this.formContactData.get('phoneNumber').value;
    this.phoneFieldValidation(number);
  }

  onConfEmailChange(confirmationEmail: string) {
    const email = this.formContactData.get('email').value;
    if (confirmationEmail === email) {
      this.equalEmails = true;
    } else {
      this.equalEmails = false;
      this.errorConfEmail = 'La información no coincide';
    }
  }

  onEmailChange(email: string) {
    const emailConf = this.formContactData.get('emailConf').value;
    if (email === emailConf) {
      this.equalEmails = true;
    } else {
      this.equalEmails = false;
      this.errorConfEmail = 'La información no coincide';
    }
  }

  onPhoneNumberChange(number: string) {
    this.phoneFieldValidation(number);
  }

  phoneFieldValidation(number: string) {
    const phoneTypeK = this.formContactData.get('phoneType').value;
    if (phoneTypeK === '12') {
      if (!number.startsWith('3')) {
        this.errorPhone = 'Número de celular debe empezar con 3';
        this.invalidPhone = true;
      } else if (number.length !== 10) {
        this.errorPhone = 'El celular debe tener 10 digitos';
        this.invalidPhone = true;
      } else {
        this.invalidPhone = false;
      }
    } else {
      if (number.length !== 7) {
        this.errorPhone = 'El telefono debe tener 7 digitos';
        this.invalidPhone = true;
      } else {
        this.invalidPhone = false;
      }
    }
  }

  onMobileNumberChange(number: string) {
    if (!number.startsWith('3')) {
      this.errorMobile = 'Número de celular debe empezar con 3';
      this.invalidMobile = true;
    } else if (number.length !== 10) {
      this.errorMobile = 'El celular debe tener 10 digitos';
      this.invalidMobile = true;
    } else {
      this.invalidMobile = false;
    }
  }

  onAbandonClicked() {
    this.navigation.onAbandonPressed(this.navCtrl);
  }

  private getTransformCatalog(catalogName: CatalogsEnum, parentid: string = ''): Observable<BdbMap[]> {
    return this.listCataloguesDelegateProvider
      .getListCatalogs(catalogName, parentid)
      .pipe(
        take(1),
        map<Catalogue[], BdbMap[]>(
          countries => this.upperCaseToFirstLetter(countries.map(countrie => ({
            key: countrie.id,
            value: countrie.name,
            cod: countrie.parentId
          }))
          )
        ));
  }

  private genericErrorModal(): void {
    this.bdbModal.launchErrModal(
      'Error',
      'Error al consultar la información. Intente de nuevo',
      'Aceptar',
      () => {
        this.navCtrl.setRoot('DashboardPage');
      }
    );
  }

  private sectorValidation(): ValidatorFn {
    return (sectorControl: FormControl): ValidationErrors => {
      const occupationKey = this.formPersonalData.get('occupation').value || '';
      const sectorAvaliable = !!this.economicSectorMap[occupationKey];
      if (sectorControl.value === '00' && sectorAvaliable) {
        return { notAvaliable: true };
      }
      return null;
    };
  }

  private buildUpdateBasicDataRq(
    personalDataForm: FormGroup,
    contactDataForm: FormGroup,
    userFeatures: UserFeatures,
    addressCode: string
  ): UpdateBasicDataRq {
    const request: UpdateBasicDataRq = {
      identificationNumber: userFeatures.customer.identificationNumber,
      identificationType: userFeatures.customer.identificationType,
      birthCity: personalDataForm.get('cityBirth').value,
      birthCountry: personalDataForm.get('countryBirth').value,
      birthStateProv: personalDataForm.get('departmentBirth').value,
      maritalStatus: personalDataForm.get('maritalStatus').value,
      nationality: personalDataForm.get('nationality').value,
      educationalLevel: personalDataForm.get('educationLevel').value,
      occupation: personalDataForm.get('occupation').value,
      dwellingType: personalDataForm.get('housing').value,
      email: contactDataForm.get('email').value,
      emailType: '31',
      economicActivity: personalDataForm.get('economicActivity').value
    };
    request.phoneNumberRecords = this.setPhoneNumbers(contactDataForm);
    request.postAddressRecords = this.setPostAddress(contactDataForm, addressCode);
    return request;
  }

  private setPhoneNumbers(contactDataForm: FormGroup): PhoneNumberRecord[] {
    const phoneNumberRecords = [];
    if (!!contactDataForm.get('phoneNumber').value) {
      phoneNumberRecords.push({
        phoneType: contactDataForm.get('phoneType').value,
        phone: contactDataForm.get('phoneNumber').value,
        phoneExtension: contactDataForm.get('ext').value,
        phoneIndicative: contactDataForm.get('prefix').value
      });
    }
    if (!!contactDataForm.get('mobileNumber').value) {
      const alreadyPushed = !!phoneNumberRecords.find(
        phone => phone.phone === contactDataForm.get('mobileNumber').value
          && phone.phoneType === '12'
      );
      if (!alreadyPushed) {
        phoneNumberRecords.push({
          phoneType: '12',
          phone: contactDataForm.get('mobileNumber').value
        });
      }
    }
    return phoneNumberRecords;
  }

  private setPostAddress(contactDataForm: FormGroup, addressCode: string): PostAddressRecord[] {
    const strAddress =
      ((!!contactDataForm.get('wayType1').value ? contactDataForm.get('wayType1').value + ' ' : '') +
      (!!contactDataForm.get('number1').value ? contactDataForm.get('number1').value + ' ' : '') +
      (!!contactDataForm.get('wayType2').value ? contactDataForm.get('wayType2').value + ' ' : '') +
      (!!contactDataForm.get('number2').value ? contactDataForm.get('number2').value + ' ' : '') +
      (!!contactDataForm.get('propertyType1').value ? contactDataForm.get('propertyType1').value + ' ' : '') +
      (!!contactDataForm.get('number3').value ? contactDataForm.get('number3').value + ' ' : '') +
      (!!contactDataForm.get('propertyType2').value ? contactDataForm.get('propertyType2').value + ' ' : '') +
      (!!contactDataForm.get('number4').value ? contactDataForm.get('number4').value + ' ' : '')).trim() +
      (!!contactDataForm.get('neighbourhood').value ? (' - ' + contactDataForm.get('neighbourhood').value) : '') +
      (!!contactDataForm.get('city').value ? (' - ' + contactDataForm.get('city').value) : '') +
      (!!contactDataForm.get('department').value ? (' - ' + contactDataForm.get('department').value) : '') +
      (!!contactDataForm.get('country').value ? (' - ' + contactDataForm.get('country').value) : '');
    const address1: PostAddressRecord = {
      addrType: contactDataForm.get('addressType').value,
      stateProv: contactDataForm.get('department').value,
      country: contactDataForm.get('country').value,
      city: contactDataForm.get('city').value,
      addressLine1: [
        contactDataForm.get('wayType1').value || '',
        contactDataForm.get('number1').value || '',
        contactDataForm.get('wayType2').value || '',
        contactDataForm.get('number2').value || '',
        '',
        contactDataForm.get('propertyType2').value || '',
        contactDataForm.get('number4').value || '',
        contactDataForm.get('propertyType1').value || '',
        contactDataForm.get('number3').value || '',
        '',
        contactDataForm.get('country').value || '',
        contactDataForm.get('department').value || '',
        contactDataForm.get('city').value || '',
        contactDataForm.get('neighbourhood').value || '',
        ''
      ].join(';'),
      addressLine2: addressCode,
      addressLine3: contactDataForm.get('neighbourhood').value || '',
      addressLine4: strAddress
    };
    const address2: PostAddressRecord = {
      addrType: null,
      stateProv: null,
      country: null,
      city: contactDataForm.get('city').value || '',
      addressLine1: contactDataForm.get('propertyType2').value || '',
      addressLine2: contactDataForm.get('number4').value || '',
      addressLine3: contactDataForm.get('propertyType1').value || '',
      addressLine4: contactDataForm.get('number3').value || ''
    };
    const address3: PostAddressRecord = {
      addrType: null,
      stateProv: null,
      country: null,
      city: null,
      addressLine1: contactDataForm.get('wayType1').value,
      addressLine2: contactDataForm.get('number1').value,
      addressLine3: contactDataForm.get('wayType2').value,
      addressLine4: contactDataForm.get('number2').value
    };
    return [
      address1,
      address2,
      address3
    ];
  }

  private showErrorModal(err: ApiGatewayError): void {
    this.serviceApiErrorModalService.launchErrorModal(
      this.viewRef,
      this.resolver,
      !!err ? err.customerErrorMessage : null
    );
  }

}
