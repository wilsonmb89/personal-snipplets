import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BillersPaymentState } from '../states/payment-core.state';
import { BillerInfoList } from '../../../../core/services-apis/payment-core/models/billers-payment.model';
import { BillInfo } from '../../../../../app/models/bills/bill-info';
import { BdbShortcutCard } from '../../../../../app/models/bdb-shortcut-card';
import { BdbMap } from '../../../../../app/models/bdb-generics/bdb-map';
import { BdbItemCardModel } from '../../../../../components/bdb-item-card-v2/bdb-item-card-v2';

export const getBillersPaymentState = createFeatureSelector<BillersPaymentState>('billersPaymentState');

export const getAllBillerInfoListWorking = createSelector(
    getBillersPaymentState,
    (state: BillersPaymentState) => state.working
);

export const getAllBillerInfoListCompleted = createSelector(
    getBillersPaymentState,
    (state: BillersPaymentState) => state.completed
);

export const getAllBillerInfoListError = createSelector(
    getBillersPaymentState,
    (state: BillersPaymentState) => state.error
);

export const getAllBillerInfoList = createSelector(
    getBillersPaymentState,
    (state: BillersPaymentState) => state.billerInfoList
);

const mapperBiller = () => {
    return (biller: BillerInfoList) =>
        new BillInfo(
            !!biller.invoiceNum ?
                biller.invoiceNum : '',
            biller.nie, biller.nickname,
            biller.orgIdNum, biller.orgInfoName,
            biller.invGen, biller.contraction,
            biller.invoiceVouchNum, biller.agrmType,
            biller.hasInvoice, biller.scheduled,
            biller.pmtType, biller.amt,
            !!biller.dueDt ?
                new Date(biller.dueDt).getTime() : new Date().getTime(),
            !!biller.expDt ?
                new Date(biller.expDt).getTime() : new Date().getTime(),
            {
                acctId: biller.accountNumber,
                acctType: biller.accountType
            }, biller.maxAmount, biller.toPayBeforeExpDaysThreshold
        );
};

export const getAllBillerInfoListOld = createSelector(
    getAllBillerInfoList,
    (billerInfoList: BillerInfoList[]) => billerInfoList.map(mapperBiller())
);

export const getPendingBills = createSelector(
    getAllBillerInfoListOld,
    (billInfoList: BillInfo[]) => billInfoList.filter((bill: BillInfo) =>
        bill.isInvGen && +bill.amt !== 0 && bill.hasInvoice
    )
);

const mapperShortcutCard = () => {
    return (bill: BillInfo) => {
        const card = new BdbShortcutCard();
        card.contraction = bill.contraction;
        card.rectangle = true;
        card.firstText = bill.nickname;
        card.secondText = bill.amt;
        card.rectangleText = bill.expDt.toString();
        card.object = bill;
        return card;
    };
};

export const getPendingBillsShortcutCard = createSelector(
    getPendingBills,
    (billInfoList: BillInfo[]) => billInfoList.map(mapperShortcutCard())
);

const mapperBdbItemCard = () => {
    return (billInfo: BillInfo, index: number) => {

        const details: BdbMap[] = billInfo.isInvGen && billInfo.hasInvoice ? [
            { key: 'Valor a pagar:', value: billInfo.amt },
            { key: 'Fecha de pago:', value: billInfo.expDt.toString() }]
            : [];

        const contextMenuList: BdbMap[] = [];
        const menuListScheduled: BdbMap = billInfo.scheduled ?
            { key: 'mod', value: 'Modificar programación', showIcon: false } :
            { key: 'sched', value: 'Programar pago', showIcon: false };

        if (billInfo.isInvGen) {
            contextMenuList.push(menuListScheduled);
        }

        if (billInfo.isInvGen && billInfo.hasInvoice) {
          contextMenuList.push({ key: 'paid-out', value: 'Marcar como pagado', showIcon: false });
        }

        const bdbItemCardModel: BdbItemCardModel = {
            contraction: billInfo.contraction,
            title: billInfo.nickname,
            desc: [
                `${billInfo.orgInfoName}`,
                `No. ${billInfo.nie}`
            ],
            details: details,
            product: billInfo,
            withContextMenu: true,
            contextMenuList: [
                ...contextMenuList,
                { key: 'delete', value: 'Eliminar servicio', showIcon: false }
            ],
            isScheduled: billInfo.scheduled,
            avatarColor: '#008c97',
            showLogo: false,
            isFavorite: false,
            logoPath: null,
            withFavorite: false
        };

        return bdbItemCardModel;
    };
};

export const sortBillsHasInvoice = createSelector(
    getPendingBills,
    (billInfoList: BillInfo[]) => billInfoList.sort(
        (a: BillInfo, b: BillInfo) => +a.expDt - +b.expDt
    ).map(mapperBdbItemCard())
);

export const billsNotHasInvoice = createSelector(
    getAllBillerInfoListOld,
    (billInfoList: BillInfo[]) => billInfoList.filter(
        (bill: BillInfo) => !bill.hasInvoice
    ).map(mapperBdbItemCard())
);
