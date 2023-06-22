export interface CreateCustomerRq {
    customerName: string;
    pin: string;
    deviceInfo: DeviceInfo;
    clientIp: string;
}

export interface CreateCustomerRs {
    message: string;
}

export interface DeviceInfo {
    serial: string;
    deviceName: string;
}

export interface CustomerData {
    cdtOwner?: boolean;
    emailAddr?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    phone?: string;
    secondLastName?: string;
}
