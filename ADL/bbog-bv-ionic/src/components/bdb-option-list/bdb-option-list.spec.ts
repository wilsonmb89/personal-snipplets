import {} from 'jasmine';
import { BdbOptionListComponent } from './bdb-option-list';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { CreditBank } from 'app/models/credits/bank-credit';

describe('bdb option list component test suite', () => {

    let component: BdbOptionListComponent;
    let fixture: ComponentFixture<BdbOptionListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BdbOptionListComponent
            ],
            imports: [
                IonicModule.forRoot(this)
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BdbOptionListComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    xit('should emit on itemSelected', () => {
        const item: CreditBank = {
            id: '003',
            name: 'Bancolombia'
        };
        spyOn(component.itemSelected, 'emit');
        component.emit(item);
        fixture.detectChanges();
        expect(component.itemSelected.emit).toHaveBeenCalled();
    });
});
