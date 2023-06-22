export const inputIdentificationProps: InputProps = {
  id: 'identificationNumber',
  name: 'identificationNumber',
  type: 'NUMBER',
  message: '',
  placeholder: '#',
  required: 'true',
  maxlength: '15',
  autoComplate: true
};

export const dropdownIdentificaionProps = {
  id: 'identificationType',
  name: 'identificationType',
  label: 'Identificación',
  placeholder: 'Selecciona'
};

const commonInputProps: InputProps = {
  type: 'SECUREKEY',
  message: '',
  placeholder: '....',
  required: 'true',
  maxlength: '4',
  minlength: '4',
  passwordMode: true,
  viewMode: true,
  autoComplate: true
};

export const InputKeyProps: InputKeyProps = {
  secure: {
    id: 'secure',
    name: 'secure',
    label: 'Clave segura',
    ...commonInputProps
  },
  last: {
    id: 'last',
    name: 'last',
    label: 'Últimos 4 dígitos de tu tarjeta débito',
    ...commonInputProps
  },
  password: {
    id: 'debit',
    name: 'debit',
    label: 'Clave de tu tarjeta débito',
    ...commonInputProps
  }
};

interface InputKeyProps {
  secure: InputProps;
  last: InputProps;
  password: InputProps;
}

interface InputProps {
  id?: string;
  name?: string;
  label?: string;
  type: string;
  message: string;
  placeholder?: string;
  required: string;
  maxlength: string;
  minlength?: string;
  passwordMode?: boolean;
  viewMode?: boolean;
  autoComplate?: boolean;
}
