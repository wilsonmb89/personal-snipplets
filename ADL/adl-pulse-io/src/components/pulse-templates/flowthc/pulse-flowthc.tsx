import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'pulse-flowthc',
  styleUrl: 'pulse-flowthc.scss',
  shadow: true
})
/**
 * Se define un  template que se adapta al 100% del ancho
 * del padre que lo contentenga.
 * Tiene dos filas contenedores:
 * 1 -> Cabecera
 * 2 -> Cuerpo
 */
export class PulseFlowthc {

  render() {
    return <Host class={{
      'pulse-flowthc': true
    }}>
      <slot name="header" />
      <slot name="content" />
    </Host>;
  }
}
