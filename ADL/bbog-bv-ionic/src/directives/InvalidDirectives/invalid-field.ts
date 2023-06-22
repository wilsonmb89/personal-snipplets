import { Directive, Renderer2, ElementRef, OnInit, Input } from '@angular/core';


export class InvalidField {
    @Input('isInvalid')
    set checked(invalid: boolean) {
        this.addInvalid(invalid);
    }

    constructor(public renderer: Renderer2, public hostElement: ElementRef) {
    }

    addInvalid(invalid: boolean) {
        const nativeElement = this.hostElement.nativeElement;
        if (invalid) {
            this.renderer.addClass(nativeElement, 'is-invalid');
        } else {
            this.renderer.removeClass(nativeElement, 'is-invalid');
        }
    }
}
