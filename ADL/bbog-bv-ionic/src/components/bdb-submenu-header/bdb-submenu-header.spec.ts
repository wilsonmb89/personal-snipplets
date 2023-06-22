import {} from 'jasmine';
import { BdbSubmenuHeaderComponent } from './bdb-submenu-header';
import { TestBed, ComponentFixture } from '@angular/core/testing';

describe('bdb submenu header test suite', () => {

    let component: BdbSubmenuHeaderComponent;
    let fixture: ComponentFixture<BdbSubmenuHeaderComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BdbSubmenuHeaderComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BdbSubmenuHeaderComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should be created', () => {
        expect(component).toBeDefined();
    });
});
