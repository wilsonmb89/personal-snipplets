// register-web-components.ts
/* eslint-disable */
import { JSX as LocalJSX } from '@pulse.io/components/dist/loader';
import { HTMLAttributes } from 'react';

type StencilToReact<T> = {
  [P in keyof T]?: T[P] &
    Omit<HTMLAttributes<Element>, 'className'> & {
      class?: string;
      ref?: any;
    };
};

declare global {
  export namespace JSX {
    interface IntrinsicElements extends StencilToReact<LocalJSX.IntrinsicElements> {}
  }
}
