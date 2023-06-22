import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from 'ionic-angular/module';
import { BdbCardDetail } from './bdb-card-detail';
import { DirectivesModule } from '../../../../directives/directives.module';
import { ComponentsModule } from '../../../../components/components.module';
import { PipesModule } from '../../../../pipes/pipes.module';
import {ModalAccountClipboardModule} from '@app/shared/components/modals/account-clipboard-modal/account-clipboard.module';
import {PulseModalControllerProvider} from '../../../../providers/pulse-modal-controller/pulse-modal-controller';

@NgModule({
  declarations: [
    BdbCardDetail,
  ],
  imports: [
    IonicModule,
    DirectivesModule,
    ComponentsModule,
    PipesModule,
    ModalAccountClipboardModule
  ],
  exports: [
    BdbCardDetail
  ],
  providers: [
    PulseModalControllerProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class BdbCardDetailModule { }
