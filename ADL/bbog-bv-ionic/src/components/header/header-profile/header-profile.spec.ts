import {} from 'jasmine';
import { HeaderProfileComponent } from './header-profile';
import { TestBed, ComponentFixture } from '@angular/core/testing';

describe('component: HeaderProfile', () => {
    let component: HeaderProfileComponent;
    let fixture: ComponentFixture<HeaderProfileComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                HeaderProfileComponent
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(HeaderProfileComponent);
        component = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(component).toBeDefined();
    });
});
