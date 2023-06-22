import { Component, Input, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'bdb-loader',
  templateUrl: 'bdb-loader.html'
})
export class BdbLoaderComponent {
  _color = 'bdb-fill-primary';
  @Input()
  set color(color: string) {
    this._color = `bdb-fill-${color}`;
  }

  constructor() { }

}
