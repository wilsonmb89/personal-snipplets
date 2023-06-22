import { Environment } from './environment.model';

export const ENV: Environment = {
  API_URL: 'https://api-staging.bancodebogota.co/proxy-validator/',
  AUTH_URL: 'https://api-staging.bancodebogota.co/pb-authorizer/',
  API_ADL_URL: 'https://pb-stg-api-bogota.avaldigitallabs.com/',
  START_PAGE: 'NewLoginPage',
  BAL_YEK_CILBUP_1:
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmIURaixnlAAaZPLgY7I8' +
    'q3UJ0E2IkruZhmAIbq2lSO/N9SN9Hnl2SFKWg/taW9/PUF7uBbWSoQYlrsjxK8hy' +
    'q1H3RKT5L+CJ1ngWfv4KyV4MtS5HVI10MuYXr7l17F/isI8a4Au/k3HF3Xgxvg0N' +
    'o8ZtGO2NlpSjdzdH9As/tF7lgD71poNEFUHPpSj+TSBvPOu7HNhXOejIBYHmqd1V' +
    'A+5fDk1ZivcC2e6oEvqGNmFR1DHq2eTUwqS1833JZvfSfZRhHdJR7gc3Bk3LoLdt' +
    'e6TmyDZeY1kKNgM9iMgL2xDtFAYzVvRov/x83kaSfY/XOY82yRk63Uwf6LCkFoZ3' +
    'pQIDAQAB',
  VERIFY_CAPTCHA: 'lmnGRFD58V6IJFed4RF9PIqgOk1AAACxRY8',
  DOMAIN_URL: 'https://virtual-staging.bancodebogota.co/',
  API_AUTH_ENDPOINT_URL: 'https://api-staging.bancodebogota.co/bancavirtual/',
  PB_REDIRECT: 'https://localhost:7011/Banking/pb/psj',
  STAGE_NAME: 'st',
  VALIDATE_TOKEN: true,
  FUNNEL_URL: 'https://api-staging.bancodebogota.co/event/',
  VALID_USER_ALLOWED: true,
  ENDPOINT_HEALTHY: 'https://api-staging.bancodebogota.co/health/',
  CYPHER_JS_KEY: 'FRONTEND_CIPHER_BDB_ST',
  CYPHER_JS_KEY_FBOG: 'FRONTEND_CIPHER_BDB_ST',
  ENDPOINT_THREAT: 'https://h.online-metrix.net/fp/tags.js?org_id=adq0fjol',
  CREDIT_CARD_POSTAUTH: 'https://quieromitarjeta-staging.bancodebogota.com.co/#/authenticator-handler?uuid=',
  API_AUTH_INTEGRATION: 'https://api-staging.bancodebogota.co/api/',
  CONSUMO_POSTAUTH: 'https://creditodigital.labdigitalbdbstaging.co/#/authenticator-handler?uuid=',
  LIBRANZA_POSTAUTH: 'https://tulibranzafacil-staging.bancodebogota.co/authenticator-handler?uuid=',
  INSURANCE_POSTAUTH: 'https://seguros.labdigitalbdbstdi.co/Occupation?uuid=',
  SAFE_KEY_PAGE: 'https://virtual-staging.bancodebogota.co/#/recover-password/CREATE_PIN',
  SAFE_KEY_LOGIN: 'https://virtual-staging.bancodebogota.co/#/login',
  FORGOT_MY_KEY: 'https://virtual-staging.bancodebogota.co/#/recover-password/RECOVER_PIN',
  BV_URL: 'https://virtual-staging.bancodebogota.co/#/',
  WITH_NURA: true,
  PB_URL: 'https//www.bancodebogota.com',
  API_CREDIT_ENDPOINT_URL: 'https://api-staging.bancodebogota.co/credito/',
  API_ADL_ANALYTICS: 'https://analytics-stg-bogota.avaldigitallabs.com/',
  API_ADL_ANALYTICS_FBOG: 'https://analytics-stg-fidubogota.avaldigitallabs.com/',
  STREAM_NAME: 'yb-analytics-stg-pb-kns-stream',
  STREAM_NAME_FBOG: 'fbog-analytics-stg-fic-kns-stream',
  PARTITION_KEY: 1,
  API_ADN_URL: 'https://api.labdigbdbstgcd.com/adn/',
  ADN_CHANNEL: 'PB',
  API_FIDUCIA_URL: 'https://fic-stg-fidubogota-api.avaldigitallabs.com/',
  API_FIDUCIARY_URL: 'https://pb-stg-api-bogota.avaldigitallabs.com/api-gateway/fiduciary/',
  FIDUCIARY_API_ASSETS: 'https://fic-stg-fidubogota.avaldigitallabs.com/',
  FBOG_BAL_YEK_CILBUP_1:
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlxjaHwZAhdFEj0nHo37t' +
  'TJiGmq6HnwMN5l2uop1RJQ8ov2ksDL5I89fQRWtd8jW5FAgX38qQC/WY/n9yft+A' +
  'rspR4nLMA2A61dbnCAeCykglVLeEa64CjE5K11Lc4rS51pzqzH0vFjQN3uMnUmPv' +
  'TMhuTFLg5QFmycduMrfJnqOfbnRW9YWQ5547XBnXpogDhT8IM6LdU7wjTqX37tzc' +
  '8gqmsiZw4z3Q55NZpf7x4JVJ7D/97GRUP6b9lFPKqnUrkuULhzNIuCQqkd3P6AzT' +
  'I2EulFkDbqLNc/+gxd//Er83B4Y8ZfVZw8zArTnbg+8HQ6eezGgULiKo/3QaST8k' +
  'UQIDAQAB',
  USER_ALLOW_CACHE: false,
  API_BDB_WS: 'wss://sgtrpf36nb.execute-api.us-east-1.amazonaws.com/stage',
  IS_REDIRECT_TEMP: true,
  API_GATEWAY_ADL_URL: 'https://pb-stg-api-bogota.avaldigitallabs.com/api-gateway/',
  INJECTABLE_SCRIPTS_KEYS: {
    TEALIUM_SRC_ENV: 'qa',
    CYXTERA_SCRIPT_CI: '54c1fc40-b3a1-4a47-817e-56f12a7af68d',
    CYXTERA_SCRIPT_WI: '1570',
    GTM_ID: 'GTM-PSCQRNP'
  },
  CDT_GET_URL: 'https://landing.labdigitalbdbstcdt.co/?utm_source=banca_virtual' +
  '&utm_medium=propia&utm_campaign=pre_login_banca_virtual&utm_content=cdt',
  RECAPCHA_SITE_KEY: '6Ler_fwUAAAAAM2zBK_y1jFCjwok-xCGySLncLoA',
  PQR_POSTAUTH: 'https://solicitudes-pqrs.banbogota.com.co/?channel=PB&uuid=',
  CCA_CROSSELL_URL: 'https://tc-digital.labdigitalbdbsttc.com/',
  LOC_CROSSELL_URL: 'https://digital-staging.labdigitalbdbstaging.co/credito/index.html?sarlaft4=true',
  MICROFRONTEND_SHELL_ORIGIN: 'https://virtual-staging.bancodebogota.co/',
  COMPRA_CARTERA_URL: 'https://tc-digital.labdigitalbdbsttc.com/'
};
