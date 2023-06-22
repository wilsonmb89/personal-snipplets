import { Component, Input, OnInit } from '@angular/core';
import { AdditionalInfo } from '../../model/generic-modal.model';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.html'
})
export class AdditionalInfoComponent implements OnInit {

  @Input() additionalInfo: AdditionalInfo;

  constructor() {}

  ngOnInit(): void {}

}
