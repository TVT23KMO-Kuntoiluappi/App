import { initializeApp } from "firebase/app";
import { 
    getFirestore, collection, addDoc, 
    serverTimestamp, query, onSnapshot, 
    getDocs, doc, setDoc, 
    getDoc, deleteDoc
     } from "firebase/firestore";
import {
        initializeAuth,
        getReactNativePersistence,
        createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword
      } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export {
    firestore,
    collection,
    addDoc,
    serverTimestamp,
    query,
    onSnapshot,
    getDocs,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    auth,
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword
};