
export enum FingerStatus {
    NONE, // El dispositivo no tiene lector de huella
    FOR_CONFIG, // El dispositivo tiene lector de huella y es su primer ingreso
    NOT_CONFIG, // El dispositivo tiene lector de huella y el usuari no la quiere utilizar en el login
    FULL, // El dispositivo tiene lector de huella Y ya esta activada para uso en el login
}

export class BvDataApp {
    device: string;
    name: string;
    fingerStatus: FingerStatus;
    model: string;

    constructor(device, name, fingerStatus, model) {
        this.device = device;
        this.name = name;
        this.fingerStatus = fingerStatus;
        this.model = model;
    }
}

export class DataToLogin {
    page: string;
    fingerStatus: FingerStatus;

    constructor(page, fingerStatus) {
        this.page = page;
        this.fingerStatus = fingerStatus;
    }
}

export interface InfoDevice {
    avilableFinger: boolean;
    actualStorage: BvDataApp;
}
