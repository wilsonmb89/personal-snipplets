/** * @author <a href="mailto:ivan.pena@avaldigitallabs.com">ivanntis</a> */ 

import { Component, h } from '@stencil/core';
import { getBreakPointBySize } from '../../../utils/utils';

@Component({
  tag: 'pulse-flowtr',
  styleUrl: 'pulse-flowtr.scss',
  shadow: true
})
/**
 * Se define un  template que se adapta al 100% del ancho
 * del padre que lo contentenga. y se cambian de posicion segun 
 * el tamaño del padre. esta pensado en flujos que sean maetsro 
 * detalle y e cual el detalle tiene scroll y matestro siempre 
 * esta fijo
 * Tiene 3 secciones contenedores:
 * 1 -> Cabecera
 * 2 -> Mestro 
 * 3 -> Detalle
 */
export class PulseFlowtr {
  private master: HTMLElement;
  private head: HTMLElement;

  hostData() {
    return;
  }
  

  componentDidLoad() {
    this.setTopSummaryCalc();
  }

  public setTopSummaryCalc() {
    const offsetBottom = (getBreakPointBySize(window.innerWidth) === 'lg') ? 24 : 0;
    this.master.style.top = `${(this.head.offsetHeight + offsetBottom)}px`;
  }

  render() {
    return (
      <div class="flowtr-main">
        <div class="flowtr-main--container pulse-grid">
          <div class="flowtr-main--container--bckg"><header id="header" class="row flowtr-main--container--header" ref={el => this.head = el as HTMLElement}>
            <div class="col-xs-12 col-md-10 col-lg-10 col-md-offset-1 col-lg-offset-1">
              <slot name="header"></slot>
            </div>
          </header>
          <section id="master" class="row flowtr-main--container--master" ref={el => this.master = el as HTMLElement}>
            <div class="col-xs-12 col-md-10 col-lg-10 col-md-offset-1 col-lg-offset-1"> 
            <slot name="master"></slot> </div>
          </section>
          </div>
          <section id="detail" class="row flowtr-main--container--detail pulse-margin-xl-xs-v">
            <div class="col-xs-12 col-md-10  col-md-offset-1"> <slot name="detail"></slot> </div>
          </section>
        </div>
      </div>
    );
  }
}
