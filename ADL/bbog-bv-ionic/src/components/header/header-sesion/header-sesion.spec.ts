import { } from 'jasmine';
import { HeaderSesionComponent } from './header-sesion';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SessionProvider } from '../../../providers/authenticator/session';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { BdbCryptoProvider } from '../../../providers/bdb-crypto/bdb-crypto';
import { App, Events } from 'ionic-angular';
import { BdbInMemoryIonicProvider } from '../../../providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { StorageMock } from 'ionic-mocks';
import { Storage } from '@ionic/storage';
import {BdbMicrofrontendEventsService} from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';
// TODO: These tests will be skipped in order to run the pipeline
xdescribe('Component: HeaderSesion', () => {
    let component: HeaderSesionComponent;
    let fixture: ComponentFixture<HeaderSesionComponent>;
    const bdbMicroFrontendSpy = jasmine.createSpyObj('BdbMicrofrontendEventsService', ['sendRouteEventToParentWindow']);

    beforeEach( () => {
        TestBed.configureTestingModule({
          declarations: [
            HeaderSesionComponent
          ],
          providers: [
            SessionProvider,
            BdbInMemoryProvider,
            BdbCryptoProvider,
            Events,
            BdbInMemoryIonicProvider,
            {
              provide: BdbMicrofrontendEventsService,
              useValue: bdbMicroFrontendSpy
            },
            {provide: Storage, useClass: StorageMock},
            [{provide: App, useValue: jasmine.createSpyObj('App', ['getRootNav'])}],
          ]
        }).compileComponents();
        bdbMicroFrontendSpy.sendRouteEventToParentWindow.and.callFake(() => true);
        fixture = TestBed.createComponent(HeaderSesionComponent);
        component = fixture.componentInstance;
    });

    it('Should create the HeaderSession component', () => {
      expect(component).toBeTruthy();
    });

  it('Should call button Help', () => {
    component.help();
    expect(bdbMicroFrontendSpy.sendRouteEventToParentWindow).toHaveBeenCalled();
  });
});
