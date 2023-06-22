import { Injector } from '@angular/core';
import { NgModule } from '@angular/core';
import { BdbRsaProvider } from '../../providers/bdb-rsa/bdb-rsa';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [BdbRsaProvider],
})
export class CoreModule {
  public static injector: Injector;

  constructor(injector: Injector) {
    CoreModule.injector = injector;
  }
}
