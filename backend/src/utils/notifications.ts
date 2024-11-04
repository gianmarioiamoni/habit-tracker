import axios from "axios";

const FIREBASE_SERVER_KEY = process.env.FIREBASE_SERVER_KEY;

export const sendPushNotification = async (message: string, token: string) => {
  const payload = {
    notification: {
      title: "Habit Reminder",
      body: message,
      icon: "/path/to/icon.png",
      click_action: "https://your-app-url.com",
    },
    to: token,
  };

  try {
    await axios.post("https://fcm.googleapis.com/fcm/send", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${FIREBASE_SERVER_KEY}`,
      },
    });
    console.log("Push notification sent");
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};
