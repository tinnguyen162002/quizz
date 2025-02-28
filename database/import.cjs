const admin = require("firebase-admin");
const fs = require("fs");

// Khởi tạo Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // Tệp JSON Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Đọc dữ liệu từ file JSON
const rawData = JSON.parse(fs.readFileSync("./QuizzyDatabase.json", "utf8"));

// Hàm import dữ liệu vào Firestore
const importData = async () => {
  try {
    // Nhập dữ liệu "topics"
    const topicsRef = db.collection("topics");
    for (const key in rawData.topics) {
      const topic = rawData.topics[key];
      await topicsRef.doc(topic.topicID).set(topic);
    }
    console.log("✅ Imported topics!");

    // Nhập dữ liệu "quizzes"
    const quizzesRef = db.collection("quizzes");
    for (const quizID in rawData.quizzes) {
      const quizData = rawData.quizzes[quizID];
      await quizzesRef.doc(quizID).set(quizData);
    }
    console.log("✅ Imported quizzes!");

    // Nhập dữ liệu "videos"
    const videosRef = db.collection("videos");
    for (const video of rawData.videos) {
      await videosRef.add(video);
    }
    console.log("✅ Imported videos!");

    console.log("🔥 Import dữ liệu thành công vào Firestore!");
  } catch (error) {
    console.error("❌ Lỗi khi import dữ liệu:", error);
  }
};

// Chạy import
importData();
