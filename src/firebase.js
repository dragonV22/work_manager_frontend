import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBt7PfwyQ9bot2SvlBZodsnaZtxUMPUMbw",
  authDomain: "emeeruchat.firebaseapp.com",
  projectId: "emeeruchat",
  storageBucket: "emeeruchat.appspot.com",
  messagingSenderId: "870004652816",
  appId: "1:870004652816:web:9812dc071ba64f3942c395",
  measurementId: "G-BTYSQDW6TN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
