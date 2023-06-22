export class MobileSummary {
    header: SummaryHeader;
    body: SummaryBody;
}

export class SummaryHeader {
    hasContraction?: boolean;
    contraction?: string;
    logoPath?: string;
    title: string;
    details: Array<string>;
    subDetails?: Array<string>;
}

export class SummaryBody {
    textUp: string;
    textDown: string;
    valueUp: string;
    valueDown: string;
}
