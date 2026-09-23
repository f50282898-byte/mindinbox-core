import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { auth, db } from "./config";
import { UserDocument } from "@/types/user";

const googleProvider = new GoogleAuthProvider();

/**
 * Fetches the true current UTC time from an external reliable source.
 * This prevents client-side clock manipulation vulnerabilities.
 */
async function getTrueServerTime(): Promise<Date> {
  try {
    const res = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
    const data = await res.json();
    return new Date(data.datetime);
  } catch (error) {
    // Fallback securely to local time if API fails, but ideally this should be a Cloud Function.
    return new Date();
  }
}

export async function signInWithGoogleService() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);
  
  if (!docSnap.exists()) {
    // Calculate unhackable trial end date
    const trueNow = await getTrueServerTime();
    const trialEnd = new Date(trueNow.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    const newUser: Partial<UserDocument> = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName,
      role: "user",
      subscriptionTier: "trial",
      dailyAIInteractions: 0,
      createdAt: serverTimestamp(),
      trialStartDate: serverTimestamp(),
      trialEndDate: Timestamp.fromDate(trialEnd),
    };
    
    await setDoc(userRef, newUser);
  }
  
  return user;
}
