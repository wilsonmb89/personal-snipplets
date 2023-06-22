import {} from 'jasmine';
import { BdbCsMosaicComponent } from './bdb-cs-mosaic';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { CsMainModel } from '..';

describe('component: BdbCsMosaic', () => {
    let component: BdbCsMosaicComponent;
    let fixture: ComponentFixture<BdbCsMosaicComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BdbCsMosaicComponent
            ],
            imports: [
                IonicModule.forRoot(this)
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(BdbCsMosaicComponent);
        component = fixture.componentInstance;
    });

    it('should emit onItemClicked', () => {
        const item: CsMainModel = {
            btnText: '',
            cardDesc: '',
            key: '',
            url: '',
            cardTitle: '',
            iconPath: '',
            iconPathSm: ''
        };
        spyOn(component.onItemClicked, 'emit');
        component.itemClicked(item);
        fixture.detectChanges();
        expect(component.onItemClicked.emit).toHaveBeenCalled();
    });
});
