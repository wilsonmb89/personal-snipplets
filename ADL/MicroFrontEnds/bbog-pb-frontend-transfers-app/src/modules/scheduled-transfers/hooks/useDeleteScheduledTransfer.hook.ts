import { useDispatch } from 'react-redux';

import { fetchDeleteScheduledTransfer } from '../store/delete/scheduled-transfer-delete.effect';
import { NotificationControl, NotificationData } from '../../../notification/Notification';
import showNotificationModal from '../../../notification';
import { useScheduledTransfer } from './useScheduledTransfer.hook';

interface UseDeleteScheduledTransfer {
  deleteScheduled: (scheduleId: string) => void;
}

const SUCCESS_TOAST_PROPS = 'La programación ha sido eliminada.';

export const useDeleteScheduledTransfer = (): UseDeleteScheduledTransfer => {
  const dispatch = useDispatch();

  const { rootScheduledAndShowToast } = useScheduledTransfer();

  const deleteScheduled = (scheduleId: string) => {
    const notificationDelete: NotificationData = {
      type: 'warning',
      name: 'Eliminar programación',
      message:
        '¿Estás seguro de eliminar esta transferencia programada? Al eliminar la programación no se realizarán futuras transferencias.'
    };
    const deleteActions: NotificationControl[] = [
      { text: 'Si, eliminar', action: () => confirmDelete(scheduleId) },
      { text: 'Cancelar', action: () => rootScheduledAndShowToast(null) }
    ];
    showNotificationModal(notificationDelete, deleteActions);
  };

  const confirmDelete = async (scheduleId: string) => {
    await Promise.resolve(dispatch(fetchDeleteScheduledTransfer(scheduleId))).then(() =>
      rootScheduledAndShowToast(SUCCESS_TOAST_PROPS)
    );
  };

  return { deleteScheduled };
};
