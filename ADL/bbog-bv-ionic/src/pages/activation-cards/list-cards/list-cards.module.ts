import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListCardsPage } from './list-cards';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ListCardsPage,
  ],
  imports: [
    IonicPageModule.forChild(ListCardsPage),
    ComponentsModule
  ],
})
export class ListCardsPageModule {}
