import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { TransfersDestinationAcctPage } from './transfers-destination-acct';
import { AccountsDelegateModule } from '@app/delegate/accounts-delegate/acconts-delegate.module';
import { GenericModalModule } from '../../../../new-app/shared/components/modals/generic-modal/generic-modal.module';
import {ListParametersDelegateModule} from '@app/delegate/list-parameters/list-parameters-delegate.module';

@NgModule({
    declarations: [
        TransfersDestinationAcctPage,
    ],
    imports: [
        IonicPageModule.forChild(TransfersDestinationAcctPage),
        ComponentsModule,
        DirectivesModule,
        GenericModalModule,
        AccountsDelegateModule,
        ListParametersDelegateModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransfersDestinationAcctPageModule { }
