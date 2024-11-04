import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const API_URL = "http://localhost:5000/auth";

// Firebase configuration
const firebaseCfg = {
  apiKey: "AIzaSyCDT_paM4P6QQc9Y6IWEnUsFCfxAy-mNcA",
  authDomain: "habit-tracker-1d77a.firebaseapp.com",
  projectId: "habit-tracker-1d77a",
  storageBucket: "habit-tracker-1d77a.appspot.com",
  messagingSenderId: "1017474093869",
  appId: "1:1017474093869:web:823c5c2f0385c42bbb39a4",
};

// Firebase initialization
const app = initializeApp(firebaseCfg);
const messaging = getMessaging(app);

const VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY;

// Service Worker registration and VAPID key setup
export const requestNotificationPermission = async (userId: any) => {
  try {
    // Service Worker registration
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    // Configure Firebase to use the registered Service Worker
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY, // pass the key directly, as env variables cannot be read by service worker 
      serviceWorkerRegistration: registration,
    });

    if (token) {
      // Save the token in the user profile
      await fetch(`${API_URL}/${userId}/notification-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
  }
};

// Function to manage messages 
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  // Gestisci la notifica qui, se desiderato (es. mostrare un toast)
});
