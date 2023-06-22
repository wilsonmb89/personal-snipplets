import ReactDom from 'react-dom';
import server from './test-utils/api-mock';

const destroyInterceptors = jest.fn();

jest.mock('@avaldigitallabs/bbog-pb-lib-frontend-commons', () => ({
  promptLogin: jest.fn().mockImplementation(() => Promise.resolve()),
  createInterceptors: jest.fn().mockImplementation(() => Promise.resolve({ destroy: destroyInterceptors })),
  decrypt: jest.fn()
}));

describe('bootstrap', () => {
  const OLD_ENV = process.env;
  const navigate = jest.fn();

  beforeAll(() => {
    process.env = { ...OLD_ENV, STANDALONE: 'true', LOGIN_URL: '/login', API_URL: '/api-gateway' };
    jest.spyOn(ReactDom, 'render').mockImplementation();
    server.listen();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    jest.resetAllMocks();
    server.close();
  });

  test('should mount app in standalone mode', async () => {
    const bootstrap = await import('./bootstrap');
    expect(bootstrap).toBeTruthy();
  });

  test('should mount app in microfrontend mode', async () => {
    process.env = { ...process.env, STANDALONE: 'false' };
    const bootstrap = await import('./bootstrap');
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
    const app = await bootstrap.mount(root, navigate);

    expect(bootstrap).toBeTruthy();
    app.unmount();
    expect(destroyInterceptors).toHaveBeenCalled();
  });
});
