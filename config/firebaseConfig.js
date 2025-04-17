
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// 🔹 Replace with your Firebase Project Config
const firebaseConfig = {
    apiKey: process.env.apiKey ,
    authDomain: process.env.authDomain,
    projectId:process.env.projectId ,
    storageBucket:process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


