import {ComponentFixture, async} from '@angular/core/testing';
import {TestUtils} from '../../test';
import {SecondMethodComponent} from './second-method';


let fixture: ComponentFixture<SecondMethodComponent> = null;
let instance: any = null;

describe('Page: Sign in', () => {

  beforeEach(async(() => TestUtils.beforeEachCompiler([SecondMethodComponent]).then(compiled => {
    fixture = compiled.fixture;
    instance = compiled.instance;
    fixture.detectChanges();
  })));

  afterEach(() => {
    fixture.destroy();
  });

  it('Should create the SecondMethodComponent component', async(() => {
    expect(instance).toBeTruthy();
  }));
});
