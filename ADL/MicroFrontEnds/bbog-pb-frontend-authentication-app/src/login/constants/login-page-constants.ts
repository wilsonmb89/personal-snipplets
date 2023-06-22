import packageJson from '../../../package.json';

export const version = `v.${packageJson.version}`;

export const titles = {
  page: 'Bienvenido a tu Banca Virtual',
  products: 'Solicita un nuevo producto',
  carousel: 'Comunícate por alguno de nuestros canales:'
};

export const servilinea = [
  { city: 'Bogotá', phone: '(601) 382 0000' },
  { city: 'Barranquilla', phone: '(605) 350 4300' },
  { city: 'Bucaramanga', phone: '(607) 652 5500' },
  { city: 'Cali', phone: '(602) 898 0077' },
  { city: 'Medellín', phone: '(604) 576 4330' },
  { city: 'Nivel Nacional', phone: '01 8000 518877' }
];

export const products = [
  {
    icon: 'ico-saving',
    title: 'Cuenta de ahorros',
    desc: 'Abre tu cuenta sin costo y en pocos minutos.',
    link: 'https://digital.bancodebogota.com/cuenta-ahorros/index.html'
  },
  {
    icon: 'ico-card',
    title: 'Tarjeta de crédito',
    desc: 'Solícitala en minutos, elige entre millas, puntos o descuentos.',
    link: 'https://digital.bancodebogota.com/tarjeta-credito/index.html'
  },
  {
    icon: 'ico-credito-vivienda',
    title: 'Financiación de vivienda',
    desc: 'Adquiere tu vivienda nueva o usada.',
    link: 'https://viviendadigital.bancodebogota.co'
  },
  {
    icon: 'ico-creditos-y-microcreditos',
    title: 'Crédito libre destino',
    desc: 'Tendrás el dinero en tu cuenta en pocos minutos.',
    link: 'https://digital.bancodebogota.com/credito/'
  },
  {
    icon: 'ico-creditos-y-microcreditos',
    title: 'Crédito de libranza',
    desc: 'Se descuenta de tu salario y puedes usarlo para lo que quieras.',
    link: 'https://digital.bancodebogota.co/libranza/index.html'
  }
];

export const carouselOptions = [
  {
    id: 0,
    text: 'Solicitar un producto',
    type: 'products',
    value: products,
    disabled: false,
    icon: 'ico-cuenta-de-ahorros'
  },
  {
    id: 1,
    text: 'Escríbenos por Whatsapp',
    type: 'link',
    value:
      'https://api.whatsapp.com/send/?phone=573182814679&text=Hola%2C+me+gustar%C3%ADa+saber+acerca+de+&app_absent=0',
    disabled: false,
    icon: 'ico-whatsapp'
  },
  { id: 2, text: 'Llamar a la Servilínea', type: 'call', value: servilinea, disabled: false, icon: 'ico-call-center' },
  {
    id: 3,
    text: 'Solicitar un turno digital',
    type: 'link',
    value: 'https://turnodigital.bancodebogota.com.co',
    disabled: false,
    icon: 'ico-home'
  },
  {
    id: 4,
    text: 'Buscar cajeros y oficinas',
    type: 'link',
    value: 'https://www.bancodebogota.com/BuscadordePuntosBogota/?entidad=bogota',
    disabled: false,
    icon: 'ico-call-center'
  }
];
