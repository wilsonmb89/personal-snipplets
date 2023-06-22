export interface GeneralData {
    version: string;
    eventCode: number;
    eventMnemonic: string;
    eventName: string;
    timestamp: string;
    result: boolean;
    details: Object;
    audit: AuditData;
    source: any;
}

export class PayloadEvent {
    constructor(public StreamName: string,
                public Data: string,
                public PartitionKey: number) {}
}

export class AditionalData {
    public type: Object;
}

export class AuditData {
    application: 'BBOG-virtualbank';
    sessionId?: string;
    clientIdType: string;
    clientId: string;
    advisorId: '';
    channel: string;
    transactionId: string;
    requestId: string;
    ipAddress: string;
}
