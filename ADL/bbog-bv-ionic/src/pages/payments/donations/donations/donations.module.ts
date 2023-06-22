import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DonationsPage } from './donations';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { ListCataloguesDelegateProvider } from '@app/delegate/list-parameters/list-catalogues-delegate.service';
import { UserFeaturesService } from '@app/apis/user-features/user-features.service';

@NgModule({
  declarations: [
    DonationsPage,

  ],
  imports: [
    IonicPageModule.forChild(DonationsPage),
    ComponentsModule,
    DirectivesModule,
  ],
  providers: [
  ListCataloguesDelegateProvider,
  UserFeaturesService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DonationsPageModule {}
