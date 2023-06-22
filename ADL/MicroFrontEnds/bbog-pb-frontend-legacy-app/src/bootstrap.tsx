import './styles.scss';
import { legacyNavigation, listenEvents } from './utils/events';

export interface AppProps {
  event: (type: string, data: string) => void;
  lastUrl: string;
}

const mount = async (
  el: Element,
  { event, lastUrl }: AppProps
): Promise<{ navigate: (route: string) => void; unmount: () => void }> => {
  const iframe = document.createElement('iframe');
  iframe.src = `${process.env.LEGACY_APP_URL}${lastUrl}`;
  iframe.className = 'legacy-app-iframe';
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-downloads');
  el.append(iframe);

  const eventHandler = listenEvents(event);

  return {
    navigate: route => {
      legacyNavigation(iframe, route);
    },
    unmount: () => {
      el.removeChild(iframe);
      window.removeEventListener('message', eventHandler);
    }
  };
};

if (process.env.STANDALONE === 'true') {
  const standaloneRootEl = document.getElementById('standalone-root');
  if (standaloneRootEl) {
    mount(standaloneRootEl, {
      lastUrl: '',
      event: type => console.log(`Dispatched ${type} event`)
    });
  }
}

export { mount };
