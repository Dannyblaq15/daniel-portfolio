import { NextResponse } from 'next/server';

const FALLBACK_MESSAGE =
  "Hi! I'm Daniel's portfolio assistant. Daniel is a Software & React Native Developer building practical web and mobile products. His featured work includes Wahala Tracker, and he is training as a Huawei Native Developer. Feel free to contact him at dl5357742@gmail.com.";

const SYSTEM_PROMPT =
  'You are an assistant for Daniel Lewis, a Software Developer and React Native Developer. He builds practical web and mobile apps using JavaScript, TypeScript, React Native, HTML, CSS, REST APIs, and developer tools such as Git, GitHub, and Vercel. Do not mention any location. Do not invent metrics, clients, certifications, or project features. His featured projects include Wahala Tracker, a stress-tracking web app, and HMS Health Connect, an in-development training project. Contact: dl5357742@gmail.com | GitHub: github.com/Dannyblaq15 | LinkedIn: linkedin.com/in/daniel-lewis-739635232. Be helpful, concise and professional. Keep responses short.';

function getFallbackMessage(messages = []) {
  const lastMessage = messages
    .filter((message) => message?.role === 'user')
    .at(-1)?.content?.toLowerCase() || '';

  if (lastMessage.includes('project') || lastMessage.includes('app')) {
    return 'Daniel builds practical web and mobile products, including Wahala Tracker, a stress-tracking web app, plus Flutter and React Native work such as Ink and Paper and Kinetic Finance.';
  }

  if (lastMessage.includes('skill') || lastMessage.includes('stack')) {
    return 'Daniel works with JavaScript, TypeScript, React, React Native, Flutter, HTML, CSS, REST APIs, Git, GitHub, Vercel, and AI integrations.';
  }

  if (lastMessage.includes('contact') || lastMessage.includes('email') || lastMessage.includes('hire')) {
    return 'You can contact Daniel at dl5357742@gmail.com, view his GitHub at github.com/Dannyblaq15, or connect on LinkedIn at linkedin.com/in/daniel-lewis-739635232.';
  }

  return FALLBACK_MESSAGE;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages)
      ? body.messages
          .filter((message) => ['user', 'assistant'].includes(message?.role) && typeof message?.content === 'string')
          .map(({ role, content }) => ({ role, content }))
      : [];

    const apiKey = process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY || process.env.OPENROUTER_API_KEY;
    const baseUrl = (process.env.QWEN_BASE_URL || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1').replace(/\/$/, '');
    const model = process.env.QWEN_MODEL || 'qwen-flash';

    // Fallback if the API key is not configured
    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
      return NextResponse.json({ message: getFallbackMessage(messages) }, { status: 200 });
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
      const errorData = await response.json().catch(() => null);
      console.error('Qwen API Error:', {
        status: response.status,
        code: errorData?.error?.code,
        type: errorData?.error?.type,
        message: errorData?.error?.message,
      });

      return NextResponse.json({ message: getFallbackMessage(messages) }, { status: 200 });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || data.output?.text || getFallbackMessage(messages);
    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 200 });
  }
}
