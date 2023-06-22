import {} from 'jasmine';
import { ConfirmationSubHeaderComponent } from './confirmation-sub-header';
import { TestBed, ComponentFixture } from '@angular/core/testing';

describe('confirmation sub header modal component test suite', () => {
    let component: ConfirmationSubHeaderComponent;
    let fixture: ComponentFixture<ConfirmationSubHeaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfirmationSubHeaderComponent
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(ConfirmationSubHeaderComponent);
        component = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(component).toBeDefined();
    });
});
