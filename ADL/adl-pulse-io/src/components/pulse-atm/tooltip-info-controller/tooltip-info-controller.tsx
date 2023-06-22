import { Component, Method, ComponentInterface, EventEmitter, Event} from '@stencil/core';
import { getAppRoot } from '../../../utils/overlays/overlays';

@Component({
  tag: 'pulse-tooltip-info-controller'
})
export class ToolTipInfoController implements ComponentInterface {

  @Event() onCloseChange: EventEmitter<string>;
  @Method()
  async present<T>(properties): Promise<T> {
    const doc = document;
    let element = doc.createElement('pulse-tooltip-info') as any;
    Object.assign(element, properties);
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
          this.onCloseChange.emit(id);
          resolve(id);
        },
        true
      );
    });
  }
}
