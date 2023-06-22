import { Injectable } from '@angular/core';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { ENV } from '@app/env';
import { SimValidationRs } from '../../app/models/sim-validation/sim-validation-rs';
import { GetOtpRes, ValidateOtpRes } from '../../app/models/otp-validation/otp-response';
import { GetOtpReq, ValidateOtpReq, OtpRefType, OtpName } from '../../app/models/otp-validation/otp-request';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { toggleAllowedOTPMapperType, UserFeaturesDelegateService } from '../../new-app/core/services-delegate/user-features/user-features-delegate.service';

@Injectable()
export class BdbOtpProvider {

  constructor(
    private bdbHttpClient: BdbHttpClient,
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private userFeatures: UserFeaturesDelegateService
  ) {}

  /**
   * Call to the service 'validation/validate-sim' in bbog-pb-backend-authentication API to validate
   * the customer's sim card and thus be able to send an OTP
   */
  public validateUserPhoneNumber(): Promise<any> {
    return this.bdbHttpClient.post<SimValidationRs>('validation/validate-sim', {}, ENV.API_GATEWAY_ADL_URL).toPromise();
  }

  /**
   * Call to the service 'validation/get-otp' in bbog-pb-backend-authentication API to send an OTP to
   * the user's registered phone number
   */
  public sendOtpUser(getOtpReq?: GetOtpReq): Promise<GetOtpRes> {
    if (!getOtpReq) {
      getOtpReq = new GetOtpReq();
      getOtpReq.refType = OtpRefType.REGISTRO;
      getOtpReq.name = OtpName.LOGIN_PB;
    }
    return this.bdbHttpClient.post<GetOtpRes>('validation/get-otp', getOtpReq, ENV.API_GATEWAY_ADL_URL).toPromise();
  }

  /**
   * Call to the service 'validation/validate-otp' in bbog-pb-backend-authentication API to validate
   * an OTP sent by the user
   */
  public validateOtpUser(validateOptRequest: ValidateOtpReq): Promise<ValidateOtpRes> {
    return this.bdbHttpClient.post<ValidateOtpRes>('validation/validate-otp', validateOptRequest, ENV.API_GATEWAY_ADL_URL).toPromise();
  }

  /**
   * Call Sim validate method to save the result data in session storage and return this result
   */
  public validateOtpData(userFeaturesOrign?: toggleAllowedOTPMapperType): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!!userFeaturesOrign) {
          this.userFeatures.isOtpAllowedFor(userFeaturesOrign).subscribe(
            async userFeatureAllowed => {
              if (!!userFeatureAllowed) {
                const validateUserPhoneNumber = await this.validateDataUserPhoneNumber().catch(err => false);
                resolve(validateUserPhoneNumber);
              } else {
                resolve(false);
              }
            },
            err => reject(false)
          );
        } else {
          const validateUserPhoneNumber = await this.validateDataUserPhoneNumber().catch(err => false);
          resolve(validateUserPhoneNumber);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Get a sim validation data and save the result in session strorage
   */
  private async validateDataUserPhoneNumber(): Promise<boolean> {
    let result = false;
    let userContactData: SimValidationRs = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.UserContactData);
    if (!userContactData) {
      userContactData = await this.validateUserPhoneNumber().catch(err => false);
      if (!!userContactData) {
        this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.UserContactData, userContactData);
      }
    }
    if (!!userContactData && userContactData.isSecure && !!userContactData.phoneNumber) {
      result = true;
    }
    return result;
  }
}
