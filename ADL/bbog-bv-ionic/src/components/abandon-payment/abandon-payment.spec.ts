import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { AbandonPaymentComponent } from './abandon-payment';
import { IonicModule, App, Events } from 'ionic-angular/index';
import { ProgressBarProvider } from '../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { BdbCryptoProvider } from '../../providers/bdb-crypto/bdb-crypto';
import { AccessDetailProvider } from '../../providers/access-detail/access-detail';
import { BdbMaskProvider } from '../../providers/bdb-mask/bdb-mask';
import { MobileSummaryProvider } from '../mobile-summary';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { AvalOpsProvider } from 'providers/aval-ops/aval-ops';
import { EventMapperProvider } from 'providers/funnel-events/events-mapper';
import { BdbUtilsProvider } from 'providers/bdb-utils/bdb-utils';
import { BdbRsaProvider } from 'providers/bdb-rsa/bdb-rsa';
import { CustomCurrencyPipe } from 'pipes/custom-currency';
import { BdbCryptoForgeProvider } from '../../providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../../providers/bdb-hash-base/bdb-hash-base';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

describe('component: AbandonPayment', () => {
  let de: DebugElement;
  let component: AbandonPaymentComponent;
  let fixture: ComponentFixture<AbandonPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AbandonPaymentComponent],
      imports: [
        IonicModule.forRoot(AbandonPaymentComponent),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        App,
        BdbInMemoryProvider,
        ProgressBarProvider,
        BdbCryptoProvider,
        AccessDetailProvider,
        BdbMaskProvider,
        Events,
        MobileSummaryProvider,
        DatePipe,
        CurrencyPipe,
        CustomCurrencyPipe,
        AvalOpsProvider,
        EventMapperProvider,
        BdbUtilsProvider,
        BdbRsaProvider,
        BdbCryptoForgeProvider,
        BdbHashBaseProvider,
        ClearStateFacade
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonPaymentComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('div'));
  });

  it('should create component', () => expect(component).toBeDefined());


  it('should emit onAbandonClicked', () => {
    const s: AccessDetailProvider = TestBed.get(AccessDetailProvider);
    spyOn(component.onAbandonClicked, 'emit');
    spyOn(s, 'unselectedOrigin');
    component.onAbandonPressed();
    fixture.detectChanges();
    expect(component.onAbandonClicked.emit).toHaveBeenCalled();
    expect(s.unselectedOrigin).toHaveBeenCalled();
  });

});
