import {} from 'jasmine';
import { BdbCsMainCardComponent } from './bdb-cs-main-card';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { CsMainModel } from '..';

describe('component: BdbCsMainCard', () => {
    let component: BdbCsMainCardComponent;
    let fixture: ComponentFixture<BdbCsMainCardComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BdbCsMainCardComponent
            ],
            imports: [
                IonicModule.forRoot(this)
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(BdbCsMainCardComponent);
        component = fixture.componentInstance;
    });

    it('should emit onCardClicked', () => {
        const item: CsMainModel = {
            btnText: '',
            cardDesc: '',
            key: '',
            url: '',
            cardTitle: '',
            iconPath: '',
            iconPathSm: ''
        };
        component.mainCard = item;
        component.onMainCardClicked.subscribe( data => {
            expect(data).toEqual(item);
        });
        spyOn(component.onMainCardClicked, 'emit');
        component.open();
        fixture.detectChanges();
        expect(component.onMainCardClicked.emit).toHaveBeenCalled();
    });
});
