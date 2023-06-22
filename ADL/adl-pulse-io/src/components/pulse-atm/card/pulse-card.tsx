/** * @author <a href="mailto:juan.gonzalez@avaldigitallabs.com">barto</a> */

import { Component, Prop, Watch, h, Listen, Method, State } from "@stencil/core";
import { Elevation, Color, ColorVariant } from '../../../interface';
import { createColorClasses } from "../../../utils/themes";

@Component({
  tag: 'pulse-card',
  styleUrl: 'pulse-card.scss',
  shadow: true
})
/**
 * Componente que genera un marco para tarjetas
 * incluye por defecto los colores basados en el tema
 * y las 6 elevaciones diseñadas en el Design System
 */
export class PulseCard {

  @Prop() elevation: Elevation = 8;
  @Prop() color: Color;
  @Prop() colorgradient: boolean = false;
  @Prop() colorvariant: ColorVariant = '700';
  @Prop() elevationhover: Elevation = 0;
  @State() sizewindow = {
    isMobile:  false
  };
  private MobileBreakpoint = 540;

  @Listen('resize', { target: 'window' })
  resizeWindow() {
    this.recalculate()
  }

  @Method()
  async recalculate() {

    this.sizewindow = { 
      isMobile: (window.innerWidth <= this.MobileBreakpoint)
    }
  }

  componentDidLoad() {
    this.recalculate();
  }


  @Watch('elevation')
  validateIndex(newValue: Elevation) {
    const isValid = typeof newValue === 'number' && newValue % 2 === 0 && newValue <= 24;
    if (!isValid) { throw new Error('invalid elevation') };
  }

  constructor() { }

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color, this.colorvariant, this.colorgradient),
        [`pulse-elevation-hover-${this.elevationhover}`]: !!this.elevationhover && !this.sizewindow.isMobile,
        [`pulse-elevation-${this.elevation}`]: true,
      }
    };
  }

  render() {
    return (
      <slot></slot>
    );
  }
}