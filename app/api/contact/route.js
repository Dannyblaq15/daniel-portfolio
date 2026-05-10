import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.json();

    // Save the data to a local JSON file
    const filePath = path.join(process.cwd(), 'data', 'contacts.json');

    // Ensure the data directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Read existing contacts if any
    let contacts = [];
    try {
      const fileData = await fs.readFile(filePath, 'utf8');
      if (fileData) {
        contacts = JSON.parse(fileData);
      }
    } catch (err) {
      // File does not exist yet, we will create it
    }

    // Append the new submission
    contacts.push({
      ...data,
      timestamp: new Date().toISOString()
    });

    // Write back to the file
    await fs.writeFile(filePath, JSON.stringify(contacts, null, 2));

    return NextResponse.json({ success: true, message: 'Message stored successfully' }, { status: 200 });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save message' }, { status: 500 });
  }
}
