// 引入 Firebase
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyCZ_s-tVGQtrS3Jts_ccXWBvsg0KTRljdY",
  authDomain: "soundkeep-79219.firebaseapp.com",
  databaseURL: "https://soundkeep-79219-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "soundkeep-79219",
  storageBucket: "soundkeep-79219.appspot.com",  // ← 這裡
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

  if (!audioFile || !blessingMessage || !cardPassword) {
    alert("請完整填寫表單");
    return;
  }

  try {
    // 生成卡片ID
    const cardId = uuidv4();

    // 上傳音頻到 Storage
    const audioRef = ref(storage, `audios/${cardId}`);
    await uploadBytes(audioRef, audioFile);
    const audioURL = await getDownloadURL(audioRef);

    // 儲存資料到 Database
    await set(dbRef(database, `cards/${cardId}`), {
      audioURL: audioURL,
      blessingMessage: blessingMessage,
      password: cardPassword,
      editTimes: 0  // 修改次數，初始為0
    });

    alert(`上傳成功！請記下你的卡片ID：\n${cardId}`);
    form.reset(); // 清空表單
  } catch (error) {
    console.error(error);
    alert("上傳失敗，請稍後再試");
  }
});
