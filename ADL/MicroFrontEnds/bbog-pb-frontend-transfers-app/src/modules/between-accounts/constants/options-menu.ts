export const optionsOwnAccount = [
  {
    icon: 'ico-transfer',
    label: 'Transferir',
    value: '0'
  },
  {
    icon: 'ico-time',
    label: 'Programar transferencia',
    value: '1'
  }
];

export const optionsAffiliatedAccounts = optionsOwnAccount.concat({
  icon: 'ico-delete',
  label: 'Eliminar cuenta',
  value: '3'
});
