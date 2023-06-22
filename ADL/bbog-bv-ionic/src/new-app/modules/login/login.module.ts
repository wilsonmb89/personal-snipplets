import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DirectivesModule } from '../../../directives/directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginFormComponent } from './components/login-form/login-form';
import { LoginNewsComponent } from './components/login-news-info/login-news';
import { ContactNumbersModalComponent } from './components/contact-numbers-modal/contact-numbers-modal';
import { CommonModule } from '@angular/common';
import { LoginTokenComponent } from './components/login-token/login-token';
import { LoginTokenConfirmationComponent } from './components/login-token-confirmation/login-token-confirmation';
import { LoginErrorComponent } from './components/login-error/login-error';
import { LoginTokenLockedComponent } from './components/login-token-locked/login-token-locked';
import { BdbUtilsModule } from '../../shared/utils/bdb-utils.module';
import { NewDirectivesModule } from '@app/shared/directives/new-directives.module';
import {BdbStorageService} from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import {BdbRsaProvider} from '../../../providers/bdb-rsa/bdb-rsa';
import {BdbCookies} from '../../../providers/bdb-cookie/bdb-cookie';
import {UserFacade} from '@app/shared/store/user/facades/user.facade';

@NgModule({
    declarations: [
        LoginFormComponent,
        LoginNewsComponent,
        ContactNumbersModalComponent,
        LoginTokenComponent,
        LoginTokenConfirmationComponent,
        LoginErrorComponent,
        LoginTokenLockedComponent,

    ],
    imports: [
        DirectivesModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BdbUtilsModule,
        NewDirectivesModule
    ],
    exports: [
        LoginFormComponent,
        LoginNewsComponent,
        ContactNumbersModalComponent,
        LoginTokenComponent,
        LoginTokenConfirmationComponent,
        LoginErrorComponent,
        LoginTokenLockedComponent,
    ],
    providers: [
        BdbStorageService,
        BdbRsaProvider,
        BdbCookies,
        UserFacade
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [
        ContactNumbersModalComponent,
        LoginErrorComponent
    ]
})
export class LoginModule { }
