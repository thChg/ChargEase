// firebase.ts
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  FacebookAuthProvider,
  GoogleAuthProvider
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAitOdB9Il71tQlTsVn7A1GW2e82UIZbMw",
  authDomain: "chargease-49ab1.firebaseapp.com",
  projectId: "chargease-49ab1",
  storageBucket: "chargease-49ab1.appspot.com", // ✅ corrected domain
  messagingSenderId: "367003687388",
  appId: "1:367003687388:web:9427d72e46e282f12dd719"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Other services
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Exports
export { app, auth, db, storage, googleProvider, facebookProvider };
