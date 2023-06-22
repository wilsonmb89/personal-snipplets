import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import showNotificationModal from '../../../notification';
import { AffiliatedAccount } from '../../../store/affiliated-accounts/afilliated-accounts.entity';
import { BetweenAccountPages, getNavigationPath } from '../constants/navigation-paths';
import { fetchDeleteAccount } from '../store/delete/account-delete.effect';
import { DeleteAccountRequest } from '../store/delete/account-delete.entity';
import { Severities } from '../../../constants/severity';
import { getNotification, Notification } from '../constants/notifications';
import { getAffiliatedAccountSelected } from '../../../store/affiliated-accounts/afilliated-accounts.select';
import { externalNavigate } from '../../../store/shell-events/shell-events.store';

interface UseDeleteAccount {
  deleteAccount: () => void;
}

export const useDeleteAccount = (): UseDeleteAccount => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const accountSelect: AffiliatedAccount = useSelector(getAffiliatedAccountSelected);

  const notificationsArra: Notification[] = [
    {
      status: 0,
      notificationData: {
        message: 'Al eliminar la cuenta deberás inscribirla nuevamente para realizar transferencias.',
        name: '¿Estás seguro de eliminar la cuenta nickname?',
        type: Severities.warning
      },
      notificationControl: [
        { text: 'Si, eliminar', action: () => confirmDelete() },
        {
          text: 'Cancelar',
          action: () => {
            return;
          }
        }
      ]
    },
    {
      status: 409,
      notificationData: {
        message:
          'Para eliminar la cuenta “nickname” primero debes eliminar las programaciones que tienes hacia esa cuenta. Recuerda que las futuras transferencias no se realizarán.',
        name: 'Tienes programaciones activas',
        type: Severities.warning
      },
      notificationControl: [
        {
          text: 'Ir a programaciones',
          action: () => {
            navigate(getNavigationPath(BetweenAccountPages.SCHEDULED_TRANSFERS));
            dispatch(externalNavigate('/legacy/transfers/scheduled'));
          }
        },
        {
          text: 'Cancelar',
          action: () => {
            return;
          }
        }
      ]
    },
    {
      status: 500,
      notificationData: {
        message: 'En este momento no es posible eliminar la cuenta “nickname”. Por favor intenta nuevamente más tarde.',
        name: 'No se pudo eliminar la cuenta',
        type: Severities.error
      },
      notificationControl: [
        {
          text: 'Entendido',
          action: () => {
            return;
          }
        }
      ]
    }
  ];

  const deleteAccount = () => {
    const { notificationControl, notificationData } = getNotification(
      0,
      accountSelect.productAlias,
      notificationsArra,
      0,
      'nickname',
      'name'
    );
    showNotificationModal(notificationData, notificationControl);
  };

  const confirmDelete = async () => {
    const request: DeleteAccountRequest = {
      targetBankId: accountSelect.bankId,
      nickName: accountSelect.productAlias,
      targetAccountId: accountSelect.productNumber,
      targetAccountType: accountSelect.productType
    };
    await Promise.resolve(dispatch(fetchDeleteAccount(request))).catch(error => showNotification(error, request));
  };

  const showNotification = (error, request: DeleteAccountRequest): void => {
    const { status } = error;
    const { notificationControl, notificationData } = getNotification(
      status,
      request.nickName,
      notificationsArra,
      500,
      'nickname',
      'message'
    );
    showNotificationModal(notificationData, notificationControl);
  };

  return {
    deleteAccount
  };
};
