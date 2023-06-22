const eventTypes = ['NAVIGATION', 'LOGIN', 'LOGOUT', 'START', 'TOP_NAVIGATION'];

const routes = new Map<string, Record<string, string>>([
  ['/dashboard', { name: 'DashboardPage' }],
  ['/settings', { name: 'settings%app' }],
  ['/transfers/history', { name: 'NewTransferMenuPage', paramKey: 'tab', paramValue: 'history' }],
  ['/transfers/scheduled', { name: 'NewTransferMenuPage', paramKey: 'tab', paramValue: 'scheduled' }],
  ['/transfers/accounts', { name: 'NewTransferMenuPage', paramKey: 'tab', paramValue: 'accounts' }],
  ['/transfers/advances', { name: 'NewTransferMenuPage', paramKey: 'tab', paramValue: 'advances' }],
  ['/transfers/fiduciary', { name: 'NewTransferMenuPage', paramKey: 'tab', paramValue: 'fiduciary' }],
  ['/transfers/loan', { name: 'NewTransferMenuPage', paramKey: 'tab', paramValue: 'loan' }],
  ['/transfers/forex', { name: 'NewTransferMenuPage', paramKey: 'tab', paramValue: 'forex' }],
  ['/logout', { name: 'authentication/logout' }],
  ['/login', { name: 'LoginPage' }]
]);

export const listenEvents = (
  event: (type: string, data: unknown) => void
): ((params: { origin: string; data: unknown }) => void) => {
  const handler = ({ origin, data }) => {
    if (origin !== process.env.LEGACY_APP_ORIGIN || !eventTypes.includes(data.event)) {
      return;
    }
    if (data.event === 'TOP_NAVIGATION') {
      window.top.location.href = data.data.route;
      return;
    }
    event(data.event, data.data);
  };
  window.addEventListener('message', handler);
  return handler;
};

export const legacyNavigation = (iframe: HTMLIFrameElement, route: string): void => {
  iframe.contentWindow.postMessage(
    {
      app: 'MF_SHELL',
      event: 'NAVIGATION',
      route: routes.get(route)
    },
    process.env.LEGACY_APP_ORIGIN
  );
};
