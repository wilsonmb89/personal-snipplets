import { Directive, OnInit, Renderer2, ElementRef, Input } from '@angular/core';
import { InvalidField } from '../InvalidDirectives/invalid-field';

@Directive({
  selector: '[bdb-select]' // Attribute selector
})
export class BdbSelectDirective  extends InvalidField implements OnInit {

  constructor(public renderer: Renderer2, public hostElement: ElementRef) {
    super(renderer, hostElement);
  }

  ngOnInit(): void {
    const nativeElement = this.hostElement.nativeElement;
    this.renderer.addClass(nativeElement, 'bdb-select');
  }

}
