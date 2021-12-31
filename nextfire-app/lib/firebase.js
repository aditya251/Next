import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, where, getDocs, query, limit } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAHbvFaoLN9wLtTuttAfGoFlgaiF8XY_h0",
    authDomain: "nextproject-20fb4.firebaseapp.com",
    projectId: "nextproject-20fb4",
    storageBucket: "nextproject-20fb4.appspot.com",
    messagingSenderId: "536184860783",
    appId: "1:536184860783:web:24edfa55a466101b8b5d9a",
    measurementId: "G-2WNJBE4PFM"
  };

  function createFirebaseApp(config) {
    try {
      return getApp();
    } catch {
      return initializeApp(config);
    }
  }

const firebaseApp = createFirebaseApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export const STATE_CHANGED = 'state_changed';

export async function getUserWithUsername(username) {
  // const usersRef = collection(firestore, 'users');
  // const query = usersRef.where('username', '==', username).limit(1);

  const q = query(
    collection(getFirestore(), 'users'), 
    where('username', '==', username),
    limit(1)
  )
  const userDoc = ( await getDocs(q) ).docs[0];
  return userDoc;
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}





