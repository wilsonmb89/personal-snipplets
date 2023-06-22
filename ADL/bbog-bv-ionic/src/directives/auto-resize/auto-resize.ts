import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Content } from 'ionic-angular';

@Directive({
  selector: '[auto-resize], [autoResize]' // Attribute selector
})

export class AutoResizeDirective {
  /*
   sm	540px	Set grid width to 540px when (min-width: 576px)
   md	720px	Set grid width to 720px when (min-width: 768px)
   lg	960px	Set grid width to 960px when (min-width: 992px)
   xl	1140px	Set grid width to 1140px when (min-width: 1200px)
   */
  @Input('autoResize') meth: string;
  @Output() onBreakPointChange: EventEmitter<string> = new EventEmitter();
  private actualBreakPoint: string;
  @HostListener('window:resize', ['$event'])

  public static asignBreakPoint(width) {
    if (width < 540) {
      return 'xs';
    } else if (width < 768) {
      return 'md';
    } else {
      return 'lg';
    }
  }

  constructor(private host: Content) { }

  onResize(event) {
    this.resizeContent(event.target.innerWidth);
  }

  resizeContent(width) {
    const sizeBreakPoint = AutoResizeDirective.asignBreakPoint(width);
    if (sizeBreakPoint !== this.actualBreakPoint) {
      this.actualBreakPoint = sizeBreakPoint;
      if (!!this.meth) {
        this.host[this.meth]();
      }
      this.onBreakPointChange.emit(this.actualBreakPoint);
    }
  }

}
