import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NewDirectivesModule } from '@app/shared/directives/new-directives.module';
import { IonicModule } from 'ionic-angular';
import { HttpClientWrapperProvider } from '../../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';
import { SessionProvider } from '../../../providers/authenticator/session';
import { PulseModalControllerProvider } from '../../../providers/pulse-modal-controller/pulse-modal-controller';
import { TokenOtpProvider } from '../../../providers/token-otp/token-otp/token-otp';
import { FormChangePassComponent } from './components/change-keys/form-change-pass/form-change-pass';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { CustomerSecurityService } from '../../../new-app/core/services-apis/customer-security/customer-security.service';
import { ChangeKeysService } from './services/change-keys.service';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import { FlowChangeKeysFacade } from './store/facades/flow-change-keys.facade';
import { CardsInfoDelegateService } from '@app/delegate/products-delegate/cards-info-delegate.service';
import { CardsInfoFacade } from './store/facades/cards-info.facade';

@NgModule({
    declarations: [
        FormChangePassComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        IonicModule,
        NewDirectivesModule
    ],
    providers: [
        SessionProvider,
        HttpClientWrapperProvider,
        TokenOtpProvider,
        PulseModalControllerProvider,
        FlowChangeKeysFacade,
        BdbInMemoryProvider,
        CustomerSecurityService,
        ChangeKeysService,
        GenericModalService,
        PulseToastService,
        CardsInfoDelegateService,
        CardsInfoFacade
    ],
    exports: [
        FormChangePassComponent,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [
    ]
})
export class SettingsModule { }
