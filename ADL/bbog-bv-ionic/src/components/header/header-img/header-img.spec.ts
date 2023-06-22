import { } from 'jasmine';
import { HeaderImgComponent } from './header-img';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('component: HeaderImg', () => {
    let component: HeaderImgComponent;
    let fixture: ComponentFixture<HeaderImgComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                HeaderImgComponent,
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(HeaderImgComponent);
        component = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should emit onBackPressed', () => {
        spyOn(component.backPressed, 'emit');
        component.onBackPressed();
        fixture.detectChanges();
        expect(component.backPressed.emit).toHaveBeenCalled();
    });
});
