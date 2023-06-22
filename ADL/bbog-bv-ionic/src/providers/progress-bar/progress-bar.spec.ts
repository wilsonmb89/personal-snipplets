import { async } from '@angular/core/testing';

import { ProgressBar, Step } from '../../app/models/progress-bar';
import { ProgressBarProvider } from './progress-bar';

let progressBar: ProgressBarProvider;

describe('Progress Bar Component', () => {
  beforeEach(async(() => {
    progressBar = new ProgressBarProvider();
  }));

  it('should correctly create instance of ProgressBar', () => {
    const pb: ProgressBar = progressBar.getInstance();
    expect(pb).not.toBe(null);
  });


  it('should correctly set logo', () => {
    const pb: ProgressBar = progressBar.getInstance();
    progressBar.setLogo('TS');
    progressBar.setColor('#fff');
    progressBar.setContraction('CS');


    expect(pb.logo).toEqual('TS');
    expect(pb.color).toEqual('#fff');
    expect(pb.contraction).toEqual('CS');

  });

  it('should correctly set Step', () => {
    const pb: ProgressBar = progressBar.getInstance();
    progressBar.init('CS', 'concept', 'tempTit', ['tt', 'aa']);

    progressBar.setTitle('concept', 'Step 1');
    progressBar.setDetails('concept', ['test', 'desctest']);
    progressBar.setDone('concept', true);
    expect(pb.steps[0]).not.toBe(null);
    expect(pb.steps[0].isDone).toBe(true);
    expect(pb.steps[0].title).toBe('Step 1');
  });

  it('should add a step', () => {
    let steps: Array<Step> = progressBar.model.steps;
    const n: number = steps.length;
    progressBar.addStep('STEP_NEW', 'new detail');
    steps = progressBar.model.steps;
    const a: number = steps.length;
    expect(a).toBeGreaterThan(n);
  });

  it('should reset two steps', () => {
    progressBar.resetObjectTwoSteps();
    const model: ProgressBar = progressBar.model;
    expect(model.logo).toEqual('');
    expect(model.contraction).toEqual('');
  });
});
