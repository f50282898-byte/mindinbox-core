import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export const runtime = 'nodejs'; // Required for firebase-admin
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Security: Verify CRON_SECRET_KEY
    const authHeader = req.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized. Invalid Cron Secret.' }, { status: 401 });
    }

    // 2. Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    // 3. Prompt Gemini
    const prompt = `
      You are an ancient, profound philosopher writing for an elite, highly intellectual audience.
      Generate a piece of profound, original wisdom in classic Fus'ha Arabic. It must be unique, striking, and deeply thought-provoking, not a cliché.
      Also provide a modern psychological breakdown of this wisdom.
      
      Respond strictly in the following JSON schema:
      {
        "text": "The profound Arabic quote",
        "author": "Your chosen persona name (e.g., الفيلسوف المجهول)",
        "psychologicalBreakdown": "A deep psychological explanation in Arabic",
        "tier": "premium" // ALWAYS return exactly "premium"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    
    // Parse the JSON strictly
    const wisdomData = JSON.parse(jsonText);

    // 4. Save to Firestore
    const today = new Date().toISOString().split('T')[0];
    
    await adminDb.collection('dailyQuotes').add({
      text: wisdomData.text,
      author: wisdomData.author,
      psychologicalBreakdown: wisdomData.psychologicalBreakdown,
      tier: wisdomData.tier,
      date: today,
      createdAt: FieldValue.serverTimestamp(),
      isAiGenerated: true
    });

    console.log("Successfully generated and saved AI wisdom for", today);
    return NextResponse.json({ success: true, date: today }, { status: 200 });
    
  } catch (err: any) {
    console.error("Cron Error generating wisdom:", err);
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}

