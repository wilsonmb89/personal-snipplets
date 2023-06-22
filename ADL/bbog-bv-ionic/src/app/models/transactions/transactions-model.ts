
import { Amount } from '../amount';

export class Transaction {

    public symbol: string;
    public installments: number;

    constructor(
        public date: string,
        public description: string,
        public amount: Amount,
        public avatar: string = 'iconbp.png'
    ) { }

}
