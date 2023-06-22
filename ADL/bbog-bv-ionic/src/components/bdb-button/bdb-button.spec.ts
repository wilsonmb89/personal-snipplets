import {ComponentFixture, async} from '@angular/core/testing';
import {TestUtils} from '../../test';
import {BdbButtonComponent} from './bdb-button';


let fixture: ComponentFixture<BdbButtonComponent>;
let instance: BdbButtonComponent;

describe('component: BdbButton', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([BdbButtonComponent]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
    fixture.detectChanges();
  })));

  afterEach(() => {
    fixture.destroy();
  });

  it('Should create the bdbButton component', async(() => {
    expect(instance).toBeTruthy();
  }));

  it('should emit clickBtn', () => {
    spyOn(instance.clickBtn, 'emit');
    instance.executeEmit();
    fixture.detectChanges();
    expect(instance.clickBtn.emit).toHaveBeenCalled();
  });
});
