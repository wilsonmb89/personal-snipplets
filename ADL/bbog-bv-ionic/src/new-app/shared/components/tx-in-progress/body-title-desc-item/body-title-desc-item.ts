import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'body-title-desc-item',
  templateUrl: './body-title-desc-item.html'
})
export class BodyTitleDescItemComponent implements OnInit {

  @Input() title: string;
  @Input() noBorder = false;

  constructor() {}

  ngOnInit(): void {}

}
