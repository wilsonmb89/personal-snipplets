import { NgModule } from '@angular/core';

import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { UserFeaturesService } from '../../../core/services-apis/user-features/user-features.service';
import { UserFeaturesDelegateService } from './user-features-delegate.service';

@NgModule({
  declarations: [],
  imports: [
    BdbUtilsModule
  ],
  providers: [
    UserFeaturesService,
    UserFeaturesDelegateService
  ]
})
export class UserFeaturesDelegateModule {}
