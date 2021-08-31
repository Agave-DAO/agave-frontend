import { isMobile } from "react-device-detect";
import {
  ReactNotificationOptions,
  store as NotificationManager,
} from "react-notifications-component";

export async function usingProgressNotification<T>(
  title: string,
  message: string,
  notificationType: ReactNotificationOptions["type"],
  promise: Promise<T>
): Promise<T> {
  const notification = NotificationManager.addNotification({
    container: isMobile ? "center" : "bottom-right",
    title: title,
    dismiss: {
      click: false,
      touch: false,
      duration: 0,
    },
    message: message,
    type: notificationType,
  });
  try {
    return await promise;
  } finally {
    NotificationManager.removeNotification(notification);
  }
}
