import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContextMenuPage } from './context-menu';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ContextMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(ContextMenuPage),
    ComponentsModule
  ],
})
export class ContextMenuPageModule {}
