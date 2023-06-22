export class ModalConfirmation {
    public modalConfHeader: ModalConfHeader;
    public modalConfSubHeader: ModalConfSubHeader;
    public modalConfLeft: ModalConfDetail;
    public modalConfRight: ModalConfDetail;
    public modalConfDetails: Array<ModalConfDetail>;
    public btnLeft: string;
    public btnRight: string;
}

export class ModalConfHeader {
    public modalTitle: string;
    public authNumber: string;
    public dateTime: string;
}

export class ModalConfSubHeader {
    public subTitle: string;
    public desc: Array<string>;
}

export class ModalConfDetail {
    public detailTitle: string;
    public desc: string;
}
