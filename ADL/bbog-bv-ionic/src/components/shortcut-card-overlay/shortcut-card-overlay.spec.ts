import {} from 'jasmine';
import { ShortcutCardOverlayComponent } from './shortcut-card-overlay';
import { TestabilityRegistry } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentsModule} from '../components.module';
import { BdbAvatarComponent } from '../bdb-avatar/bdb-avatar';
import { ContractionAvatarPipe } from 'new-app/shared/pipes/contraction/contraction-avatar.pipe';

describe('overlay card test suite', () => {
    let component: ShortcutCardOverlayComponent;
    let fixture: ComponentFixture<ShortcutCardOverlayComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ShortcutCardOverlayComponent,
                BdbAvatarComponent,
                ContractionAvatarPipe
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ShortcutCardOverlayComponent);
        component = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(component).toBeDefined();
    });
});
