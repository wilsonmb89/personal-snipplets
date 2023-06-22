import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClientWrapperProvider } from '../../http/http-client-wrapper/http-client-wrapper.service';
import { GetAllBasicDataRs } from './models/getAll.model';
import { BasicDataRs } from './models/getBasicData.model';
import { SendEmailNotificationRq, SendEmailNotificationRs } from './models/sendEmailNotification.model';
import { UpdateBasicDataRq, UpdateBasicDataRs } from './models/updateBasicData.model';

@Injectable()
export class CustomerBasicDataService {

  private readonly CONST_CUSTOMER_BASIC_DATA_URL = 'customer-basic-data';
  private readonly CONST_GET_ALL_OP = 'get-all';
  private readonly CONST_GET_BASIC_DATA_OP = 'get';
  private readonly CONST_UPDATE_BASIC_DATA_OP = 'update-basic-data';
  private readonly CONST_EMAIL_NOTIFICATION_OP = 'customer-notification/email';

  constructor(
    private bdbHttp: HttpClientWrapperProvider
  ) {}

  public getBasicData(): Observable<BasicDataRs> {
    return this.bdbHttp.postToADLApi<any, BasicDataRs>(
      {},
      `${this.CONST_CUSTOMER_BASIC_DATA_URL}/${this.CONST_GET_BASIC_DATA_OP}`
    );
  }

  public getAll(): Observable<GetAllBasicDataRs> {
    return this.bdbHttp.postToADLApi<{}, GetAllBasicDataRs>(
      {},
      `${this.CONST_CUSTOMER_BASIC_DATA_URL}/${this.CONST_GET_ALL_OP}`
    );
  }

  public updateBasicData(body: UpdateBasicDataRq): Observable<UpdateBasicDataRs> {
    return this.bdbHttp.postToADLApi<UpdateBasicDataRq, UpdateBasicDataRs>(
      body,
      `${this.CONST_CUSTOMER_BASIC_DATA_URL}/${this.CONST_UPDATE_BASIC_DATA_OP}`
    );
  }

  public sendEmailNotification(request: SendEmailNotificationRq): Observable<SendEmailNotificationRs> {
    return this.bdbHttp.postToADLApi<SendEmailNotificationRq, SendEmailNotificationRs>(
      request,
      `${this.CONST_CUSTOMER_BASIC_DATA_URL}/${this.CONST_EMAIL_NOTIFICATION_OP}`
    );
  }

}
