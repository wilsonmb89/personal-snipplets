import {NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../../../../app/core/core.module';
import {ModalAccountClipboardComponent} from './account-clipboard';
import {SendMailModalService} from '@app/shared/components/modals/send-mail-modal/services/send-mail-modal.service';
import {PulseModalControllerProvider} from '../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import {PulseToastService} from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import {EmailProvider} from '../../../../../providers/messenger';
import {NewPipesModule} from '@app/shared/pipes/new-pipes.module';

@NgModule({
  declarations: [
    ModalAccountClipboardComponent
  ],
  exports: [
    ModalAccountClipboardComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    NewPipesModule
  ],
  providers: [
    PulseModalControllerProvider,
    PulseToastService
  ],
  entryComponents: [
    ModalAccountClipboardComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class ModalAccountClipboardModule {
}
