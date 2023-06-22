export class ProgressBar {
    logo: string;
    steps: Array<Step>;
    contraction?: string;
    color?: string;

    constructor() {

    }
}

export class Step {
    public id: string;
    public title: string;
    public details: string[];
    public isDone: boolean;

    constructor(id: string, title: string) {
        this.id = id;
        this.title = title;
    }
}

export class ProgressBarData {

    constructor(
        public title: string,
        public contraction: string,
        public logo: string,
        public details: string
    ) {
    }

}
