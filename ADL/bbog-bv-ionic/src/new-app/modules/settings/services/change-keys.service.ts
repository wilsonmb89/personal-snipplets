import { Injectable } from '@angular/core';
import { CustomerCard } from '../../../../app/models/activation-cards/customer-cards-list-rs';
import { CustomerSecurityService } from '../../../../new-app/core/services-apis/customer-security/customer-security.service';
import { FormChangePass } from '../models/change-keys.model';
import { DebitCardUpdatePinRequest } from '../../../../new-app/core/services-apis/customer-security/models/update-pin.model';
import { Observable } from 'rxjs/Observable';
import { BdBGenericResponse } from '../../../../new-app/core/models/generic-rs.model';

@Injectable()
export class ChangeKeysService {

    private REFERENCE_DEBIT_CARD = 'VISA';
    private REFERENCE_SECURE_PASS = 'PRIV';

    constructor(
        private cusSecurityService: CustomerSecurityService
    ) { }

    public updatePassDebitCard(
        valueKeys: FormChangePass,
        debitCard?: CustomerCard
    ): Observable<BdBGenericResponse> {

        const debitCardUpdatePinRq: DebitCardUpdatePinRequest = {
            accountId: !!debitCard ? debitCard.cardNumber.substring(debitCard.cardNumber.length - 4) : '1',
            referenceId: !!debitCard ? this.REFERENCE_DEBIT_CARD : this.REFERENCE_SECURE_PASS,
            newPassword: valueKeys.newPassword,
            oldPassword: valueKeys.oldPassword
        };

        return this.cusSecurityService.updatePin(debitCardUpdatePinRq);
    }

}
