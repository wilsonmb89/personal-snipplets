export const isRevolvingCredit = (productSubType: string): boolean =>
  !![
    '570ML',
    '572ML',
    '014ML',
    '070ML',
    '182ML',
    '568ML',
    '067MLP',
    '568MLP',
  ].find((subType) => subType === productSubType);
