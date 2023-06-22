import { NgModule } from '@angular/core';
import {  IonicModule } from 'ionic-angular';
import { NavbarSideComponent } from './navbar-side';

@NgModule({
  declarations: [
    NavbarSideComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [NavbarSideComponent]
})
export class NavbarSideModule { }
