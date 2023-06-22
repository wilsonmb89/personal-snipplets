export enum ProductValidationType {
  CCA = 'CCA',
  SDA = 'SDA',
  DDA = 'DDA',
  LOC = 'LOC',
  CDA = 'CDA',
  DEB = 'DEB'
}

const productDetailsMap: Map<ProductValidationType, unknown> = new Map([
  [
    ProductValidationType.CCA,
    {
      digits: '8',
      label: 'Últimos 8 digitos de tu tarjeta de crédito',
      message: 'Si cuentas con más de una tarjeta de crédito, puedes ingresar la información de la que tú elijas.',
      placeholder: '........'
    }
  ],
  [
    ProductValidationType.SDA,
    {
      digits: '9',
      label: 'Ingresa el número de tu cuenta',
      message: 'Si cuentas con más de una cuenta, puedes ingresar la información de la que tú elijas.',
      placeholder: '.........'
    }
  ],
  [
    ProductValidationType.DDA,
    {
      digits: '9',
      label: 'Ingresa el número de tu cuenta',
      message: 'Si cuentas con más de una cuenta, puedes ingresar la información de la que tú elijas.',
      placeholder: '.........'
    }
  ],
  [
    ProductValidationType.LOC,
    {
      digits: '11',
      label: 'Ingresa el número de tu crédito',
      message: 'Si cuentas con más de un crédito, puedes ingresar la información del que tú elijas.',
      placeholder: '...........'
    }
  ],
  [
    ProductValidationType.CDA,
    {
      digits: '10',
      label: 'Ingresa el número de tu CDT',
      message: 'Si cuentas con más de un CDT, puedes ingresar la información del que tú eligas.',
      placeholder: '..........'
    }
  ],
  [
    ProductValidationType.DEB,
    {
      digits: '4',
      label: 'Clave de tu Tarjeta Débito',
      message: 'Si cuentas con más de una tarjeta débito, puedes ingresar la información de la que tú elijas.',
      placeholder: '....'
    }
  ]
]);

export const getProductDetail = (product: ProductValidationType): ProductDetail => {
  return productDetailsMap.get(product) as ProductDetail;
};

export interface ProductDetail {
  digits: string;
  label: string;
  message?: string;
  placeholder: string;
}
