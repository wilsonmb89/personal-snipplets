import { TestBed } from '@angular/core/testing';
import {
  buildMockResponse,
  expectObject,
  mockHttpClientInfo,
} from '../services-apis.spec';
import { Catalogue, CatalogueRq } from './models/catalogue.model';
import { UserFeatures } from './models/UserFeatures';
import { UserFeaturesService } from './user-features.service';

let userFeaturesService: UserFeaturesService;
const userSettingsMock: UserFeatures = {
  customer: {
    channel: 'PB',
    identificationNumber: '2006699',
    identificationType: 'C',
    remoteAddress: '',
    terminalId: '001'
  },
  settings: {
    onBoarding: { pockets: false, anyOtherService: false },
    amounts: { maxAmountBeforeRequestSecurity: 50000000 },
    privateMode: false,
    unicefCardRequested: false,
    greenCardRequested: false,
    amtUnicefCampaignDash: 10,
    amtMillionBanquetCampaignDash: 2,
  },
  toggle: {
    allowedServices: {
      pockets: true,
      activateTD: false,
      dianTaxPayment: true,
      pqrInquiry: true,
      enableSetCardPin: true,
      cardsSecurity: true,
      toggleTC: true,
      facilpass: true,
      setCCPin: true,
      crossSellSavingAccountSDA: true,
      crossSellCreditCardCCA: true,
      crossSellMortgageCreditDLA: true,
      crossSellCreditService568: true,
      crossSellCreditLOC: true,
      crossSellLifeInsurance678: true,
      crossSellCDTCDA: true,
      crossSellFiduciaryFDA: true,
      crossSellPortfolioPurchase:  true,
      extraordinaryPaymentCredit: true,
      helpCenter: true,
      scheduledTransfers: true,
      betweenAccounts: true,
      cashAdvance: true
    },
    allowedOTPServices: {
      login: true,
      accountInscription: true,
      accountTransfer: true,
      billInscription: true,
      billPayment: true,
      creditCardInscription: true,
      creditCardPayment: true,
      creditInscription: true,
      creditPayment: true,
      pilaPayment: true,
      taxPayment: true,
      recharges: true,
      updateData: false,
      limitChanges: false,
      limitChangeNationalAccount: false,
      debitCardActivation: true,
      creditCardActivation: true,
    },
  },
};

describe('UserFeaturesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserFeaturesService, mockHttpClientInfo],
    }).compileComponents();
    userFeaturesService = TestBed.get(UserFeaturesService);
  });

  it('should post request GetUserFeatures', (done) => {
    buildMockResponse(userSettingsMock);
    const result = userFeaturesService.getUserFeatures();
    expectObject(result, userSettingsMock, done);
  });

  it('should post request SaveUserFeatures', (done) => {
    const userSettingsSaveMock = { ...userSettingsMock };
    userSettingsSaveMock.settings.privateMode = false;
    buildMockResponse(userSettingsSaveMock);
    const result = userFeaturesService.saveUserFeatures(userSettingsSaveMock);
    expectObject(result, userSettingsSaveMock, done);
  });

  it('should post request GetCatalogue', (done) => {
    const catalogueRqMock: CatalogueRq = {
      catalogName: 'CONVENIOS_DONACIONES',
      parentId: null
    };

    const catalogueRsMock: Array<Catalogue> = [
      { id: '3234', name: 'ACCION CULTURAL POPULAR', parentId: null },
      {
        id: '3428',
        name: 'BANQUETE DEL MILLÓN - MINUTO DE DIOS',
        parentId: null,
      },
      { id: '3677', name: 'CASA DE LA MADRE', parentId: null },
      {
        id: '0817',
        name: 'CONCILIO DE LAS ASAMBLEAS DE DIOS',
        parentId: null,
      },
      { id: '2091', name: 'CORPORACION GUSTAVO MATAMOROS', parentId: null },
      { id: '2016', name: 'DIOCESIS PRO CATEDRAL VPAR', parentId: null },
      { id: '9285', name: 'DONACIONES REPARACION VICTIMAS', parentId: null },
      { id: '1853', name: 'EQUINNOVA', parentId: null },
      { id: '0046', name: 'FUNDACION CARDIO INFANTIL', parentId: null },
      { id: '7447', name: 'FUNDACION HEROES DE COLOMBIA', parentId: null },
      { id: '4440', name: 'FUNDACION TVFAMILIA', parentId: null },
      { id: '4557', name: 'FUNDAMOR', parentId: null },
      { id: '4585', name: 'FUNDAMOR BONOS POR LA VIDA', parentId: null },
      {
        id: '9686',
        name: 'IG CEN CRIST CASA ORACION CABECERA',
        parentId: null,
      },
      { id: '4978', name: 'IURD', parentId: null },
      { id: '4998', name: 'TELETON', parentId: null },
      { id: '4066', name: 'UND. PARA LA PREV. DEL CANCER', parentId: null },
      { id: '5557', name: 'VISION MUNDIAL', parentId: null },
    ];

    buildMockResponse(catalogueRsMock);

    const result = userFeaturesService.getCatalogues(catalogueRqMock);
    expectObject(result, catalogueRsMock, done);
  });
});
