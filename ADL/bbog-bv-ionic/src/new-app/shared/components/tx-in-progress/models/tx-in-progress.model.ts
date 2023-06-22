export class TxInProgressModel <OriginInfo> {
  constructor(
    public header: TxInProgressHeaderModel,
    public body: TxInProgressBodyModel,
    public action: TxInProgressActionButtonModel,
    public originInfo: OriginInfo
  ) {}
}

export class TxInProgressHeaderModel {
  constructor(
    public iconPath: string,
    public title: string,
    public showTime: boolean
  ) {}
}

export class TxInProgressBodyModel {
  constructor(
    public amtInfo: TxInProgressBodyAmtInfoModel
  ) {}
}

export class TxInProgressBodyAmtInfoModel {
  constructor(
    public amtVal: string,
    public amtDesc: string
  ) {}
}

export class TxInProgressActionButtonModel {
  constructor(
    public btnTitle: string,
    public btnAction: Function
  ) {}
}

export enum TxType {
  AchTransfers,
  AvalTransfers
}
