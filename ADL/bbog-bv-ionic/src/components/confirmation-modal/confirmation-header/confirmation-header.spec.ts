import {} from 'jasmine';
import { ConfirmationHeaderComponent } from './confirmation-header';
import { TestBed, ComponentFixture } from '@angular/core/testing';

describe('confirmation header modal component test suite', () => {
    let component: ConfirmationHeaderComponent;
    let fixture: ComponentFixture<ConfirmationHeaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfirmationHeaderComponent
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(ConfirmationHeaderComponent);
        component = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(component).toBeDefined();
    });
});
