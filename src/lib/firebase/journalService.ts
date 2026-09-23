import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export interface JournalEntry {
  text: string;
  aiAnalysis: string;
}

export async function saveJournalEntry(uid: string, text: string, aiAnalysis: string) {
  if (!uid || !text || !aiAnalysis) throw new Error("Missing required fields for journal entry.");
  
  const journalRef = collection(db, "users", uid, "journalEntries");
  
  await addDoc(journalRef, {
    text,
    aiAnalysis,
    timestamp: serverTimestamp()
  });
}

