import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'pulse-flow-thc',
  styleUrl: 'pulse-flow-thc.scss',
  shadow: true
})
/**
 * Se define un  template que se adapta al 100% del ancho
 * del padre que lo contentenga.
 * Tiene dos filas contenedores:
 * 1 -> Cabecera
 * 2 -> Cuerpo
 */
export class PulseFlowTemplateHeaderContent {

  render() {
    return <Host class={{
      'pulse-flow-thc': true
    }}>
      <slot name="header" />
      <slot name="content" />
    </Host>;
  }
}
