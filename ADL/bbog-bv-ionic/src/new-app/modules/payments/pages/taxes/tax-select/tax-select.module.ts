import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TaxSelectPage } from './tax-select';
import { CardOptionComponent } from '../../../components/card-option/card-option';
import { GenericVouchersModule } from '../../../../vouchers/generic-vouchers.module';
import { GenericVoucherPageModule } from '../../../../vouchers/pages/generic-voucher/generic-voucher.module';
import { GenericModalModule } from '@app/shared/components/modals/generic-modal/generic-modal.module';

@NgModule({
  declarations: [
    TaxSelectPage,
    CardOptionComponent
  ],
  imports: [
    IonicPageModule.forChild(TaxSelectPage),
    GenericVouchersModule,
    GenericVoucherPageModule,
    GenericModalModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class TaxSelectPageModule {}
