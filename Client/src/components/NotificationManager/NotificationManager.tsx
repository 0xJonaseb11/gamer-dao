import { ComponentProps, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer, TypeOptions } from 'react-toastify';

import { Icon } from '@q-dev/q-ui-kit';
import { isObject, uniqueId } from 'lodash';

import { Container } from './styles';

import { Bus, NotificationObjectPayload } from 'utils';

import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

type IconName = ComponentProps<typeof Icon>['name'];

export const NOTIFICATION_TYPE: { [key: string]: TypeOptions } = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  default: 'default',
};

const NotificationManager = () => {
  const { t } = useTranslation();

  const showToast = useCallback(
    (
      messageType = NOTIFICATION_TYPE.default,
      payload?: string | NotificationObjectPayload | unknown,
    ) => {
      let title = '';
      let message = '';
      let iconName: IconName | undefined;

      const defaultTitles = {
        [NOTIFICATION_TYPE.success]: t('NOTIFICATIONS_DEFAULT_TITLE_SUCCESS'),
        [NOTIFICATION_TYPE.error]: t('NOTIFICATIONS_DEFAULT_TITLE_ERROR'),
        [NOTIFICATION_TYPE.warning]: t('NOTIFICATIONS_DEFAULT_TITLE_WARNING'),
        [NOTIFICATION_TYPE.info]: t('NOTIFICATIONS_DEFAULT_TITLE_INFO'),
        [NOTIFICATION_TYPE.default]: t('NOTIFICATIONS_DEFAULT_TITLE_DEFAULT'),
      };
      const defaultMessages = {
        [NOTIFICATION_TYPE.success]: t('NOTIFICATIONS_DEFAULT_MESSAGE_SUCCESS'),
        [NOTIFICATION_TYPE.error]: t('NOTIFICATIONS_DEFAULT_MESSAGE_ERROR'),
        [NOTIFICATION_TYPE.warning]: t('NOTIFICATIONS_DEFAULT_MESSAGE_WARNING'),
        [NOTIFICATION_TYPE.info]: t('NOTIFICATIONS_DEFAULT_MESSAGE_INFO'),
        [NOTIFICATION_TYPE.default]: t('NOTIFICATIONS_DEFAULT_MESSAGE_DEFAULT'),
      };

      const defaultIconNames: Record<string, IconName> = {
        [NOTIFICATION_TYPE.default]: 'info',
        [NOTIFICATION_TYPE.info]: 'info',
        [NOTIFICATION_TYPE.success]: 'check-circle',
        [NOTIFICATION_TYPE.error]: 'cross-circle',
        [NOTIFICATION_TYPE.warning]: 'info',
      };

      if (isObject(payload)) {
        const msgPayload = payload as NotificationObjectPayload;

        title = msgPayload.title || '';
        message = msgPayload.message;
        iconName = msgPayload?.iconName as IconName;
      } else if (payload) {
        message = payload as string;
      } else {
        message = defaultMessages[messageType];
      }

      if (!title) {
        title = defaultTitles[messageType];
      }
      if (!iconName) {
        iconName = defaultIconNames[messageType];
      }

      toast(
        <Container $type={messageType} className="notification-manager">
          <div className="notification-manager__main">
            <div className="notification-manager__icon-wrp">
              <Icon className="notification-manager__icon" name={iconName} />
            </div>

            <div className="notification-manager__content">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="notification-manager__text text-sm">{message}</p>
            </div>

            <button className="notification-manager__close">
              <Icon name="cross" />
            </button>
          </div>
        </Container>,
        {
          toastId: uniqueId(),
          icon: false,
          hideProgressBar: true,
          type: messageType,
          closeButton: false,
        },
      );
    },
    [t],
  );

  useEffect(() => {
    Bus.on(Bus.eventList.success, payload =>
      showToast(NOTIFICATION_TYPE.success, payload),
    );
    Bus.on(Bus.eventList.warning, payload =>
      showToast(NOTIFICATION_TYPE.warning, payload),
    );
    Bus.on(Bus.eventList.error, payload =>
      showToast(NOTIFICATION_TYPE.error, payload),
    );
    Bus.on(Bus.eventList.info, payload =>
      showToast(NOTIFICATION_TYPE.info, payload),
    );
    Bus.on(Bus.eventList.default, payload =>
      showToast(NOTIFICATION_TYPE.default, payload),
    );
  }, []);

  return <ToastContainer />;
};

export default NotificationManager;
