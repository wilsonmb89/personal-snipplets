import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[bdb-normalize-diacritic]' // Attribute selector
})

export class BdbNormalizeDiacriticDirective {

  constructor() { }

  public static normalizeDiacriticText(inText: string): string {
    if (!!inText) {
      inText = inText
        .normalize('NFD')
        .replace(/[\u0300-\u036f´\`¨]/g, '')
        .replace(/[^A-Za-z0-9 ]+/g, '') // remove all special character
        .replace(/^\w/, (c) => c.toUpperCase())
        .replace(/(^|\. *)([a-z])/g, (match, separator, char) => separator + char.toUpperCase());
    }
    return inText;
  }

  @HostListener('input', ['$event'])
  onInputChange(event) {
    const initialValue = event.target.value;
    event.target.value = BdbNormalizeDiacriticDirective.normalizeDiacriticText(initialValue);
    if (initialValue !== event.target.value) {
      event.stopPropagation();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = BdbNormalizeDiacriticDirective.normalizeDiacriticText(event.clipboardData.getData('text/plain'));
    document.execCommand('insertText', false, pastedInput);
  }

  @HostListener('focus', ['$event'])
  onFocus(event) {
    const initialValue = event.target.value;
    event.target.value = BdbNormalizeDiacriticDirective.normalizeDiacriticText(initialValue);
    if (initialValue !== event.target.value) {
      event.stopPropagation();
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event) {
    const initialValue = event.target.value;
    event.target.value = BdbNormalizeDiacriticDirective.normalizeDiacriticText(initialValue);
    if (initialValue !== event.target.value) {
      event.stopPropagation();
    }
  }

}
