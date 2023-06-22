import { ProductDetail } from 'app/models/products/product-model';
import { AccountBalanceAval } from 'app/models/enrolled-transfer/account-balance';
import { AccountAny } from 'app/models/enrolled-transfer/account-any';
import { AccountBalance } from 'app/models/enrolled-transfer/account-balance';
import { Customer } from 'app/models/bdb-generics/customer';
import { ModalRs } from 'app/models/modal-rs/modal-rs';
import { BdbConstants } from 'app/models/bdb-generics/bdb-constants';

export class MockProductsProvider {

    public static modalRs: ModalRs = new ModalRs('pmt', 100, '2504', '25-jun-2018', '0');

    private static products: Array<ProductDetail> = [
        {
            productBank: 'Banco de Bogotá',
            isAval: true,
            productName: 'Cuenta de Ahorros',
            productType: 'ST',
            productNumber: '0019501345',
            productNumberX: '****1345',
            description: 'Disponible',
            amount: 1025584242,
            isActive: false,
            bankId: BdbConstants.BBOG_CODE,
            franchise: null,
        },
        {
            productBank: 'Banco de Bogotá',
            isAval: true,
            productName: 'Tarjeta de credito',
            productType: 'MC',
            productNumber: '4500195013453345',
            productNumberX: '****3345',
            description: 'Disponible',
            amount: 1025584242,
            isActive: false,
            bankId: BdbConstants.BBOG_CODE,
            franchise: null
        }];


        public static readonly accountBalanceAval: AccountBalanceAval = {
            amount: 23424,
            amount2: 23424,
            aval: true,
            description: 'ddsfsdf',
            description2: 'ddsfsdf',
            details: 'ddsfsdf',
            payments: '',
            productBank: 'ddsfsdf',
            productName: 'ddsfsdf',
            productNumber: 'ddsfsdf',
            productNumberX: 'ddsfsdf',
            productSubtype: 'MC',
            productType: 'ddsfsdf',
        };


        public static readonly payment: ProductDetail = {
            productName: 'Cuenta de Ahorros',
                productType: 'ST',
                productNumber: '0019501345',
                productNumberX: '0019501345',
                productBank: '',
                isAval: false,
                description: 'Disponible',
                amount: 1025584242,
                isActive: false,
                bankId: BdbConstants.BBOG_CODE
        };

        public static readonly accountBalanceType: AccountBalance = {
            productAlias: 'Cuenta Bancolombia',
            productBank: 'Bancolombia',
            productNumber: '234213451345',
            productType: 'CCA',
            productName: 'Andrea Serna',
            bankId: '007',
            aval: false,
            contraction: 'CB',
            customer: new Customer('2342342', 'C'),
            description: 'cuenta de ahorros en bancolombia'
        };

        public static readonly accountEnrolled: AccountAny = {
            accountEnrolled: MockProductsProvider.accountBalanceType,
            accountOwned: null,
            owned: false
        };

        public static readonly accountOwned: AccountAny = {
            accountEnrolled: null,
            accountOwned: MockProductsProvider.payment,
            owned: true
        };

        public static getProductsMock(): Array<ProductDetail> {
            return this.products;
        }

}
