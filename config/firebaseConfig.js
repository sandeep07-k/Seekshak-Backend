
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// 🔹 Replace with your Firebase Project Config
const firebaseConfig = {
    apiKey: "AIzaSyB7zB85MkI-W248oYwlduBgK9arfm-BhKk",
    authDomain: "seekshak-c0835.firebaseapp.com",
    projectId: "seekshak-c0835",
    storageBucket: "seekshak-c0835.firebasestorage.app",
    messagingSenderId: "833681905929",
    appId: "1:833681905929:web:6c50939910a097106d9bd8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


