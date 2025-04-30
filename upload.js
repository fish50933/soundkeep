// 引入 Firebase 模組化 API
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { getDatabase, ref as dbRef, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid';

// Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyCZ_s-tVGQtrS3Jts_ccXWBvsg0KTRljdY",
  authDomain: "soundkeep-79219.firebaseapp.com",
  databaseURL: "https://soundkeep-79219-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "soundkeep-79219",
  storageBucket: "soundkeep-79219.firebaseapp.com",
  messagingSenderId: "239015232427",
  appId: "1:239015232427:web:9134721712ab88c4c548ee"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

// 表單監聽器
const form = document.getElementById("uploadForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const audioFile = document.getElementById("audioFile").files[0];
  const bgImageFile = document.getElementById("bgImage").files[0];  // 背景圖（可選）
  const blessingMessage = document.getElementById("blessingMessage").value.trim();
  const cardPassword = document.getElementById("cardPassword").value.trim();

  if (!audioFile || !blessingMessage || !cardPassword) {
    alert("請完整填寫所有欄位（音檔 / 祝福語 / 密碼）");
    return;
  }

  try {
    const cardId = uuidv4();

    // 上傳音檔
    const audioRef = ref(storage, `audios/${cardId}`);
    await uploadBytes(audioRef, audioFile);
    const audioURL = await getDownloadURL(audioRef);

    // 上傳背景圖片（如果有）
    let bgImageURL = "";
    if (bgImageFile) {
      const imageRef = ref(storage, `images/${cardId}`);
      await uploadBytes(imageRef, bgImageFile);
      bgImageURL = await getDownloadURL(imageRef);
    }

    // 儲存到資料庫
    const cardData = {
      audioURL,
      blessingMessage,
      password: cardPassword,
      bgImageURL,     // 若無背景圖，則為空字串
      editTimes: 0
    };

    await set(dbRef(database, `cards/${cardId}`), cardData);

    alert(`上傳成功！請記下你的卡片ID：\n${cardId}`);
    // 轉跳到 card.html
    window.location.href = `card.html?id=${cardId}`;
  } catch (err) {
    console.error("上傳錯誤：", err);
    alert(`發生錯誤，請稍後再試：${err.message}`);
  }
});
