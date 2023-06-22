import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { UserFacade } from './facades/user.facade';
import { LastLoginEffects } from './effects/last-login.effect';
import { UserSettingsEffects } from './effects/user-settings.effect';
import { ValidationApiService } from '../../../core/services-apis/identity-validation/validation-api.service';
import { CatalogueEffects } from './effects/catalogue.effect';
import { UserFeaturesService } from '@app/apis/user-features/user-features.service';
import { CustomerBasicDataService } from '@app/apis/customer-basic-data/customer-basic-data.service';
import { BdbCryptoForgeProvider } from '../../../../providers/bdb-crypto-forge/bdb-crypto-forge';

@NgModule({
    imports: [
        EffectsModule.forFeature([
            LastLoginEffects,
            UserSettingsEffects,
            CatalogueEffects
        ])
    ],
    providers: [
        UserFacade,
        ValidationApiService,
        CustomerBasicDataService,
        UserFeaturesService,
        BdbCryptoForgeProvider
    ]
})

export class UserStoreModule { }
