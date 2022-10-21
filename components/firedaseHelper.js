import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "paywall-f2816.firebaseapp.com",
    projectId: "paywall-f2816",
    storageBucket: "paywall-f2816.appspot.com",
    messagingSenderId: "1093369957876",
    appId: process.env.APP_ID
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);