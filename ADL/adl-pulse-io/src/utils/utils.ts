import { CssCustomRule, DateTypes, GridBreakpoints } from "../interface";

export function hasShadowDom(el: HTMLElement) {
  return !!el.shadowRoot && !!(el as any).attachShadow;
}

export function getBreakPointBySize(width: number) {
  if (width < 480) {
    return 'xs';
  } else if (width < 540) {
    return 'sm';
  } else if (width < 768) {
    return 'md';
  } else {
    return 'lg';
  }
}

export function getGridBreakpointBySize(width: number): GridBreakpoints {
  if (width < 541) {
    return 'sm';
  } else if (width < 771) {
    return 'md';
  } else {
    return 'lg';
  }
}

export function getCustomCssProps(likeRule?: string): CssCustomRule[] {
  likeRule = `--${likeRule || ''}`;
  const props: CssCustomRule[] = [];
  [].slice.call(document.styleSheets)
  .reduce(function(prev: string, styleSheet: CSSStyleSheet) {
    if (styleSheet.cssRules) {
      return prev + [].slice.call(styleSheet.cssRules)
        .reduce(function(_prev: string, cssRule: CSSStyleRule) {        
          if (cssRule.selectorText == ':root') {
            let css = cssRule.cssText.split('{');
            css = css[1].replace('}','').split(';');
            for (let i = 0; i < css.length; i++) {
              const prop = css[i].split(':');
              if (prop.length == 2 && prop[0].indexOf(likeRule) == 1) {
                props.push({ name: prop[0].trim(), value: prop[1].trim() });
              }              
            }
          }
        }, '');
    }
  }, '');
  return props;
}

export function formatDate(date: Date, format: DateTypes): string {
  switch (format) {
    case 'DD MMM YYYY':
      return getNamedDate(date);
    case 'DD/MM/YYYY':
      return getSlashedDate(date);
    default:
      return date.toLocaleDateString();
  }
}

function getSlashedDate(date: Date): string {
  const day: string = date.getDate() <= 9 ? `0${date.getDate()}` : `${date.getDate()}`;
  const month: string = (date.getMonth() + 1) <= 9 ? `0${(date.getMonth() + 1)}` : `${(date.getMonth() + 1)}`;
  const year: string = `${date.getFullYear()}`;
  return `${day}/${month}/${year}`;
}

function getNamedDate(date: Date): string {
  const day: string = date.getDate() <= 9 ? `0${date.getDate()}` : `${date.getDate()}`;
  const month: string = (date.getMonth() + 1) <= 9 ? `0${(date.getMonth() + 1)}` : `${(date.getMonth() + 1)}`;
  const year: string = `${date.getFullYear()}`;
  return `${day} ${transformNamedMonth(month)} ${year}`;
}
 

function transformNamedMonth(month: string): string {
  const t = month
    .replace('01', 'ene')
    .replace('02', 'feb')
    .replace('03', 'mar')
    .replace('04', 'abr')
    .replace('05', 'may')
    .replace('06', 'jun')
    .replace('07', 'jul')
    .replace('08', 'ago')
    .replace('09', 'sep')
    .replace('10', 'oct')
    .replace('11', 'nov')
    .replace('12', 'dic')
  return t;
}

export function formatAMPM(date: Date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
}
