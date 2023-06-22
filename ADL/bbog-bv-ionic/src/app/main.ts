import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import 'web-animations-js/web-animations.min';
import { ENV } from '@app/env';
import { defineCustomElements } from '@pulse.io/components/dist/loader';

platformBrowserDynamic().bootstrapModule(AppModule);
defineCustomElements(window);

if (ENV.STAGE_NAME === 'pr') {
  const script = document.createElement('script');
  script.innerHTML = `window['adrum-start-time'] = new Date().getTime();
    (function(config){
        config.appKey = 'AD-AAB-AAM-PST';
        config.adrumExtUrlHttps = 'https://cdn.appdynamics.com';
        config.beaconUrlHttps = 'https://col.eum-appdynamics.com';
        config.xd = {enable : true};
    })(window['adrum-config'] || (window['adrum-config'] = {}));`;
  document.body.appendChild(script);
} else {
  const script = document.createElement('script');
  script.innerHTML = `window['adrum-start-time'] = new Date().getTime();
    (function(config){
        config.appKey = 'AD-AAB-AAN-BAA';
        config.adrumExtUrlHttps = 'https://cdn.appdynamics.com';
        config.beaconUrlHttps = 'https://col.eum-appdynamics.com';
        config.xd = {enable : true};
    })(window['adrum-config'] || (window['adrum-config'] = {}));`;
  document.body.appendChild(script);

}


