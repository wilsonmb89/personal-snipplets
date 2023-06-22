/** * @author <a href="mailto:ivan.pena@avaldigitallabs.com">ivanntis</a> */

import { Component, Listen, h } from '@stencil/core';
import { getBreakPointBySize } from '../../../utils/utils';

@Component({
  tag: 'pulse-flowtt',
  styleUrl: 'pulse-flowtt.scss',
  shadow: true
})
/**
 * Se define un  template que se adapta al 100% del ancho
 * del padre que lo contenga, y se cambian de posicion según 
 * el tamaño del padre
 * Tiene 3 secciones contenedores:
 * 1 -> Cabecera
 * 2 -> Cuerpo a
 * 3 -> Cuerpo b
 */
export class PulseFlowtt {
  private summary: HTMLElement;
  private head: HTMLElement;

  hostData() {
    return;
  }

  @Listen('scroll', { target: 'window' })
  handleScroll() {
    this.setTopSummaryCalc();
  }

  @Listen('resize', { target: 'window' })
  handleResize() {
    this.setTopSummaryCalc();
  }

  componentDidLoad() {
    this.setTopSummaryCalc();
  }

  public setTopSummaryCalc() {
    const offsetBottom = (getBreakPointBySize(window.innerWidth) === 'lg') ? 24 : 0;
    this.summary.style.top = `${(this.head.offsetHeight + offsetBottom)}px`;
  }

  render() {
    return (
      <div class="flowtt-main">
        <div class="flowtt-main--container pulse-grid">
          <header id="header" class="row flowtt-main--container--header" ref={el => this.head = el as HTMLElement}>
            <div class="col-xs-12 col-md-10 col-lg-10 col-md-offset-1 col-lg-offset-1">
              <slot name="header"></slot>
            </div>
          </header>
          <section class="row flowtt-main--container--content">
            <div class="col-xs-12 col-md-10 col-lg-3  col-md-offset-1 col-lg-offset-2 order-lg-2 flowtt-main--container--content--summary" ref={el => this.summary = el as HTMLElement}> <slot name="summary"></slot> </div>
            <div class="col-xs-12  col-md-8 col-lg-5 col-md-offset-2 col-lg-offset-1 order-lg-1 flowtt-main--container--content--data"> <slot name="content"></slot> </div>
          </section>
        </div>
      </div>
    );
  }
}
