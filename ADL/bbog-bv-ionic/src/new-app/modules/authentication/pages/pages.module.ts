import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BdbAuthenticationLogoutComponentModule } from './logout/logout.component.module';

@NgModule({
  imports: [BdbAuthenticationLogoutComponentModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BdbAuthenticationPagesModule {}
