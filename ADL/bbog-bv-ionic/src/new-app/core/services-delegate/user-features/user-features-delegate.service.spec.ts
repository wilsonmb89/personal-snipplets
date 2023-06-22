import { TestBed } from '@angular/core/testing';
import { UserFeatures } from '@app/apis/user-features/models/UserFeatures';
import { UserFeaturesService } from '@app/apis/user-features/user-features.service';
import { of } from 'rxjs/observable/of';
import { UserFeaturesDelegateService } from './user-features-delegate.service';

let userFeaturesDelegateService: UserFeaturesDelegateService;
const userFeaturesMockData: UserFeatures = {
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
      crossSellPortfolioPurchase: true,
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
    }
  },
};

describe('UserFeaturesDelegateService', () => {
  const userFeaturesServiceMock = jasmine.createSpyObj('UserFeaturesService', [
    'getUserFeatures',
    'saveUserFeatures'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserFeaturesDelegateService,
        { provide: UserFeaturesService, useValue: userFeaturesServiceMock },
      ],
    }).compileComponents();
    userFeaturesDelegateService = TestBed.get(UserFeaturesDelegateService);

    it('getUserFeatures inquiry should return data mapped', (done) => {
      userFeaturesServiceMock.getUserFeatures.and.returnValue(of(userFeaturesMockData));
      const serviceResult = userFeaturesDelegateService.getUserFeatures();
      expect(serviceResult).toBeTruthy();

      serviceResult.subscribe(res => {
        expect(res).toEqual(userFeaturesMockData);
        done();
      });
    });

    it('saveUserFeatures inquiry should return data mapped', (done) => {
      const mockData = {...userFeaturesMockData};
      mockData.settings.unicefCardRequested = true;

      userFeaturesServiceMock.saveUserFeatures.and.returnValue(of(mockData));
      const serviceResult = userFeaturesDelegateService.saveUserFeatures(mockData);
      expect(serviceResult).toBeTruthy();

      serviceResult.subscribe(res => {
        expect(res).toEqual(userFeaturesMockData);
        done();
      });
    });
  });
});
