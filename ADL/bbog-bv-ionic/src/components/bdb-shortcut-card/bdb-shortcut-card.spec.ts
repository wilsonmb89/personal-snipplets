import {} from 'jasmine';
import { BdbShortcutCardComponent } from './bdb-shortcut-card';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BdbAvatarComponent } from '../bdb-avatar/bdb-avatar';
import { ShortcutCardOverlayComponent } from '../shortcut-card-overlay/shortcut-card-overlay';
import { IonicModule } from 'ionic-angular';
import { BdbShortcutCard } from 'app/models/bdb-shortcut-card';
import { DirectivesModule } from 'directives/directives.module';
import { ContractionAvatarPipe } from 'new-app/shared/pipes/contraction/contraction-avatar.pipe';

describe('component: BdbShortcutCard', () => {
    let component: BdbShortcutCardComponent;
    let fixture: ComponentFixture<BdbShortcutCardComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BdbShortcutCardComponent,
                BdbAvatarComponent,
                ShortcutCardOverlayComponent,
                ContractionAvatarPipe
            ],
            imports: [
                IonicModule
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(BdbShortcutCardComponent);
        component = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(component).toBeDefined();
    });

    it('should emit onCardClicked', () => {
        const item: BdbShortcutCard = {
            contraction: 'CC',
            firstText: 'da',
            rectangle: true,
            secondText: 'a'
        };
        component.shortcut = item;
        component.onCardClicked.subscribe( data => {
            expect(data).toEqual(item);
        });
        spyOn(component.onCardClicked, 'emit');
        component.cardClicked();
        fixture.detectChanges();
        expect(component.onCardClicked.emit).toHaveBeenCalled();
    });
});
