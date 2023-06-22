import { DataMovementsFiduciary } from './data-movements-fiduciary';

export class ActivityFiduciaryOrderList {
  constructor(activityFiduciaryOrderList: DataMovementsFiduciary []) {
    this.activityFiduciaryOrderList = activityFiduciaryOrderList;
  }
  activityFiduciaryOrderList: DataMovementsFiduciary [];
}
