import { } from 'jasmine';
import { ModalTokenHeaderComponent } from './modal-token-header';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('modal token header test', () => {

    let component: ModalTokenHeaderComponent;
    let fixture: ComponentFixture<ModalTokenHeaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ModalTokenHeaderComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalTokenHeaderComponent);
        component = fixture.componentInstance;
    });

    it('should emit onCloseModal', () => {
        spyOn(component.onCloseModal, 'emit');
        component.closeModal();
        fixture.detectChanges();
        expect(component.onCloseModal.emit).toHaveBeenCalled();
    });
});

