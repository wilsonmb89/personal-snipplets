import {} from 'jasmine';
import { AddNewServiceBtnComponent } from './add-new-service-btn';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('add new btn test suite', () => {
    let component: AddNewServiceBtnComponent;
    let fixture: ComponentFixture<AddNewServiceBtnComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AddNewServiceBtnComponent
            ]
        });

        fixture = TestBed.createComponent(AddNewServiceBtnComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should be created', () => {
        expect(component).toBeDefined();
    });
});
