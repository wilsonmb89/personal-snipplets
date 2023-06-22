import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule, IonicErrorHandler, IonicApp } from 'ionic-angular';
import { MasterPage } from './master';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { NavbarSideModule } from '../../../components/navbar-side/navbar-side.module';

@NgModule({
  declarations: [
    MasterPage,
  ],
  imports: [
    IonicPageModule.forChild(MasterPage),
    ComponentsModule,
    PipesModule,
    NavbarSideModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MasterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MasterPageModule {}
