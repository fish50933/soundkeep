import { storage, database } from "./firebase.js";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as dbRef, set } from "firebase/database";

// 表單送出處理
const form = document.getElementById("uploadForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const audioFile = document.getElementById("audioFile").files[0];
  const message = document.getElementById("message").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!audioFile || !message || !password) {
    alert("請填寫完整！");
    return;
  }

  try {
    // 1. 產生一個唯一的卡片 ID
    const cardId = generateId();

    // 2. 上傳音頻檔案到 Storage
    const audioStorageRef = storageRef(storage, `audio/${cardId}.mp3`);
    await uploadBytes(audioStorageRef, audioFile);

    // 3. 取得音頻檔案的下載連結
    const audioUrl = await getDownloadURL(audioStorageRef);

    // 4. 把資料存到 Database
    const cardData = {
      message,
      audioUrl,
      password,
      modifyCount: 0, // 初始修改次數
    };

    await set(dbRef(database, `cards/${cardId}`), cardData);

    // 5. 顯示卡片 ID
    document.getElementById("result").innerHTML = `
      <h3>上傳成功！</h3>
      <p>你的卡片ID是：<strong>${cardId}</strong></p>
      <p>請保管好你的ID與密碼！</p>
    `;
  } catch (error) {
    console.error(error);
    alert("上傳失敗，請重試");
  }
});

// 隨機產生ID
function generateId() {
  return Math.random().toString(36).substr(2, 8);
}
