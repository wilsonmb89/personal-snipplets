import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {AuthorizationEffects} from '@app/modules/authentication/store/effects/auth.effect';
import {AuthFacade} from '@app/modules/authentication/store/facades/auth.facade';
import {AuthenticatorServiceApi} from '@app/modules/authentication/services/auth/authenticator.service';
import {LoaderStoreModule} from '@app/shared/store/loader/loader-store.module';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';

@NgModule({
    imports: [
        EffectsModule.forFeature([
            AuthorizationEffects
        ]),
      BdbUtilsModule
    ],
    providers: [
        AuthFacade,
        AuthenticatorServiceApi,
        LoaderStoreModule
    ]
})

export class AuthStoreModule { }
