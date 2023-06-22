import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[bdbRadioRef]'
})
export class BdbRadioButtonRefDirective {
    public type: string;

    constructor(private hostElement: ElementRef) {
        this.type = this.hostElement.nativeElement.type;
    }

}
