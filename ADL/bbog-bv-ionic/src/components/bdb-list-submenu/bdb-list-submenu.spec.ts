import {} from 'jasmine';
import { BdbListSubmenuComponent } from './bdb-list-submenu';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, Config } from 'ionic-angular';
import { BdbMap } from 'app/models/bdb-generics/bdb-map';

describe('component: BdbListSubmenu', () => {

    let component: BdbListSubmenuComponent;
    let fixture: ComponentFixture<BdbListSubmenuComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BdbListSubmenuComponent
            ],
            imports: [
                IonicModule.forRoot(this)
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(BdbListSubmenuComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should be created', () => {
        expect(component).toBeDefined();
    });

    it('should emit on itemSelected', () => {
        const item: BdbMap = {
            key: 'dl',
            value: ''
        };
        spyOn(component.clickItem, 'emit');
        component.itemSelected(item);
        fixture.detectChanges();
        expect(component.clickItem.emit).toHaveBeenCalled();
    });
});
