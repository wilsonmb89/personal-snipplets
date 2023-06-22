/** * @author <a href="mailto:ivan.pena@avaldigitallabs.com">ivanntis</a> */ 
import { Component, Element, h } from '@stencil/core';


@Component({
  tag: 'pulse-flowtm',
  styleUrl: 'pulse-flowtm.scss',
  shadow: true
})
/**
 * Se define un  template que se adapta al 100% del ancho
 * del padre que lo contentenga.
 * Tiene dos filas contenedores:
 * 1 -> Cabecera
 * 2 -> Cuerpo
 */
export class Pulseflowtm {
  @Element() element: HTMLElement;

  hostData() {
    return;
  }

  render() {

    return (
      <div class="flowtm-main">
        <div class="flowtm-main--container pulse-grid">
          <header class="row flowtm-main--container--header"> 
            <div class="col-xs-12 col-md-10 col-lg-10 col-md-offset-1 col-lg-offset-1">
              <slot name="header"></slot> 
            </div>
          </header>
          <section id="content" class="row flowtm-main--container--content">
            <div class="col-xs-12 col-md-10  col-md-offset-1"> <slot name="content"></slot> </div>
          </section>
        </div>
      </div>
    );
  }
}
