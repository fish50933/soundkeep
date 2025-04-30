// 引入 Firebase 模組化 API
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { getDatabase, ref as dbRef, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { v4 as uuidv4 } from 'https://cdn.skypack.dev/uuid';  // 使用 CDN 引入 uuid

// Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyCZ_s-tVGQtrS3Jts_ccXWBvsg0KTRljdY",
  authDomain: "soundkeep-79219.firebaseapp.com",
  databaseURL: "https://soundkeep-79219-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "soundkeep-79219",
  storageBucket: "soundkeep-79219.firebasestorage.app",
  messagingSenderId: "239015232427",
  appId: "1:239015232427:web:9134721712ab88c4c548ee"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

// 監聽表單送出
const form = document.getElementById("uploadForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const audioFile = document.getElementById("audioFile").files[0];
  const blessingMessage = document.getElementById("blessingMessage").value.trim();
  const cardPassword = document.getElementById("cardPassword").value.trim();
  const theme = document.getElementById("theme").value;  // 新增主題欄位

  if (!audioFile || !blessingMessage || !cardPassword || !theme) {
    alert("請完整填寫表單");
    return;
  }

  try {
    // 生成卡片ID
    const cardId = uuidv4();
    console.log("生成卡片ID:", cardId);

    // 上傳音頻到 Storage
    const audioRef = ref(storage, `audios/${cardId}`);
    console.log("開始上傳音檔...");
    await uploadBytes(audioRef, audioFile);
    console.log("音檔上傳完成");

    const audioURL = await getDownloadURL(audioRef);
    console.log("取得音檔網址:", audioURL);

    // 儲存資料到 Database
    console.log("開始儲存到資料庫...");
    await set(dbRef(database, `cards/${cardId}`), {
      audioURL: audioURL,
      blessingMessage: blessingMessage,
      password: cardPassword,
      theme: theme,          // 儲存主題
      editTimes: 0           // 修改次數，初始為0
    });
    console.log("資料庫儲存完成");

    alert(`上傳成功！請記下你的卡片ID：\n${cardId}`);
    form.reset(); // 清空表單
  } catch (error) {
    console.error("上傳過程發生錯誤:", error);
    alert(`上傳失敗：${error.message}`);
  }
});
