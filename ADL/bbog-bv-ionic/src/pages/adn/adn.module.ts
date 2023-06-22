import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AdnPage} from './adn';
import {
  BdbAdnModule,
  EnvironmentConfig,
  EnvironmentConfigLiteral,
  EnvironmentService,
  EnvironmentServiceFactory
} from '@npm-bbta/bdb-adn';
import {ENV} from '@app/env';

const config: EnvironmentConfigLiteral = {
  env: ENV.STAGE_NAME,
  channel: ENV.ADN_CHANNEL,
  cypherJsKey: ENV.CYPHER_JS_KEY,
  tagManager: ENV.INJECTABLE_SCRIPTS_KEYS.GTM_ID
};

@NgModule({
  declarations: [
    AdnPage,
  ],
  imports: [
    IonicPageModule.forChild(AdnPage),
    BdbAdnModule.forRoot(),
  ],
  providers: [
    {provide: EnvironmentConfig, useValue: config},
    {provide: EnvironmentService, useFactory: EnvironmentServiceFactory, deps: [EnvironmentConfig]}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AdnPageModule {
}
