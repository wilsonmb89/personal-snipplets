import { BdbAutocompleteComponent } from './bdb-autocomplete';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestUtils } from '../../../../test';
import { IonicModule } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { BdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms';

let fixture: ComponentFixture<BdbAutocompleteComponent>;
let instance: BdbAutocompleteComponent;

describe('Bdb-autocomplete component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BdbAutocompleteComponent],
            imports: [
                IonicModule.forRoot(BdbAutocompleteComponent),
                ReactiveFormsModule
            ],
            providers: [FormBuilder,
                BdbPlatformsProvider]

        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BdbAutocompleteComponent);
        instance = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('Should create the bdbButton component', async(() => {
        expect(instance).toBeTruthy();
    }));

});
