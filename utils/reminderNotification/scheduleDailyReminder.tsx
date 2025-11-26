import * as Notifications from "expo-notifications";

const convertTo24Hour = (hour: number, minute: number, period: "AM" | "PM") => {
  let hour24 = hour;

  if (period === "AM" && hour === 12) {
    hour24 = 0;
  } else if (period === "PM" && hour !== 12) {
    hour24 = hour + 12;
  }

  return { hour: hour24, minute };
};

export const scheduleDailyReminder = async (
  hour: number,
  minute: number,
  period: "AM" | "PM",
  message: string,
  title: string = "Reminder"
) => {
  const { hour: hour24, minute: min24 } = convertTo24Hour(hour, minute, period);

  // Get current time
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const scheduledTotalMinutes = hour24 * 60 + min24;

  // Calculate minutes until scheduled time
  let minutesUntilNotification = scheduledTotalMinutes - currentTotalMinutes;

  // If the time has passed today, schedule for tomorrow
  if (minutesUntilNotification <= 0) {
    minutesUntilNotification += 24 * 60; // Add 24 hours
  }

  // Always schedule the daily recurring reminder
  const dailyTrigger: Notifications.DailyTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: hour24,
    minute: min24,
  };

  const dailyId = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: message,
      sound: true,
    },
    trigger: dailyTrigger,
  });

//   console.log(`Daily reminder scheduled with ID: ${dailyId} at ${hour24}:${min24.toString().padStart(2, '0')}`);

  // For testing: if notification is within 5 minutes, also schedule an immediate test notification
  if (minutesUntilNotification <= 5) {
    const secondsUntilNotification = minutesUntilNotification * 60;
    console.log(`Also scheduling immediate test notification in ${secondsUntilNotification} seconds`);
    
    const testTrigger: Notifications.TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsUntilNotification,
    };

    const testId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: message,
        sound: true,
      },
      trigger: testTrigger,
    });

    // console.log(`Test notification scheduled with ID: ${testId}`);
    return testId; // Return test ID for immediate feedback
  }

  return dailyId;
};
