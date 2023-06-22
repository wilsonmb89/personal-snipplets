import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BdbSecurityRestProvider } from './bdb-security-rest';


@NgModule({
  declarations: [],
  imports: [
    HttpClientModule

  ],
  providers: [
    BdbSecurityRestProvider
  ]
})
export class BdbSecurityModule {
}
