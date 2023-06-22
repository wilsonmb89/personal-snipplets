import { Directive, Renderer2, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[pb-input]' // Attribute selector
})
export class PbInputDirective implements OnInit {

  constructor(public renderer2: Renderer2, public el: ElementRef) {
  }

  ngOnInit(): void {
    const nativeElement = this.el.nativeElement;
    this.renderer2.addClass(nativeElement, 'pb-input');
  }

}
