import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// Firebase 設定
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
const db = getDatabase(app);
const storage = getStorage(app);

// 取得表單並設定事件
const form = document.getElementById("uploadForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const audioFile = document.getElementById("audioFile").files[0];
  const message = document.getElementById("message").value;

  if (audioFile && message) {
    // 生成唯一的卡片 ID
    const cardId = uuidv4();

    // 上傳音頻檔案到 Firebase Storage
    const audioStorageRef = storageRef(storage, `audio/${cardId}.mp3`);
    const uploadTask = uploadBytesResumable(audioStorageRef, audioFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Upload error:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // 當上傳完成後，將音頻的 URL 和祝福語存到 Firebase Realtime Database
          const audioData = {
            audioUrl: downloadURL,
            message: message,
            cardId: cardId,
            createdAt: new Date().toISOString(),
          };

          const cardRef = ref(db, "cards/" + cardId);
          set(cardRef, audioData);

          // 提示成功並顯示卡片ID
          alert("音頻和祝福語已經成功上傳！卡片 ID: " + cardId);
        });
      }
    );
  } else {
    alert("請選擇音頻檔案和輸入祝福語");
  }
});
