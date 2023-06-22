import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';

import { SearchTaxFormPage } from './search-tax-form';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { GenericModalModule } from '@app/shared/components/modals/generic-modal/generic-modal.module';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { FlowHeaderComponentModule } from '@app/shared/components/flow/flow-header/flow-header.module';
import {GenericVouchersModule} from '../../../../../vouchers/generic-vouchers.module';
import {GenericVoucherPageModule} from '../../../../../vouchers/pages/generic-voucher/generic-voucher.module';
import { PaymentBillersDelegateModule } from '@app/delegate/payment-billers-delegate/payment-billers-delegate.module';

@NgModule({
  declarations: [
    SearchTaxFormPage
  ],
  imports: [
    IonicPageModule.forChild(SearchTaxFormPage),
    CommonModule,
    ComponentsModule,
    GenericModalModule,
    BdbUtilsModule,
    FlowHeaderComponentModule,
    GenericVouchersModule,
    GenericVoucherPageModule,
    PaymentBillersDelegateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SearchTaxFormPageModule {}
