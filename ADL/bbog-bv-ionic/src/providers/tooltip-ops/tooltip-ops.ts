import { Injectable } from '@angular/core';
import { BdbCookies } from '../../providers/bdb-cookie/bdb-cookie';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { TooltipOptions } from 'app/models/tooltip-options';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { HTMLPulseTooltipControllerElement, HTMLPulseTooltipElement } from '@pulse.io/components/dist';

@Injectable()
export class TooltipOpsProvider {

  tooltipElements: { element: HTMLPulseTooltipElement, id: string }[] = [];

  constructor(public bdbCookie: BdbCookies) { }

  validateCookie(): boolean {
    const cookie = +this.bdbCookie.getCookie(InMemoryKeys.TooltipCounter);
    if (cookie < 3) {
      this.bdbCookie.setCookie(InMemoryKeys.TooltipCounter, cookie + 1, 360);
      return true;
    }
    return false;
  }

  presentToolTip(options: TooltipOptions): Observable<any> {
    const el: HTMLPulseTooltipControllerElement = document.querySelector('pulse-tooltip-controller');
    if (!!el) {
      return from(el.present(options).then((id: string) => id ));
    } else {
      const controller = document.createElement('pulse-tooltip-controller') as HTMLPulseTooltipControllerElement;
      document.body.appendChild(controller);
      const el2 = document.querySelector('pulse-tooltip-controller') as HTMLPulseTooltipControllerElement;
      return from(el2.present(options).then((id: string) => id ));
    }
  }

  removeTooltip(id: string) {
    const controller: HTMLPulseTooltipControllerElement = document.querySelector('pulse-tooltip-controller');
    const temp = document.getElementById(id);
    if (!!temp && !!controller) {
      controller.dismiss(id);
    }
  }

  assignElements = (id: string) => {
    const element = document.getElementById(id) as HTMLPulseTooltipElement;
    this.tooltipElements.push({ element, id });
  }

  getActiveTooltips(): { element: HTMLPulseTooltipElement, id: string }[] {
    return this.tooltipElements;
  }

  recalcTooltip() {
    if (this.tooltipElements.length > 0) {
      this.tooltipElements.forEach(e => {
        e.element.recalculate();
      });
    }
  }

  removeAllTooltip() {
    if (this.tooltipElements.length > 0) {
      this.tooltipElements.forEach(e => {
        this.removeTooltip(e.id);
      });
      this.tooltipElements = [];
    }
  }

}
