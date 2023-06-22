import { Injectable } from '@angular/core';
import { HTMLPulseTooltipInfoControllerElement, HTMLPulseTooltipInfoElement } from '@pulse.io/components/dist';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';

import { TooltipInfoOptions } from './models/tooltip-info-options.model';

@Injectable()
export class TooltipInfoOpsProvider {

  tooltipElements: { element: HTMLPulseTooltipInfoElement, id: string }[] = [];

  constructor() { }

  public presentToolTip(options: TooltipInfoOptions): Observable<HTMLPulseTooltipInfoElement> {
    this.syncTooltipElements();
    const tooltipOpen = this.tooltipElements.find(element => element.id === options.id);
      if (!(!!tooltipOpen)) {
      const el: HTMLPulseTooltipInfoControllerElement = document.querySelector('pulse-tooltip-info-controller');
      if (!!el) {
        return from(el.present(options).then((id: string) => this.assignElement(id)));
      } else {
        const controller = document.createElement('pulse-tooltip-info-controller') as HTMLPulseTooltipInfoControllerElement;
        document.body.appendChild(controller);
        const el2 = document.querySelector('pulse-tooltip-info-controller') as HTMLPulseTooltipInfoControllerElement;
        return from(el2.present(options).then((id: string) => this.assignElement(id) ));
      }
    }
    return of(document.getElementById(options.id) as HTMLPulseTooltipInfoElement);
  }

  public removeTooltip(id: string): void {
    const controller: HTMLPulseTooltipInfoControllerElement = document.querySelector('pulse-tooltip-info-controller');
    const temp = document.getElementById(id);
    if (!!temp && !!controller) {
      controller.dismiss(id);
    }
    this.syncTooltipElements();
  }

  public getActiveTooltips(): { element: HTMLPulseTooltipInfoElement, id: string }[] {
    return this.tooltipElements;
  }

  public recalcTooltip(): void {
    if (this.tooltipElements.length > 0) {
      this.tooltipElements.forEach(e => {
        e.element.recalculate();
      });
    }
  }

  public removeAllTooltip(): void {
    Array.from(document.getElementsByTagName('pulse-tooltip-info')).forEach(
      (tooltipInfo: HTMLPulseTooltipInfoElement) => {
        tooltipInfo.dismiss();
      }
    );
    this.syncTooltipElements();
  }

  private syncTooltipElements(): void {
    const tooltipElementsTemp: { element: HTMLPulseTooltipInfoElement, id: string }[] = [];
    this.tooltipElements.forEach(elementCur => {
      const element = document.getElementById(elementCur.id) as HTMLPulseTooltipInfoElement;
      if (!!element) {
        tooltipElementsTemp.push(elementCur);
      }
    });
    this.tooltipElements = tooltipElementsTemp;
  }

  private assignElement(id: string): HTMLPulseTooltipInfoElement {
    const element = document.getElementById(id) as HTMLPulseTooltipInfoElement;
    this.tooltipElements.push({ element, id });
    return element;
  }

}
