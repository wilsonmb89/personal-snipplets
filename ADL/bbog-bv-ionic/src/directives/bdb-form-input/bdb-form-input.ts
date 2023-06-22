import { Directive, Renderer2, ElementRef, OnInit, Input } from '@angular/core';
import { InvalidField } from '../InvalidDirectives/invalid-field';


@Directive({
  selector: '[bdb-form-input]' // Attribute selector
})
export class BdbFormInputDirective extends InvalidField implements OnInit {

  constructor(public renderer2: Renderer2, public el: ElementRef) {
    super(renderer2, el);
  }

  ngOnInit(): void {
    const nativeElement = this.el.nativeElement;
    this.renderer2.addClass(nativeElement, 'custom-input');
  }

}
