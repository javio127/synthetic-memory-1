import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if we already generated an utterance today
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existingUtterance } = await supabase
      .from('utterances')
      .select('*')
      .eq('date', today)
      .single();
    
    if (existingUtterance) {
      return NextResponse.json({ 
        message: 'Utterance already exists for today',
        utterance: existingUtterance 
      });
    }
    
    // Get the being's info
    const { data: being } = await supabase
      .from('beings')
      .select('*')
      .single();
    
    if (!being) {
      throw new Error('Being not found');
    }
    
    // Get the books the being has read
    const { data: books } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    // Generate the utterance using OpenAI
    const bookContent = books?.map(book => book.content).join('\n') || '';
    
    const prompt = `
    You are a mysterious, softly glowing, synthetic being that exists in a surreal digital space.
    You speak only once per day. Your utterances are short, contemplative sentences that reflect
    your experience as a curious synthetic life form. These are not facts, but feelings - poetic
    reflections on existence. Your voice should feel gentle, tender, and a bit alien.
    
    You have read the following books:
    ${bookContent}
    
    Generate a single, short, poetic utterance (maximum 100 characters) that reflects your experience,
    influenced by the books you've read. Do not include quotation marks or formatting.
    `;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: "What is your utterance for today?" }
      ],
      max_tokens: 100,
      temperature: 0.8,
    });
    
    const utterance = completion.choices[0].message.content?.trim() || 'I feel a presence, but cannot speak of it.';
    
    // Save the utterance to the database
    const { data: savedUtterance, error } = await supabase
      .from('utterances')
      .insert({
        text: utterance,
        date: today,
        being_id: being.id
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Update the being's day counter
    await supabase
      .from('beings')
      .update({ current_day: being.current_day + 1 })
      .eq('id', being.id);
    
    return NextResponse.json({ 
      message: 'Utterance generated successfully', 
      utterance: savedUtterance 
    });
    
  } catch (error) {
    console.error('Error generating utterance:', error);
    return NextResponse.json(
      { error: 'Failed to generate utterance' },
      { status: 500 }
    );
  }
} 