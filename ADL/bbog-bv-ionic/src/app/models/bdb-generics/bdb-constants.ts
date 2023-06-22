import { MaskType } from '../../../providers/bdb-mask/bdb-mask-type.enum';

export enum BalanceStatus {
  FINISHED,
  FINISHED_WITH_ERROR,
  IN_PROCESS
}

export enum StepsLoginEnum {
  SIGN_IN,
  TOKEN_MFA,
  NUMBER_SAFE_SITE,
  TOKEN_LOCKED,
  LOGIN_SUCCESS,
  LOGIN_ERROR_401,
  LOGIN_ERROR,
  INVALID_TOKEN_MFA,
  USER_BLOCKED,
}

export class BdbConstants {

  /* Channel */
  static readonly NETWORK_OWNER = 'PB';
  /* Banco de bogota ID */
  static readonly BBOG = '001';
  static readonly BRANCH_ID = 'DIG';
  /* currency */
  static readonly COP = 'COP';
  /* tipos de producto para Banco de Bogotá */
  static readonly SAVINGS_ACCOUNT = 'SDA';
  static readonly ELECTRONIC_DEPOSIT_ACCOUNT = 'CMA';
  static readonly CHECK_ACCOUNT = 'DDA';
  static readonly CREDIT_CARD = 'CCA';
  static readonly CDT = 'CDA';
  static readonly CREDIT = 'LOC';
  static readonly USM_CREDIT = 'DLA';
  static readonly LEASING = 'LEAS';
  static readonly FUDUCIARY = 'FDA';
  static readonly LIFE_INSURANCE = '678';

  /* tipos de producto para ATH */
  static readonly ATH_SAVINGS_ACCOUNT = 'ST';
  static readonly ATH_CHECK_ACCOUNT = 'IM';
  static readonly ATH_CREDISERVICE_ALS_PNATURAL = 'AN';
  static readonly ATH_ADELANTO_NOMINA = 'DN';
  static readonly ATH_CUENTA_AFC = 'AF';
  static readonly ATH_CREDITO_HIP = 'AV';
  static readonly ATH_FUDUCIARY = 'FB';
  static readonly ATH_LEASING = 'LF';
  static readonly ATH_ADVANCE_LEASING = 'LA';
  static readonly ATH_CREDISERVICE_AP = 'AP';
  static readonly ATH_OTHER_CREDITS = 'AD';
  static readonly ATH_CDT = 'CD'; // adding for api migration
  static readonly ATH_LEASING_H = 'LH'; // adding for api migration
  static readonly ATH_LIBRANSA = 'LB'; // adding for api migration

  /* Categorias de productos Banca Virtual */
  static readonly CUENTAS_BBOG = 'AC';
  static readonly FIDUCIAS_BBOG = 'FD';
  static readonly CREDITOS_BBOG = 'CR';
  static readonly TARJETA_CREDITO_BBOG = 'TC';
 // static readonly DEPRECATED_BBOG = 'DP';
  static readonly CDT_BBOG = 'DT';
 // static readonly PENSIONES = 'PN';
 // static readonly CESANTIAS = 'CS';

  // TODO: Validar ubicacion de este json
  /*  */
  static readonly namedMap = {
    fecProxPagoBBOG: { label: 'Fecha próximo pago', label2: 'Fecha', format: MaskType.DATE, format2: MaskType.DATE_BILL, priority: 2 },
    pagMinimoBBOG: { label: 'Pago mínimo', label2: 'Pago min', format: MaskType.CURRENCY, format2: MaskType.CURRENCY_NOCENTS, priority: 1 },
    totalFechaBBOG: { label: 'Pago total', format: MaskType.CURRENCY, priority: 3 },
    cupoComprasBBOG: { label: 'Cupo disponible', format: MaskType.CURRENCY },
    cupoAvancesBBOG: { label: 'Cupo avances', format: MaskType.CURRENCY, priority: 4 },
    cupoTarjetaBBOG: { label: 'Cupo total', format: MaskType.CURRENCY, priority: 5 },
    cupoTotCreSerBBOG: { label: 'Cupo Total', format: MaskType.CURRENCY, priority: 5 },
    cupoUtiCreSerBBOG: { label: 'Cupo utilizado', format: MaskType.CURRENCY, priority: 4 },
    cupoDispoCreSerBBOG: { label: 'Cupo disponible', format: MaskType.CURRENCY },
    vlrProxCuotaBBOG: {
      label: 'Valor próxima cuota', label2: 'Cuota', format: MaskType.CURRENCY,
      format2: MaskType.CURRENCY_NOCENTS, priority: 1
    },
    vlrTotPagCreSerBBOG: { label: 'Pago total', format: MaskType.CURRENCY, priority: 3 },
    /* intCorrienteBBOG: { label: 'Interés corriente', format: MaskType.CURRENCY },
    intMoraBBOG: { label: 'Interés de mora', format: MaskType.CURRENCY }, */
    totalBBOG: { label: 'Saldo total', format: MaskType.CURRENCY, priority: 2 },
    canjeBBOG: { label: 'Saldo en canje', format: MaskType.CURRENCY, priority: 1 },
    disponibleBBOG: { label: 'Saldo disponible', format: MaskType.CURRENCY },
    fecVencBBOG: { label: 'Fecha de vencimiento', format: MaskType.DATE, priority: 3 },
    cupoSobgiroBBOG: { label: 'Cupo de sobregiro', format: MaskType.CURRENCY, priority: 2 },
    sobgiroDispBBOG: { label: 'Sobregiro utilizado', format: MaskType.CURRENCY, priority: 3 },
    valTotPagarBBOG: { label: 'Total a pagar', format: MaskType.CURRENCY },
    valOriCredBBOG: { label: 'Valor original del credito', format: MaskType.CURRENCY },
    vlrObligBBOG: { label: 'Valor de la obligación', format: MaskType.CURRENCY, priority: 3 },
    saldoCapitalBBOG: { label: 'Saldo a capital', format: MaskType.CURRENCY },
    vlrPagCreHipBBOG: {
      label: 'Valor a pagar', label2: 'Cuota', format: MaskType.CURRENCY,
      format2: MaskType.CURRENCY_NOCENTS, priority: 1
    },
    fecInicialBBOG: { label: 'Fecha inicial del crédito', format: MaskType.DATE, priority: 4 },
    tasaNormalBBOG: { label: 'Tasa de interés', format: MaskType.PERCENTAGE, priority: 5 },
    tasaMoraBBOG: { label: 'Tasa de interés de mora', format: MaskType.PERCENTAGE, priority: 6 },
    valObligLeasingBBOG: { label: 'Valor del leasing', format: MaskType.CURRENCY },
    saldObligLeasingBBOG: { label: 'Saldo', format: MaskType.CURRENCY },
    valorCanonLeasingBBOG: { label: 'Valor del canon', format: MaskType.CURRENCY },
    fechaIniContLeasingBBOG: { label: 'Fecha inicial del contrato', format: MaskType.DATE },
    fechaOpcCompLeasingBBOG: { label: 'Fecha opcional', format: MaskType.DATE },
    tasaCompLeasingBBOG: { label: 'Tasa complementaria', format: MaskType.PERCENTAGE },
    tasaIntMoraLeasingBBOG: { label: 'Tasa de interes mora', format: MaskType.PERCENTAGE },
    vlrTotalCDTBBOG: { label: 'Valor CDT', format: MaskType.CURRENCY },
    tasaIntBBOG: { label: 'Tasa interes', format: MaskType.PERCENTAGE },
    vlrRetBBOG: { label: 'Valor retroactivo', format: MaskType.CURRENCY },
    intPagBBOG: { label: 'Interes pago', format: MaskType.CURRENCY },
    salDispVivBBOG: { label: 'Saldo disponible para vivienda', format: MaskType.CURRENCY, priority: 1 },
    salDisLibDestBBOG: { label: 'Saldo disponible libre destino', format: MaskType.CURRENCY, priority: 2 },
    retContinAcumBBOG: { label: 'Retención contingente', format: MaskType.CURRENCY, priority: 3 },
    salCanjeBBOG: { label: 'Saldo en canje', format: MaskType.CURRENCY, priority: 4 },
    diasSobgiroBBOG: { label: 'Días de sobregiro', priority: 4 },
    /* AV VILLAS */
    Saldo_disponible: { label: 'Saldo disponible', format: MaskType.CURRENCY },
    Saldo_bloqueado: { label: 'Saldo bloqueado', format: MaskType.CURRENCY },
    Saldo_canje: { label: 'Saldo en canje', format: MaskType.CURRENCY },
    Saldo_canje_24_horas: { label: 'Saldo en canje 1 día', format: MaskType.CURRENCY },
    Saldo_canje_48_horas: { label: 'Saldo en canje 2 día', format: MaskType.CURRENCY },
    Saldo_canje_72_horas: { label: 'Saldo en canje 3 día', format: MaskType.CURRENCY },
    Saldo_actual: { label: 'Saldo total', format: MaskType.CURRENCY },
    saldo_cdt: { label: 'Saldo disponible', format: MaskType.CURRENCY },
    /* CDT Digital */
    CDTEfficiencyBBOG: {label: 'Rendimientos', format: MaskType.CURRENCY},
    CDTRateBBOG: {label: 'Tasa Fija', format: MaskType.PERCENTAGE},
    CDTAmountBBOG: {label: 'Valor', format: MaskType.CURRENCY, priority: 1},
    CDTRetentionBBOG: {label: 'Retefuente (4%)', priority: 2, format: MaskType.CURRENCY},
    CDTCreationDate: {label: 'Creación', format: MaskType.DATE, priority: 3},
    CDTDurationBBOG: {label: 'Plazo', priority: 4},
    rendimientoMensualFBOG: {label: 'Rendimiento mensual', format: MaskType.CURRENCY, priority: 3},
    rendimientoAnualFBOG: {label: 'Rentabilidad anual', format: MaskType.SIMPLE_PERCENTAGE, priority: 4},
  };

  /* tipos de productos AV VILLAS */

  static readonly PUNTOS_POR_TODO = '09';
  static readonly GERENTE_BANCA_PREFERENTE = '99';


  /* Credit types */

  static readonly ADELANTO_NOMINA = '110';
  static readonly CREDISERVICE_1 = '568';
  static readonly CREDISERVICE_2 = '014';
  static readonly CREDISERVICE_3 = '570';
  static readonly CREDISERVICE_4 = '182';

  /* creditcard types */

  static readonly CREDIT_CARD_VISA = 'CB';
  static readonly CREDIT_CARD_MC = 'MC';

  /* ATH BANK CODES */
  static readonly BBOG_CODE = '00010016';

  /* BDB BANK CODE */
  static readonly BDB_BANK_CODE = '0001';

  /* payment codes */

  static readonly PC_CAPITAL_INSTALLMENT = '1';
  static readonly PC_NORMAL_PAYMENT = '2';
  static readonly PC_NEXT_INSTALLMENTS = '3';
  static readonly PC_DECREASE_INSTALLMENTS = '4';
  static readonly PC_DECREASE_TERM = '5';
  static readonly PC_REDUCE_INSTALLMENT = '6';
  static readonly PC_TOTAL_PAYMENT = '7';
  static readonly BILL_PAYMENT = '21';

  /* ref types */

  static readonly RT_CUSTOMER_ISSUED = '0';
  static readonly RT_PAYMENT_SCHEDULED = '1';
  static readonly RT_ROTATIVE_CREDIT = '0';
  static readonly RT_DNA_PAYROLL = '1';

  /* progress bar step keys */
  static readonly PROGBAR_STEP_1 = 'concept';
  static readonly PROGBAR_STEP_2 = 'value';
  static readonly PROGBAR_STEP_3 = 'origin';
  static readonly PROGBAR_STEP_4 = 'recharge';

  /* BBOG LOGO */
  static readonly VISA_LOGO = 'assets/imgs/visa.svg';
  static readonly DEBIT_CARD = 'assets/imgs/debitCard.svg';
  static readonly MASTERCARD_LOGO = 'assets/imgs/mastercard.svg';
  static readonly MASTERCARD_SIMPLE_LOGO = 'assets/imgs/mastercard_simpleLogo.svg';
  static readonly BBOG_LOGO_WHITE = 'assets/imgs/logo_white.svg';
  static readonly FROZEN_CARD = 'assets/imgs/pulse-toast/frozen-icon.svg';

  // AUTH
  static readonly VERIFY_RECAPTCHA_DC = 'lmnGRFD58V6IJFed4RF9PIqgOk1AAACxRY8';

  /* to request enrolled products */
  static readonly ENR_CREDITCARD = 'creditcard';

  static readonly TIMEOUT_SESSION = 600;

  static readonly SITE = '6';

  static readonly FINGER_PRINT_OPTIONS = {
    clientId: 'fingerprint-bbta',
    clientSecret: 'password', // Only necessary for Android
    disableBackup: true, // Only for Android(optional)
    localizedFallbackTitle: 'Use Pin', // Only for iOS
    localizedReason: 'Please authenticate' // Only for iOS
  };
  // IPmail
  static readonly EMAIL_OPTIONS = {
    PAY: { TEMPLATE: 'comprobante_pago_servicio', SUBJECT: 'PAGO Banco de Bogotá' },
    TRANSFER: { TEMPLATE: 'comprobante_transferencia', SUBJECT: 'Transferencia Banco de Bogotá' }
  };

  static readonly SET_PWD_CONF = {
    'Tarjeta Débito': { min: 4, max: 4, type: 'password' },
    'Tarjeta de Crédito': { min: 8, max: 8, type: 'tel' },
    'Cuenta de Ahorros': { min: 4, max: 1000, type: 'tel' },
    'CDT': { min: 4, max: 1000, type: 'tel' },
    'Crédito': { min: 4, max: 1000, type: 'tel' },
    'Cuenta Corriente': { min: 4, max: 1000, type: 'tel' }
  };

  /* Application text */
  static readonly ABANDON_TRANS = 'Abandonar transacción';
  static readonly ABANDON_PAY = 'Abandonar pago';
  static readonly ABANDON_ENROLL = 'Abandonar inscripción';
  static readonly ABANDON_GENERIC = 'Cancelar';
  static readonly OWN_ACCOUNT = 'CUENTA PROPIA';

  static readonly UNKNOWN = 'UNKNOWN';

  static readonly TRANSACTION_COST = {
    CASH_ADVANCE: '$ 5.630,00 + IVA',
    ACH_TRANSFER: '$ 6.480,00 + IVA',
    NO_COST: '$ 0'
  };
  static readonly DIR_EMPTY_STATE = 'empty-states/';

  static readonly POCKETS = {
    deposit: 'C',
    withdraw: 'D'
  };

   /* History Types */
   static readonly  MOVEMENTS_HISTORY = { label: 'MOVEMENTS_HISTORY' } ;
   static readonly PAYMENTS_BILLS_HISTORY = { label: 'PAYMENTS_HISTORY', value: '1' };
   static readonly PAYMENTS_OBLIGATIONS_HISTORY = { label: 'PAYMENTS_OBLIGATIONS_HISTORY', value: '2' };
   static readonly TRANSFERS_HISTORY = { label: 'TRANSFERS_HISTORY', value: '3' };

   /* Filter date suggestion */
  static readonly LAST_MONTH = 'LAST_MONTH';
  static readonly LAST_WEEK = 'LAST_WEEK';
  static readonly LAST_DAY = 'LAST_DAY';
  static readonly TODAY = 'TODAY';
  static readonly PERSONALIZED = 'PERSONALIZED';
  static readonly LAST_MONTH_TAG = 'Último mes';

  /* PAYMENT PILA CONTRACTION */
  static readonly PAYMENT_PILA_CONTRACTION = 'P';

  /* ADN - PAYROLL ACCOUNT CODE */
  static readonly PAYROLL_ACCOUNT_CODE = '010AH';
}
