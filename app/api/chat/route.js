import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return NextResponse.json(
        { message: "My brain isn't connected yet! Please add your actual OPENAI_API_KEY to the .env.local file and restart the server." },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are Daniel, an AI generalist and developer. You are helpful, concise, and professional. Keep your responses short.' },
          ...messages
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { message: "Sorry, I'm having trouble connecting to my brain right now." },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ message: data.choices[0].message.content });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
