import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ProgressBar, Step} from '../../app/models/progress-bar';
import {BdbConstants} from '../../app/models/bdb-generics/bdb-constants';

@Injectable()
export class ProgressBarProvider {

  model: ProgressBar;

  constructor() {
    this.model = new ProgressBar();
    this.resetObject();
  }

  getInstance() {
    return this.model;
  }

  setLogo(path: string) {
    this.model.logo = path;
  }

  setTitle(stepId: string, title: string) {
    this.getStep(stepId).title = title;
  }

  setDetails(stepId: string, details: Array<string>) {
    this.getStep(stepId).details = details;
  }

  setDone(stepId: string, isDone: boolean) {
    this.getStep(stepId).isDone = isDone;
  }

  setContraction(contraction: string) {
    this.model.contraction = contraction;
  }

  setColor(color: string) {
    this.model.color = color;
  }

  private getStep(stepId: string): Step {
    return this.model.steps.find((e) => {
      return e.id === stepId;
    });
  }

  addStep(stepId: string, title: string) {
    const step = new Step(stepId, title);
    this.model.steps.push(step);
  }

  init(contraction: string, key: string, title: string, details: string[], config: { isDone, pathLogo } = {isDone: true, pathLogo: ''}) {
    this.resetObject();
    this.setLogo(config.pathLogo);
    this.setContraction(contraction);
    this.setTitle(key, title);
    this.setDetails(key, details);
    this.setDone(key, config.isDone);
  }

  resetObject() {
    this.model.logo = '';
    this.model.steps = [];
    this.model.contraction = '';
    const step1 = new Step(BdbConstants.PROGBAR_STEP_1, 'concepto');
    const step2 = new Step(BdbConstants.PROGBAR_STEP_2, 'Valor a pagar');
    const step3 = new Step(BdbConstants.PROGBAR_STEP_3, 'Cuenta origen');
    this.model.steps.push(step1, step2, step3);
  }

  resetObjectTwoSteps() {
    this.model.logo = '';
    this.model.steps = [];
    this.model.contraction = '';
    const step1 = new Step(BdbConstants.PROGBAR_STEP_1, 'concepto');
    const step2 = new Step(BdbConstants.PROGBAR_STEP_2, 'Valor a pagar');
    this.model.steps.push(step1, step2);
  }

}
