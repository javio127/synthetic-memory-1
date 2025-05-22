import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { vibe } = await req.json();
    if (!vibe) {
      return NextResponse.json({ error: 'Missing vibe' }, { status: 400 });
    }

    // Get the being (assume only one for now)
    const { data: being, error: beingError } = await supabase
      .from('beings')
      .select('*')
      .single();
    if (beingError || !being) {
      return NextResponse.json({ error: 'No being found' }, { status: 404 });
    }

    // Use OpenAI to generate a book
    const prompt = `You are a poetic AI librarian. Given the vibe: "${vibe}", invent a book that would fit. Respond in JSON with keys: title, author, summary. Example: {"title": "...", "author": "...", "summary": "..."}`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: `Vibe: ${vibe}` }
      ],
      max_tokens: 200,
      temperature: 0.9,
    });
    let bookData = null;
    try {
      bookData = JSON.parse(completion.choices[0].message.content || '{}');
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse OpenAI response' }, { status: 500 });
    }
    if (!bookData.title || !bookData.author || !bookData.summary) {
      return NextResponse.json({ error: 'Incomplete book data from OpenAI' }, { status: 500 });
    }

    // Save to Supabase
    const { data: book, error: bookError } = await supabase
      .from('books')
      .insert({
        title: bookData.title,
        author: bookData.author,
        summary: bookData.summary,
        vibe,
        being_id: being.id,
      })
      .select()
      .single();
    if (bookError) {
      return NextResponse.json({ error: 'Failed to save book' }, { status: 500 });
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error('Gift book error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 