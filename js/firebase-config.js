import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnNeBOctqylIA8vGpHiylUAWbMPAMlJ50",
  authDomain: "happyliving-2872b.firebaseapp.com",
  databaseURL: "https://happyliving-2872b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "happyliving-2872b",
  storageBucket: "happyliving-2872b.firebasestorage.app",
  messagingSenderId: "825825590143",
  appId: "1:825825590143:web:36bb30ac0dfcb125f2384a",
  measurementId: "G-P7YNMYV4KJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

// Export for use in other modules
export { app, analytics, auth, database };