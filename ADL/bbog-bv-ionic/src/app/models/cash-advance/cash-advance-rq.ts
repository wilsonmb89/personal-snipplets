import { Customer } from '../bdb-generics/customer';
import { Account } from '../fiducia/account';

export class CashAdvanceRq {
    public customer: Customer;
    public accountFrom: Account;
    public accountTo: Account;
    public amt: string;
    public assertion: string;
}
