import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const scheduleEventNotifications = async (event) => {
  const oneWeekBefore = new Date(event.date);
  oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

  const dayOfEvent = new Date(event.date);
  dayOfEvent.setHours(0, 0, 0, 0);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Upcoming Event",
      body: `Upcoming event: ${event.type} on ${event.lands?.landName} is in one week.`,
    },
    trigger: oneWeekBefore,
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Upcoming Event",
      body: `Upcoming event: ${event.type} on ${event.lands?.landName} is today.`,
    },
    trigger: dayOfEvent,
  });
};

export { scheduleEventNotifications };
