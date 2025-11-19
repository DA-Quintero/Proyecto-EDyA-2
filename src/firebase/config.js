import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD8O2cSSwPH0gXkZdpxf_tgDRckPRt_1Is",
  authDomain: "estructuras2-ddb4c.firebaseapp.com",
  databaseURL: "https://estructuras2-ddb4c-default-rtdb.firebaseio.com",
  projectId: "estructuras2-ddb4c",
  storageBucket: "estructuras2-ddb4c.firebasestorage.app",
  messagingSenderId: "20551543741",
  appId: "1:20551543741:web:da4871a25d0891ca36c0d4",
};

const app = initializeApp(firebaseConfig);

// 🔹 Cambia esta línea:
const auth = getAuth(app); // <--- importante

const db = getFirestore(app);
const rtdb = getDatabase(app);

let analytics;
if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics, auth, db, rtdb };
