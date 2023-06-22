import { Customer } from '../bdb-generics/customer';
import { DeviceRsa } from './secure-pass-rq';

export interface AnalyzeCompleteRq {
    customer: Customer;
    deviceRsa: DeviceRsa;
    securePin: boolean;
    activeToken: boolean;
}
