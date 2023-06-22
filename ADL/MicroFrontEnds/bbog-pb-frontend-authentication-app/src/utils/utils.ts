import { UseFormRegisterReturn } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fieldRegistry = (formRegister: UseFormRegisterReturn) => ({
  name: formRegister.name,
  onAtInputOnBlur: formRegister.onBlur,
  onAtInputChanged: formRegister.onChange,
  ref: formRegister.ref
});
