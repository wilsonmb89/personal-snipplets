import { Directive, Renderer2, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[bdb-checked],[BdbChecked]'
})
export class BdbCheckedDirective {

  @Input('BdbChecked')
  set checked(checked: boolean) {
    this.changeChecked(checked);
  }

  constructor(
    private renderer: Renderer2,
    private hostElement: ElementRef
  ) { }

  changeChecked(checked: boolean) {
    const nativeElement = this.hostElement.nativeElement;
    if (checked) {
      const child = document.createElement('div');
      const img = document.createElement('img');
      img.src = 'assets/imgs/check-card.svg';
      this.renderer.addClass(nativeElement, 'bdb-checked');
      this.renderer.appendChild(child, img);
      this.renderer.addClass(child, 'green-check');
      this.renderer.appendChild(nativeElement, child);
    } else {
      if (!!nativeElement.children[1]) {
        this.renderer.removeChild(nativeElement, nativeElement.children[1]);
      }
      this.renderer.removeClass(nativeElement, 'bdb-checked');
    }
  }

}
