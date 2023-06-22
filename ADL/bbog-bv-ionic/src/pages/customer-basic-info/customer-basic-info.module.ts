import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerBasicInfoPage } from './customer-basic-info';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../../components/components.module';
import { CustomerBasicDataDelegateModule } from '@app/delegate/customer-basic-data-delegate/customer-basic-data-delegate.module';
import { ListCataloguesDelegateProvider } from '@app/delegate/list-parameters/list-catalogues-delegate.service';
import { ServiceApiErrorModalModule } from '@app/shared/components/modals/service-api-error-modal/service-api-error-modal.module';

@NgModule({
  declarations: [
    CustomerBasicInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerBasicInfoPage),
    DirectivesModule,
    ComponentsModule,
    CustomerBasicDataDelegateModule,
    ServiceApiErrorModalModule
  ],
  providers: [
    ListCataloguesDelegateProvider
  ]
})
export class CustomerBasicInfoPageModule {}
