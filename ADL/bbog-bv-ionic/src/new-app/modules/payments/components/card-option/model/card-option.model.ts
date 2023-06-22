import { toggleAllowedOTPMapperType } from '../../../../../core/services-delegate/user-features/user-features-delegate.service';


export class CardOptionModel {
  constructor(
    public iconPath: string,
    public title: string,
    public description: string,
    public linkText: string,
    public navigationPath: string,
    public tagText?: string,
    public allowedOTPService?: toggleAllowedOTPMapperType,
  ) {}
}
