import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCrKh8Z9Gachjf7wJpUnNcd8fq9JB_8qGs",
  authDomain: "campaign-intelligence-9ebc4.firebaseapp.com",
  projectId: "campaign-intelligence-9ebc4",
  storageBucket: "campaign-intelligence-9ebc4.firebasestorage.app",
  messagingSenderId: "393895087069",
  appId: "1:393895087069:web:a7d645045fe14f87abc434"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<void> {
  await signInWithRedirect(auth, googleProvider);
}

export async function getGoogleRedirectResult() {
  return getRedirectResult(auth);
}

export async function firebaseSignOut() {
  await signOut(auth);
}




