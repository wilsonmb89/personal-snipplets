import { ComponentFixture, async } from '@angular/core/testing';
import { TestUtils } from '../../test';
import { SecondMethodItemComponent } from './second-method-item';


let fixture: ComponentFixture<SecondMethodItemComponent>;
let component: SecondMethodItemComponent;

describe('Component: SecondMethodItem', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([SecondMethodItemComponent]).then(compiled => {
    fixture = compiled.fixture;
    component = compiled.instance;
    fixture.detectChanges();
  })));

  afterEach(() => {
    fixture.destroy();
  });

  it('Should create the SecondMethodItemComponent component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should emit on itemSelected', () => {
    spyOn(component.selected, 'emit');
    component.emitEvent();
    fixture.detectChanges();
    expect(component.selected.emit).toHaveBeenCalled();
  });
});
