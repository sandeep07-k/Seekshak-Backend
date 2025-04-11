const admin = require("firebase-admin");
const serviceAccount = require("./seekshak-c0835-firebase-adminsdk-fbsvc-2df7d74887.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
