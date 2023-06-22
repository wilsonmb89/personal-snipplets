import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpClientWrapperProvider } from './http-client-wrapper/http-client-wrapper.service';
import { BdbApiInterceptor } from './interceptors/bdb-api.interceptor';
import { BdbSecurityModule } from '../../shared/security/bdb-security.module';
import { TokenInterceptor } from '../../../providers/token-interceptor/token-interceptor';


export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: BdbApiInterceptor, multi: true}
];

export const httpTokenInterceptorProvider = [
  {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
];

@NgModule({
  declarations: [],
  imports: [HttpClientModule, BdbSecurityModule],
  providers: [
    HttpClientWrapperProvider,
    httpInterceptorProviders,
    httpTokenInterceptorProvider
  ]
})
export class BdbHttpModule {
}
