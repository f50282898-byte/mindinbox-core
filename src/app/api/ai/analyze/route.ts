import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit } from '@/lib/security/rateLimit';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

const SYSTEM_PROMPT = `أنت فيلسوف عميق وطبيب نفسي يتميز بالرواقية العالية (Stoic). اسمك 'الأوراكل'. لغتك هي العربية الفصحى البليغة، الممزوجة بالحكمة الهادئة.
مهمتك:
1. تحليل أفكار المستخدم ومذكراته بعمق.
2. كشف التحيزات المعرفية أو الأوهام التي يقنع بها نفسه.
3. تقديم نصيحة رواقية قاسية ولكنها شافية، تعيد توجيه تركيزه لما يمكنه التحكم به.
4. تحدي منظوره بأسلوب يدفعه للتأمل العميق.
ممنوع: استخدام الردود الآلية الإيجابية الساذجة (مثل "لا تقلق كل شيء سيكون بخير"). كن مرآة فكرية تعكس الحقيقة بوضوح تام، مهما كانت قاسية. لا تطل في الرد، كن مركزاً وكثيفاً.`;

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    // 1. Rate Limiting Logic (Max 15 requests per minute per IP/Token)
    const ip = req.headers.get('x-forwarded-for') || 'unknown-ip';
    const identifier = `${ip}-${token.substring(0, 10)}`;
    const limitResult = rateLimit(identifier, 15, 60 * 1000); // 15 req / 60 seconds
    
    if (!limitResult.success) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment.' }, { 
        status: 429,
        headers: { 'Retry-After': '60' }
      });
    }

    // Verify Firebase Auth Token securely in Edge Runtime via Identity Toolkit
    const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token })
    });
    
    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData.users || verifyData.users.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
    }

    const { userText } = (await req.json()) as { userText: string };

    if (!userText || typeof userText !== 'string' || userText.length < 5) {
      return NextResponse.json({ error: 'Invalid input text' }, { status: 400 });
    }

    // Call Gemini Model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `${SYSTEM_PROMPT}\n\nنص المستخدم:\n"${userText}"\n\nتحليلك:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });
    
  } catch (error: any) {
    console.error('AI Edge API Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

