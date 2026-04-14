import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  runTransaction,
  collection,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export type { User };

// ── Wallet ────────────────────────────────────────────────────────────────────
// Firestore schema:
//   wallets/{userId}  →  { balance: number, updatedAt: Timestamp }
//   wallets/{userId}/txns/{txnId}  →  { type, amount, orderId?, museId?, createdAt }

export interface WalletDoc {
  balance: number;
}

/** Real-time listener — returns unsubscribe fn */
export function listenWalletBalance(
  userId: string,
  cb: (balance: number) => void
): () => void {
  return onSnapshot(doc(db, "wallets", userId), (snap) => {
    cb(snap.exists() ? (snap.data() as WalletDoc).balance ?? 0 : 0);
  });
}

/** One-time read */
export async function getWalletBalance(userId: string): Promise<number> {
  const snap = await getDoc(doc(db, "wallets", userId));
  return snap.exists() ? (snap.data() as WalletDoc).balance ?? 0 : 0;
}

/** Credit wallet after successful Cashfree payment (atomic) */
export async function addToWallet(
  userId: string,
  amount: number,
  orderId: string
): Promise<number> {
  const walletRef = doc(db, "wallets", userId);
  let newBalance = 0;

  await runTransaction(db, async (txn) => {
    const snap = await txn.get(walletRef);
    const current = snap.exists() ? (snap.data() as WalletDoc).balance ?? 0 : 0;
    newBalance = Math.round((current + amount) * 100) / 100;
    txn.set(walletRef, { balance: newBalance, updatedAt: serverTimestamp() }, { merge: true });
  });

  // Log top-up transaction
  await setDoc(doc(collection(db, `wallets/${userId}/txns`)), {
    type: "topup",
    amount,
    orderId,
    createdAt: serverTimestamp(),
  });

  return newBalance;
}

/**
 * Atomically deduct `amount` from wallet.
 * Returns { success: true, newBalance } if funds were sufficient,
 * or { success: false, newBalance: current } if insufficient.
 */
export async function deductFromWallet(
  userId: string,
  amount: number,
  museId: string
): Promise<{ success: boolean; newBalance: number }> {
  const walletRef = doc(db, "wallets", userId);
  let success = false;
  let newBalance = 0;

  await runTransaction(db, async (txn) => {
    const snap = await txn.get(walletRef);
    const current = snap.exists() ? (snap.data() as WalletDoc).balance ?? 0 : 0;
    if (current >= amount) {
      newBalance = Math.round((current - amount) * 100) / 100;
      txn.update(walletRef, { balance: newBalance, updatedAt: serverTimestamp() });
      success = true;
    } else {
      newBalance = current;
    }
  });

  if (success) {
    await setDoc(doc(collection(db, `wallets/${userId}/txns`)), {
      type: "usage",
      amount,
      museId,
      createdAt: serverTimestamp(),
    });
  }

  return { success, newBalance };
}
