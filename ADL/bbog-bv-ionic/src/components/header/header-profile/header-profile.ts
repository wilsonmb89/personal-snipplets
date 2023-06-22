import { Component } from '@angular/core';

@Component({
  selector: 'header-profile',
  template:
  `
    <div class="profile-image"></div>
    <div class="icon-arrow"></div>
  `
})
export class HeaderProfileComponent {

  text: string;

  constructor() {
  }

}
