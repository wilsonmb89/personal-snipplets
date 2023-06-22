export const secureKeyPageData: SecureKeyPage = {
  register: {
    flow: 'register',
    title: 'Registro de Clave Segura',
    clientValidation: 'Crea tu Clave Segura',
    userValidationPath: '/clave-segura/registro/validacion-cliente',
    getOtpPath: '/clave-segura/registro/envio-otp',
    otpValidationPath: '/clave-segura/registro/validacion-otp',
    productValidationPath: '/clave-segura/registro/validacion-producto',
    createKeyPath: '/clave-segura/registro/crear'
  },
  forget: {
    flow: 'forget',
    title: 'Olvido de Clave Segura',
    clientValidation: 'Recupera tu Clave Segura',
    userValidationPath: '/clave-segura/olvido/validacion-cliente',
    getOtpPath: '/clave-segura/olvido/envio-otp',
    otpValidationPath: '/clave-segura/olvido/validacion-otp',
    productValidationPath: '/clave-segura/olvido/validacion-producto',
    createKeyPath: '/clave-segura/olvido/crear'
  }
};

interface SecureKeyPage {
  register: PageData;
  forget: PageData;
}
export interface PageData {
  flow: string;
  title: string;
  clientValidation: string;
  userValidationPath: string;
  getOtpPath: string;
  otpValidationPath: string;
  productValidationPath: string;
  createKeyPath: string;
}
