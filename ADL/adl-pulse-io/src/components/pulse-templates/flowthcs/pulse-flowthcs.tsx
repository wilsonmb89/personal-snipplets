import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'pulse-flowthcs',
  styleUrl: 'pulse-flowthcs.scss',
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
 * El cuerpo A tendrá definido un tamaño máximo de 6 columnas
 * para el breakpoint de desktop y distribuirlo de forma organizada
 * con el cuerpo B esto es parametrizable mediante la propiedad
 * lgcontentsize
 */
export class PulseFlowthcs {

  private lgoffsetsummary: number = 1;
  private readonly lg_max_content_size = 6;

  @Prop() lgcontentsize: number = 6;

  componentWillLoad() {
    if (this.lgcontentsize >= this.lg_max_content_size || this.lgcontentsize <= 0) {
      this.lgcontentsize = 6;
      this.lgoffsetsummary = 1;
    } else {
      this.lgoffsetsummary = (this.lg_max_content_size - this.lgcontentsize) + 1;
    }
  }

  render() {
    return <Host class={{
      'pulse-flowthcs': true
    }}>
      <div class="pulse-flowthcs-container">
        <div class="pulse-flowthcs-container__header">
          <slot name="header" />
        </div>
        <div class="pulse-flowthcs-container__body">
          <div class="pulse--grid">
            <div class="pulse-row">
              <div class={`pulse-flowthcs-container__body__content pulse-col pulse-col-sm-4 pulse-col-md-6 pulse-col-lg-${this.lgcontentsize} pulse-offset-md-1 pulse-offset-lg-1`}>
                <slot name="content" />
              </div>
              <div class={`pulse-flowthcs-container__body__summary pulse-col pulse-col-sm-4 pulse-col-md-8 pulse-col-lg-3 pulse-offset-lg-${this.lgoffsetsummary}`}>
                <slot name="summary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Host>;
  }
}
