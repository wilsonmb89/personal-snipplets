import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlockPlatformPage } from './block-platform';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    BlockPlatformPage,
  ],
  imports: [
    IonicPageModule.forChild(BlockPlatformPage),
    ComponentsModule,
    DirectivesModule
  ],
})
export class BlockPlatformPageModule {}
