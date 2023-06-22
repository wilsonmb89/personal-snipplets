import { Injectable } from '@angular/core';
import { HTMLPulseOptionMenuElement, HTMLPulseOptionMenuControllerElement } from '@pulse.io/components/dist';
import { from } from 'rxjs/observable/from';
import {MenuOption} from './models/menu-option.model';

@Injectable()
export class MenuOptionsOpsProvider {

  optionMenuElement: { element: HTMLPulseOptionMenuElement, id: string };

  constructor() { }

  public async presentOptionMenu(options: MenuOption): Promise<HTMLPulseOptionMenuElement> {
      await customElements.whenDefined('pulse-option-menu-controller');
      const el: HTMLPulseOptionMenuControllerElement = document.querySelector('pulse-option-menu-controller');
      if (!!el) {
        return from(el.present(options).then((id: string) => this.assignElement(id))).toPromise();
      } else {
        const controller = document.createElement('pulse-option-menu-controller') as HTMLPulseOptionMenuControllerElement;
        document.body.appendChild(controller);
        await customElements.whenDefined('pulse-option-menu-controller');
        const el2 = document.querySelector('pulse-option-menu-controller') as HTMLPulseOptionMenuControllerElement;
        return from(el2.present(options).then((id: string) => this.assignElement(id))).toPromise();
      }
  }

  public removeMenuOption(id: string): void {
    const controller: HTMLPulseOptionMenuControllerElement = document.querySelector('pulse-option-menu-controller');
    const temp = document.getElementById(id);
    if (!!temp && !!controller) {
      controller.dismiss(id);
    }
  }

  public getActiveMenuOption(): { element: HTMLPulseOptionMenuElement, id: string } {
    return this.optionMenuElement;
  }

  public removeAllMenuOption(): void {
    Array.from(document.getElementsByTagName('pulse-option-menu')).forEach(
      (menuOption: HTMLPulseOptionMenuElement) => {
        menuOption.dismiss();
      }
    );
  }

  private assignElement(id: string): HTMLPulseOptionMenuElement {
    const element = document.getElementById(id) as HTMLPulseOptionMenuElement;
    return element;
  }

  public recalcTooltip(): void {
      this.optionMenuElement.element.recalculate();
  }
}
