export interface ConstantsModel {
  document_types: Array<{
    name: string,
    value: string,
    analyticsCode: string,
    valueopt: string
    valueAsLoginForm?: string
  }>;
}

