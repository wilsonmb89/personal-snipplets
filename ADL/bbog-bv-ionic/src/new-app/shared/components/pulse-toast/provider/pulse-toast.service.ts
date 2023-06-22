import {Injectable} from '@angular/core';
import {PulseToastOptions} from '@app/shared/components/pulse-toast/model/generic-toast.model';
import { HTMLPulseToastElement } from '@pulse.io/components/dist';

@Injectable()
export class PulseToastService {

  constructor( ) { }

  private getAppRoot(doc: Document) {
    return doc.querySelector('ion-app') || doc.body;
  }

   private createOverlay(opts: PulseToastOptions): Promise<any> {
    return new Promise((resolve) => {
      customElements.whenDefined('pulse-toast').then(() => {
        const doc = document;
        const element = doc.createElement('pulse-toast') as any;
        for (const [key, value] of (<any>Object).entries(opts)) {
          if (!!value) {
            element.setAttribute(key, value);
          }
        }

        element.setAttribute('image', !!opts.image ? opts.image : 'assets/imgs/pulse-toast/clock-alert.svg');

        this.getAppRoot(doc).appendChild(element);
        resolve(element.componentOnReady() as any);
      });
    });
  }

  create(opts: PulseToastOptions): Promise<HTMLPulseToastElement> {
    return this.createOverlay(opts) as any;
  }

}
