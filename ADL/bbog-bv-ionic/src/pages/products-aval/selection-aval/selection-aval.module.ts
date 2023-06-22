import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectionAvalPage } from './selection-aval';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { ProductsDelegateModule } from '@app/delegate/products-delegate/products-delegate.module';

@NgModule({
  declarations: [
    SelectionAvalPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectionAvalPage),
    ComponentsModule,
    DirectivesModule,
    ProductsDelegateModule
  ],
})
export class SelectionAvalPageModule {}
