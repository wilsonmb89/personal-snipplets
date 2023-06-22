import { } from 'jasmine';
import { BdbBackSubmenuComponent } from './bdb-back-submenu';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('component: BdbBackSubmenu', () => {

    let component: BdbBackSubmenuComponent;
    let fixture: ComponentFixture<BdbBackSubmenuComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BdbBackSubmenuComponent
            ]
        }).compileComponents();

    fixture = TestBed.createComponent(BdbBackSubmenuComponent);
    component = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should emit returnPage', () => {
        spyOn(component.returnPage, 'emit');
        component.executeEmit();
        fixture.detectChanges();
        expect(component.returnPage.emit).toHaveBeenCalled();
    });
});
