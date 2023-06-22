import { Directive, Renderer2, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[bdb-tag], [bdbTag]' // Attribute selector
})
export class BdbTagDirective implements OnInit {
  @Input() color: string;

  constructor(public renderer: Renderer2, public hostElement: ElementRef) {
  }

  ngOnInit(): void {
    const nativeElement = this.hostElement.nativeElement;
    this.renderer.addClass(nativeElement, 'bdb-tag');
    this.renderer.addClass(nativeElement, `button-outline-md-${this.getColor()}`);
  }

  private getColor(): string {
    return (this.color) ? this.color : 'bdb-blue';
  }
}
