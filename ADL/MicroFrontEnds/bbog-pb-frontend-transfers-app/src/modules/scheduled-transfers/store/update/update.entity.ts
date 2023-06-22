import { CreateScheduledTransferRq } from '../create/create.entity';

export interface UpdateScheduledTransferRq extends CreateScheduledTransferRq {
  scheduledId: string;
}

export interface UpdateScheduledTransferRs {
  message: string;
  approvalId: string;
  requestId: string;
}
