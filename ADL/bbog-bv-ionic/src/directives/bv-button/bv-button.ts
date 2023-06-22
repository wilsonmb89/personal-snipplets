import { Directive, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[bv-button],[bvButton]',
  exportAs: 'bvButton',

})
export class BvButtonDirective implements OnInit {
  @Input() color: string;
  @Input() outline: boolean;
  @Input() small: boolean;
  private _show: boolean;
  @Input()
  set showLoader(show: boolean) {
    this.showIndicator(show);
  }
  loader: any;
  // labelButton: string;
  childB: any;

  ngOnInit(): void {

    const nativeElement = this.hostElement.nativeElement;

    if (this.small) {
      this.renderer.addClass(nativeElement, 'bv-button-small');
    }

    if (this.outline) {

      this.renderer.addClass(nativeElement, 'bv-button-outline');
      this.renderer.addClass(nativeElement, `button-outline-md-${this.getColor()}`);

    } else {
      this.renderer.addClass(nativeElement, 'bv-button');

      if (this.getColor().endsWith('-gradient')) {
        this.renderer.addClass(nativeElement, `bdb-bg-color-${this.getColor()}`);
      } else {
        this.renderer.addClass(nativeElement, `button-md-${this.getColor()}`);
      }

    }



    // this.labelButton = this.hostElement.nativeElement.textContent;
    this.childB = nativeElement.children[0];

  }

  constructor(private renderer: Renderer2, private hostElement: ElementRef) {

  }

  private showIndicator(show) {
    if (show) {
      if (!!this.childB) {
        this.renderer.removeChild(this.hostElement.nativeElement, this.childB);
        this.buildSpinner();
        this.renderer.setProperty(this.hostElement.nativeElement, 'disabled', true);
      }

    } else {
      if (this.childB !== '' && this.childB !== undefined && !!this.loader) {
          this.renderer.removeChild(this.hostElement.nativeElement, this.loader);
          this.renderer.appendChild(this.hostElement.nativeElement, this.childB);
          this.renderer.setProperty(this.hostElement.nativeElement, 'disabled', false);
      }

    }
  }

  private getColor(): string {
    return (this.color) ? this.color : 'bdb-blue';
  }

  buildSpinner() {
    this.loader = this.renderer.createElement('div');
    this.renderer.addClass(this.loader, 'spinner');
    this.renderer.appendChild(this.hostElement.nativeElement, this.loader);
  }

}
