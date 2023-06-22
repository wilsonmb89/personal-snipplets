import { Customer } from '../bdb-generics/customer';
import {DeviceRsa} from './secure-pass-rq';

export class ValDebitCardRq {
   customer: Customer;
   bankId: string;
   numCard: string;
   secret: string;
   deviceRsa: DeviceRsa;
   tokenMFA?: string;
   referenceId?: string;
   tokenRecaptcha?: string;
}
