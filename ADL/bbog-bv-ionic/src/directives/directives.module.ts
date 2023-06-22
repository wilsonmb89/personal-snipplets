import { NgModule } from '@angular/core';
import { BvButtonDirective } from './bv-button/bv-button';
import { BdbBorderCardDirective } from './bdb-border-card/bdb-border-card';
import { BdbCheckedDirective } from './bdb-checked/bdb-checked';
import { BdbSelectDirective } from './bdb-select/bdb-select';
import { BdbFormInputDirective } from './bdb-form-input/bdb-form-input';
import { PbInputDirective } from './pb-input/pb-input';
import { AutoResizeDirective } from './auto-resize/auto-resize';
import { AddAttributeColDirective } from './add-attribute-col/add-attribute-col';
import { BdbTagDirective } from './bdb-tag/bdb-tag';
import { AddAttrTableDirective } from './add-attr-table/add-attr-table';
import { BreakpointDetectorDirective } from './breakpoint-detector/breakpoint-detector';
import { BdbNormalizeDiacriticDirective } from './bdb-normalize-diacritic/bdb-normalize-diacritic';
import {NavBehaviorDirective} from '@app/shared/directives/navigation/navigation';

@NgModule({
    declarations: [
        BvButtonDirective,
        BdbBorderCardDirective,
        BdbCheckedDirective,
        BdbSelectDirective,
        BdbFormInputDirective,
        PbInputDirective,
        AutoResizeDirective,
        AddAttributeColDirective,
        BdbTagDirective,
        AddAttrTableDirective,
        BreakpointDetectorDirective,
        BdbNormalizeDiacriticDirective,
        NavBehaviorDirective
    ],
    imports: [],
    exports: [
        BvButtonDirective,
        BdbBorderCardDirective,
        BdbCheckedDirective,
        BdbSelectDirective,
        BdbFormInputDirective,
        PbInputDirective,
        AutoResizeDirective,
        AddAttributeColDirective,
        BdbTagDirective,
        AddAttrTableDirective,
        BreakpointDetectorDirective,
        BdbNormalizeDiacriticDirective,
        NavBehaviorDirective
    ]
})
export class DirectivesModule { }
