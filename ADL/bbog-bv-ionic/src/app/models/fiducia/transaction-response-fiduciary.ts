import { ActivityFiduciaryOrderList } from './activity-order-list-fiduciary';

export class TransactionsResponseFiduciary {
  constructor(activityOrderList: ActivityFiduciaryOrderList) {
    this.activityOrderList = activityOrderList;
  }
  activityOrderList: ActivityFiduciaryOrderList;
}
