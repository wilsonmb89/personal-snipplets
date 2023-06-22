import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';


@Component({
    selector: 'toggle-component',
    templateUrl: 'toggle.html'
})
export class ToggleComponent implements OnChanges {

    @Input() isActive: boolean;
    @Input() isEnabled: boolean;
    @Output() onChangeState = new EventEmitter();

    activeModifier: string;
    enabledModifier: string;

    constructor() {}

    ngOnChanges(): void {
        this.activeModifier = this.isActive ? '--active' : '--inactive';
        this.enabledModifier = this.isEnabled ? '--enabled' : '--disabled';
    }
    changeToggleState() {
        this.onChangeState.emit();
    }
}
