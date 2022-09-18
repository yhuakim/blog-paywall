import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD3fn5vip2WMqo9NZb-k0Suv9pDWCOZJOY",
    authDomain: "paywall-f2816.firebaseapp.com",
    projectId: "paywall-f2816",
    storageBucket: "paywall-f2816.appspot.com",
    messagingSenderId: "1093369957876",
    appId: "1:1093369957876:web:015d5bb0b50c6c8f7b7da1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);