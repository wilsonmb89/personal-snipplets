import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ProductsComponentsModule } from '../products/components/products-components.module';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { CardSelectionPageModule } from './pages/card-selection/card-selection.module';
import { CardActivationPageModule } from './pages/card-activation/card-activation.module';
import { CardBlockSelectionPageModule } from './pages/card-block-selection/card-block-selection.module';
import { CreditCardComponentModule } from '@app/shared/components/credit-card/credit-card.module';
import { BdbHttpModule } from '../../core/http/bdb-http.module';
import { CDTService } from './services/cdt.service';
import { CreditCardBlockingService } from './services/credit-card-blocking.service';
import { ActivatedCardPageModule } from './pages/activated-card/activated-card.module';
import { DashboardCardActivationService } from '../dashboard/services/dashboard-card-activation.service';
import { EnrollCustomCardModule } from '@app/delegate/enroll-custom-card-delegate/enroll-custom-card-delegate.module';
import { CreditCardService } from './services/credit-card.service';

@NgModule({
    imports: [
        ProductsComponentsModule,
        EnrollCustomCardModule,
        BdbUtilsModule,
        CardSelectionPageModule,
        CardActivationPageModule,
        CardBlockSelectionPageModule,
        CreditCardComponentModule,
        BdbHttpModule,
        ActivatedCardPageModule
    ],
    providers: [
        CDTService,
        CreditCardService,
        CreditCardBlockingService,
        DashboardCardActivationService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ProductsModule { }
