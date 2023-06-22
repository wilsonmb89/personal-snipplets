import { HttpClient } from '@angular/common/http';
import { ComponentRef, Injectable } from '@angular/core';

@Injectable()
export class TabsMenuProvider {

  cmpRef: ComponentRef<any>;

  constructor(
    public http: HttpClient
  ) { }

  openTab(tab, target, componentFactoryResolver, callback: any) {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
    const factory = componentFactoryResolver.resolveComponentFactory(tab.component);
    this.cmpRef = target.createComponent(factory);
    callback(this.cmpRef);
  }

  getActiveTab(tabs) {
    return tabs.filter((e: any) => e.active === true)[0] || null;
  }

}
