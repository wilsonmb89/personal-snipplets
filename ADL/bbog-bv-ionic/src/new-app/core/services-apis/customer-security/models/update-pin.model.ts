export interface DebitCardUpdatePinRequest {
    accountId: string;
    referenceId: string;
    oldPassword: string;
    newPassword: string;
}
