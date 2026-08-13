import { NextResponse } from 'next/server';

const FALLBACK_MESSAGE =
  "Hi! I'm Daniel's portfolio assistant. Daniel is a Software & React Native Developer building practical web and mobile products. His featured work includes Wahala Tracker, and he is training as a Huawei Native Developer. Feel free to contact him at dl5357742@gmail.com.";

const SYSTEM_PROMPT =
  'You are an assistant for Daniel Lewis, a Software Developer and React Native Developer. He builds practical web and mobile apps using JavaScript, TypeScript, React Native, HTML, CSS, REST APIs, and developer tools such as Git, GitHub, and Vercel. Do not mention any location. Do not invent metrics, clients, certifications, or project features. His featured projects include Wahala Tracker, a stress-tracking web app, and HMS Health Connect, an in-development training project. Contact: dl5357742@gmail.com | GitHub: github.com/Dannyblaq15 | LinkedIn: linkedin.com/in/daniel-lewis-739635232. Be helpful, concise and professional. Keep responses short.';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY || process.env.OPENROUTER_API_KEY;
    const baseUrl = (process.env.QWEN_BASE_URL || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1').replace(/\/$/, '');
    const model = process.env.QWEN_MODEL || 'qwen3.7-flash';

    // Fallback if the API key is not configured
    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
      return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 200 });
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          ...messages
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Sorry, I'm having trouble connecting to my chat service right now." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "I couldn't generate a response.";
    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
