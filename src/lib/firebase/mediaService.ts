import { collection, doc, getDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./config";
import { Timestamp } from "firebase/firestore";

export interface Masterclass {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // Internal or Vimeo/YT url
  requiredTier: 'awakened' | 'inner_sanctum';
  publishedAt: Timestamp;
}

export async function getMasterclassById(id: string): Promise<Masterclass | null> {
  try {
    const docRef = doc(db, "masterclasses", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Masterclass;
    }
    return null;
  } catch (error) {
    console.error("Error fetching masterclass:", error);
    return null;
  }
}

export async function getSanctumMasterclasses(): Promise<Masterclass[]> {
  try {
    const q = query(
      collection(db, "masterclasses"),
      where("requiredTier", "==", "inner_sanctum"),
      orderBy("publishedAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Masterclass));
  } catch (error) {
    console.error("Error fetching sanctum masterclasses:", error);
    return [];
  }
}

