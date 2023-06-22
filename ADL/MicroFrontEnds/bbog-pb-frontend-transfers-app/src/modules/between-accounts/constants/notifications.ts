import { NotificationControl, NotificationData } from '../../../notification/Notification';
import { replace, isEqual } from 'lodash';

export interface Notification {
  status?: number;
  notificationData: NotificationData;
  notificationControl: NotificationControl[];
}

export const getNotification = (
  statusCode: number,
  textForReplace: string,
  notifications: Notification[],
  codeDefault?: number,
  replaceText?: string,
  replaceProperty?: string
): Notification => {
  const notification: Notification =
    notifications.find(({ status }) => isEqual(status, statusCode)) ??
    notifications.find(({ status }) => isEqual(status, codeDefault));
  if (replaceText && notification)
    notification.notificationData[replaceProperty] = replace(
      notification.notificationData[replaceProperty],
      replaceText,
      textForReplace
    );

  return notification;
};
