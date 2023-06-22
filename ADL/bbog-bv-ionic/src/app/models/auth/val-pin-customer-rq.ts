
import {Customer} from '../bdb-generics/customer';
import {DeviceRsa} from './secure-pass-rq';

export class ValPinCustomerRq {
  customer: Customer;
  pin: string;
  deviceRsa: DeviceRsa;
  tokenMFA?: string;
  referenceId?: string;
  tokenRecaptcha?: string;
}
