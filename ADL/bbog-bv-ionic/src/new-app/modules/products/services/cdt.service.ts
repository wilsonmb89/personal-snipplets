import { Injectable } from '@angular/core';
import { CdtRenewalRequest } from '../models/cdt-renewal-request';
import { ProductBalanceInfo } from '@app/apis/products/products-detail/models/GetBalanceRs';

@Injectable()
export class CDTService {

    constructor() { }

    public getRequestBody(cdtData): CdtRenewalRequest {
        return {
            cdtNumber: cdtData.accountId,
            cdtStatusRenewal: cdtData['renewal'] === '2' ? 1 : 2,
          };
    }

    public getCDTCardToggleIsActive(cdt: ProductBalanceInfo): boolean {
        return !(cdt['renewal'] === '2');
    }

    public getCDTCardToggleIsEnabled(cdt: ProductBalanceInfo): boolean {
        const initialDate = this.dateSubstraction(cdt.expDate, 14);
        const finalDate = this.dateSubstraction(cdt.expDate, 1);
        const currentDate = new Date();
        if (cdt['renewal'] === '2') {
            return !(currentDate >= finalDate);
        } else {
            return (currentDate >= initialDate && currentDate <= finalDate);
        }
    }

    public getCDTCardTitleData(cdt: ProductBalanceInfo): string {
        return cdt['renewal'] === '2' ? 'Renovación automática desactivada:' : 'Renovación automática activada:';
    }

    public getCDTCardContent(cdt: ProductBalanceInfo): string {
        let dateString: string;
        if (cdt['renewal'] === '2') {
            dateString = `${this.dateFormate(this.dateSubstraction(cdt.expDate, 1))}`;
            return `Podrás modificar esta opción hasta el ${dateString.bold()}. Tu dinero más intereses serán consignados en la cuenta desde donde transferiste, 1 día hábil siguiente al vencimiento.`;
        } else {
            const initialDate = this.dateSubstraction(cdt.expDate, 14);
            const finalDate = this.dateSubstraction(cdt.expDate, 1);
            const currentDate = new Date();

            if (currentDate >= initialDate && currentDate <= finalDate) {
                dateString = `${this.dateFormate(finalDate)}`;
                return `Podrás modificar esta opción hasta el ${dateString.bold()}.`;
            } else {
                dateString = `${this.dateFormate(initialDate)} hasta el ${this.dateFormate(finalDate)}`;
                return `Podrás modificar esta opción desde el ${dateString.bold()}, de lo contrario se renovará tu CDT Digital (captial + intereses).`;
            }
        }
    }

    private dateSubstraction(date: string, days: number): Date {
        const auxDate = new Date(date);
        auxDate.setDate(auxDate.getDate() - days);
        const hour = days === 1 ? 23 : 0;
        auxDate.setHours(hour, 0, 0, 0);
        return auxDate;
    }

    private dateFormate(date: Date): string {
        return date.toLocaleString('es-mx', { month: 'long', day: 'numeric', year: 'numeric' });
    }

}
