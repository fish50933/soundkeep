// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// 你的 Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyCZ_s-tVGQtrS3Jts_ccXWBvsg0KTRljdY",
  authDomain: "soundkeep-79219.firebaseapp.com",
  databaseURL: "https://soundkeep-79219-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "soundkeep-79219",
  storageBucket: "soundkeep-79219.appspot.com",
  messagingSenderId: "239015232427",
  appId: "1:239015232427:web:9134721712ab88c4c548ee"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Storage 和 Database
const storage = getStorage(app);
const database = getDatabase(app);

export { storage, database };
