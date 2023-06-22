import { Directive, HostListener, OnInit } from '@angular/core';
import { BdbCardDetail } from '../../components/core/molecules/bdb-card-detail/bdb-card-detail';

@Directive({
  selector: '[breakpoint-detector]' // Attribute selector
})
export class BreakpointDetectorDirective implements OnInit {

  private actualBreakPoint: string;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeContent(event.target.innerWidth);
  }

  constructor(private host: BdbCardDetail) {

  }

  ngOnInit() {
    const w = window.innerWidth;
    this.host.breakpointAssign(this.asignBreakPoint(w));
  }

  resizeContent(width) {
    const sizeBreakPoint = this.asignBreakPoint(width);
    if (sizeBreakPoint !== this.actualBreakPoint) {
      this.actualBreakPoint = sizeBreakPoint;
      this.host.breakpointAssign(sizeBreakPoint);
    }
  }

  asignBreakPoint(width) {

    if (width < 540) {
      return 'xs';
    } else if (width < 768) {
      return 'md';
    } else {
      return 'lg';
    }

  }

}
