import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebProgressBarComponent } from './web-progress-bar';
import { ProgressBarProvider } from '../../providers/progress-bar/progress-bar';
import { ProgressBar } from 'app/models/progress-bar';
import { IonicModule } from 'ionic-angular';
import { ContractionAvatarPipe } from 'new-app/shared/pipes/contraction/contraction-avatar.pipe';

describe('header session component test suite', () => {
    let component: WebProgressBarComponent;
    let fixture: ComponentFixture<WebProgressBarComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                WebProgressBarComponent,
                ContractionAvatarPipe
            ],
            providers: [
                ProgressBarProvider
            ],
            imports: [
                IonicModule.forRoot(this)
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(WebProgressBarComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        const model: ProgressBar = component.model;
        expect(component).toBeDefined();
        expect(model).not.toBeNull();
    });
});
