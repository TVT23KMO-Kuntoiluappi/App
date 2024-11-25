import { initializeApp } from "firebase/app"
import { Platform } from 'react-native'
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import {
  getFirestore,
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
  updateDoc,
} from "firebase/firestore"
import {
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  updateEmail
} from "firebase/auth"
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
  getMetadata,
} from "firebase/storage"
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
} from "@env"

const firebaseConfig = {
  apiKey: /*process.env.*/API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: Platform.OS === 'android' ? process.env.ANDROID_APP_ID : process.env.IOS_APP_ID,
}

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
const storage = getStorage(app);

auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? 'logged in' : 'logged out')
})

export const uploadImage = async (uri, path) => {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required')
    }

    const token = await auth.currentUser.getIdToken()
    if (!token) {
      throw new Error('No auth token')
    }
    
    const response = await fetch(uri)
    const blob = await response.blob()
    
    const storageRef = ref(storage, path)
    const metadata = {
      contentType: 'image/jpeg',
      customMetadata: {
        uploadedBy: auth.currentUser.uid,
        timestamp: new Date().toISOString()
      }
    }

    const snapshot = await uploadBytes(storageRef, blob, metadata)
    return await getDownloadURL(snapshot.ref)
    
  } catch (error) {
    throw error
  }
}

export const uploadUserPicture = async (uri) => {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required')
    }

    const path = `users/${auth.currentUser.uid}/profile/avatar`
    const response = await fetch(uri)
    const blob = await response.blob()
    
    const storageRef = ref(storage, path)
    const metadata = {
      contentType: 'image/jpeg',
      customMetadata: {
        type: 'profile',
        updatedAt: new Date().toISOString()
      }
    }
    
    await uploadBytes(storageRef, blob, metadata)
    return await getDownloadURL(storageRef)
  } catch (error) {
    throw error
  }
}

export const getUserPicture = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('Authentication required hööö')
    }

    const path = `users/${auth.currentUser.uid}/profile/avatar`
    const storageRef = ref(storage, path)
    
    try {
      const url = await getDownloadURL(storageRef)
      return url
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        return null
      }
      throw error
    }
    
  } catch (error) {
    throw error
  }
}

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
  signInWithEmailAndPassword,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
  getMetadata,
  updateProfile,
  updateDoc,
  updateEmail,
}
