import { Entity, jsonRsaCrypto } from '../../../../../app/core/decorators/JsonRsaCrypto';
import { ProductDetail } from '../../../../../app/models/products/product-model';

export class PocketCreateRq {
    accountDetail: AccountDetailApi;
    pocketDetail: PocketDetailRq;
}

export interface PocketCreateRs {
  message: string;
}

export class PocketTransferRq {
    accountDetail: AccountDetailApi;
    pocketId: string;
    amount: number;
    transferType: string;
}

export class PocketDetailRq {
    pocketName?: string;
    pocketType?: string;
    openningAmt?: number;
    monthlyAmt?: number;
    savingGoal?: number;
    term?: number;
}
export interface PocketListRs {
    pockets: Pocket[];
    message: string;
}

export interface PocketList {
    pockets: Pocket[];
}

export interface Pocket {
    pocketName: string;
    pocketBalance: string;
    pocketType: string;
    pocketId: string;
    account: ProductDetail;
    pocketGoal: string;
    pocketEndDate: string;
    pocketStartDate: string;
    putType: string;
    debitAmount: string;
    debAutType: string;
    debitDayOne: string;
    debitDayTwo: string;
}

export interface PocketPostRs {
    message: string;
}

export class PocketMovementRq {
    pocketId: string;
    accountDetail:  AccountDetailApi;
}

export class PocketMovementRs {
    movementsDetailRs: MovementsDetailRs[];
    message: string;
}

export interface MovementsDetailRs {
    date: string;
    description: string;
    amount: string;
    transactionType: string;
}

export interface PulseOnBoardingItem {
    mainTitle: string;
    description: string;
    imageUrl: string;
}

export interface GetPocketsApiRq {
    accountDetail: AccountDetailApi;
}

export class AccountDetailApi {
    pocketId?: string;
    acctId: string;
    acctType: string;
}

export class PocketDetailApi {
    pocketName: string;
    pocketType: string;
    pocketId: string;
}

export interface DeletePocketApiRq {
    accountDetail: AccountDetailApi;
    pocketDetail: PocketDetailApi;
}

export interface DeletePocketApiRs {
    message: string;
}

export class ModifyPocketDetailApi {
    pocketId: string;
    newPocketName: string;
    newSavingGoal: number;
    newPocketType: string;
    newDate: number;
    newPutType: string;
    newDebitAmount: number;
    newDebAutType: string;
    newDebitDayOne: string;
    newDebitDayTwo: string;
}

export interface ModifyPocketApiRq {
    accountDetail: AccountDetailApi;
    pocketDetail: ModifyPocketDetailApi;
}

export interface ModifyPocketApiRs {
    message: string;
}
