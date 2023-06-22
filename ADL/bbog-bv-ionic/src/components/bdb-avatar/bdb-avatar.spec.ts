import {} from 'jasmine';
import { BdbAvatarComponent } from './bdb-avatar';
import { TestabilityRegistry } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractionAvatarPipe } from 'new-app/shared/pipes/contraction/contraction-avatar.pipe';

describe('component: BdbAvatar', () => {
    let component: BdbAvatarComponent;
    let fixture: ComponentFixture<BdbAvatarComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                BdbAvatarComponent,
                ContractionAvatarPipe
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BdbAvatarComponent);
        component = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(component).toBeDefined();
    });
});
