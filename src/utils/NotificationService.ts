import PushNotification from 'react-native-push-notification';

class NotificationService {
  constructor() {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    PushNotification.createChannel(
      {
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
        importance: 4,
      },
      created => console.log(`CreateChannel returned '${created}'`),
    );
  }

  showNotification(title: string, message: string) {
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
    });
  }

  // Schedule a notification
  scheduleNotification(title: string, message: string, date: Date) {
    PushNotification.localNotificationSchedule({
      channelId: 'default-channel-id',
      title: title,
      message: message,
      date: date,
    });
  }
}

export default new NotificationService();
