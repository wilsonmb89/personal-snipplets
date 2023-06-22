import { Directive, Input, ElementRef, OnInit, Renderer2 } from '@angular/core';

/**
 * Generated class for the AddAttributeColDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[add-attribute-col], [addAttributeCol]' // Attribute selector
})
export class AddAttributeColDirective implements OnInit {

  @Input() col: string;
  @Input() lg: string;
  @Input() xl: string;
  @Input() md: string;
  @Input() sm: string;
  @Input() mobile = false;
  @Input() tablet = false;
  @Input() hiddenWeb = false;

  constructor(
    private renderer: Renderer2,
    private hostElement: ElementRef
  ) { }

  ngOnInit() {

    if (this.xl) {
      this.renderer.setAttribute(this.hostElement.nativeElement, `col-xl-${this.xl}`, '');
    }

    if (this.lg) {
      this.renderer.setAttribute(this.hostElement.nativeElement, `col-lg-${this.lg}`, '');
    }

    if (this.md) {
      this.renderer.setAttribute(this.hostElement.nativeElement, `col-md-${this.md}`, '');
    }

    if (this.sm) {
      this.renderer.setAttribute(this.hostElement.nativeElement, `col-sm-${this.sm}`, '');
    }

    if (this.col) {
      this.renderer.setAttribute(this.hostElement.nativeElement, `col-${this.col}`, '');
    }

    if (!this.mobile) {
      this.renderer.setAttribute(this.hostElement.nativeElement, 'hidden-sm-down', '');
    }

    if (!this.tablet) {
      this.renderer.setAttribute(this.hostElement.nativeElement, 'hidden-md-down', '');
    }

    if (this.hiddenWeb) {
      this.renderer.setAttribute(this.hostElement.nativeElement, 'hidden-lg-up', '');
    }
  }

}
