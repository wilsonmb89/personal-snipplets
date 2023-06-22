interface LegacyAppProps {
  lastUrl: string;
  event: (type: string, data: { route?: string }) => void;
}

declare module 'legacyApp/bootstrap' {
  const mount: (
    el: HTMLElement,
    props: LegacyAppProps
  ) => Promise<{ route: (route: string) => void; unmount: () => void }>;
  export { mount };
}

declare module 'legacyApp/version' {
  const version: string;
  export default version;
}

declare module 'settingsApp/bootstrap' {
  const mount: (el: HTMLElement, onNavigate: (route: string) => void) => Promise<{ unmount: () => void }>;
  export { mount };
}

declare module 'settingsApp/version' {
  const version: string;
  export default version;
}

declare module 'customerAssistanceApp/bootstrap' {
  const mount: (el: HTMLElement, onNavigate: (route: string) => void) => Promise<{ unmount: () => void }>;
  export { mount };
}

declare module 'customerAssistanceApp/version' {
  const version: string;
  export default version;
}

declare module 'transfersApp/bootstrap' {
  const mount: (el: HTMLElement, onNavigate: (route: string | number) => void) => Promise<{ unmount: () => void }>;
  export { mount };
}

declare module 'transfersApp/version' {
  const version: string;
  export default version;
}

declare module 'authenticationApp/bootstrap' {
  const mount: (el: HTMLElement, onNavigate: (route: string | number) => void) => Promise<{ unmount: () => void }>;
  export { mount };
}

declare module 'authenticationApp/version' {
  const version: string;
  export default version;
}

declare module '*.scss';
declare module '*.svg';
