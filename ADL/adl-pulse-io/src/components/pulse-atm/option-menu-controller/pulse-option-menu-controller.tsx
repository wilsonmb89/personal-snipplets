import { Component, Method, ComponentInterface, EventEmitter, Event } from '@stencil/core';
import { getAppRoot } from '../../../utils/overlays/overlays';
import { Color, ColorVariant } from '../../../interface';

export interface PulseMenuData {
  id: any;
  data:  Array<PulseOptionMenuData>;
  value: any;
  show: boolean;
  htmlelementref: HTMLElement;
}

export interface PulseOptionMenuData {
  label: string;
  value: string;
  action: any;
  color: Color;
  icon: string;
  colorvariant: ColorVariant;
  showIcon: boolean;
}

@Component({
  tag: 'pulse-option-menu-controller'
})
export class PulseOptionMenuController implements ComponentInterface {

  @Event() closeChange: EventEmitter<string>;

  @Method()
  async present<T>(properties: PulseMenuData): Promise<T> {
    const doc = document;
    let element = doc.createElement('pulse-option-menu') as any;
    Object.assign(element, properties);
    element.addEventListener(
        'click',
        (ev) => {
          ev.stopPropagation();
        }
      );

    properties.data.forEach((opts: PulseOptionMenuData) => {
      let option = doc.createElement('pulse-option') as any;
      option.textContent = opts.label;
      Object.assign(option, opts);
      option.addEventListener(
        'optionOnClick',
        (event) => {
         opts.action(event.detail)
         const menu = document.querySelector('pulse-option-menu');
         menu.show = false;
        }
      );
      element.appendChild(option);
    });

    getAppRoot(doc).appendChild(element);
    return new Promise(resolve => {
      element.addEventListener(
        'presentEnd',
        () => {
          return resolve(properties.id);
        },
        true
      );
    });
  }

  @Method()
  async dismiss<T>(id): Promise<T> {
    const el = document.getElementById(id) as any;
    el.dismiss();
    return new Promise(resolve => {
      el.addEventListener(
        'onCloseChange',
        () => {
          this.closeChange.emit(id);
          resolve(id);
        },
        true
      );
    });
  }
}
