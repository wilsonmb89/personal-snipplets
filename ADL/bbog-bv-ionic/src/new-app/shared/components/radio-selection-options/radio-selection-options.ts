import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { RadioOptionCard } from '@app/shared/models/components/radio-selection-options.model';

@Component({
  selector: 'radio-selection-options',
  templateUrl: 'radio-selection-options.html'
})
export class RadioSelectionOptionsComponent implements OnInit {

  @Input() radioOptionsId: string;
  @Input() optionsList: RadioOptionCard[] = [];
  @Output() optionSelectedEmiter = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  public changeOptionSelected(optionSelected: RadioOptionCard): void {
    this.optionsList.forEach(
      option => {
        option.selected = optionSelected.acct.productNumber === option.acct.productNumber;
      }
    );
    this.optionSelectedEmiter.emit(optionSelected);
  }

  public resetListOptions(): void {
    this.optionsList.forEach(option => option.selected = false);
  }
}
