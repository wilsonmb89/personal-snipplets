import {} from 'jasmine';
import { BdbSummaryComponent } from './bdb-summary';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileSummaryHeaderComponent, MobileSummaryBodyComponent, MobileSummaryProvider } from '..';
import { BdbAvatarComponent } from '../../bdb-avatar/bdb-avatar';
import { IonicModule } from 'ionic-angular';
import { ContractionAvatarPipe } from 'new-app/shared/pipes/contraction/contraction-avatar.pipe';

describe('component: BdbSummary', () => {
    let component: BdbSummaryComponent;
    let fixture: ComponentFixture<BdbSummaryComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BdbSummaryComponent,
                MobileSummaryHeaderComponent,
                MobileSummaryBodyComponent,
                BdbAvatarComponent,
                ContractionAvatarPipe
            ],
            providers: [
                MobileSummaryProvider
            ],
            imports: [
                IonicModule.forRoot(this)
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BdbSummaryComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeDefined();
    });
});
