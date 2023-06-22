export interface GenericModalModel {
  icon: ModalIcon;
  modalTitle: string;
  modalInfoData: string;
  additionalModalData?: AdditionalInfo;
  actionButtons: ModalActionButton[];
  mainActionInClose?: boolean;
  hideCloseButton?: boolean;
}

interface ModalIcon {
  src: string;
  alt: string;
}

interface ModalActionButton {
  id: string;
  buttonText: string;
  block: boolean;
  colorgradient?: boolean;
  fill?: string;
  action: Function;
}

export interface AdditionalInfo {
  icon: ModalIcon;
  additionalInfoData: string;
}
