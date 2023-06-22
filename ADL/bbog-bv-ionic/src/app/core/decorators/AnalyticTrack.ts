import { Events } from 'ionic-angular';
import { CoreModule } from '../core.module';
import { ENV } from '@app/env';


export function PageTrack(obj: {title}): ClassDecorator {
  return function (constructor: any) {
    if (ENV.STAGE_NAME !== 'pr' && ENV.STAGE_NAME !== 'st') {
      return ;
    }
    const ionViewDidEnter = constructor.prototype.ionViewDidEnter;

    constructor.prototype.ionViewDidEnter = function (...args: any[]) {
      setTimeout(() => {
        const events = CoreModule.injector.get(Events);
        events.publish('view:enter', {'name': document.URL, 'title': obj.title});
      }, 5);
      // tslint:disable-next-line: no-unused-expression
      ionViewDidEnter && ionViewDidEnter.apply(this, args);
    };

  };
}
