import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { Alert } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBlYEAHVWYmDghYf1sHWap9c8UFAKlSYNc",
  authDomain: "wp-clone-256aa.firebaseapp.com",
  projectId: "wp-clone-256aa",
  storageBucket: "wp-clone-256aa.appspot.com",
  messagingSenderId: "979935378743",
  appId: "1:979935378743:web:c2ca33520c51cc8dbdaeb2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Replace __export const auth = getAuth(app)__ with the following code to resolve the warning:
// AsyncStorage has been extracted from react-native core and will be removed in a future
// release. It can now be installed and imported from '@react-native-async-storage/async-storage'
// instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage

// initialize auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const storage = getStorage(app);
export const db = getFirestore(app);

export function signIn(email, password) {
  try {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      Alert.alert("Incorrect Email address or Password");
    });
  } catch (error) {
    alert(error.message);
  }
  return;
}

export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}
