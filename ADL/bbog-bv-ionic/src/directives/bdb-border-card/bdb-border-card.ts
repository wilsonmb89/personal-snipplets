import { Directive, Input, OnInit, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[bdb-border-card],[BdbBorderCard]'
})
export class BdbBorderCardDirective implements OnInit {

  @Input('BdbBorderCard') color: string;

  constructor(
    private renderer: Renderer2,
    private hostElement: ElementRef
  ) {
  }

  ngOnInit() {

    const nativeElement = this.hostElement.nativeElement;
    this.renderer.addClass(nativeElement, 'bdb-border-card');

    if (this.color !== '') {
      this.renderer.addClass(nativeElement, `bdb-border-color-${this.color}`);
    }
  }

}
