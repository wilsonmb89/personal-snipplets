import { Environment } from './environment.model';

export const ENV: Environment = {
  API_URL: 'https://api-canales.bancodebogota.co/bancavirtual/',
  AUTH_URL: 'http://authenticatorweb.bancodebogota.com.co',
  API_ADL_URL: 'https://pb-api-bogota.avaldigitallabs.com/',
  START_PAGE: 'NewLoginPage',
  BAL_YEK_CILBUP_1:
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw0KiPRFMIHDkR40luaDj' +
    'VXXxZD7Q9zf6Iw+PnyjNKdKidiBTh9D2KZj/zFkYkYhEgq4jnBpzp/hCGz3T9XOq' +
    'Z30/sYNCKrysBg+DD4HTjMR0qZEjz7jHZLNj7joVggXSDfrIwzjuS6k9J0Kze9/K' +
    'GrdWkBo8uMTTQTjTloUUQ07z77q+hksWrQBS5HMM3GopHWN9Y6Z1PDVtAdCty8rZ' +
    'b63CibOydwTsrwBS8gBQ6+bHYFzWNfDJI3nC9Gs7eR0xb1xdnsCvC034oK+G+XMi' +
    'Q9NbKN62JVYto3yre858RdH0ZdGCZOBghY9Ctb2LcN4V7CAxs7UHqadKYGmhVJRG' +
    '2wIDAQAB',
  VERIFY_CAPTCHA: 'lmnGRFD58V6IJFed4RF9PIqgOk1AAACxRY8',
  DOMAIN_URL: 'https://virtual.bancodebogota.co/',
  API_AUTH_ENDPOINT_URL: 'https://api-canales.bancodebogota.co/auth/',
  PB_REDIRECT: 'https://localhost:7011/Banking/pb/psj',
  STAGE_NAME: 'pr',
  VALIDATE_TOKEN: true,
  FUNNEL_URL: 'https://api.bancodebogota.co/event/',
  VALID_USER_ALLOWED: true,
  ENDPOINT_HEALTHY: 'https://api-canales.bancodebogota.co/health/',
  CYPHER_JS_KEY: 'FRONTEND_CIPHER_BDB_PR',
  CYPHER_JS_KEY_FBOG: 'FRONTEND_CIPHER_BDB_PR',
  ENDPOINT_THREAT: 'https://digitalid.bancodebogota.com.co/fp/tags.js?org_id=adq0fjol',
  CREDIT_CARD_POSTAUTH: 'https://quieromitarjeta.bancodebogota.co/#/authenticator-handler?uuid=',
  API_AUTH_INTEGRATION: 'https://api-canales.bancodebogota.co/auth/',
  CONSUMO_POSTAUTH: 'https://creditodigital.bancodebogota.co/#/authenticator-handler?uuid=',
  LIBRANZA_POSTAUTH: 'https://tulibranzafacil.bancodebogota.co/authenticator-handler?uuid=',
  INSURANCE_POSTAUTH: 'https://seguros.bancodebogota.com.co/Occupation?uuid=',
  WITH_NURA: false,
  SAFE_KEY_PAGE: 'https://virtual.bancodebogota.co/#/recover-password/CREATE_PIN',
  SAFE_KEY_LOGIN: 'https://virtual.bancodebogota.co/#/login',
  FORGOT_MY_KEY: 'https://virtual.bancodebogota.co/#/recover-password/RECOVER_PIN',
  BV_URL: 'https://virtual.bancodebogota.co/#/',
  PB_URL: 'https//www.bancodebogota.com',
  API_CREDIT_ENDPOINT_URL: 'https://api.bancodebogota.co/credito/',
  API_ADL_ANALYTICS: 'https://analytics-bogota.avaldigitallabs.com/',
  API_ADL_ANALYTICS_FBOG: 'https://analytics-fidubogota.avaldigitallabs.com/',
  STREAM_NAME: 'yb-analytics-prod-pb-kns-stream',
  STREAM_NAME_FBOG: 'fbog-analytics-pro-fic-kns-stream',
  PARTITION_KEY: 1,
  API_ADN_URL: 'https://api.labdigbdbcd.com/adn/',
  ADN_CHANNEL: 'PB',
  API_FIDUCIA_URL: 'https://fic-pro-fidubogota-api.avaldigitallabs.com/',
  API_FIDUCIARY_URL: 'https://pb-api-bogota.avaldigitallabs.com/api-gateway/fiduciary/',
  FIDUCIARY_API_ASSETS: 'https://fic-pro-fidubogota.avaldigitallabs.com/',
  FBOG_BAL_YEK_CILBUP_1:
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlxjaHwZAhdFEj0nHo37t' +
  'TJiGmq6HnwMN5l2uop1RJQ8ov2ksDL5I89fQRWtd8jW5FAgX38qQC/WY/n9yft+A' +
  'rspR4nLMA2A61dbnCAeCykglVLeEa64CjE5K11Lc4rS51pzqzH0vFjQN3uMnUmPv' +
  'TMhuTFLg5QFmycduMrfJnqOfbnRW9YWQ5547XBnXpogDhT8IM6LdU7wjTqX37tzc' +
  '8gqmsiZw4z3Q55NZpf7x4JVJ7D/97GRUP6b9lFPKqnUrkuULhzNIuCQqkd3P6AzT' +
  'I2EulFkDbqLNc/+gxd//Er83B4Y8ZfVZw8zArTnbg+8HQ6eezGgULiKo/3QaST8k' +
  'UQIDAQAB',
  USER_ALLOW_CACHE: true,
  API_BDB_WS: 'wss://rfj6gs7msk.execute-api.us-east-1.amazonaws.com/prod',
  IS_REDIRECT_TEMP: true,
  API_GATEWAY_ADL_URL: 'https://pb-api-bogota.avaldigitallabs.com/api-gateway/',
  INJECTABLE_SCRIPTS_KEYS: {
    TEALIUM_SRC_ENV: 'prod',
    CYXTERA_SCRIPT_CI: '54c1fc40-b3a1-4a47-817e-56f12a7af68d',
    CYXTERA_SCRIPT_WI: '1570',
    GTM_ID: 'GTM-KS9FT97'
  },
  CDT_GET_URL: 'https://digital.bancodebogota.com.co/cdt/?utm_source=banca_virtual' +
  '&utm_medium=propia&utm_campaign=pre_login_banca_virtual&utm_content=cdt',
  RECAPCHA_SITE_KEY: '6Leg_fwUAAAAAEV_HF0HFasCmzcumM82jVkSU90O',
  PQR_POSTAUTH: 'https://solicitudes-pqrs.bancodebogota.com.co/?channel=PB&uuid=',
  CCA_CROSSELL_URL: 'https://digital.bancodebogota.com/tarjeta-credito/opciones/index.html?utm_source=banca_virtual&utm_medium=propia&utm_campaign=post_login_banca_virtual&utm_content=tc',
  LOC_CROSSELL_URL: 'https://digital.bancodebogota.co/credito/index.html?utm_source=banca_virtual&utm_medium=propia&utm_campaign=post_login_banca_virtual&utm_content=LibreDestino&sarlaft4=true',
  MICROFRONTEND_SHELL_ORIGIN: 'https://virtual.bancodebogota.co/',
  COMPRA_CARTERA_URL: 'https://digital.bancodebogota.com/tarjeta-credito/index.html?utm_expid=.P5wrMIvgRSyb0oVWpciXAQ.0&utm_referrer='
};
