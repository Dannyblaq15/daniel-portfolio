import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.QWEN_MODEL || 'qwen/qwen-2.5-7b-instruct:free';

    // Fallback if the API key is not configured
    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
      return NextResponse.json(
        { message: "Hi! I'm Daniel's portfolio assistant. Daniel is a Software & React Native Developer based in Lagos, Nigeria. He built the 'Wahala Tracker' (an issue tracker web app) and is currently training as a Huawei Native Developer, building 'HMS Health Connect' for HarmonyOS. Feel free to contact him at dl5357742@gmail.com!" },
        { status: 200 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://daniel-lewis.vercel.app', // Optional, for OpenRouter analytics
        'X-Title': 'Daniel Lewis Portfolio', // Optional, for OpenRouter analytics
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an assistant for Daniel Lewis, a Software Developer and React Native Developer based in Lagos, Nigeria. He builds web and mobile apps using JavaScript, React Native, Node.js, HTML, CSS and REST APIs. He has skills in UI/UX Design (Figma, Photoshop, Canva). He is currently training as a Huawei Native Developer. His featured projects include: 1) "Wahala Tracker" (an issue tracking web app built with JavaScript/HTML/CSS deployed on Vercel) and 2) "HMS Health Connect" (a HarmonyOS mobile app integrating HMS Kits like Account, Health, and Push). Contact: dl5357742@gmail.com | GitHub: github.com/Dannyblaq15 | LinkedIn: linkedin.com/in/daniel-lewis-739635232. Be helpful, concise and professional. Keep responses short.'
          },
          ...messages
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return NextResponse.json(
        { message: "Sorry, I'm having trouble connecting to my brain right now." },
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
