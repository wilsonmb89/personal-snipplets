import { Component, Input } from '@angular/core';

@Component({
  selector: 'default-view-menu',
  templateUrl: 'default-view-menu.html'
})
export class DefaultViewMenuComponent {

  @Input() img: any;
  @Input() message: string;
  @Input() button: any;

  constructor() { }

}
