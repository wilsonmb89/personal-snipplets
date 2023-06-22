import { Directive, Input, Renderer2, ElementRef, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[add-attr-table]' // Attribute selector
})
export class AddAttrTableDirective implements OnInit {

  @Input() justify: string;
  @Input() nowrap = false;
  @Input() platform: any;
  @Input() color: string;
  @Input() type: string;

  constructor(
    private renderer: Renderer2,
    private hostElement: ElementRef
  ) {
  }

  ngOnInit() {

    const nativeElement = this.hostElement.nativeElement;
    const mqLg = window.matchMedia('(min-width: 768px)');
    const mqMd = window.matchMedia('(min-width: 540px) and (max-width: 767px)');
    const mqSm = window.matchMedia('(max-width: 539px)');

    if (!!this.justify) {
      this.renderer.setStyle(nativeElement, 'justify-self', this.justify);
    }

    if (this.nowrap) {
      this.addNowRap(nativeElement);
    }

    if (!!this.platform) {

      if (!this.platform.desktop) {
        this.renderer.setAttribute(nativeElement, `hidden-p-lg-up`, '');
      }

      if (!this.platform.tablet && !this.platform.desktop) {
        this.renderer.setAttribute(nativeElement, `hidden-p-md-up`, '');
      }

      if (!this.platform.tablet && !this.platform.mobile) {
        this.renderer.setAttribute(nativeElement, `hidden-p-md-down`, '');
      }

      if (!this.platform.mobile) {
        this.renderer.setAttribute(nativeElement, `hidden-p-sm-down`, '');
      }

      if (mqLg.matches && !!this.platform.desktop && !!this.platform.desktop.nowrap && this.platform.desktop.nowrap === true) {
        this.addNowRap(nativeElement);
      } else if (mqMd.matches && !!this.platform.tablet && !!this.platform.tablet.nowrap && this.platform.tablet.nowrap === true) {
        this.addNowRap(nativeElement);
      } else if (mqSm.matches && !!this.platform.mobile && !!this.platform.mobile.nowrap && this.platform.mobile.nowrap === true) {
        this.addNowRap(nativeElement);
      } else if (!this.nowrap) {
        this.notNowRap(nativeElement);
      }

      mqLg.addListener((e) => {
        if (e.matches && !!this.platform.desktop && !!this.platform.desktop.nowrap && this.platform.desktop.nowrap === true) {
          this.addNowRap(nativeElement);
        } else if ((!this.platform.desktop || !this.platform.desktop.nowrap) && !this.nowrap) {
          this.notNowRap(nativeElement);
        }
      });

      mqMd.addListener((e) => {
        if (e.matches && !!this.platform.tablet && !!this.platform.tablet.nowrap && this.platform.tablet.nowrap === true) {
          this.addNowRap(nativeElement);
        } else if ((!this.platform.tablet || !this.platform.tablet.nowrap) && !this.nowrap) {
          this.notNowRap(nativeElement);
        }
      });

      mqSm.addListener((e) => {
        if (e.matches && !!this.platform.mobile && !!this.platform.mobile.nowrap && this.platform.mobile.nowrap === true) {
          this.addNowRap(nativeElement);
        } else if ((!this.platform.mobile || !this.platform.mobile.nowrap) && !this.nowrap) {
          this.notNowRap(nativeElement);
        }
      });
    }

    if (!!this.color) {
      this.renderer.addClass(nativeElement.firstElementChild, this.color);
    }

    if (!!this.type) {
      this.renderer.addClass(nativeElement.firstElementChild, this.type);
    }

  }

  addNowRap(nativeElement) {
    this.renderer.setStyle(nativeElement, 'white-space', 'nowrap');
    this.renderer.setStyle(nativeElement, 'overflow', 'hidden');
    this.renderer.setStyle(nativeElement, 'text-overflow', 'ellipsis');
  }

  notNowRap(nativeElement) {
    this.renderer.removeStyle(nativeElement, 'white-space');
    this.renderer.removeStyle(nativeElement, 'overflow');
    this.renderer.removeStyle(nativeElement, 'text-overflow');
  }

}
