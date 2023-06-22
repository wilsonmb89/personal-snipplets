import { } from 'jasmine';
import { BdbDropdownComponent } from './bdb-dropdown';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BdbMap } from 'app/models/bdb-generics/bdb-map';

describe('component: BdbDropdown', () => {

    let component: BdbDropdownComponent;
    let fixture: ComponentFixture<BdbDropdownComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BdbDropdownComponent
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(BdbDropdownComponent);
        component = fixture.componentInstance;
    });

    it('should emit itemSelected', () => {
        spyOn(component.itemSelected, 'emit');
        component.onChange('item');
        fixture.detectChanges();
        expect(component.itemSelected.emit).toHaveBeenCalled();
    });
});
