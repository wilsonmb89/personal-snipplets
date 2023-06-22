import { Color, CssClassMap } from "../interface";

export function createColorClasses(color: Color | undefined | null, variant = '700', gradient = false): CssClassMap | undefined {
  return {
    [`pulse-color`]: true,
    [`pulse-color-gradient`]: gradient,
    [`pulse-color-${color}-${variant}`]: true,
  }
}
