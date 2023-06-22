import showNotificationModal from '@components/core/modal-notification';
import { NotificationControl, NotificationData } from '@components/core/modal-notification/ModalNotification';

export interface UseNotification {
  launchNotificationModal: (data: NotificationData, controls: NotificationControl[]) => void;
  launchGenericError: (action: () => void) => void;
  launchOneActionNotification: (data: NotificationData, action: () => void, text?: string) => void;
}

export const useNotification = (): UseNotification => {
  const launchNotificationModal = (data: NotificationData, controls: NotificationControl[]): void => {
    showNotificationModal(data, controls);
  };

  const launchOneActionNotification = (data: NotificationData, action: () => void, text?: string): void => {
    const controls: NotificationControl[] = [{ text: text || 'Entendido', action: action }];
    launchNotificationModal(data, controls);
  };

  const launchGenericError = (action: () => void): void => {
    const notificationData: NotificationData = {
      type: 'error',
      name: 'Algo ha fallado',
      message: 'En estos momentos no podemos realizar la operación. Por favor inténtalo nuevamente más tarde.'
    };
    launchOneActionNotification(notificationData, action);
  };

  return { launchNotificationModal, launchGenericError, launchOneActionNotification };
};
