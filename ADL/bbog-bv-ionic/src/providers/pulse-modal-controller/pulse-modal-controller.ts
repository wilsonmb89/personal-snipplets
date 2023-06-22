import { Injectable, NgZone, Injector, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { HTMLPulseModalElement } from '@pulse.io/components/dist';

export interface PulseModalOptions {
  component: any;
  componentProps?: any;
  size?: string;
}

export class AngularFrameworkDelegate {
  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private location: ViewContainerRef | undefined,
    private zone: NgZone
  ) { }

  attachView = (
    resolver: ComponentFactoryResolver,
    injector: Injector,
    location: ViewContainerRef | undefined,
    container: any,
    component: any,
    params: any
  ) => {
    const factory = resolver.resolveComponentFactory(component);
    const componentRef = location.createComponent(factory, location.length, injector);
    const instance = componentRef.instance;
    const hostElement = componentRef.location.nativeElement;
    if (params) {
      Object.assign(instance, params);
    }
    container.appendChild(hostElement);
    componentRef.changeDetectorRef.reattach();
    return hostElement;
  }

  attachViewToDom(
    container: any,
    component: any,
    params?: any
  ) {
    return this.zone.run(() => {
      return new Promise(resolve => {
        const el = this.attachView(this.resolver, this.injector, this.location,
          container, component, params
        );
        resolve(el);
      });
    });
  }
}

@Injectable()
export class PulseModalControllerProvider {

  constructor(
    private injector: Injector,
    private zone: NgZone
  ) { }

  private getAppRoot(doc: Document) {
    return doc.querySelector('ion-app') || doc.body;
  }

  private createOverlay(opts: object | undefined): Promise<any> {
    return new Promise((resolve) => {
      customElements.whenDefined('pulse-modal').then(() => {
        const doc = document;
        const element = doc.createElement('pulse-modal') as any;
        Object.assign(element, opts);
        this.getAppRoot(doc).appendChild(element);
        resolve(element.componentOnReady() as any);
      });
    });
  }

  create(
    options: PulseModalOptions,
    viewRef: ViewContainerRef,
    resolver: ComponentFactoryResolver
  ): Promise<HTMLPulseModalElement> {

    const injector = this.injector;
    const zone = this.zone;

    return this.createOverlay({
      ...options,
      delegate: new AngularFrameworkDelegate(
        resolver, injector, viewRef, zone
      )
    }) as any;
  }

  private getOverlays(doc: Document): any[] {
    const selector = 'pulse-modal';
    return (Array.from(doc.querySelectorAll(selector)) as any[]);
  }

  private getOverlay(doc: Document): any | undefined {
    const overlays = this.getOverlays(doc);
    return overlays[overlays.length - 1];
  }

  private dismissOverlay(doc: Document, data: any): Promise<boolean> {

    const overlay = this.getOverlay(doc);
    if (!overlay) {
      return Promise.reject('overlay does not exist');
    }
    return overlay.dismiss(data);
  }

  dismiss(data?: any) {
    return this.dismissOverlay(document, data);
  }

}
