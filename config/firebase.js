const admin = require("firebase-admin");
require("dotenv").config();
// const serviceAccount = require("./seekshak-c0835-firebase-adminsdk-fbsvc-2df7d74887.json");

const serviceAccount = {
  projectId:process.env.project_id,
  privateKeyId:process.env.private_key_id,
  privateKey:process.env.private_key.replace(/\\n/g, '\n'),
  clientEmail: process.env.client_email,
  clientId: process.env.client_id,
  authUri: process.env.auth_uri,
  tokenUri: process.env.token_uri,
  authProviderX509CertUrl: process.env.auth_provider_x509_cert_url,
  clientX509CertUrl: process.env.client_x509_cert_url,
  universeDomain: process.env.universe_domain,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
