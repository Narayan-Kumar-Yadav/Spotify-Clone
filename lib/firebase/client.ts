import "client-only";

import type { FirebaseApp } from "firebase/app";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

function getRequiredEnvValue(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required Firebase environment variable: ${name}`);
  }

  return value;
}

const firebaseConfig = {
  apiKey: getRequiredEnvValue(firebaseEnv.apiKey, "NEXT_PUBLIC_FIREBASE_API_KEY"),
  appId: getRequiredEnvValue(firebaseEnv.appId, "NEXT_PUBLIC_FIREBASE_APP_ID"),
  authDomain: getRequiredEnvValue(firebaseEnv.authDomain, "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  messagingSenderId: getRequiredEnvValue(
    firebaseEnv.messagingSenderId,
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  ),
  projectId: getRequiredEnvValue(firebaseEnv.projectId, "NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getRequiredEnvValue(
    firebaseEnv.storageBucket,
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  ),
};

export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
