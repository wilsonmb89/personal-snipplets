import {} from 'jasmine';
import { ConfirmationDetailComponent } from './confirmation-detail';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe(('confirmation modal detail component test suite'), () => {

    let component: ConfirmationDetailComponent;
    let fixture: ComponentFixture<ConfirmationDetailComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfirmationDetailComponent
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(ConfirmationDetailComponent);
        component = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(component).toBeDefined();
    });
});
