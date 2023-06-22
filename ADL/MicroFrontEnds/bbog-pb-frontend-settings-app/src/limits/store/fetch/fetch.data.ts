import { Limit } from '../../models/limit.model';

export interface LimitsTree {
  id: string;
  title: string;
  description: string;
  limits: LimitData[];
}

export interface LimitData {
  channel: string;
  state: Limit;
  content: LimitContent;
}

interface LimitTooltipInfo {
  title: string;
  description: string;
}

export interface LimitContent {
  channel: string;
  icon?: string;
  title?: string;
  description?: string;
  descriptionExpanded?: string;
  tooltipInfo?: LimitTooltipInfo;
  warningInfo?: string;
}

export const limitsTree = [
  {
    id: 'ACCOUNT_LIMIT',
    children: ['0320', '5067']
  },
  {
    id: 'CHANNELS',
    children: ['BM', 'PB']
  },
  {
    id: 'PAYMENTS',
    children: ['PSE', 'CTD']
  },
  {
    id: 'PHYSICAL_TRANSACTIONS',
    children: ['AUT', 'AVA', 'PIN']
  },
  {
    id: 'CORRESPONDENTS',
    children: ['IVR', 'CNB']
  }
];

export const limitsSections: Omit<LimitsTree, 'limits'>[] = [
  {
    id: 'ACCOUNT_LIMIT',
    title: 'Límite total',
    description: 'Recuerda que este tope afecta el total de tus transacciones diarias.'
  },
  {
    id: 'CHANNELS',
    title: 'Transacciones en Banca Virtual y Banca Móvil',
    description: 'Transferencias y pagos en nuestros canales digitales'
  },
  {
    id: 'PHYSICAL_TRANSACTIONS',
    title: 'Transacciones en oficinas y cajeros automáticos',
    description: 'Retiros y pagos en sucursales AVAL'
  },
  {
    id: 'PAYMENTS',
    title: 'Compras, pagos por internet y PSE',
    description: 'Todas las transacciones que necesites hacer a través de sitios web'
  },
  {
    id: 'CORRESPONDENTS',
    title: 'Servilínea y corresponsales',
    description: 'Débito de tu dinero por líneas telefónicas o corresponsales'
  }
];

const accountLimitData = {
  title: 'Límite de Cuenta',
  descriptionExpanded: 'Monto máximo para transar a diario desde cualquier canal físico o virtual.',
  icon: 'accounting-coins-stack',
  tooltipInfo: {
    title: 'Límite de Cuenta:',
    description:
      'Tope que establece el monto máximo que puedes transar a diario desde cualquier canal físico o virtual. Debe ser mayor a todos los demás topes.'
  },
  warningInfo:
    'El tope por este canal no puede ser mayor a $50,000,000. Si necesitas un monto más alto dirigete a una de nuestras oficinas.'
};

export const limitsContent: LimitContent[] = [
  { channel: '0320', ...accountLimitData },
  { channel: '5067', ...accountLimitData },
  {
    channel: 'PB',
    title: 'Banca Virtual',
    descriptionExpanded: 'Pagos, transferencias y recargas desde tu Banca Virtual.',
    icon: 'credit-card-laptop-payment',
    tooltipInfo: {
      title: 'Tope Banca Virtual:',
      description:
        'Monto máximo diario para realizar transacciones en tu nueva Banca Virtual, el portal transaccional. Pagos, transferencias y recargas.'
    }
  },
  {
    channel: 'BM',
    title: 'Banca Móvil',
    descriptionExpanded: 'Pagos, transferencias y recargas desde tu Banca Móvil.',
    icon: 'wireless-payment-credit-card',
    tooltipInfo: {
      title: 'Tope Banca Móvil:',
      description:
        'Monto máximo diario para realizar transacciones en tu aplicación Banca Móvil. Pagos, transferencias y recargas.'
    }
  },
  {
    channel: 'PSE',
    title: 'Pagos virtuales (PSE y AVAL Pay Center)',
    descriptionExpanded: 'Pagos y transferencias por PSE y AVAL Pay Center.',
    icon: 'self-payment',
    tooltipInfo: {
      title: 'Tope pagos virtuales:',
      description: 'Monto máximo diario para realizar transacciones por PSE y AVAL Pay Center.'
    }
  },
  {
    channel: 'CTD',
    title: 'Compras Virtuales con Tarjeta Débito',
    descriptionExpanded: 'Transacciones por páginas de internet diferentes a PSE con tu Tarjeta Débito.',
    icon: 'e-commerce-shop',
    tooltipInfo: {
      title: 'Tope compras virtuales:',
      description:
        'Monto máximo diario para realizar transacciones por páginas de internet con tu Tarjeta Débito. El tope se restablece por seguridad al día siguiente.'
    },
    warningInfo:
      'Por seguridad este tope será restablecido al finalizar el día a $15.000.000 y 10 transacciones. Si el cambio es inferior a $15.000.000 no se modificará.'
  },
  {
    channel: 'AUT',
    title: 'Cajeros Automáticos',
    descriptionExpanded: 'Transferencias, pagos y retiros por cajeros automáticos de la red AVAL y otros puntos.',
    icon: 'accounting-withdraw-alternate',
    tooltipInfo: {
      title: 'Tope cajeros automáticos:',
      description:
        'Monto máximo diario para realizar transferencias, pagos y retiros por cajeros automáticos de la red AVAL. Retiros diarios en cajero automático siempre son hasta $2,000,000 de pesos.'
    },
    warningInfo: 'Por seguridad solo puedes realizar retiros en un total de $2.000.000 diarios.'
  },
  {
    channel: 'AVA',
    title: 'Oficina AVAL (Sin tarjeta)',
    descriptionExpanded:
      'Transferencias, pagos, retiros y otras transacciones en oficinas de red AVAL sin uso de tu Tarjeta Débito.',
    icon: 'saving-bank-cash',
    tooltipInfo: {
      title: 'Tope Oficina AVAL sin tarjeta:',
      description:
        'Monto máximo diario para realizar transferencias, pagos y retiros y otras transacciones en oficinas de red AVAL sin uso de tu Tarjeta Débito.'
    }
  },
  {
    channel: 'PIN',
    title: 'Oficina AVAL (Con tarjeta)',
    descriptionExpanded:
      'Transferencias, pagos, retiros y otras transacciones en oficinas de red AVAL con uso de tu Tarjeta Débito.',
    icon: 'credit-card-payment',
    tooltipInfo: {
      title: 'Tope Oficina AVAL con tarjeta:',
      description:
        'Monto máximo diario para realizar transferencias, pagos, retiros y otras transacciones en oficinas de red AVAL con uso de tu Tarjeta Débito.'
    }
  },
  {
    channel: 'IVR',
    title: 'Servilínea',
    descriptionExpanded: 'Transferencias y pagos por nuestra Servilínea.',
    icon: 'headphones-customer-support-human',
    tooltipInfo: {
      title: 'Tope Servilínea:',
      description: 'Monto máximo diario para realizar transferencias y pagos por nuestra Servlínea.'
    }
  },
  {
    channel: 'CNB',
    title: 'Corresponsales no bancarios',
    descriptionExpanded: 'Transferencias, pagos y retiros en puntos físicos de Corresponsales no bancarios.',
    icon: 'e-commerce-shop',
    tooltipInfo: {
      title: 'Tope Corresponsales no bancarios:',
      description:
        'Monto máximo diario para realizar transferencias, pagos y retiros en puntos físicos de Corresponsales no bancarios.'
    }
  }
];
