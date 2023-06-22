import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebProgressBarNewComponent } from './web-progress-bar-new';
import { ProgressBarProvider } from '../../providers/progress-bar/progress-bar';
import { ProgressBar } from 'app/models/progress-bar';
import { IonicModule } from 'ionic-angular';
import { ContractionAvatarPipe } from 'new-app/shared/pipes/contraction/contraction-avatar.pipe';

describe('header session component test suite', () => {
    let component: WebProgressBarNewComponent;
    let fixture: ComponentFixture<WebProgressBarNewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                WebProgressBarNewComponent,
                ContractionAvatarPipe
            ],
            providers: [
                ProgressBarProvider
            ],
            imports: [
                IonicModule.forRoot(this)
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(WebProgressBarNewComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        const model: ProgressBar = component.model;
        expect(component).toBeDefined();
        expect(model).not.toBeNull();
    });
});
