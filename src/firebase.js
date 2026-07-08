import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYkyTBSCInCSt-hiD_tkDKuakY51sRfXo",
  authDomain: "tiwari-tutorials-cfb74.firebaseapp.com",
  projectId: "tiwari-tutorials-cfb74",
  storageBucket: "tiwari-tutorials-cfb74.firebasestorage.app",
  messagingSenderId: "183003633718",
  appId: "1:183003633718:web:2b31e4e2ff3d67d3fc6097",
  measurementId: "G-MYND35VG51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics safely
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export const db = getFirestore(app);
export const storage = getStorage(app);
export { analytics };