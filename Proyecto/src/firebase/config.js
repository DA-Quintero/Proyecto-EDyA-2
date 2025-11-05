// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8O2cSSwPH0gXkZdpxf_tgDRckPRt_1Is",
  authDomain: "estructuras2-ddb4c.firebaseapp.com",
  databaseURL: "https://estructuras2-ddb4c-default-rtdb.firebaseio.com",
  projectId: "estructuras2-ddb4c",
  storageBucket: "estructuras2-ddb4c.firebasestorage.app",
  messagingSenderId: "20551543741",
  appId: "1:20551543741:web:da4871a25d0891ca36c0d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;