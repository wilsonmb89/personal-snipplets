export * from './components';

export type Color = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'carbon' | 'carbon-light' | 'gold' | 'copper' | 'olive' | 'scooter' | 'bouquet' | 'white';
export type ColorVariant = '100' | '400' | '700' | '900';
export type Fill = 'outline' | 'solid' | 'clear';
export type CssClassMap = { [className: string]: boolean };
export type Elevation = 0 | 2 | 4 | 8 | 16 | 24;
export type StateInput = 'basic' | 'success' | 'warn' | 'error';
export type Size = 'xs' | 's' | 'm' | 'l' | 'xl';
export type SizeModal = 'small' | 'default' | 'large' | 'xl';
export type Type = 'money' | 'number' | 'string';
export type TextFieldTypes =
  | 'date'
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'url'
  | 'currency'
  | 'time';

export type Position =
  | 'top-middle'
  | 'top-end'
  | 'top-start'
  | 'bottom-middle'
  | 'bottom-end'
  | 'bottom-start'
  | 'left-middle'
  | 'left-end'
  | 'left-start'
  | 'right-middle'
  | 'right-end'
  | 'right-start';
export type CardStyles = 'tabs' | 'buttons' | 'composable-row' | 'composable-column';
export type Mode = 'light' | 'dark';

export type SwitchType = "none" | "radio";

export type AvatarType = 'text' | 'img' | 'icon' | 'logo'

export interface PulseOnBoardingItem {
  mainTitle: string;
  description: string;
  imageUrl: string;

}

export interface PulseTooltipInfoData {
  title: string;
  description: string;
}

export type TextAlign =
  | 'center'
  | 'left'
  | 'right'
  | 'justify'
  | 'initial'
  | 'inherit';
export type GridBreakpoints = 'sm' | 'md' | 'lg';

export interface CssCustomRule {
  name: string;
  value: string;
}

export type DateTypes =
  | 'DD MMM YYYY'
  | 'DD/MM/YYYY';

export type LogoTypes =
  | 'visa'
  | 'master'
  | 'bbog'
  | 'claro'
  | 'tigo'
  | 'movistar'
  | 'virgin'
  | 'facilpass';

export interface PulseOptionData {
  value: string;
  disabled: boolean;
  name: string ;
}
