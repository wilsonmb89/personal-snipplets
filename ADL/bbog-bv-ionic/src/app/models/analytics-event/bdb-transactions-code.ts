export class BdbTransactionsCode {
    public eventCode: number;
    public eventMnemonic: string;
    public eventName: string;
    public transactionId?: string;

    constructor(eventCode, eventMnemonic, eventName, transactionId?) {
        this.eventCode = eventCode;
        this.eventMnemonic = eventMnemonic;
        this.eventName = eventName;
        this.transactionId = transactionId;
    }
}
export class BdbEventsConstants {

    static readonly security =
        {
            'paymentHistory': new BdbTransactionsCode(1, 'HISPAYT', 'payment and transfer History', '20307'),
            'analyzeTree': new BdbTransactionsCode(2, 'GETSD', 'Get products and secure data', '20308'),
            'authenticationUpdate': new BdbTransactionsCode(3, 'UPDPIN', 'update secure key', '20206'),
            'analyzeNumber': new BdbTransactionsCode(4, 'PRDV', 'Validated by product and type product', '20303'),
            'pinadd': new BdbTransactionsCode(5, 'UPDPINADD', 'Update  add universal PIN', '20206'),
            'authentication': new BdbTransactionsCode(6, 'AUTH', 'authentication secure key or debit card', '20407'),
            'rsa': new BdbTransactionsCode(7, 'RSA', 'Analyze RSA', '20407'),
            'rsaPin': new BdbTransactionsCode(8, 'RSAPIN', 'RSA Secure pin', '20407'),
            'rsaToken': new BdbTransactionsCode(9, 'RSAT', 'Validate RSA Token', '20407'),
            'cardsInfo': new BdbTransactionsCode(10, 'CDINFO', 'cards and info (get name and email)', '20308'),
            'rsaNotify': new BdbTransactionsCode(11, 'RSAN', 'RSA notify', '20404'),
            'uuid': new BdbTransactionsCode(12, 'UUID', 'secure UUID', ''),
            'sendOtp': new BdbTransactionsCode(13, 'OTPS', 'Send OTP', ''),
            'validateOtp': new BdbTransactionsCode(14, 'VOTP', 'Validate OTP', ''),
            'createUser': new BdbTransactionsCode(15, 'CUSDS', 'Create user SDS', ''),
            'topes': new BdbTransactionsCode(16, 'TOPES', 'Topes', '20403'),
            'locked': new BdbTransactionsCode(17, 'LOCK', 'Locked', '20405'),
            'unlocked': new BdbTransactionsCode(18, 'UNLOCK', 'Unlocked', '20406'),
        };

    static readonly transation =
        {
            'purchase': new BdbTransactionsCode(19, 'PURCH', 'Purchase', '10101')
        };

    static readonly collected =
        {
            'tax': new BdbTransactionsCode(20, 'TAX_C', 'Tax collection', '10501'),
            'citiesTax': new BdbTransactionsCode(21, 'PTAXC', 'Get cities payment tax'),
            'taxByCity': new BdbTransactionsCode(22, 'TAXBC', 'Tax by city', '10501'),
            'services': new BdbTransactionsCode(23, 'SERV_C', 'Service payment', '10502'),
            'infoPila': new BdbTransactionsCode(24, 'PILAI', 'Get information PILA', ''),
            'pila': new BdbTransactionsCode(25, 'PILA', 'Payment PILA', '10503'),
            'pilaProvider': new BdbTransactionsCode(26, 'PILAP', 'get PILA provider', ''),
            'insurance': new BdbTransactionsCode(27, 'INS_C', 'Insurance payment', '10506'),
            'recharge': new BdbTransactionsCode(28, 'RECH_C', 'Generate recharge', '10504'),
            'donation': new BdbTransactionsCode(29, 'DON_C', 'Donation', '10505'),
            'otherServices': new BdbTransactionsCode(30, 'OTHER_SER_C', 'Other service collect', '10507')
        };

    static readonly deposits =
        {
            'AVAL': new BdbTransactionsCode(31, 'AVAL_DEP', 'AVAL Deposits', '10201'),
            'bank': new BdbTransactionsCode(32, 'BANK_DEP', 'Bank accounts deposits', '10202')
        };

    static readonly transfer =
        {
            'AVAL': new BdbTransactionsCode(33, 'AVAL_TRANS', 'AVAL Transfer', '10801'),
            'internal': new BdbTransactionsCode(34, 'INTERNAL_TRANS', 'Internal transfer', '10802'),
            'otherBanks': new BdbTransactionsCode(35, 'OTHER_BANKS_TRANS', 'Other banks transfer', '10803'),
            'international': new BdbTransactionsCode(36, 'INTERNATIONAL_TRANS', 'International transfer', '10804')
        };

    static readonly uses =
        {
            'cash': new BdbTransactionsCode(37, 'CASH_ADVANCE', 'Cash advance', '10901'),
            'chargedAccount': new BdbTransactionsCode(38, 'CHARG_ACCOUNT_ADV', 'Charged account advance', '10902'),
            'disbursementCredit': new BdbTransactionsCode(39, 'DISB_CREDIT', 'Disbursement credit cash', '10903'),
            'disubursementCreditChargeAcc': new BdbTransactionsCode(40, 'DISBURS_CREDIT_CHARG_ACC', 'DisbursementCredChargeAcc', '10905'),
            'portfolioPurchase': new BdbTransactionsCode(41, 'PORTF_PURCHASE', 'Portfolio purchase', '10904')
        };

    static readonly taxes =
        {
            'GMF': new BdbTransactionsCode(42, 'GMF', 'GMF withholding', '11001'),
            'IVA': new BdbTransactionsCode(43, 'IVA', 'IVA withholding', '11002'),
            'ICA': new BdbTransactionsCode(44, 'ICA', 'ICA withholding', '11003'),
            'retefuente': new BdbTransactionsCode(45, 'RETEFUENTE', 'Retefuente withholding', '11004')
        };

    static readonly charge =
        {
            'monetary': new BdbTransactionsCode(46, 'MON_TRANSAC', 'Monetary transation charge', '11101'),
            'noMonetary': new BdbTransactionsCode(47, 'NO_MON_TRANSAC', 'No monetary transaction charge', '11102')
        };

    static readonly manager =
        {
            'accountListByBank': new BdbTransactionsCode(48, 'ACL', 'getAccountListByBank', ''),
            'accountbalance': new BdbTransactionsCode(49, 'PRODL', 'Get product list'),
            'productenrolled': new BdbTransactionsCode(50, 'PRODE', 'Get product enrolled, recurrent payment', ''),
            'transfEnrolled': new BdbTransactionsCode(69, 'TRANSE', 'Get transfer enrolled', ''),
            'billEnrrolled': new BdbTransactionsCode(51, 'BILLE', 'Get bill enrolled', ''),
            'mgmtbill': new BdbTransactionsCode(52, 'MGMB', 'Management bill', ''),
            'inscriptions': new BdbTransactionsCode(53, 'INSC', 'Inscriptions', '20202'),
            'managementTransfer': new BdbTransactionsCode(68, 'MNGTRANS', 'Transfer enrolled management', '20202'),
            'certification': new BdbTransactionsCode(54, 'CERTIFICATIONS', 'Certification generate', '20203'),
            'extracts': new BdbTransactionsCode(55, 'EXTRACTS', 'Extracts generate', '20204'),
            'reference': new BdbTransactionsCode(56, 'REFERENCES', 'References generate', '20205'),
            'modify': new BdbTransactionsCode(57, 'MODIFY_INFO', 'Modify characteristics', '20206'),
            'cancellation': new BdbTransactionsCode(58, 'CANCELLATION', 'cancellations', '20207'),
            'deliveryMeans': new BdbTransactionsCode(59, 'DELIVERY_MEANS', 'Delivery means', '20208'),
            'activation': new BdbTransactionsCode(60, 'ACTIVATION', 'Activations', '20209'),
            'renewal': new BdbTransactionsCode(61, 'RENEWAL', 'Renewal', '20211'),
            'authorization': new BdbTransactionsCode(62, 'AUTHORIZATION', 'Authorization', '20212'),
        };

    static readonly payments = {
        'mgmtobligation': new BdbTransactionsCode(63, 'ENRL', 'Loan enrolled', '20202'),
        'aval_creditCard': new BdbTransactionsCode(64, 'PAY_CC', 'Payment Aval credit card', '10401'),
        'aval_credit': new BdbTransactionsCode(65, 'PAY_C', 'Payment credit', '10401'),
        'other_Bank_credit': new BdbTransactionsCode(66, 'PYMT_C_OBK', 'Payments Credits other banks', '10403'),
        'other_Bank_creditCard': new BdbTransactionsCode(67, 'PYMT_CC_OBK', 'Payments credit card other banks', '10403'),
    };

    static readonly pockets = {
        'pocket_balance': new BdbTransactionsCode(68, 'PCKT_GET', 'Pocket Consult Bt Account', '20301'),
        'pocket_create': new BdbTransactionsCode(69, 'PCKT_POST', 'Pocket create', '20201'),
        'pocket_edit': new BdbTransactionsCode(70, 'PCKT_PUT', 'Pocket edit', '20201'),
        'pocket_deposit': new BdbTransactionsCode(71, 'PCKT_DPST', 'Pocket deposit', '10202'),
        'pocket_withdraw': new BdbTransactionsCode(62, 'PCKT_WTHDRW', 'Pocket withdraw', '10802'),
        'pocket_movements': new BdbTransactionsCode(73, 'PCKT_MVNT', 'Pocket movement', '20301'),
        'pocket_onboarding': new BdbTransactionsCode(74, 'PCKT_ONBR', 'Pocket ONBOARDING', '20302'),
    };

    static readonly userFeatures = {
        'get_user_feature': new BdbTransactionsCode(75, 'FTRS_GET', 'Get User Features', '20304'),
        'save_user_feature': new BdbTransactionsCode(76, 'FTRS_SAVE', 'Save User Features', '20305'),
    };

    static readonly trusts = {
        'investment': new BdbTransactionsCode(77, 'TRUST_INVESTMENT', 'Trust Investment Transfer', '20401'),
        'divestment': new BdbTransactionsCode(78, 'TRUST_DIVESTMENT', 'Trust Divestment Transfer', '20402')
    };
}
