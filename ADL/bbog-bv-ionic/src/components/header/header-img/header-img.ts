import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'header-img',
  templateUrl: 'header-img.html'
})
export class HeaderImgComponent {

  @Input() imgPath;
  @Input() text = 'Atrás';
  @Output() backPressed = new EventEmitter();

  constructor() {
  }

  onBackPressed () {
    this.backPressed.emit();
  }
}
