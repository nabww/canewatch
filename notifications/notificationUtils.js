// notificationUtils.js
import PushNotification from "react-native-push-notification";

// Schedule notifications for an event
export const scheduleEventNotifications = (event) => {
  const oneWeekBefore = new Date(event.date);
  oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

  const dayOfEvent = new Date(event.date);
  dayOfEvent.setHours(8, 0, 0, 0);

  // Notification one week before
  PushNotification.localNotificationSchedule({
    message: `Upcoming event: ${event.name} is in one week.`,
    date: oneWeekBefore,
    actions: '["Move Up Date", "Honor Date"]',
  });

  // Notification on the day of the event at 8 AM
  PushNotification.localNotificationSchedule({
    message: `Upcoming event: ${event.name} is today at 8 AM.`,
    date: dayOfEvent,
    actions: '["Move Up Date", "Honor Date"]',
  });
};
